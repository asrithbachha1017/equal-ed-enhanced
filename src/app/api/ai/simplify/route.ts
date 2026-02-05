import { NextResponse } from 'next/server';
import { simplifyText } from '@/lib/ai/openai';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const simplified = await simplifyText(text);
        return NextResponse.json({ simplified });
    } catch (error: any) {
        console.error('Simplification API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
