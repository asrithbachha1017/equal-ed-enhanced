"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Keyboard, ArrowRight, Loader2, PlayCircle } from "lucide-react";
import { SignLanguageProcessResponse } from "@/lib/sign-language/types";
import { cn } from "@/lib/utils";

interface TextInputProps {
    onProcessingComplete: (data: SignLanguageProcessResponse) => void;
}

export function TextInput({ onProcessingComplete }: TextInputProps) {
    const [text, setText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcess = () => {
        if (!text.trim()) return;

        setIsProcessing(true);

        // Mock Processing Logic
        // In a real app, this would hit an API to tokenize and more intelligent matching
        setTimeout(() => {
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

            // Mock matching based on keywords (very simple for demo)
            const segments = sentences.map((sentence, index) => {
                const cleanText = sentence.trim();
                return {
                    id: `text-${Date.now()}-${index}`,
                    text: cleanText,
                    // Randomly assign a video for demo purposes, or a consistent one for "Hello"
                    videoUrl: cleanText.toLowerCase().includes('hello')
                        ? "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" // Stable test video
                        : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Stable test video
                    fallbackType: 'partial' as const,
                    duration: 3000
                };
            });

            const response: SignLanguageProcessResponse = {
                jobId: `job-${Date.now()}`,
                status: 'completed',
                segments: segments,
                metadata: {
                    filename: 'Direct Text Input',
                    totalSegments: segments.length,
                    processedAt: new Date().toISOString()
                }
            };

            onProcessingComplete(response);
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-0 glass-morphism">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-6 w-6 text-primary" />
                    Type to Translate
                </CardTitle>
                <CardDescription>
                    Enter text below to instantly generate sign language interpretation.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Hello, how can I help you today?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[150px] text-lg bg-background/50 border-border/50 resize-none focus-visible:ring-primary"
                />
                <div className="flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleProcess}
                        disabled={!text.trim() || isProcessing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                Translate Now <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
