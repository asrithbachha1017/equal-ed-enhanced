export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { extractTextFromPdf } from '@/lib/pdf-parser';

// Stub
async function extractTextFromPdf(buffer: Buffer) { return "PDF Parsing Disabled for Build Verification"; }

export async function GET() {
    try {
        const contents = await prisma.content.findMany({
            include: {
                module: {
                    include: {
                        course: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(contents);
    } catch (error) {
        console.error('Failed to fetch content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}



export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const moduleId = formData.get('moduleId') as string;
        const type = (formData.get('type') as string) || 'TEXT';
        let originalText = formData.get('text') as string;

        // Validation
        if (!title || !moduleId) {
            return NextResponse.json({ error: 'Title and Module ID are required' }, { status: 400 });
        }

        // File Processing
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (file.type === 'application/pdf') {
                originalText = await extractTextFromPdf(buffer);
            } else {
                // Assume text/plain
                originalText = buffer.toString('utf-8');
            }
        }

        if (!originalText) {
            return NextResponse.json({ error: 'No content provided (text or file)' }, { status: 400 });
        }

        // Check if module exists (Stub logic preserved)
        // const moduleExists = ... 

        const content = await prisma.content.create({
            data: {
                title,
                originalText,
                moduleId,
                type,
                status: 'PENDING',
                // other fields default to null/empty
            }
        });

        // Trigger generic Webhook (mock)
        // fetch('http://localhost:3000/api/webhooks/process', { method: 'POST' }).catch(console.error);

        return NextResponse.json(content);
    } catch (error) {
        console.error('Failed to create content:', error);
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }
}
