import { NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/ai/openai';

export async function POST(request: Request) {
    try {
        const { context, question } = await request.json();
        if (!context || !question) {
            return NextResponse.json({ error: 'Context and Question are required' }, { status: 400 });
        }

        const answer = await answerQuestion(context, question);
        return NextResponse.json({ answer });
    } catch (error: any) {
        console.error('QA API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
