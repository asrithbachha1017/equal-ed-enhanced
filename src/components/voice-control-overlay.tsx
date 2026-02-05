"use client";

import React, { useEffect } from "react";
import { Mic, MicOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceAssistant } from "@/contexts/voice-assistant-context";
import { useHaptics } from "@/hooks/use-haptics";
import { Button } from "@/components/ui/button";

const VoiceControlOverlay = () => {
    const { isListening, toggleListening, feedback, transcript, lastIntent } = useVoiceAssistant();
    const { triggerSuccess, triggerClick } = useHaptics();

    // Vibrate on new feedback (command success)
    useEffect(() => {
        if (feedback) triggerSuccess();
    }, [feedback, triggerSuccess]);

    // Vibrate on toggle
    const handleToggle = () => {
        triggerClick();
        toggleListening();
    };

    return (
        <div className="fixed top-24 left-6 z-50 flex flex-col items-start gap-2 pointer-events-none">
            {/* Visual Feedback Toast */}
            {feedback && (
                <div className="bg-zinc-900/90 text-white px-4 py-3 rounded-lg mb-2 text-md font-medium border border-zinc-700 shadow-2xl animate-in slide-in-from-left-5 fade-in pointer-events-auto max-w-[300px]">
                    {feedback}
                </div>
            )}

            {/* Transcript (Optional Debug) */}
            {isListening && transcript && !feedback && (
                <div className="bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1 rounded-md text-xs border border-white/10 animate-fade-in">
                    "{transcript}"
                </div>
            )}

            {/* Mic Control */}
            <Button
                size="icon"
                onClick={handleToggle}
                className={cn(
                    "rounded-full h-12 w-12 pointer-events-auto transition-all duration-300 shadow-xl border-2",
                    isListening
                        ? "bg-red-500 hover:bg-red-600 border-red-400 animate-pulse text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 border-zinc-600 text-zinc-400"
                )}
                aria-label={isListening ? "Stop Voice Assistant" : "Start Voice Assistant"}
            >
                {isListening ? <Activity className="h-6 w-6 animate-pulse" /> : <MicOff className="h-5 w-5" />}
            </Button>
        </div>
    );
};

export default VoiceControlOverlay;
