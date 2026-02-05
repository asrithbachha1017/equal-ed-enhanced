import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ContentPlayer } from "@/components/features/content-player"
import { ChatAssistant } from "@/components/features/chat-assistant"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

async function getContent(id: string) {
    // In a real app we'd handle errors better or verify auth
    try {
        const content = await prisma.content.findUnique({
            where: { id },
            include: { module: { include: { course: true } } }
        })
        return content
    } catch (e) {
        return null
    }
}

export default async function LearnPage({ params }: { params: Promise<{ contentId: string }> }) {
    const { contentId } = await params;
    const content = await getContent(contentId)

    if (!content) {
        // For hackathon demo, if not found, we might show a mock if ID is "demo"
        if (contentId === "demo") {
            return <ContentPlayer content={{
                id: "demo",
                title: "Demo Content: Space Exploration",
                originalText: "Space exploration is the use of astronomy and space technology to explore outer space. While the exploration of space is carried out mainly by astronomers with telescopes, its physical exploration though is conducted both by unmanned robotic space probes and human spaceflight.",
                simplifiedText: "Space exploration means using technology to travel to and look at outer space. We use telescopes, robots, and astronauts to learn more about the universe.",
                audioUrl: null, // "demo-audio.mp3"
                type: "TEXT",
                moduleId: "demo-module",
                createdAt: new Date()
            }} />
        }
        return notFound()
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="h-16 border-b flex items-center px-4 md:px-8">
                <Link href="/dashboard/courses">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Course
                    </Button>
                </Link>
                <div className="ml-4 font-semibold opacity-70">
                    {content.module?.course?.title} / {content.module?.title}
                </div>
            </header>
            <main className="flex-1 container max-w-4xl mx-auto p-4 md:p-8 relative">
                <ContentPlayer content={content} />
                <ChatAssistant
                    context={content.originalText}
                    lessonTopic={content.title}
                    moduleId={content.moduleId}
                />
            </main>
        </div>
    )
}
