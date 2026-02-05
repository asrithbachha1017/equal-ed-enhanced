"use client";

// Force refresh: 2026-01-08-HMR-TRIGGER
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";
import { MockLevel, MockModule } from "@/lib/mock-db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CourseIntroModal } from "@/components/course/course-intro-modal";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, BookOpen, CheckCircle, X, Database, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useGamification } from "@/lib/gamification";
import { useCourse } from "@/hooks/use-course";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function CoursePage() {
    const params = useParams();
    const courseId = params.courseId as string;
    const { data: course, isLoading: loading } = useCourse(courseId);
    const { addXP } = useGamification();
    const [selectedModule, setSelectedModule] = useState<any | null>(null);
    const [showTranscript, setShowTranscript] = useState(false);

    // Intro Modal Logic (Moved to Top Level)
    const [introOpen, setIntroOpen] = useState(false);

    useEffect(() => {
        if (course?.introVideo) {
            const hasSeen = sessionStorage.getItem(`seen_intro_${courseId}`);
            if (!hasSeen) {
                setIntroOpen(true);
                sessionStorage.setItem(`seen_intro_${courseId}`, "true");
            }
        }
    }, [course, courseId]);

    const handleModuleClick = (module: any) => {
        setSelectedModule(module);
        setShowTranscript(false);
    };

    const handleComplete = () => {
        const { newLevel, levelUp } = addXP(50);
        if (levelUp) {
            toast.success(`🎉 Nice work! You're now Level ${newLevel}!`, {
                description: "+50 XP earned. Keep up the momentum!",
            });
        } else {
            toast.success(`+50 XP! Keep going!`, {
                description: "Module completed successfully.",
            });
        }
        setSelectedModule(null); // Close player
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <CourseIntroModal
                isOpen={introOpen}
                onClose={() => setIntroOpen(false)}
                courseTitle={course.title}
                introData={course.introVideo}
            />

            <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
                <Link href="/dashboard/courses" className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Library
                </Link>

                {/* Course Header */}
                <div className="space-y-4 animate-in slide-in-from-bottom-5 fade-in">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                        <Database className="w-3 h-3 mr-1" />
                        Dataset-Driven Curriculum
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {course.title}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                        {course.description}
                    </p>

                    {/* AI Transparency Card */}
                    {course.aiMetadata && (
                        <Card className="bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900 mt-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    Powered by {course.aiMetadata.modelName} ({(course.aiMetadata.confidenceScore * 100).toFixed(0)}% Confidence)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-indigo-800 dark:text-indigo-200 space-y-3">
                                <p>{course.aiMetadata.usage}</p>
                                <div className="flex flex-wrap gap-2">
                                    {course.aiMetadata.citations.map((cite, i) => (
                                        <Link key={i} href={cite.url} target="_blank" className="inline-flex items-center px-2 py-1 rounded bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-colors text-xs border border-indigo-200 dark:border-indigo-800">
                                            <ExternalLink className="h-3 w-3 mr-1 opacity-50" />
                                            {cite.title} ({cite.type})
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Learning Objectives */}
                    {course.learningObjectives && (
                        <div className="grid gap-4 mt-8 p-6 bg-white dark:bg-slate-900 rounded-xl border">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                What you'll learn
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {course.learningObjectives.map((obj, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                        {obj}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Levels & Syllabus */}
                <div className="space-y-8">
                    {course.levels.map((level: MockLevel, levelIndex: number) => (
                        <div key={level.id} className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-100">{level.title}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{level.description}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg text-xs md:text-sm">
                                    <Database className="w-4 h-4 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold">Powered by {level.dataset.name}</span>
                                        <span className="text-slate-500">{level.dataset.usage}</span>
                                    </div>
                                    <Link href={level.dataset.sourceUrl} target="_blank">
                                        <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary ml-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* AI Lab Launcher (Conditional) */}
                            {level.dataset.name.includes("ASL") && (
                                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500 rounded-lg text-white">
                                            <PlayCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">AI Gesture Lab Available</h3>
                                            <p className="text-sm text-indigo-700 dark:text-indigo-300">Practice this level with real-time feedback.</p>
                                        </div>
                                    </div>
                                    <Link href="/monitor?mode=practice">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                                            Launch AI Lab <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Math Lab Launcher (Conditional) */}
                            {(level.dataset.name.includes("DeepMind") || level.dataset.name.includes("Math")) && (
                                <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-teal-500 rounded-lg text-white">
                                            <Database className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-teal-900 dark:text-teal-100">Adaptive Math Engine</h3>
                                            <p className="text-sm text-teal-700 dark:text-teal-300">Infinite procedural drills generated from dataset logic.</p>
                                        </div>
                                    </div>
                                    <Link href="/math-lab">
                                        <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
                                            Enter Math Lab <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            <div className="grid gap-4">
                                {level.modules.length > 0 ? (
                                    level.modules.map((module: MockModule, index: number) => (
                                        <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary" onClick={() => handleModuleClick(module)}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                                    Module {index + 1}: {module.title}
                                                </CardTitle>
                                                <PlayCircle className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription>
                                                    {level.dataset.dataType} • Interactive Practice
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="p-6 border-2 border-dashed rounded-xl text-center text-muted-foreground bg-slate-50 dark:bg-slate-900/50">
                                        <p>Interactive modules for this level are generated dynamically from the dataset.</p>
                                        <Button variant="outline" className="mt-4" onClick={() => alert("Start Dynamic Practice Session functionality coming soon!")}>
                                            Start AI Practice Session
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lesson Player Overlay */}
                {selectedModule && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                            {/* Header */}
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                                <h3 className="text-lg font-bold">{selectedModule.title}</h3>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedModule(null)}>
                                    <X className="h-5 w-5" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Video Player */}
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800 relative group">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={selectedModule.videoUrl || "https://www.youtube.com/embed/0FcwzMq4iWg"} // ASL Fingerspelling Tutorial
                                        title={selectedModule.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>

                                    {/* Transcript Toggle Overlay */}
                                    {selectedModule.transcript && (
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setShowTranscript(!showTranscript)}
                                                className="bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20"
                                            >
                                                {showTranscript ? "Hide Transcript" : "Show Transcript"}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Transcript Panel */}
                                {showTranscript && selectedModule.transcript && (
                                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2">
                                        <h5 className="font-semibold mb-2 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" /> Transcript
                                        </h5>
                                        <div className="max-h-40 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-2">
                                            {selectedModule.transcript}
                                        </div>
                                    </div>
                                )}

                                {/* Text Content */}
                                <div className="prose dark:prose-invert max-w-none">
                                    <h4 className="text-xl font-semibold mb-2">Lesson Overview</h4>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                        {selectedModule.content || "Content is loading..."}
                                    </p>

                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 my-4">
                                        <h5 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Key Takeaway</h5>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                            Mastering this topic is crucial for understand higher-level concepts in this subject.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setSelectedModule(null)}>
                                    Close
                                </Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleComplete}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Complete & Earn XP
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
