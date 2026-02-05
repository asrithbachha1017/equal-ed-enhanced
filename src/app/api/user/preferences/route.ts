import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    // In real app, get userId from session
    // Mocking userId for demo
    const userId = request.headers.get("x-user-id") || "student-123";

    try {
        const profile = await prisma.accessibilityProfile.findUnique({
            where: { userId }
        });
        return NextResponse.json(profile || {});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const userId = request.headers.get("x-user-id") || "student-123";
    try {
        const body = await request.json();
        const profile = await prisma.accessibilityProfile.upsert({
            where: { userId },
            update: { ...body },
            create: { userId, ...body }
        });
        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
}
