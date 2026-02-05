export type IntentType =
    | 'NAVIGATE'
    | 'INTERACT'
    | 'READ_SCREEN'
    | 'SYSTEM_CONTROL'
    | 'QUERY'
    | 'UNKNOWN';

export interface VoiceIntent {
    type: IntentType;
    payload?: string;
    originalTranscript: string;
    confidence: number;
}

export function classifyIntent(transcript: string): VoiceIntent {
    const t = transcript.toLowerCase().trim();

    // Navigation
    if (t.includes('go to') || t.includes('open') || t.includes('navigate')) {
        const target = t.replace(/(go to|open|navigate|to)\s+/, '').trim();
        return { type: 'NAVIGATE', payload: target, originalTranscript: transcript, confidence: 1 };
    }

    // System Control
    if (t.includes('stop') || t.includes('silence') || t.includes('pause') || t.includes('off')) {
        return { type: 'SYSTEM_CONTROL', payload: 'stop', originalTranscript: transcript, confidence: 1 };
    }

    // Interaction (Click)
    if (t.startsWith('click') || t.startsWith('select') || t.startsWith('press')) {
        const target = t.replace(/^(click|select|press)\s+/, '').trim();
        return { type: 'INTERACT', payload: target, originalTranscript: transcript, confidence: 1 };
    }

    // Reading
    if (t.startsWith('read')) {
        const target = t.replace(/^read\s+/, '').trim();
        return { type: 'READ_SCREEN', payload: target, originalTranscript: transcript, confidence: 1 };
    }

    // Query
    if (t.includes('where am i') || t.includes('status')) {
        return { type: 'QUERY', originalTranscript: transcript, confidence: 1 };
    }

    return { type: 'UNKNOWN', originalTranscript: transcript, confidence: 0 };
}
