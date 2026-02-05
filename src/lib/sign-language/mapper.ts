import { SignLanguageSegment } from "./types";
import { SIGN_DICTIONARY, SignEntry } from "./dictionary";

/**
 * Splits raw text into meaningful segments (sentences).
 * Uses simple regex for splitting by punctuation.
 */
export function segmentText(rawText: string): string[] {
    // Remove multiple spaces and newlines
    const normalized = rawText.replace(/\s+/g, " ").trim();

    // Split by . ! ? followed by space, or newline
    const segments = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

    return segments.map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Normalizes a word for lookup (lowercase, remove punctuation, simple stemming).
 */
function normalizeWord(word: string): string {
    return word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
}

/**
 * Simple English stemmer/lemmatizer fallback
 * e.g., "courses" -> "course", "learning" -> "learn"
 */
function getRootWord(word: string): string {
    if (word.endsWith("ing")) return word.slice(0, -3);
    if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
    if (word.endsWith("ed")) return word.slice(0, -2);
    return word;
}

/**
 * Maps a text segment to a video URL using the enhanced dictionary.
 */
export async function mapSegmentToVideo(segmentText: string, index: number): Promise<SignLanguageSegment> {

    let bestMatch: SignEntry = SIGN_DICTIONARY["default"];
    let fallbackType: SignLanguageSegment['fallbackType'] = 'fingerspell';

    const words = segmentText.split(" ");

    // Scored matching: longer words and exact matches get higher priority
    let highestScore = 0;

    for (const rawWord of words) {
        const cleanWord = normalizeWord(rawWord);
        if (!cleanWord || cleanWord.length < 2) continue; // Skip mostly punctuation or single letters

        // 1. Exact Match
        if (SIGN_DICTIONARY[cleanWord]) {
            const score = cleanWord.length * 2; // Prefer longer exact words
            if (score > highestScore) {
                highestScore = score;
                bestMatch = SIGN_DICTIONARY[cleanWord];
                fallbackType = bestMatch.type === 'exact' ? 'exact' : 'partial';
            }
            continue;
        }

        // 2. Stem/Root Match
        const rootWord = getRootWord(cleanWord);
        if (rootWord !== cleanWord && SIGN_DICTIONARY[rootWord]) {
            const score = rootWord.length; // Lower priority than exact
            if (score > highestScore) {
                highestScore = score;
                bestMatch = SIGN_DICTIONARY[rootWord];
                fallbackType = 'partial';
            }
        }
    }

    // If no keywords found, strict fallback to fingerspelling/default
    if (highestScore === 0) {
        fallbackType = 'fingerspell';
    }

    // Simulate network delay for "processing" feel
    // await new Promise(r => setTimeout(r, 10));

    return {
        id: `seg_${index}_${Date.now()}`,
        text: segmentText,
        videoUrl: bestMatch.url,
        fallbackType: fallbackType
    };
}

export async function processTextToSignSegments(fullText: string): Promise<SignLanguageSegment[]> {
    const textSegments = segmentText(fullText);
    const signSegments: SignLanguageSegment[] = [];

    for (let i = 0; i < textSegments.length; i++) {
        const segment = await mapSegmentToVideo(textSegments[i], i);
        signSegments.push(segment);
    }

    return signSegments;
}

