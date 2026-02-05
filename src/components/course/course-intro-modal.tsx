"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    PlayCircle,
    SkipForward,
    MessageSquare,
    Volume2,
    VolumeX,
    RotateCcw,
    Gauge,
    Pause,
    Play
} from "lucide-react";

interface CourseIntroModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    introData?: {
        script: string;
        fallbackText: string[];
        videoUrl?: string;
        liveSummary?: {
            text: string;
            type: "overview" | "goal" | "method" | "differentiation";
        }[];
    };
}

export function CourseIntroModal({ isOpen, onClose, courseTitle, introData }: CourseIntroModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [isPaused, setIsPaused] = useState(false);

    // Dyslexia & Font State
    const [fontSize, setFontSize] = useState<"base" | "lg">("base");
    const [isDyslexic, setIsDyslexic] = useState(false);

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const itemsRef = useRef<string[]>([]);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Prepare content for iteration
    useEffect(() => {
        if (!introData) return;
        if (introData.liveSummary) {
            itemsRef.current = introData.liveSummary.map(s => s.text);
        } else if (introData.fallbackText) {
            itemsRef.current = introData.fallbackText;
        } else {
            itemsRef.current = [introData.script];
        }
    }, [introData]);

    const controlVideo = (action: "play" | "pause") => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: action === "play" ? 'playVideo' : 'pauseVideo' }),
                '*'
            );
        }
    };

    const speakCurrentSegment = useCallback(() => {
        if (isPaused || isMuted || !isOpen || !introData) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const textToSpeak = itemsRef.current[currentIndex];
        if (!textToSpeak) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = playbackRate * 0.9; // Base speed slightly slower/teacher-like
        utterance.pitch = 1.0;

        // Voice Selection
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Samantha") ||
            v.lang.startsWith("en")
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            // Auto-advance if not at end
            if (currentIndex < itemsRef.current.length - 1 && !isPaused) {
                setCurrentIndex(prev => prev + 1);
            }
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);

    }, [currentIndex, isPaused, isMuted, isOpen, introData, playbackRate]);

    // Trigger speech when index or state changes
    useEffect(() => {
        speakCurrentSegment();
        // Cleanup on unmount or strict dependency change
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [speakCurrentSegment]); // Re-run when speakCurrentSegment changes (which depends on index)

    // Handle Play/Pause Toggle
    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false);
            window.speechSynthesis.resume();
        } else {
            setIsPaused(true);
            window.speechSynthesis.pause();
        }
    };

    // Handle Speed Toggle
    const toggleSpeed = () => {
        const newRate = playbackRate === 1.0 ? 0.75 : playbackRate === 0.75 ? 1.25 : 1.0;
        setPlaybackRate(newRate);
        // Restart current segment with new rate
        if (!isPaused) {
            window.speechSynthesis.cancel();
            speakCurrentSegment(); // Will pick up new rate
        }
    };

    // Handle Replay
    const handleReplay = () => {
        setCurrentIndex(0);
        setIsPaused(false);
        controlVideo("pause");
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        }
        window.speechSynthesis.cancel();
    };

    if (!introData) return null;

    // Helper to get type label
    const getTypeLabel = (index: number) => {
        if (introData.liveSummary && introData.liveSummary[index]) {
            return introData.liveSummary[index].type;
        }
        return "Info";
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-0 overflow-hidden shadow-2xl h-[85vh] md:h-auto flex flex-col">

                <div className="grid md:grid-cols-2 h-full">
                    {/* LEFT: Video / Animation */}
                    <div className="bg-black relative flex items-center justify-center h-[40%] md:h-auto border-b md:border-b-0 md:border-r border-slate-800">
                        {introData.videoUrl ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`${introData.videoUrl}${introData.videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=0&controls=0&rel=0&modestbranding=1&enablejsapi=1`}
                                title={`${courseTitle} Introduction`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full absolute inset-0"
                                style={{ opacity: isPaused ? 0.5 : 1, transition: "opacity 0.3s" }} // Visual cue for pause
                            />
                        ) : (
                            <div className="text-center p-8 space-y-6 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
                                <div className={`w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center ${!isPaused ? 'animate-pulse' : ''}`}>
                                    <PlayCircle className="w-8 h-8 text-indigo-300" />
                                </div>
                                <div className="space-y-4 max-w-lg mx-auto">
                                    <p className="text-2xl font-medium text-white transition-all duration-500">
                                        {itemsRef.current[currentIndex]}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Video Controls Overlay (Custom) */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
                            <span className="bg-black/60 text-white/90 text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-2">
                                {isPaused ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                {introData.videoUrl ? "AI Voice Sync Active" : "AI Narration"}
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: Live Dialog Box (Summary) */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 flex flex-col h-[60%] md:h-auto overflow-hidden">

                        {/* Header & Accessibility Controls */}
                        <div className="flex flex-wrap gap-2 justify-between items-center mb-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/30 shrink-0">
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2 text-sm md:text-base">
                                <MessageSquare className="w-4 h-4" /> Live Transcript
                            </h3>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setFontSize(fontSize === "base" ? "lg" : "base")} className="h-7 px-2 text-xs" title="Font Size">
                                    {fontSize === "base" ? "A+" : "A-"}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setIsDyslexic(!isDyslexic)} className={`h-7 px-2 text-xs ${isDyslexic ? "bg-indigo-100 font-bold" : ""}`} title="Dyslexia Font">
                                    Dyslexia
                                </Button>
                            </div>
                        </div>

                        {/* Scrolling Transcript */}
                        <div
                            className={`space-y-4 flex-1 overflow-y-auto pr-2 ${fontSize === "lg" ? "text-lg" : "text-sm"} ${isDyslexic ? "font-mono" : ""}`}
                            role="region"
                            aria-label="Audio Transcript"
                            tabIndex={0} // Container focusable for scrolling, items are NOT
                        >
                            {itemsRef.current.map((text, i) => {
                                // SANITIZATION: Strip URLs, Markdown, and HTML-like tags
                                const cleanText = text
                                    .replace(/https?:\/\/[^\s]+/g, "") // Remove URLs
                                    .replace(/<[^>]*>/g, "") // Remove Basic HTML
                                    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Simplify Markdown Links to text
                                    .trim();

                                return (
                                    <div
                                        key={i}
                                        className={`pl-4 py-2 rounded-r-lg transition-all duration-500 border-l-4
                                            ${i === currentIndex
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 opacity-100 translate-x-0 shadow-sm"
                                                : "border-slate-200 dark:border-slate-800 text-slate-400 opacity-60"
                                            }`}
                                    // INTERACTIVITY REMOVED per Accessibility Logic:
                                    // Transcript is for listening/reading, not random seeking.
                                    >
                                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${i === currentIndex ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
                                            {getTypeLabel(i)}
                                        </span>
                                        <p className={`${i === currentIndex ? "text-slate-900 dark:text-slate-100 font-medium" : ""}`}>
                                            {cleanText}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Playback Controls (Footer of Panel) */}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" onClick={handleReplay} className="h-8 w-8" title="Replay">
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={togglePause} className="h-8 w-8" title={isPaused ? "Resume" : "Pause"}>
                                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                </Button>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={toggleSpeed} className="h-8 px-2 text-xs flex gap-1" title="Speed">
                                    <Gauge className="w-3 h-3" /> {playbackRate}x
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="h-8 w-8" title="Mute AI Voice">
                                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-green-600" />}
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>

                <DialogFooter className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex sm:justify-between items-center w-full mt-auto z-10 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 hidden sm:flex">
                        <Volume2 className="w-4 h-4" />
                        <span>AI Teacher: {isPaused ? "Paused" : "Speaking"} • {Math.round(((currentIndex + 1) / itemsRef.current.length) * 100)}%</span>
                    </div>
                    <Button onClick={onClose} className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        Start Learning <SkipForward className="w-4 h-4" />
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
