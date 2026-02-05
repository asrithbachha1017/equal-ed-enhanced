import { NextResponse } from 'next/server';

/**
 * Sign Language Translation API
 * Returns mock images for prototype presentation
 */

interface TranslationRequest {
    text: string;
    targetLanguage: 'ASL' | 'BSL';
    outputFormat: 'video' | 'gif' | 'image';
    duration?: string;
}

interface TranslationResponse {
    imageUrl?: string;
    videoUrl?: string;
    type: 'image' | 'video';
    videoId: string;
    duration: number;
    language: string;
    text: string;
    matchedSign?: string;
    generatedAt: string;
}

// Mock sign language images for common words/phrases
const SIGN_IMAGES: Record<string, string> = {
    // Direct matches
    'welcome': '/sign-language/welcome.png',
    'settings': '/sign-language/settings.png',
    'solar system': '/sign-language/solar_system.png',
    'solarsystem': '/sign-language/solar_system.png',

    // Keyword matching
    'hello': '/sign-language/welcome.png',
    'hi': '/sign-language/welcome.png',
    'greetings': '/sign-language/welcome.png',
    'config': '/sign-language/settings.png',
    'preferences': '/sign-language/settings.png',
    'options': '/sign-language/settings.png',
    'planets': '/sign-language/solar_system.png',
    'sun': '/sign-language/solar_system.png',
    'earth': '/sign-language/solar_system.png',
    'space': '/sign-language/solar_system.png',
    'orbit': '/sign-language/solar_system.png',
};

function findMatchingSign(text: string): { sign: string; url: string } | null {
    const lowerText = text.toLowerCase().trim();

    // Direct match
    if (SIGN_IMAGES[lowerText]) {
        return { sign: lowerText, url: SIGN_IMAGES[lowerText] };
    }

    // Keyword search in text
    for (const [keyword, url] of Object.entries(SIGN_IMAGES)) {
        if (lowerText.includes(keyword)) {
            return { sign: keyword, url };
        }
    }

    // No match - return welcome as default
    return { sign: 'welcome', url: '/sign-language/welcome.png' };
}

export async function POST(req: Request) {
    try {
        const body: TranslationRequest = await req.json();
        const { text, targetLanguage } = body;

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text is required for translation' },
                { status: 400 }
            );
        }

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        // Find matching sign
        const match = findMatchingSign(text);

        const videoId = `sign_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const response: TranslationResponse = {
            imageUrl: match?.url || '/sign-language/welcome.png',
            type: 'image',
            videoId,
            duration: 3,
            language: targetLanguage,
            text: text.slice(0, 100),
            matchedSign: match?.sign,
            generatedAt: new Date().toISOString(),
        };

        console.log('[Sign Language API] Matched:', {
            input: text.slice(0, 50),
            matched: match?.sign,
            language: targetLanguage,
        });

        return NextResponse.json(response);

    } catch (error) {
        console.error('[Sign Language API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate sign language translation' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
        return NextResponse.json(
            { error: 'videoId is required' },
            { status: 400 }
        );
    }

    return NextResponse.json({
        videoId,
        status: 'completed',
        progress: 100,
        message: 'Translation complete',
    });
}
