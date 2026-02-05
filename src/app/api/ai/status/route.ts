import { NextResponse } from 'next/server';

/**
 * API Status Endpoint
 * Checks if the AI backend is properly configured and operational.
 */
export async function GET() {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY.startsWith('AIza');

    const hasOpenAIKey = !!process.env.OPENAI_API_KEY &&
        process.env.OPENAI_API_KEY !== 'sk-...' &&
        process.env.OPENAI_API_KEY.startsWith('sk-');

    const connected = hasGeminiKey || hasOpenAIKey;
    const provider = hasGeminiKey ? 'Gemini' : (hasOpenAIKey ? 'OpenAI' : 'None');

    return NextResponse.json({
        connected,
        provider,
        models: hasGeminiKey
            ? ['gemini-1.5-flash', 'gemini-1.5-pro']
            : (hasOpenAIKey ? ['gpt-4o', 'gpt-3.5-turbo'] : []),
        features: {
            streaming: true,
            tts: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
            voiceInput: true // Browser-based, always available
        },
        message: connected
            ? `AI backend is connected via ${provider}.`
            : 'AI backend is in mock mode. Set GEMINI_API_KEY or OPENAI_API_KEY in .env to enable.'
    });
}
