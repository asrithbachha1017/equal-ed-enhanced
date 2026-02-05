"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type TranslationLanguage = 'ASL' | 'BSL';
export type AvatarState = 'idle' | 'greeting' | 'explaining';

export interface SignLanguageState {
    // Core state
    isVideoVisible: boolean;
    isEnabled: boolean;
    selectedText: string;
    translationLanguage: TranslationLanguage;
    videoSrc: string | null;
    imageSrc: string | null;
    contentType: 'video' | 'image';
    videoId: string | null;
    matchedSign: string | null;

    // Playback state
    isPlaying: boolean;
    playbackSpeed: number;
    currentTime: number;
    duration: number;
    zoomLevel: number;
    isFullscreen: boolean;

    // UI state
    isLoading: boolean;
    error: string | null;
    showSettings: boolean;
    highlightedTextRange: { start: number; end: number } | null;

    // VR Avatar state
    vrAvatarMode: boolean;
    avatarState: AvatarState;
    captionText: string;
}

interface SignLanguageActions {
    // Toggle/visibility
    setEnabled: (enabled: boolean) => void;
    toggleEnabled: () => void;
    showPlayer: () => void;
    hidePlayer: () => void;

    // Text selection
    setSelectedText: (text: string) => void;
    clearSelectedText: () => void;

    // Language
    setTranslationLanguage: (lang: TranslationLanguage) => void;

    // Video
    setVideoSrc: (src: string | null, id?: string | null) => void;

    // Playback
    setIsPlaying: (playing: boolean) => void;
    togglePlayback: () => void;
    setPlaybackSpeed: (speed: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setZoomLevel: (zoom: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    setIsFullscreen: (fullscreen: boolean) => void;
    toggleFullscreen: () => void;

    // UI
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setShowSettings: (show: boolean) => void;
    toggleSettings: () => void;
    setHighlightedTextRange: (range: { start: number; end: number } | null) => void;

    // Complex actions
    generateTranslation: (text: string) => Promise<void>;
    reset: () => void;

    // VR Avatar actions
    setVrAvatarMode: (enabled: boolean) => void;
    toggleVrAvatarMode: () => void;
    setAvatarState: (state: AvatarState) => void;
    setCaptionText: (text: string) => void;
}

interface SignLanguageContextType extends SignLanguageState, SignLanguageActions { }

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: SignLanguageState = {
    isVideoVisible: false,
    isEnabled: false,
    selectedText: '',
    translationLanguage: 'ASL',
    videoSrc: null,
    imageSrc: null,
    contentType: 'image',
    videoId: null,
    matchedSign: null,
    isPlaying: false,
    playbackSpeed: 1,
    currentTime: 0,
    duration: 0,
    zoomLevel: 1,
    isFullscreen: false,
    isLoading: false,
    error: null,
    showSettings: false,
    highlightedTextRange: null,
    // VR Avatar initial state
    vrAvatarMode: false,
    avatarState: 'idle',
    captionText: '',
};

// ============================================================================
// CONTEXT
// ============================================================================

const SignLanguageContext = createContext<SignLanguageContextType | null>(null);

// ============================================================================
// CACHE UTILITIES
// ============================================================================

const VIDEO_CACHE_KEY = 'signlang_video_cache';

function getCachedVideo(text: string, lang: TranslationLanguage): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const cache = JSON.parse(sessionStorage.getItem(VIDEO_CACHE_KEY) || '{}');
        const key = `${lang}:${text.slice(0, 100)}`;
        return cache[key] || null;
    } catch {
        return null;
    }
}

function setCachedVideo(text: string, lang: TranslationLanguage, videoUrl: string): void {
    if (typeof window === 'undefined') return;
    try {
        const cache = JSON.parse(sessionStorage.getItem(VIDEO_CACHE_KEY) || '{}');
        const key = `${lang}:${text.slice(0, 100)}`;
        cache[key] = videoUrl;
        sessionStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(cache));
    } catch {
        // Ignore cache errors
    }
}

// ============================================================================
// ANALYTICS
// ============================================================================

function trackEvent(event: string, data?: Record<string, any>): void {
    // Placeholder for analytics - integrate with your analytics provider
    console.log('[SignLang Analytics]', event, data);
}

// ============================================================================
// PROVIDER
// ============================================================================

interface SignLanguageProviderProps {
    children: ReactNode;
    apiEndpoint?: string;
}

