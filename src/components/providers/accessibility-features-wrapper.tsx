"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for heavy client-side features with ssr: false (valid in Client Components)
const VoiceControlOverlay = dynamic(() => import("@/components/voice-control-overlay"), { ssr: false });
const AITutor = dynamic(() => import("@/components/ai-tutor").then((mod) => mod.AITutor), { ssr: false });
const SignLanguageListener = dynamic(() => import("@/components/sign-language").then((mod) => mod.SignLanguageListener), { ssr: false });
const SignLanguagePlayer = dynamic(() => import("@/components/sign-language").then((mod) => mod.SignLanguagePlayer), { ssr: false });
const VrAvatarPanel = dynamic(() => import("@/components/sign-language").then((mod) => mod.VrAvatarPanel), { ssr: false });

export function AccessibilityFeaturesWrapper() {
    return (
        <Suspense fallback={null}>
            <VoiceControlOverlay />
            <AITutor />
            <SignLanguageListener />
            <SignLanguagePlayer />
            <VrAvatarPanel />
        </Suspense>
    );
}
