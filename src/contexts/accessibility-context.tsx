"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'normal' | 'large' | 'extra-large';
type FontStyle = 'system' | 'serif' | 'dyslexic';

interface AccessibilitySettings {
    fontSize: FontSize;
    fontStyle: FontStyle;
    highContrast: boolean;
    reducedMotion: boolean;
    voiceNavigation: boolean;
    screenNarration: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
    setFontSize: (size: FontSize) => void;
    setFontStyle: (style: FontStyle) => void;
    setHighContrast: (enabled: boolean) => void;
    setReducedMotion: (enabled: boolean) => void;
    setVoiceNavigation: (enabled: boolean) => void;
    setScreenNarration: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [fontSize, setFontSizeState] = useState<FontSize>('normal');
    const [fontStyle, setFontStyleState] = useState<FontStyle>('system');
    const [highContrast, setHighContrastState] = useState(false);
    const [reducedMotion, setReducedMotionState] = useState(false);
    const [voiceNavigation, setVoiceNavigationState] = useState(false);
    const [screenNarration, setScreenNarrationState] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('accessibility-settings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setFontSizeState(parsed.fontSize || 'normal');
                setFontStyleState(parsed.fontStyle || 'system');
                setHighContrastState(parsed.highContrast || false);
                setReducedMotionState(parsed.reducedMotion || false);
                setVoiceNavigationState(parsed.voiceNavigation || false);
                setScreenNarrationState(parsed.screenNarration || false);
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    const logAccessibilityUsage = (feature: string, enabled: boolean) => {
        // In a real app, this would write to the AccessibilityUsage table.
        // For the demo/research validation, we log to console which can be shown to judges.
        console.log(`[Research Log] Accessibility Event: ${feature} turned ${enabled ? 'ON' : 'OFF'} at ${new Date().toISOString()}`);
    };

    // Persist to localStorage and apply classes
    useEffect(() => {
        localStorage.setItem('accessibility-settings', JSON.stringify({
            fontSize, fontStyle, highContrast, reducedMotion, voiceNavigation, screenNarration
        }));

        const root = document.documentElement;

        // Font Size
        root.classList.remove('text-normal', 'text-large', 'text-extra-large');
        root.classList.add(`text-${fontSize}`);

        // Font Style
        root.classList.remove('font-style-system', 'font-style-serif', 'font-style-dyslexic');
        root.classList.add(`font-style-${fontStyle}`);

        // High Contrast
        if (highContrast) root.classList.add('high-contrast');
        else root.classList.remove('high-contrast');

        // Reduced Motion
        if (reducedMotion) root.classList.add('reduced-motion');
        else root.classList.remove('reduced-motion');

    }, [fontSize, fontStyle, highContrast, reducedMotion, voiceNavigation, screenNarration]);

    // Wrappers
    const setFontSize = (size: FontSize) => {
        setFontSizeState(size);
        logAccessibilityUsage('FontSize', size !== 'normal');
    };
    const setFontStyle = (style: FontStyle) => {
        setFontStyleState(style);
        logAccessibilityUsage('DyslexiaFont', style === 'dyslexic');
    };
    const setHighContrast = (enabled: boolean) => {
        setHighContrastState(enabled);
        logAccessibilityUsage('HighContrast', enabled);
    };
    const setReducedMotion = (enabled: boolean) => {
        setReducedMotionState(enabled);
        logAccessibilityUsage('ReducedMotion', enabled);
    };
    const setVoiceNavigation = (enabled: boolean) => {
        setVoiceNavigationState(enabled);
        logAccessibilityUsage('VoiceNavigation', enabled);
    };
    const setScreenNarration = (enabled: boolean) => {
        setScreenNarrationState(enabled);
        logAccessibilityUsage('ScreenNarration', enabled);
    };

    return (
        <AccessibilityContext.Provider value={{
            fontSize, fontStyle, highContrast, reducedMotion, voiceNavigation, screenNarration,
            setFontSize, setFontStyle, setHighContrast, setReducedMotion, setVoiceNavigation, setScreenNarration
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
    return context;
};
