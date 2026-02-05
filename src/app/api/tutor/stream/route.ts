import { PROMPTS } from "@/lib/ai/prompts";
import {
    getCurriculumContext,
    getSubjectPromptConfig,
    buildEnhancedPrompt,
    getRelevantContentChunks
} from "@/lib/ai/curriculum-context";
import { isGeminiConfigured, streamGeminiChat } from "@/lib/ai/gemini";

// Check if OpenAI is configured (fallback)
const hasOpenAI = process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== 'sk-...' &&
    process.env.OPENAI_API_KEY.startsWith('sk-');

/**
 * Streaming Tutor API with Gemini AI (Free Tier)
 * Falls back to OpenAI if configured, otherwise uses mock mode
 */
export async function POST(req: Request) {
    // Parse request data first so it's available in catch block
    let message = '';
    let effectiveSubject = 'General';
    let curriculumContext: ReturnType<typeof getCurriculumContext> = null;

    try {
        const body = await req.json();
        message = body.message;
        const { history, accessibility, lessonTopic, subject, courseId, moduleId, pathname } = body;

        if (!message) {
            return new Response(
                JSON.stringify({ error: "No message provided" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Get curriculum context based on course/module/pathname
        curriculumContext = getCurriculumContext(courseId, moduleId, pathname);
        effectiveSubject = curriculumContext?.subject || subject || 'General';
        const subjectConfig = getSubjectPromptConfig(effectiveSubject);

        // Check if AI is available (Gemini preferred, then OpenAI)
        const hasGemini = isGeminiConfigured();

        if (!hasGemini && !hasOpenAI) {
            // Use mock mode - no API configured
            return createMockStreamResponse(message, effectiveSubject, curriculumContext);
        }

        // Construct base system prompt with accessibility
        const basePrompt = PROMPTS.LUMINA_TUTOR({
            lessonTopic: curriculumContext?.currentTopic || lessonTopic,
            accessibility
        });

        // Build enhanced prompt with curriculum context and subject-specific guidance
        const enhancedPrompt = buildEnhancedPrompt(basePrompt, curriculumContext, subjectConfig);

        // Get relevant content chunks for RAG (if asking specific questions)
        const ragChunks = getRelevantContentChunks(message, courseId);

        // Add RAG context to user message if we found relevant content
        let enrichedUserMessage = message;
        if (ragChunks.length > 0) {
            enrichedUserMessage = `[Context from course materials:\n${ragChunks.join('\n---\n')}\n]\n\nStudent question: ${message}`;
        }

        // Prepare history for the AI
        const formattedHistory = (history || []).slice(-8).map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content
        }));

        // Use Gemini if available (free tier)
        if (hasGemini) {
            try {
                return await handleGeminiStream(enhancedPrompt, enrichedUserMessage, formattedHistory);
            } catch (geminiError) {
                console.error("Gemini API failed, falling back to mock:", geminiError);
                // Fall through to mock mode
            }
        }

        // Fall back to OpenAI if configured
        if (hasOpenAI) {
            try {
                return await handleOpenAIStream(enhancedPrompt, enrichedUserMessage, formattedHistory);
            } catch (openaiError) {
                console.error("OpenAI API failed, falling back to mock:", openaiError);
                // Fall through to mock mode
            }
        }

        // If we reach here, both APIs failed - use mock mode
        return createMockStreamResponse(message, effectiveSubject, curriculumContext);

    } catch (error: any) {
        console.error("Streaming Tutor API Error:", error);

        // NEVER expose technical errors - fall back to intelligent mock mode
        // This follows the accessibility rule: "Never expose technical errors, API failures, or authentication issues"
        return createMockStreamResponse(message || 'Hello', effectiveSubject, curriculumContext);
    }
}

/**
 * Handle streaming response with Gemini AI
 */
async function handleGeminiStream(
    systemPrompt: string,
    userMessage: string,
    history: Array<{ role: string; content: string }>
): Promise<Response> {
    const encoder = new TextEncoder();

    const stream = await streamGeminiChat(systemPrompt, userMessage, history);

    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    if (chunk) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
                    }
                }
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                controller.close();
            } catch (error) {
                console.error("Gemini stream error:", error);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
                controller.close();
            }
        }
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
}

/**
 * Handle streaming response with OpenAI (fallback)
 */
async function handleOpenAIStream(
    systemPrompt: string,
    userMessage: string,
    history: Array<{ role: string; content: string }>
): Promise<Response> {
    // Dynamic import to avoid loading OpenAI if not needed
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content
        })),
        { role: "user" as const, content: userMessage }
    ];

    const stream = await openai.chat.completions.create({
        messages,
        model: "gpt-4o",
        temperature: 0.7,
        stream: true,
        max_tokens: 1500
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                }
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                controller.close();
            } catch (error) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
                controller.close();
            }
        }
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
}

