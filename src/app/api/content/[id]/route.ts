import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const content = await prisma.content.findUnique({
            where: { id },
            include: {
                module: true
            }
        });

        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Failed to fetch content item:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}
