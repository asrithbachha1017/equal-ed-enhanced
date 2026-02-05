import OpenAI from 'openai';
import { PROMPTS } from './prompts';

const apiKey = process.env.OPENAI_API_KEY;

// Singleton Client
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function simplifyText(text: string): Promise<string> {
    if (!openai) throw new Error("OpenAI API Key missing");

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        // @ts-ignore
        messages: PROMPTS.SIMPLIFY(text),
        temperature: 0.3,
    });
    return response.choices[0].message.content || "";
}

export async function generateQuiz(text: string): Promise<any[]> {
    if (!openai) throw new Error("OpenAI API Key missing");

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        // @ts-ignore
        messages: PROMPTS.QUIZ_GENERATION(text),
        response_format: { type: "json_object" },
        temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    try {
        const parsed = JSON.parse(content);
        return parsed.questions || [];
    } catch (e) {
        console.error("Failed to parse quiz JSON", e);
        return [];
    }
}

export async function answerQuestion(context: string, question: string): Promise<string> {
    if (!openai) throw new Error("OpenAI API Key missing");

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        // @ts-ignore
        messages: PROMPTS.QA(context, question),
        temperature: 0.1, // Low temp for factual accuracy
    });
    return response.choices[0].message.content || "I could not generate an answer.";
}

export async function chatWithContent(context: string, messages: any[]): Promise<string> {
    if (!openai) throw new Error("OpenAI API Key missing");

    // Prepend system instruction with context
    const systemParam = { role: "system", content: PROMPTS.CHAT_SYSTEM(context) };

    // Combine system + history
    const conversation = [systemParam, ...messages];

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        // @ts-ignore
        messages: conversation,
        temperature: 0.3,
    });
    return response.choices[0].message.content || "I'm sorry, I couldn't respond to that.";
}
