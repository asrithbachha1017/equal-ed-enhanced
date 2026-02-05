/**
 * Gemini AI Client
 * Uses Google's free Gemini API for the EqualEd AI Tutor
 */

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Initialize Gemini client if API key is available
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Safety settings for educational content
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

/**
 * Check if Gemini is properly configured
 */
export function isGeminiConfigured(): boolean {
    return !!genAI;
}

/**
 * Get the Gemini model for chat
 */
export function getGeminiModel() {
    if (!genAI) {
        throw new Error('Gemini API key not configured');
    }

    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash', // Free tier model
        safetySettings,
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1500,
        },
    });
}

/**
 * Create a streaming chat session with Gemini
 */
export async function streamGeminiChat(
    systemPrompt: string,
    userMessage: string,
    history: Array<{ role: string; content: string }>
): Promise<AsyncIterable<string>> {
    const model = getGeminiModel();

    // Gemini uses a different format for chat history
    // Format: [{ role: 'user', parts: [{ text: '...' }] }, { role: 'model', parts: [{ text: '...' }] }]
    const geminiHistory = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    // Start chat with system instruction
    const chat = model.startChat({
        history: geminiHistory,
        systemInstruction: systemPrompt,
    });

    // Send message and get streaming response
    const result = await chat.sendMessageStream(userMessage);

    // Return async generator for streaming
    return (async function* () {
        for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
                yield text;
            }
        }
    })();
}

/**
 * Simple text generation with Gemini (non-chat)
 */
export async function generateWithGemini(prompt: string): Promise<string> {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Simplify text using Gemini
 */
export async function simplifyTextWithGemini(text: string): Promise<string> {
    const prompt = `You are an expert accessibility assistant. Simplify the following text to be easier to read:
- Use simple vocabulary and short sentences (Grade 5-6 reading level)
- Break down complex ideas into bullet points where appropriate
- Do not omit important facts

Text to simplify:
"${text}"`;

    return generateWithGemini(prompt);
}

/**
 * Generate quiz questions with Gemini
 */
export async function generateQuizWithGemini(text: string): Promise<any[]> {
    const prompt = `Generate 3 multiple-choice questions based on this text. Return ONLY valid JSON:
{ "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" } ] }

Text:
"${text}"`;

    const result = await generateWithGemini(prompt);

    try {
        // Extract JSON from response
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.questions || [];
        }
    } catch (e) {
        console.error('Failed to parse quiz JSON from Gemini:', e);
    }
    return [];
}
