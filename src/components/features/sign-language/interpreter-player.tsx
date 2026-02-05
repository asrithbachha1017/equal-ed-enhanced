"use client";

import { useEffect, useState, useRef } from "react";
import { SignLanguageSegment } from "@/lib/sign-language/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignLanguagePlayerProps {
    segments: SignLanguageSegment[];
    currentSegmentId: string | null;
    onSegmentChange: (segmentId: string) => void;
    onClose?: () => void;
}

export function SignLanguagePlayer({
    segments,
    currentSegmentId,
    onSegmentChange,
    onClose
}: SignLanguagePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);

    const currentSegment = segments[currentIndex];

    // Reset error state when segment changes
    useEffect(() => {
        setHasError(false);
    }, [currentSegmentId]);

    useEffect(() => {
        if (currentSegmentId) {
            const index = segments.findIndex(s => s.id === currentSegmentId);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [currentSegmentId, segments]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    // Handle image "playback" duration
    useEffect(() => {
        if (
            isPlaying &&
            currentSegment &&
            (currentSegment.videoUrl.endsWith('.png') || currentSegment.videoUrl.endsWith('.jpg') || currentSegment.videoUrl.endsWith('.jpeg')) &&
            !hasError
        ) {
            const timer = setTimeout(() => {
                handleEnded();
            }, 3000 / playbackSpeed);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, currentSegment, playbackSpeed, hasError]);

    const handleEnded = () => {
        if (currentIndex < segments.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            onSegmentChange(segments[nextIndex].id);
            // Auto-play next
            // videoRef.current?.play(); // React often handles this via useEffect key change?
        } else {
            setIsPlaying(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else if (currentSegment && (currentSegment.videoUrl.endsWith('.png') || currentSegment.videoUrl.endsWith('.jpg'))) {
            // For images, just toggle state
            setIsPlaying(!isPlaying);
        }
    };

    const handleNext = () => {
        if (currentIndex < segments.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            onSegmentChange(segments[nextIndex].id);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const nextIndex = currentIndex - 1;
            setCurrentIndex(nextIndex);
            onSegmentChange(segments[nextIndex].id);
        }
    };

    const isImage = currentSegment && (currentSegment.videoUrl.endsWith('.png') || currentSegment.videoUrl.endsWith('.jpg') || currentSegment.videoUrl.endsWith('.jpeg'));

    return (
        <Card className="fixed bottom-4 right-4 w-80 md:w-96 shadow-2xl z-50 border-0 glass-morphism bg-background/80 overflow-hidden flex flex-col transition-all duration-300 backdrop-blur-xl">
            <div className="bg-primary/90 text-primary-foreground px-4 py-3 flex items-center justify-between backdrop-blur-md">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    Sign Interpretation
                </h3>
                {onClose && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-white/20" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="relative aspect-video bg-black/90 flex items-center justify-center overflow-hidden">
                {currentSegment ? (
                    <div className="w-full h-full">
                        {currentSegment.fallbackType === 'fingerspell' || hasError ? (
                            <div className="w-full h-full flex items-center justify-center flex-col text-white p-4 text-center">
                                <span className="text-4xl font-mono tracking-[0.5em] uppercase mb-2">{currentSegment.text.substring(0, 10)}...</span>
                                <p className="text-xs text-white/50">
                                    {hasError ? "(Video Unavailable - Fallback Mode)" : "(Fingerspelling Simulation)"}
                                </p>
                            </div>
                        ) : (
                            isImage ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={currentSegment.videoUrl}
                                        alt={currentSegment.text}
                                        className="w-full h-full object-contain"
                                        onError={() => setHasError(true)}
                                    />
                                    {/* Progress indicator for images when playing */}
                                    {isPlaying && (
                                        <div className="absolute bottom-0 left-0 h-1 bg-primary z-10 transition-all ease-linear"
                                            style={{
                                                width: '100%',
                                                transitionDuration: `${3000 / playbackSpeed}ms`
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <video
                                    key={currentSegment.videoUrl}
                                    ref={videoRef}
                                    src={currentSegment.videoUrl}
                                    className="w-full h-full object-contain"
                                    autoPlay={isPlaying}
                                    onEnded={handleEnded}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onError={() => {
                                        // Quietly handle error and show fallback
                                        setHasError(true);
                                    }}
                                    controls={false} // Custom controls
                                />
                            )
                        )}
                    </div>
                ) : (
                    <p className="text-white/50 text-sm">No segment selected</p>
                )}

                {/* Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center">
                    <p className="text-white text-xs font-medium line-clamp-2">
                        {currentSegment?.text}
                    </p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
                        <SkipBack className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="default"
                        size="icon"
                        className="h-10 w-10 btn-interactive"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                    </Button>

                    <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex === segments.length - 1}>
                        <SkipForward className="h-4 w-4" />
                    </Button>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Speed: {playbackSpeed}x</span>
                        <span>Playing {currentIndex + 1} of {segments.length}</span>
                    </div>
                    <Slider
                        min={0.5}
                        max={2}
                        step={0.25}
                        value={[playbackSpeed]}
                        onValueChange={(val) => setPlaybackSpeed(val[0])}
                        className="w-full"
                    />
                </div>
            </div>
        </Card>
    );
}
