import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

// Initialize Google Cloud TTS Client
// Keeps credentials in environment variables (GOOGLE_APPLICATION_CREDENTIALS)
const client = new textToSpeech.TextToSpeechClient();

export async function POST(req: Request) {
    try {
        const { text, gender = "NEUTRAL" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        // Construct the request
        const request = {
            input: { text: text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: "en-US", ssmlGender: gender as "MALE" | "FEMALE" | "NEUTRAL" },
            // select the type of audio encoding
            audioConfig: { audioEncoding: "MP3" as const },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        // Returns audio content as base64
        const audioContent = response.audioContent;

        if (!audioContent) {
            throw new Error("No audio content returned");
        }

        return NextResponse.json({
            audioContent: Buffer.from(audioContent).toString("base64")
        });

    } catch (error) {
        console.error("Text-to-Speech API Error:", error);
        return NextResponse.json({ error: "Internal Server Error. Ensure Google Cloud Creds are set." }, { status: 500 });
    }
}
