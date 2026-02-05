"use client";

import React, { useEffect, useCallback } from 'react';
import { useSignLanguage } from '@/contexts/sign-language-context';

/**
 * VR Sign-Language Avatar Panel
 * 
 * A demonstration feature for deaf users showing a sign-language avatar
 * with animated states (greeting, explaining, idle) and synchronized captions.
 * 
 * This is a PROTOTYPE / DEMONSTRATION feature showcasing future VR integration.
 */

// ============================================================================
// STYLES - EduAIThon ICTIEE 2026 Conference Theme
// ============================================================================

const COLORS = {
    primary: '#0F4C45',      // Deep Teal
    accent: '#D6C6A1',       // Soft Gold
    background: '#F2EAD3',   // Cream
    surface: '#FFFFFF',      // White
    text: '#2E2E2E',         // Dark Gray
    textMuted: '#5A5A5A',    // Muted Gray
    backdrop: 'rgba(15, 76, 69, 0.85)',
};

// ============================================================================
// AVATAR SVG COMPONENT
// ============================================================================

import Image from 'next/image';

interface AvatarProps {
    state: 'idle' | 'greeting' | 'explaining';
}

function SignAvatar({ state }: AvatarProps) {
    const getAnimationClass = () => {
        switch (state) {
            case 'greeting': return 'animate-wave';
            case 'explaining': return 'animate-explain';
            default: return 'animate-breathe';
        }
    };

    return (
        <div className={`relative ${getAnimationClass()} w-[280px] h-[320px] flex items-center justify-center`}>
            {/* 3D Avatar Video */}
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg bg-black">
                <video
                    src="/vr-sign-video.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>

            {/* State indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium z-10 shadow-lg"
                style={{ backgroundColor: COLORS.accent, color: COLORS.background }}>
                {state === 'greeting' ? '👋 Hello!' : state === 'explaining' ? '🤟 Signing...' : '⏳ Waiting...'}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VrAvatarPanel() {
    const {
        vrAvatarMode,
        avatarState,
        captionText,
        toggleVrAvatarMode,
        isEnabled,
    } = useSignLanguage();

    // Handle Escape key to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && vrAvatarMode) {
            toggleVrAvatarMode();
        }
    }, [vrAvatarMode, toggleVrAvatarMode]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Don't render if not in VR mode or sign language is disabled
    if (!vrAvatarMode || !isEnabled) return null;

    return (
        <>
            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.005); }
                }
                @keyframes wave {
                    0%, 100% { transform: scale(1) translateY(0); }
                    25% { transform: scale(1.01) translateY(-2px); }
                    50% { transform: scale(1) translateY(0); }
                    75% { transform: scale(1.01) translateY(-1px); }
                }
                @keyframes hand-wave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(-5deg); }
                }
                @keyframes explain-left {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-5px) translateY(-3px); }
                }
                @keyframes explain-right {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(5px) translateY(-3px); }
                }
                .animate-breathe { animation: breathe 4s ease-in-out infinite; }
                .animate-wave { animation: wave 1.2s ease-in-out infinite; }
                .animate-hand-wave { animation: hand-wave 1s ease-in-out infinite; }
                .animate-hand-explain-left { animation: explain-left 2s ease-in-out infinite; }
                .animate-hand-explain-right { animation: explain-right 2s ease-in-out infinite 0.6s; }
            `}</style>

            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 z-[9998] backdrop-blur-sm"
                style={{ backgroundColor: COLORS.backdrop }}
                onClick={toggleVrAvatarMode}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label="VR Sign-Language Avatar Assistant"
            >
                <div
                    className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                    style={{ backgroundColor: COLORS.background }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between p-4"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🤟</span>
                            <div>
                                <h2 className="font-semibold text-white text-on-teal" style={{ color: '#FFFFFF' }}>Sign-Language Avatar</h2>
                                <p className="text-xs text-white/70" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>VR Assistance Mode</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleVrAvatarMode}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Close VR Avatar"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Avatar Display */}
                    <div
                        className="flex flex-col items-center justify-center py-8 px-4"
                        style={{ backgroundColor: COLORS.surface }}
                    >
                        <SignAvatar state={avatarState} />
                    </div>

                    {/* Caption */}
                    <div
                        className="p-4 text-center"
                        style={{ backgroundColor: COLORS.background }}
                    >
                        <p
                            className="text-lg font-medium mb-2"
                            style={{ color: COLORS.text }}
                        >
                            {captionText || 'Select text to see sign language explanation'}
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: COLORS.textMuted }}
                        >
                            Sign-language avatar is a visual aid for deaf users.
                        </p>
                    </div>

                    {/* Footer */}
                    <div
                        className="p-3 border-t flex items-center justify-between"
                        style={{ borderColor: COLORS.surface }}
                    >
                        <div
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ backgroundColor: COLORS.accent + '20', color: COLORS.accent }}
                        >
                            🧪 Prototype / Demonstration Feature
                        </div>
                        <p
                            className="text-[10px] max-w-[180px] text-right"
                            style={{ color: COLORS.textMuted }}
                        >
                            Future: Real-time AI-driven sign generation
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VrAvatarPanel;
