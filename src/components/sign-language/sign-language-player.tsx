"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSignLanguage } from '@/contexts/sign-language-context';
import { cn } from '@/lib/utils';

// ============================================================================
// STYLES - EduAIThon ICTIEE 2026 Conference Theme  
// ============================================================================

const COLORS = {
    primary: '#0F4C45',        // Deep Teal header
    primaryHover: '#0A3530',   // Darker Teal
    accent: '#D6C6A1',         // Soft Gold active indicator
    accentLight: '#E5D9BF',
    background: '#F2EAD3',     // Cream player background
    surface: '#FFFFFF',        // White controls surface
    text: '#2E2E2E',           // Dark Gray
    textMuted: '#5A5A5A',
    overlay: 'rgba(15, 76, 69, 0.8)',
};

const styles = {
    // Container styles
    container: {
        position: 'fixed' as const,
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        width: '400px',
        maxWidth: 'calc(100vw - 40px)',
        backgroundColor: COLORS.background,
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
    },
    containerFullscreen: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        transform: 'none',
        borderRadius: 0,
        zIndex: 99999,
    },
    // Header styles
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: COLORS.primary,
        color: COLORS.text,
    },
    headerLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        color: COLORS.text,
    },
    headerButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    iconButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: COLORS.text,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    // Video area styles
    videoContainer: {
        position: 'relative' as const,
        aspectRatio: '16/9',
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain' as const,
    },
    playOverlay: {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 212, 170, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, background-color 0.2s',
    },
    // Controls bar styles
    controlsBar: {
        padding: '12px 16px',
        backgroundColor: COLORS.surface,
    },
    progressContainer: {
        marginBottom: '12px',
    },
    progressBar: {
        width: '100%',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '2px',
        cursor: 'pointer',
        position: 'relative' as const,
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: '2px',
        transition: 'width 0.1s linear',
    },
    timeDisplay: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: COLORS.textMuted,
        marginTop: '4px',
    },
    controlsRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    controlGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    speedButton: {
        padding: '4px 12px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 0.2s, color 0.2s',
    },
    speedButtonActive: {
        backgroundColor: COLORS.accent,
        color: COLORS.background,
    },
    speedButtonInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: COLORS.textMuted,
    },
    zoomButton: {
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'transparent',
        color: COLORS.text,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
    },
    // Loading overlay
    loadingOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(26, 27, 46, 0.9)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: `3px solid ${COLORS.surface}`,
        borderTopColor: COLORS.accent,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    // Text sync indicator
    textSyncIndicator: {
        padding: '8px 16px',
        backgroundColor: COLORS.surface,
        borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
        fontSize: '12px',
        color: COLORS.textMuted,
    },
    highlightedText: {
        color: COLORS.accent,
        fontWeight: 500,
    },
    // Settings dropdown
    settingsDropdown: {
        position: 'absolute' as const,
        top: '100%',
        right: 0,
        marginTop: '8px',
        backgroundColor: COLORS.surface,
        borderRadius: '8px',
        padding: '8px 0',
        minWidth: '160px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
    },
    settingsItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        fontSize: '13px',
        color: COLORS.text,
    },
    // Error state
    errorContainer: {
        padding: '24px',
        textAlign: 'center' as const,
        color: COLORS.textMuted,
    },
    retryButton: {
        marginTop: '12px',
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: COLORS.accent,
        color: COLORS.background,
        fontWeight: 500,
        cursor: 'pointer',
    },
};

// ============================================================================
// ICONS (Inline SVG for zero dependencies)
// ============================================================================

const Icons = {
    Play: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
        </svg>
    ),
    Pause: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    ),
    Settings: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
        </svg>
    ),
    Fullscreen: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
    ),
    ExitFullscreen: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
    ),
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    ),
    ZoomIn: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
        </svg>
    ),
    ZoomOut: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M8 11h6" />
        </svg>
    ),
    SignLang: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 1.5c-1.77 0-3.33 1.17-3.83 2.87C8.14 4.13 7.58 4 7 4c-2.21 0-4 1.79-4 4v8c0 3.87 3.13 7 7 7h4c3.87 0 7-3.13 7-7V8c0-2.21-1.79-4-4-4-.58 0-1.14.13-1.67.37-.5-1.7-2.06-2.87-3.83-2.87zm0 2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zM7 6c1.1 0 2 .9 2 2H5c0-1.1.9-2 2-2zm10 0c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z" />
        </svg>
    ),
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export interface SignLanguagePlayerProps {
    className?: string;
}

