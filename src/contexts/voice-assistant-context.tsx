"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { speechService, SpeechService } from "@/lib/voice/speech";
import { classifyIntent, VoiceIntent } from "@/lib/voice/intents";
import { ActionExecutor } from "@/lib/voice/executor";

interface VoiceAssistantState {
    isListening: boolean;
    toggleListening: () => void;
    transcript: string;
    lastIntent: VoiceIntent | null;
    feedback: string;
}

const VoiceAssistantContext = createContext<VoiceAssistantState | undefined>(undefined);

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const routerRef = useRef(router); // Keep ref for strict closures availability?
    const [isListening, setIsListening] = useState(false); // Default to off for privacy, user must enable
    const [transcript, setTranscript] = useState("");
    const [lastIntent, setLastIntent] = useState<VoiceIntent | null>(null);
    const [feedback, setFeedback] = useState("");

    // Update router ref if it changes (rare)
    useEffect(() => { routerRef.current = router; }, [router]);

    // Initialize Executor
    const executorRef = useRef<ActionExecutor | null>(null);

    // Announce/Feedback Helper
    const announce = useCallback((text: string) => {
        setFeedback(text);
        if (speechService.isSupported) {
            speechService.speak(text);
        }
        // Clear visual feedback after delay
        setTimeout(() => setFeedback(""), 4000);
    }, []);

    // Handle incoming speech
    const handleResult = useCallback(async (text: string) => {
        setTranscript(text);
        console.log("[Voice] Transcript:", text);

        // 1. Classify
        const intent = classifyIntent(text);
        setLastIntent(intent);
        console.log("[Voice] Intent:", intent);

        // 2. Execute
        if (intent.type !== 'UNKNOWN' && intent.confidence > 0.5) {
            // Lazy load executor to ensure router is ready
            if (!executorRef.current) {
                executorRef.current = new ActionExecutor(routerRef.current, speechService);
            }

            // Re-update router just in case
            // The executor is class-based so it might hold stale router if not careful, 
            // but Next.js router is stable. We can pass it dynamically if needed.
            // For now, let's assume the router instance is stable enough or re-instantiate.
            executorRef.current = new ActionExecutor(routerRef.current, speechService);

            try {
                const resultMessage = await executorRef.current.execute(intent);
                announce(resultMessage);
            } catch (error) {
                console.error("Execution Error", error);
                announce("Sorry, something went wrong executing that command.");
            }
        }
    }, [announce]); // Dependencies minimized

    // Error Handler
    const handleError = useCallback((error: any) => {
        console.warn("[Voice] Error:", error);
        // Optional: announce("I'm having trouble hearing you.");
    }, []);

    // Effect: Manage Speech Service
    useEffect(() => {
        if (isListening) {
            speechService.start(handleResult, handleError);
            announce("Voice assistant active.");
        } else {
            speechService.stop();
            // announce("Voice assistant paused."); // Maybe too chatty?
        }
        return () => {
            speechService.stop();
        };
    }, [isListening, handleResult, handleError, announce]);

    const toggleListening = () => {
        setIsListening(prev => !prev);
    };

    return (
        <VoiceAssistantContext.Provider value={{
            isListening,
            toggleListening,
            transcript,
            lastIntent,
            feedback
        }}>
            {children}
        </VoiceAssistantContext.Provider>
    );
}

export const useVoiceAssistant = () => {
    const context = useContext(VoiceAssistantContext);
    if (!context) throw new Error("useVoiceAssistant must be used within VoiceAssistantProvider");
    return context;
};
