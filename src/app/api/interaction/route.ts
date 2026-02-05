import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, contentId, type, duration, score } = body;

        // Validate required fields
        if (!userId || !contentId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create interaction record
        const interaction = await prisma.studentInteraction.create({
            data: {
                userId,
                contentId,
                type, // 'READ', 'LISTENED', 'QUIZ'
                duration: duration || 0,
                score: score || null,
            }
        });

        // Update User Profile or adaptive stats here if needed in future

        return NextResponse.json(interaction);
    } catch (error) {
        console.error('Failed to log interaction:', error);
        return NextResponse.json({ error: 'Failed to log interaction' }, { status: 500 });
    }
}
