import { NextResponse } from 'next/server';
import { chatWithContent } from '@/lib/ai/openai';

export async function POST(request: Request) {
    try {
        const { context, messages } = await request.json();

        if (!context || !messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Context and Messages array are required' }, { status: 400 });
        }

        const response = await chatWithContent(context, messages);
        return NextResponse.json({ message: response });
    } catch (error: any) {
        // Never expose technical errors to users - use friendly fallback
        console.error('Assistant Chat API Error:', error);

        // Return a user-friendly message without exposing technical details
        return NextResponse.json({
            message: "I'll still help you in a simpler way for now. Could you try asking your question again?"
        });
    }
}