export function SignLanguagePlayer({ className }: SignLanguagePlayerProps) {
    const {
        isVideoVisible,
        videoSrc,
        imageSrc,
        contentType,
        matchedSign,
        isPlaying,
        playbackSpeed,
        currentTime,
        duration,
        zoomLevel,
        isFullscreen,
        isLoading,
        error,
        showSettings,
        selectedText,
        translationLanguage,

        togglePlayback,
        setPlaybackSpeed,
        setCurrentTime,
        setDuration,
        zoomIn,
        zoomOut,
        toggleFullscreen,
        hidePlayer,
        toggleSettings,
        setIsPlaying,
        setTranslationLanguage,
        generateTranslation,
    } = useSignLanguage();

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // ========================================================================
    // VIDEO SYNC
    // ========================================================================

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = playbackSpeed;
    }, [playbackSpeed]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.play().catch(() => setIsPlaying(false));
        } else {
            video.pause();
        }
    }, [isPlaying, setIsPlaying]);

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        setCurrentTime(video.currentTime);
    }, [setCurrentTime]);

    const handleLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        setDuration(video.duration);
    }, [setDuration]);

    const handleVideoEnded = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, [setIsPlaying, setCurrentTime]);

    // ========================================================================
    // PROGRESS BAR INTERACTION
    // ========================================================================

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progress = progressRef.current;
        if (!video || !progress) return;

        const rect = progress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * video.duration;

        video.currentTime = newTime;
        setCurrentTime(newTime);
    }, [setCurrentTime]);

    // ========================================================================
    // KEYBOARD NAVIGATION
    // ========================================================================

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isVideoVisible) return;

            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlayback();
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        toggleFullscreen();
                    } else {
                        hidePlayer();
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (videoRef.current) {
                        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (videoRef.current) {
                        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
                    }
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    zoomOut();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVideoVisible, isFullscreen, duration, togglePlayback, toggleFullscreen, hidePlayer, zoomIn, zoomOut]);

    // ========================================================================
    // FOCUS TRAP
    // ========================================================================

    useEffect(() => {
        if (!isVideoVisible) return;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        };

        firstElement?.focus();
        container.addEventListener('keydown', handleTabKey);
        return () => container.removeEventListener('keydown', handleTabKey);
    }, [isVideoVisible]);

    // ========================================================================
    // FULLSCREEN HANDLING
    // ========================================================================

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        if (isFullscreen) {
            container.requestFullscreen?.().catch(() => { });
        } else if (document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => { });
        }
    }, [isFullscreen]);

    // ========================================================================
    // RENDER
    // ========================================================================

    if (!isVideoVisible) return null;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: COLORS.overlay,
                    zIndex: 9998,
                }}
                onClick={hidePlayer}
                aria-hidden="true"
            />

            {/* Player Container */}
            <div
                ref={containerRef}
                id="player-active"
                role="complementary"
                aria-label="Sign language translation video player"
                style={isFullscreen ? styles.containerFullscreen : styles.container}
                className={className}
            >
                {/* Header */}
                <div style={styles.header}>
                    <a
                        href="https://signapse.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.headerLogo}
                    >
                        <Icons.SignLang />
                        <span>Sign Language</span>
                    </a>
                    <div style={styles.headerButtons}>
                        {/* Settings */}
                        <div style={{ position: 'relative' }}>
                            <button
                                ref={(el) => el && (el as any).ref_1311}
                                style={styles.iconButton}
                                onClick={toggleSettings}
                                aria-label="Settings"
                                aria-expanded={showSettings}
                            >
                                <Icons.Settings />
                            </button>
                            {showSettings && (
                                <div style={styles.settingsDropdown}>
                                    <div
                                        style={styles.settingsItem}
                                        onClick={() => setTranslationLanguage('ASL')}
                                    >
                                        <span>ASL (American)</span>
                                        {translationLanguage === 'ASL' && <span style={{ color: COLORS.accent }}>✓</span>}
                                    </div>
                                    <div
                                        style={styles.settingsItem}
                                        onClick={() => setTranslationLanguage('BSL')}
                                    >
                                        <span>BSL (British)</span>
                                        {translationLanguage === 'BSL' && <span style={{ color: COLORS.accent }}>✓</span>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button
                            ref={(el) => el && (el as any).ref_1317}
                            style={styles.iconButton}
                            onClick={toggleFullscreen}
                            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            {isFullscreen ? <Icons.ExitFullscreen /> : <Icons.Fullscreen />}
                        </button>

                        {/* Close */}
                        <button
                            ref={(el) => el && (el as any).ref_1324}
                            style={styles.iconButton}
                            onClick={hidePlayer}
                            aria-label="Close video player"
                        >
                            <Icons.Close />
                        </button>
                    </div>
                </div>

                {/* Content Area - Image or Video */}
                <div style={styles.videoContainer}>
                    {error ? (
                        <div style={styles.errorContainer}>
                            <p>Failed to load translation</p>
                            <p style={{ fontSize: '12px', marginTop: '4px' }}>{error}</p>
                            <button
                                style={styles.retryButton}
                                onClick={() => generateTranslation(selectedText)}
                            >
                                Retry
                            </button>
                        </div>
                    ) : imageSrc && contentType === 'image' ? (
                        /* Image Display */
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#1a1b2e',
                        }}>
                            <img
                                src={imageSrc}
                                alt={`Sign language for: ${matchedSign || selectedText}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    transform: `scale(${zoomLevel})`,
                                    transformOrigin: 'center center',
                                    transition: 'transform 0.2s ease',
                                }}
                            />
                            {/* Match indicator */}
                            {matchedSign && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '12px',
                                    left: '12px',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(0, 212, 170, 0.9)',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                }}>
                                    Sign: {matchedSign.toUpperCase()}
                                </div>
                            )}
                        </div>
                    ) : videoSrc && contentType === 'video' ? (
                        /* Video Display */
                        <>
                            <video
                                ref={videoRef}
                                className="ref_1330"
                                style={{
                                    ...styles.video,
                                    transform: `scale(${zoomLevel})`,
                                    transformOrigin: 'center center',
                                }}
                                src={videoSrc}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={handleVideoEnded}
                                onClick={togglePlayback}
                                playsInline
                            />
                            {!isPlaying && (
                                <div
                                    style={styles.playOverlay}
                                    onClick={togglePlayback}
                                    aria-label="Play"
                                >
                                    <Icons.Play />
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={styles.errorContainer}>
                            <Icons.SignLang />
                            <p style={{ marginTop: '12px' }}>Select text to generate translation</p>
                        </div>
                    )}

                    {/* Loading Overlay */}
                    {isLoading && (
                        <div style={styles.loadingOverlay}>
                            <div style={styles.spinner} />
                            <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>
                                Generating sign language...
                            </p>
                        </div>
                    )}
                </div>

                {/* Controls Bar */}
                <div style={styles.controlsBar}>
                    {/* Progress Bar */}
                    <div style={styles.progressContainer}>
                        <div
                            ref={progressRef}
                            style={styles.progressBar}
                            onClick={handleProgressClick}
                            role="slider"
                            aria-label="Video progress"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(progressPercentage)}
                            tabIndex={0}
                        >
                            <div
                                style={{
                                    ...styles.progressFill,
                                    width: `${progressPercentage}%`,
                                }}
                            />
                        </div>
                        <div style={styles.timeDisplay}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Control Buttons Row */}
                    <div style={styles.controlsRow}>
                        {/* Play/Pause */}
                        <div style={styles.controlGroup}>
                            <button
                                ref={(el) => el && (el as any).ref_557}
                                style={{
                                    ...styles.iconButton,
                                    backgroundColor: COLORS.accent,
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                }}
                                onClick={togglePlayback}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                            </button>
                        </div>

                        {/* Speed Controls */}
                        <div style={styles.controlGroup}>
                            {[0.5, 1, 1.5].map((speed) => (
                                <button
                                    key={speed}
                                    style={{
                                        ...styles.speedButton,
                                        ...(playbackSpeed === speed
                                            ? styles.speedButtonActive
                                            : styles.speedButtonInactive),
                                    }}
                                    onClick={() => setPlaybackSpeed(speed)}
                                    aria-label={`${speed}x speed`}
                                    aria-pressed={playbackSpeed === speed}
                                >
                                    {speed}x
                                </button>
                            ))}
                        </div>

                        {/* Zoom Controls */}
                        <div style={styles.controlGroup}>
                            <button
                                style={styles.zoomButton}
                                onClick={zoomOut}
                                aria-label="Zoom out"
                                disabled={zoomLevel <= 0.5}
                            >
                                <Icons.ZoomOut />
                            </button>
                            <span style={{ fontSize: '11px', color: COLORS.textMuted, minWidth: '36px', textAlign: 'center' }}>
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                style={styles.zoomButton}
                                onClick={zoomIn}
                                aria-label="Zoom in"
                                disabled={zoomLevel >= 3}
                            >
                                <Icons.ZoomIn />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Text Sync Indicator */}
                {selectedText && (
                    <div
                        style={styles.textSyncIndicator}
                        role="status"
                        aria-live="polite"
                    >
                        <span>Currently playing: </span>
                        <span style={styles.highlightedText}>
                            "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"
                        </span>
                    </div>
                )}
            </div>

            {/* Global Spinner Animation - using dangerouslySetInnerHTML to avoid styled-jsx issues */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            ` }} />
        </>
    );
}

export default SignLanguagePlayer;
