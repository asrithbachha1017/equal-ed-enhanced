import OpenAI from 'openai';
import fs from 'fs';
import os from 'os';
import path from 'path';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
    if (!openai) throw new Error("OpenAI API Key missing");

    // Whisper API requires a file stream, so we must write buffer to disk temporarily
    const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.mp3`);

    try {
        await fs.promises.writeFile(tempFilePath, audioBuffer);

        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
            language: "en",
        });

        return response.text;
    } catch (error) {
        console.error("Whisper Transcription Error:", error);
        throw error;
    } finally {
        // Cleanup temp file
        if (fs.existsSync(tempFilePath)) {
            await fs.promises.unlink(tempFilePath);
        }
    }
}
