import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PROMPTS } from "@/lib/ai/prompts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { message, history, accessibility, lessonTopic } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "No message provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key
            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json({
                reply: "I am a Mock Lumina Tutor. Set your OPENAI_API_KEY to make me real! But I see you asked: " + message
            });
        }

        // Construct dynamic system prompt based on context
        const systemPrompt = PROMPTS.LUMINA_TUTOR({
            lessonTopic,
            accessibility
        });

        // Construct conversation for OpenAI
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.slice(-6), // Context of last few messages (increased from 4)
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            messages: messages as any,
            model: "gpt-3.5-turbo",
            temperature: 0.7, // Slightly creative but focused
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });

    } catch (error) {
        console.error("AI Tutor API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
