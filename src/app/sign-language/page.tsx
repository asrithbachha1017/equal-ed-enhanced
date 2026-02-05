"use client";

import { useState } from "react";
import { PDFUpload } from "@/components/features/sign-language/pdf-upload";
import { SignLanguagePlayer } from "@/components/features/sign-language/interpreter-player";
import { DocumentViewer } from "@/components/features/sign-language/document-viewer";
import { TextInput } from "@/components/features/sign-language/text-input";
import { SignLanguageProcessResponse, SignLanguageSegment } from "@/lib/sign-language/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SignLanguagePage() {
    const [segments, setSegments] = useState<SignLanguageSegment[]>([]);
    const [currentSegmentId, setCurrentSegmentId] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [mode, setMode] = useState<'pdf' | 'text'>('text'); // Default to text for broader utility

    const handleProcessingComplete = (data: SignLanguageProcessResponse) => {
        setSegments(data.segments);
        if (data.segments.length > 0) {
            setCurrentSegmentId(data.segments[0].id);
        }
        setIsReady(true);
    };

    const reset = () => {
        setSegments([]);
        setCurrentSegmentId(null);
        setIsReady(false);
    };

    return (
        <div className="container max-w-7xl mx-auto py-8 min-h-screen space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {isReady ? (
                        <Button variant="ghost" className="gap-2 hover:bg-primary/10" onClick={reset}>
                            <ArrowLeft className="h-4 w-4" /> Start Over
                        </Button>
                    ) : (
                        <Link href="/dashboard">
                            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="text-center md:text-right">
                    <h1 className="text-3xl md:text-4xl font-bold font-style-serif text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-600">
                        Sign Interpreter
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">AI-Powered Text to Sign Language</p>
                </div>
            </div>

            {!isReady ? (
                <div className="max-w-2xl mx-auto space-y-8 mt-12">
                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-muted/50 rounded-full w-fit mx-auto backdrop-blur-sm border border-border/50">
                        <button
                            onClick={() => setMode('text')}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                mode === 'text' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Type Text
                        </button>
                        <button
                            onClick={() => setMode('pdf')}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                mode === 'pdf' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Upload PDF
                        </button>
                    </div>

                    {/* Input Component */}
                    <div className="animate-in slide-in-from-bottom-4 duration-300">
                        {mode === 'text' ? (
                            <TextInput onProcessingComplete={handleProcessingComplete} />
                        ) : (
                            <PDFUpload onProcessingComplete={handleProcessingComplete} />
                        )}
                    </div>

                    <div className="text-center text-muted-foreground p-6 glass-morphism rounded-xl border-0 bg-background/30 max-w-lg mx-auto">
                        <h3 className="font-semibold mb-2 text-primary">How it works</h3>
                        <p className="text-sm leading-relaxed">
                            Our system uses AI to analyze your content and match it with verified sign language videos.
                            Unknown words will be fingerspelled automatically.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    {/* Document Side */}
                    <div className="order-2 lg:order-1 lg:col-span-8 pb-32 space-y-4">
                        <div className="glass-morphism rounded-xl p-6 border-0 bg-background/40">
                            <div className="flex items-center justify-between mb-6 border-b border-primary/10 pb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                                    Translated Content
                                </h2>
                                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                                    {segments.length} Segments
                                </span>
                            </div>
                            <DocumentViewer
                                segments={segments}
                                currentSegmentId={currentSegmentId}
                                onSegmentClick={setCurrentSegmentId}
                            />
                        </div>
                    </div>

                    {/* Video Side - Sticky */}
                    <div className="order-1 lg:order-2 lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <SignLanguagePlayer
                                segments={segments}
                                currentSegmentId={currentSegmentId}
                                onSegmentChange={setCurrentSegmentId}
                            />

                            <div className="hidden lg:block glass-morphism p-4 rounded-xl border-0 bg-primary/5">
                                <p className="font-medium text-sm text-primary mb-2">✨ Pro Tip</p>
                                <p className="text-xs text-muted-foreground">
                                    Use the arrow keys (←/→) to navigate between segments. Press Space to play/pause.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
