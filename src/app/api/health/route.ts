
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: 'ok', database: 'connected' }, { status: 200 });
    } catch (error: any) {
        console.error('Health Check Failed:', error);
        return NextResponse.json({ status: 'error', database: 'disconnected', message: error.message }, { status: 503 });
    }
}
