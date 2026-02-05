import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { writeFile } from "fs/promises";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`[API] Received audio for transcription: ${file.name}`);

        // Create tmp directory if it doesn't exist
        const tmpDir = path.join(process.cwd(), "tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Write buffer to temp file
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFilePath = path.join(tmpDir, `audio-${Date.now()}.webm`);
        await writeFile(tempFilePath, buffer);

        // Call OpenAI Whisper API
        if (process.env.OPENAI_API_KEY) {
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: "whisper-1",
            });

            // Cleanup
            fs.unlinkSync(tempFilePath);

            return NextResponse.json({ text: transcription.text });
        } else {
            // Fallback for when API keys are missing (so app doesn't crash during demo)
            console.warn("[API] No OpenAI API Key found. Returning mock response.");
            fs.unlinkSync(tempFilePath);
            return NextResponse.json({ text: "This is a mock transcription. Please set OPENAI_API_KEY in .env to use real Whisper AI." });
        }

    } catch (error) {
        console.error("Speech-to-Text API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
