"use client";

import { useScreenNarration } from '@/hooks/use-screen-narration';

/**
 * ScreenNarrationProvider
 * 
 * Enables keyboard-activated screen narration for accessibility.
 * This component activates the global keydown listener when screen narration is enabled.
 * 
 * Features:
 * - Announces currently focused element on keyboard navigation
 * - Debounced (800ms) to prevent audio flooding
 * - Toggle with Ctrl+Shift+V
 * - Works with voiceNavigation + screenNarration settings
 */
export function ScreenNarrationProvider({ children }: { children: React.ReactNode }) {
    // Initialize the screen narration hook
    // This sets up event listeners when enabled
    useScreenNarration();

    return <>{children}</>;
}
