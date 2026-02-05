import { NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/ai/whisper';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        const transcription = await transcribeAudio(buffer);
        return NextResponse.json({ transcription });
    } catch (error: any) {
        console.error('Transcription API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
