import { NextResponse } from 'next/server';

/**
 * Tutor Analytics API
 * Provides insights into AI tutor usage and learning patterns
 */

// Mock analytics data for demo (replace with Prisma queries in production)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '7d'; // 7d, 30d, all

    // Generate mock analytics
    const now = new Date();
    const analytics = {
        summary: {
            totalQuestions: 47,
            averageResponseTime: 1.2, // seconds
            topicsExplored: 12,
            helpfulRating: 0.89, // 89% helpful
            streakDays: 5
        },
        topSubjects: [
            { subject: 'Mathematics', count: 22, percentage: 47 },
            { subject: 'Science', count: 15, percentage: 32 },
            { subject: 'American Sign Language', count: 7, percentage: 15 },
            { subject: 'General', count: 3, percentage: 6 }
        ],
        topTopics: [
            { topic: 'Fractions', count: 8 },
            { topic: 'Photosynthesis', count: 6 },
            { topic: 'Algebra Basics', count: 5 },
            { topic: 'Finger Spelling', count: 4 },
            { topic: 'Multiplication', count: 4 }
        ],
        activityByDay: generateActivityByDay(period),
        recentInteractions: [
            {
                id: '1',
                question: 'What is 2/3 + 1/4?',
                topic: 'Fractions',
                subject: 'Mathematics',
                helpful: true,
                createdAt: new Date(now.getTime() - 3600000).toISOString()
            },
            {
                id: '2',
                question: 'Explain photosynthesis simply',
                topic: 'Photosynthesis',
                subject: 'Science',
                helpful: true,
                createdAt: new Date(now.getTime() - 7200000).toISOString()
            },
            {
                id: '3',
                question: 'How do I sign "thank you"?',
                topic: 'Basic Signs',
                subject: 'American Sign Language',
                helpful: null,
                createdAt: new Date(now.getTime() - 10800000).toISOString()
            }
        ],
        learningInsights: generateLearningInsights()
    };

    return NextResponse.json(analytics);
}

function generateActivityByDay(period: string): Array<{ date: string; questions: number }> {
    const days = period === '30d' ? 30 : period === 'all' ? 90 : 7;
    const activity = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        activity.push({
            date: date.toISOString().split('T')[0],
            questions: Math.floor(Math.random() * 8) + (i % 7 === 0 ? 0 : 2) // More activity on weekdays
        });
    }

    return activity;
}

function generateLearningInsights(): string[] {
    return [
        "You've been asking great questions about fractions! Consider practicing mixed numbers next.",
        "Your science curiosity is growing - you asked 40% more questions this week!",
        "Tip: Try the 'Quiz me' button to test your understanding of recent topics.",
        "You're most active on Tuesdays and Thursdays. Keep up the consistent learning!"
    ];
}

/**
 * Log a new tutor interaction
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            userId,
            question,
            response,
            topic,
            subject,
            courseId,
            responseTime,
            provider,
            model
        } = body;

        // In production, save to database with Prisma:
        // const interaction = await prisma.tutorInteraction.create({
        //     data: { userId, question, response, topic, subject, courseId, responseTime, provider, model }
        // });

        // For now, just acknowledge the log
        console.log('Tutor interaction logged:', { userId, topic, subject, responseTime });

        return NextResponse.json({
            success: true,
            message: 'Interaction logged',
            id: `mock-${Date.now()}`
        });
    } catch (error) {
        console.error('Failed to log tutor interaction:', error);
        return NextResponse.json(
            { error: 'Failed to log interaction' },
            { status: 500 }
        );
    }
}