export function SignLanguageProvider({
    children,
    apiEndpoint = '/api/sign-language/translate'
}: SignLanguageProviderProps) {
    const [state, setState] = useState<SignLanguageState>(initialState);

    // Helper to update state
    const updateState = useCallback((updates: Partial<SignLanguageState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    // ========================================================================
    // ACTIONS
    // ========================================================================

    const setEnabled = useCallback((enabled: boolean) => {
        updateState({ isEnabled: enabled });
        if (!enabled) {
            updateState({ isVideoVisible: false, isPlaying: false });
        }
        trackEvent('toggle_enabled', { enabled });
    }, [updateState]);

    const toggleEnabled = useCallback(() => {
        setState(prev => {
            const newEnabled = !prev.isEnabled;
            trackEvent('toggle_enabled', { enabled: newEnabled });
            return {
                ...prev,
                isEnabled: newEnabled,
                isVideoVisible: newEnabled ? prev.isVideoVisible : false,
                isPlaying: newEnabled ? prev.isPlaying : false,
            };
        });
    }, []);

    const showPlayer = useCallback(() => updateState({ isVideoVisible: true }), [updateState]);
    const hidePlayer = useCallback(() => updateState({ isVideoVisible: false, isPlaying: false, isFullscreen: false }), [updateState]);

    const setSelectedText = useCallback((text: string) => updateState({ selectedText: text }), [updateState]);
    const clearSelectedText = useCallback(() => updateState({ selectedText: '', highlightedTextRange: null }), [updateState]);

    const setTranslationLanguage = useCallback((lang: TranslationLanguage) => {
        updateState({ translationLanguage: lang });
        trackEvent('change_language', { language: lang });
    }, [updateState]);

    const setVideoSrc = useCallback((src: string | null, id?: string | null) => {
        updateState({ videoSrc: src, videoId: id ?? null });
    }, [updateState]);

    const setIsPlaying = useCallback((playing: boolean) => updateState({ isPlaying: playing }), [updateState]);
    const togglePlayback = useCallback(() => {
        setState(prev => {
            trackEvent('toggle_playback', { playing: !prev.isPlaying });
            return { ...prev, isPlaying: !prev.isPlaying };
        });
    }, []);

    const setPlaybackSpeed = useCallback((speed: number) => {
        updateState({ playbackSpeed: speed });
        trackEvent('change_speed', { speed });
    }, [updateState]);

    const setCurrentTime = useCallback((time: number) => updateState({ currentTime: time }), [updateState]);
    const setDuration = useCallback((duration: number) => updateState({ duration: duration }), [updateState]);

    const setZoomLevel = useCallback((zoom: number) => {
        const clampedZoom = Math.max(0.5, Math.min(3, zoom));
        updateState({ zoomLevel: clampedZoom });
    }, [updateState]);

    const zoomIn = useCallback(() => {
        setState(prev => ({ ...prev, zoomLevel: Math.min(3, prev.zoomLevel + 0.25) }));
        trackEvent('zoom', { direction: 'in' });
    }, []);

    const zoomOut = useCallback(() => {
        setState(prev => ({ ...prev, zoomLevel: Math.max(0.5, prev.zoomLevel - 0.25) }));
        trackEvent('zoom', { direction: 'out' });
    }, []);

    const setIsFullscreen = useCallback((fullscreen: boolean) => updateState({ isFullscreen: fullscreen }), [updateState]);
    const toggleFullscreen = useCallback(() => {
        setState(prev => {
            trackEvent('toggle_fullscreen', { fullscreen: !prev.isFullscreen });
            return { ...prev, isFullscreen: !prev.isFullscreen };
        });
    }, []);

    const setIsLoading = useCallback((loading: boolean) => updateState({ isLoading: loading }), [updateState]);
    const setError = useCallback((error: string | null) => updateState({ error: error }), [updateState]);
    const setShowSettings = useCallback((show: boolean) => updateState({ showSettings: show }), [updateState]);
    const toggleSettings = useCallback(() => {
        setState(prev => ({ ...prev, showSettings: !prev.showSettings }));
    }, []);
    const setHighlightedTextRange = useCallback((range: { start: number; end: number } | null) => {
        updateState({ highlightedTextRange: range });
    }, [updateState]);

    // Generate translation via API
    const generateTranslation = useCallback(async (text: string) => {
        if (!text.trim()) return;

        // Check cache first
        const cachedUrl = getCachedVideo(text, state.translationLanguage);
        if (cachedUrl) {
            updateState({
                videoSrc: cachedUrl,
                isVideoVisible: true,
                selectedText: text,
                error: null
            });
            trackEvent('cache_hit', { textLength: text.length });
            return;
        }

        updateState({ isLoading: true, error: null, selectedText: text });
        trackEvent('generate_start', { textLength: text.length, language: state.translationLanguage });

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    targetLanguage: state.translationLanguage,
                    outputFormat: 'image',
                    duration: '6s',
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation failed: ${response.status}`);
            }

            const data = await response.json();

            // Handle both image and video responses
            if (data.imageUrl || data.videoUrl) {
                const url = data.imageUrl || data.videoUrl;
                const type = data.type || (data.imageUrl ? 'image' : 'video');

                setCachedVideo(text, state.translationLanguage, url);
                updateState({
                    imageSrc: type === 'image' ? url : null,
                    videoSrc: type === 'video' ? url : null,
                    contentType: type,
                    videoId: data.videoId || null,
                    matchedSign: data.matchedSign || null,
                    isVideoVisible: true,
                    isLoading: false,
                });
                trackEvent('generate_success', { videoId: data.videoId, type, matched: data.matchedSign });
            } else {
                throw new Error('No content URL in response');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Translation failed';
            updateState({ error: errorMessage, isLoading: false });
            trackEvent('generate_error', { error: errorMessage });
        }
    }, [apiEndpoint, state.translationLanguage, updateState]);

    const reset = useCallback(() => {
        setState(initialState);
        trackEvent('reset');
    }, []);

    // ========================================================================
    // VR AVATAR ACTIONS
    // ========================================================================

    const setVrAvatarMode = useCallback((enabled: boolean) => {
        updateState({
            vrAvatarMode: enabled,
            avatarState: enabled ? 'greeting' : 'idle',
            captionText: enabled ? 'Welcome! I will help explain content in sign language.' : ''
        });
        trackEvent('vr_avatar_toggle', { enabled });

        // Transition from greeting to idle after 3 seconds
        if (enabled) {
            setTimeout(() => {
                setState(prev => prev.vrAvatarMode ? { ...prev, avatarState: 'idle' } : prev);
            }, 3000);
        }
    }, [updateState]);

    const toggleVrAvatarMode = useCallback(() => {
        setState(prev => {
            const newEnabled = !prev.vrAvatarMode;
            trackEvent('vr_avatar_toggle', { enabled: newEnabled });
            return {
                ...prev,
                vrAvatarMode: newEnabled,
                avatarState: newEnabled ? 'greeting' : 'idle',
                captionText: newEnabled ? 'Welcome! I will help explain content in sign language.' : ''
            };
        });
    }, []);

    const setAvatarState = useCallback((avatarState: AvatarState) => {
        updateState({ avatarState });
    }, [updateState]);

    const setCaptionText = useCallback((captionText: string) => {
        updateState({ captionText, avatarState: 'explaining' });
        // Return to idle after caption is shown
        setTimeout(() => {
            setState(prev => prev.captionText === captionText ? { ...prev, avatarState: 'idle' } : prev);
        }, 4000);
    }, [updateState]);

    // ========================================================================
    // CONTEXT VALUE
    // ========================================================================

    const contextValue: SignLanguageContextType = {
        ...state,
        setEnabled,
        toggleEnabled,
        showPlayer,
        hidePlayer,
        setSelectedText,
        clearSelectedText,
        setTranslationLanguage,
        setVideoSrc,
        setIsPlaying,
        togglePlayback,
        setPlaybackSpeed,
        setCurrentTime,
        setDuration,
        setZoomLevel,
        zoomIn,
        zoomOut,
        setIsFullscreen,
        toggleFullscreen,
        setIsLoading,
        setError,
        setShowSettings,
        toggleSettings,
        setHighlightedTextRange,
        generateTranslation,
        reset,
        // VR Avatar actions
        setVrAvatarMode,
        toggleVrAvatarMode,
        setAvatarState,
        setCaptionText,
    };

    return (
        <SignLanguageContext.Provider value={contextValue}>
            {children}
        </SignLanguageContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useSignLanguage(): SignLanguageContextType {
    const context = useContext(SignLanguageContext);
    if (!context) {
        throw new Error('useSignLanguage must be used within a SignLanguageProvider');
    }
    return context;
}

export default SignLanguageContext;