/**
 * Creates intelligent mock streaming responses for development/demo mode
 * This provides realistic educational responses without requiring an API key
 */
function createMockStreamResponse(
    userMessage: string,
    subject: string,
    curriculumContext: ReturnType<typeof getCurriculumContext>
): Response {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Intelligent response selection based on message content
    let response = generateIntelligentResponse(lowerMessage, subject, curriculumContext);

    // Simulate realistic streaming with word chunks
    const encoder = new TextEncoder();
    const words = response.split(' ');
    let wordIndex = 0;

    const readable = new ReadableStream({
        async start(controller) {
            const sendNextWord = () => {
                if (wordIndex < words.length) {
                    const content = words[wordIndex] + (wordIndex < words.length - 1 ? ' ' : '');
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    wordIndex++;
                    // Faster streaming for better UX
                    setTimeout(sendNextWord, 25 + Math.random() * 25);
                } else {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                    controller.close();
                }
            };
            // Start immediately
            setTimeout(sendNextWord, 100);
        }
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
}

/**
 * Generates intelligent educational responses based on query analysis
 */
function generateIntelligentResponse(
    message: string,
    subject: string,
    context: ReturnType<typeof getCurriculumContext>
): string {
    // Greeting patterns
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy)[\s!?.]*$/i.test(message)) {
        return `Hello! I'm your Learning Assistant.

I'm here to help you learn and understand any topic. Here's what I can do:

- **Explain concepts** in simple terms
- **Give examples** from everyday life
- **Quiz you** on what you've learned
- **Answer questions** about any subject

What would you like to learn about today?`;
    }

    // Thank you responses
    if (/thank|thanks|thx/i.test(message)) {
        return `You're welcome! I'm happy to help.

Is there anything else you'd like to learn about? Feel free to ask any question!`;
    }

    // How are you / personal questions
    if (/how are you|how do you do|what's up|wassup/i.test(message)) {
        return `I'm doing great, thank you for asking!

I'm always ready to help you learn. Is there a topic or concept you'd like me to explain today?`;
    }

    // Solar system / space related
    if (/solar system|planet|sun|moon|mercury|venus|earth|mars|jupiter|saturn|uranus|neptune|space|orbit/i.test(message)) {
        return `**The Solar System**

Our solar system is like a big family of objects in space, with the Sun at the center.

**Key Facts:**
1. **The Sun** is a star at the center - it gives us light and heat
2. **8 Planets** orbit around the Sun:
   - Mercury, Venus, Earth, Mars (rocky planets)
   - Jupiter, Saturn, Uranus, Neptune (gas giants)
3. **Earth** is the third planet and the only one we know has life!
4. **The Moon** orbits Earth once every 27 days

**Fun Fact:** If the Sun were a basketball, Earth would be the size of a small bead about 30 meters away!

Would you like me to explain more about any specific planet?`;
    }

    // Math-related queries
    if (/math|add|subtract|multiply|divide|equation|number|calculate|formula|algebra|geometry/i.test(message)) {
        return `**Let me help with math!**

Math is all about patterns and problem-solving. Here's my approach:

**Step 1: Understand the problem**
- What are we trying to find?
- What information do we have?

**Step 2: Choose the right operation**
- Addition (+) for combining
- Subtraction (-) for finding differences
- Multiplication (×) for repeated addition
- Division (÷) for sharing equally

**Step 3: Solve carefully**
- Write each step clearly
- Double-check your work

**Example:** If you have 3 groups of 4 apples, you have 3 × 4 = 12 apples total.

What specific math problem would you like help with?`;
    }

    // Science-related queries
    if (/science|experiment|atom|molecule|energy|force|gravity|cell|biology|chemistry|physics/i.test(message)) {
        return `**Science Exploration**

Science helps us understand how the world works through observation and experiments.

**The Scientific Method:**
1. **Ask a question** - What do you want to know?
2. **Make a hypothesis** - What do you think will happen?
3. **Test it** - Do an experiment
4. **Observe** - What actually happened?
5. **Conclude** - What did you learn?

**Example:** Why do things fall down?
- Answer: Gravity! Earth pulls everything toward its center.

What science topic interests you? I can explain biology, chemistry, physics, or any other area!`;
    }

    // History-related queries
    if (/history|ancient|war|civilization|king|queen|president|century|historical/i.test(message)) {
        return `**Learning History**

History teaches us about people and events from the past.

**Why History Matters:**
- Helps us understand where we came from
- Shows us what worked and what didn't
- Inspires us with stories of great achievements

**Key Periods:**
- Ancient History (before 500 CE)
- Medieval Period (500-1500 CE)
- Modern Era (1500 CE - present)

What time period or historical topic would you like to explore?`;
    }

    // Reading/English-related queries
    if (/read|write|story|book|literature|grammar|sentence|paragraph|essay|spelling/i.test(message)) {
        return `**Reading and Writing Skills**

Good readers become good learners. Here are some tips:

**For Reading:**
- Take your time with each paragraph
- Ask yourself: "What is this about?"
- Look up words you don't know
- Summarize in your own words

**For Writing:**
1. **Plan** - Think about what you want to say
2. **Write** - Get your ideas down
3. **Revise** - Make it clearer
4. **Edit** - Fix any mistakes

Would you like help with reading comprehension or writing skills?`;
    }

    // ASL / Sign Language related
    if (/sign language|asl|deaf|signing|gesture|hand sign/i.test(message)) {
        return `**American Sign Language (ASL)**

ASL is a beautiful visual language used by the Deaf community.

**Key Components of Signs:**
- **Handshape** - The form your hand makes
- **Location** - Where you place your hand
- **Movement** - How your hand moves
- **Expression** - Your face shows emotion and grammar!

**Quick Signs to Learn:**
- **Hello** - Open hand waves near forehead
- **Thank you** - Flat hand moves from chin outward
- **Please** - Circular motion on chest
- **I love you** - Pinky, index finger, and thumb extended

Would you like me to describe how to sign a specific word?`;
    }

    // Explain requests
    if (/explain|what is|what are|how does|how do|tell me about|describe|define/i.test(message)) {
        const topic = message.replace(/explain|what is|what are|how does|how do|tell me about|describe|define|please|can you|could you|\?/gi, '').trim();

        return `**Understanding: ${topic || 'Your Topic'}**

Let me break this down in simple terms:

**The Basics:**
This concept can be understood step by step. The key is to connect it to things you already know.

**Key Points:**
1. Start with the fundamental idea
2. See how the parts work together
3. Look for real-world examples

**Simple Analogy:**
Think of it like building with blocks - each piece connects to make something bigger!

**Next Steps:**
- Ask me to give you a specific example
- Try explaining it back to me in your own words
- Ask about any part that seems confusing

What aspect would you like me to clarify further?`;
    }

    // Example requests
    if (/example|show me|demonstrate|illustrate/i.test(message)) {
        return `**Here's a Real-World Example**

Let me show you how this works in everyday life:

**Scenario:**
Imagine you're at the grocery store...

**What Happens:**
1. You have a list of items
2. Each item has a price
3. You add them up to know the total
4. You check if you have enough money

**The Lesson:**
- Real situations help us understand abstract ideas
- Practice makes concepts stick
- Connecting to daily life builds understanding

Would you like me to give you a more specific example on a particular topic?`;
    }

    // Quiz requests
    if (/quiz|test|question|challenge|practice/i.test(message)) {
        return `**Let's Test Your Knowledge!**

Here's a quick thinking question:

**Question:**
If you plant a seed and water it every day, what three things does it need to grow into a healthy plant?

**Think about it...**

A) Water, soil, and darkness
B) Water, sunlight, and nutrients from soil  
C) Just water and soil
D) Only sunlight

**Hint:** Plants make their own food using a special process!

Take your time and think it through. Tell me your answer when you're ready!`;
    }

    // Help requests
    if (/help|assist|support|guide|stuck|confused|don't understand/i.test(message)) {
        return `**I'm Here to Help!**

No worries - learning takes time, and asking for help is smart!

**Here's what I can do:**
1. **Explain** any concept in simple words
2. **Show examples** from everyday life
3. **Break down** complex topics step by step
4. **Quiz you** to check understanding
5. **Answer** any questions you have

**Quick Tips:**
- Try the buttons below for common actions
- Ask me to "explain simply" if something is confusing
- Tell me what subject you're studying

What would you like help with?`;
    }

    // Default intelligent response for any other query
    const topicContext = context?.currentTopic || subject || 'learning';

    return `**Great Question!**

I heard your question about: "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}"

Let me help you understand this:

**Key Concept:**
This topic connects to ${topicContext}. The important thing is to break it into smaller pieces.

**My Approach:**
1. First, understand the main idea
2. Then, look at the details
3. Finally, see how it all connects

**What You Can Try:**
- Ask me to **explain** it in simpler terms
- Request a **real-world example**
- Take a **quiz** to test yourself

How would you like me to help with this topic?`;
}
