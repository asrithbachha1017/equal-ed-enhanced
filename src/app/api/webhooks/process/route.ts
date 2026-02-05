import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { simplifyText } from '@/lib/ai/openai';
import { generateAudio } from '@/lib/ai/tts';

export async function POST(request: Request) {
    try {
        // 1. Fetch PENDING content
        const pendingContent = await prisma.content.findMany({
            where: { status: 'PENDING' },
            take: 5 // Process in batches
        });

        const results = [];

        for (const content of pendingContent) {
            // 2. Mark as PROCESSING
            await prisma.content.update({
                where: { id: content.id },
                data: { status: 'PROCESSING' }
            });

            try {
                // 3. Run AI Logic
                // Parallelize these in production
                const simplified = await simplifyText(content.originalText);
                // Audio generation (Video/Audio buffer would need upload to storage, mocking URL here)
                const audioBuffer = await generateAudio(simplified);
                const mockAudioUrl = audioBuffer ? `/audio/${content.id}.mp3` : null;

                // Mock Caption Generation (in real app, use Whisper or Deepgram on the audio)
                const mockCaptionUrl = mockAudioUrl ? `/captions/${content.id}.vtt` : null;

                // 4. Update to COMPLETED
                const updated = await prisma.content.update({
                    where: { id: content.id },
                    data: {
                        simplifiedText: simplified,
                        audioUrl: mockAudioUrl,
                        captionUrl: mockCaptionUrl,
                        status: 'COMPLETED'
                    }
                });
                results.push(updated);
            } catch (err) {
                console.error(`Processing failed for ${content.id}`, err);
                await prisma.content.update({
                    where: { id: content.id },
                    data: { status: 'FAILED', error: String(err) }
                });
            }
        }

        return NextResponse.json({ processed: results.length, results });
    } catch (error) {
        console.error('Webhook failed:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
}
