import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Client initialization
const client = (() => {
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
        try {
            const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
            return new TextToSpeechClient({ credentials });
        } catch (error) {
            console.error("Failed to parse GOOGLE_CREDENTIALS_JSON", error);
        }
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        return new TextToSpeechClient();
    }
    return null;
})();

export async function generateAudio(text: string): Promise<Buffer> {
    if (!client) throw new Error("Google Cloud Credentials missing");

    try {
        const [response] = await client.synthesizeSpeech({
            input: { text },
            voice: { languageCode: 'en-US', name: 'en-US-Studio-O' }, // Studio voice for high quality
            audioConfig: { audioEncoding: 'MP3' },
        });

        if (response.audioContent) {
            return Buffer.from(response.audioContent);
        }
        throw new Error("No audio content received from Google Cloud");
    } catch (error) {
        console.error("TTS generation failed:", error);
        throw error;
    }
}
