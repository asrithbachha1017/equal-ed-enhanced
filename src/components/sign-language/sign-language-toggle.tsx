"use client";

import React, { useEffect, useCallback } from 'react';
import { useSignLanguage } from '@/contexts/sign-language-context';
import { cn } from '@/lib/utils';

// ============================================================================
// STYLES - EduAIThon ICTIEE 2026 Conference Theme
// ============================================================================

const COLORS = {
    accent: '#0F4C45',         // Deep Teal
    accentDark: '#0A3530',     // Darker Teal
    inactive: '#5A5A5A',       // Muted Gray
    background: '#F2EAD3',     // Cream
    text: '#2E2E2E',           // Dark Gray
    textMuted: '#5A5A5A',      // Muted
};

// ============================================================================
// TOGGLE SWITCH COMPONENT
// ============================================================================

export interface SignLanguageToggleProps {
    className?: string;
    label?: string;
    showLabel?: boolean;
    position?: 'fixed' | 'inline';
}

export function SignLanguageToggle({
    className,
    label = 'Play sign language translation for selected text',
    showLabel = true,
    position = 'fixed',
}: SignLanguageToggleProps) {
    const { isEnabled, toggleEnabled, selectedText, generateTranslation, isLoading, vrAvatarMode, toggleVrAvatarMode } = useSignLanguage();

    // Handle text selection when toggle is enabled
    useEffect(() => {
        if (!isEnabled) return;

        const handleMouseUp = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();

            if (text && text.length > 0 && text.length < 2000) {
                generateTranslation(text);
            }
        };

        // Add listener to document
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [isEnabled, generateTranslation]);

    const containerStyle: React.CSSProperties = position === 'fixed' ? {
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '16px',
        backgroundColor: COLORS.background,
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    } : {};

    return (
        <div
            style={containerStyle}
            className={cn("sign-language-toggle-container", className)}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
            >
                {/* Toggle Switch */}
                <button
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={label}
                    className="ref_1440"
                    onClick={toggleEnabled}
                    disabled={isLoading}
                    style={{
                        position: 'relative',
                        width: '52px',
                        height: '28px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: isEnabled ? COLORS.accent : COLORS.inactive,
                        cursor: isLoading ? 'wait' : 'pointer',
                        transition: 'background-color 0.2s ease',
                        padding: 0,
                        flexShrink: 0,
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleEnabled();
                        }
                    }}
                >
                    {/* Toggle Knob */}
                    <span
                        style={{
                            position: 'absolute',
                            top: '3px',
                            left: isEnabled ? '26px' : '3px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: COLORS.text,
                            transition: 'left 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Hand icon inside knob */}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={isEnabled ? COLORS.accent : COLORS.inactive}
                        >
                            <path d="M12.5 1.5c-1.77 0-3.33 1.17-3.83 2.87C8.14 4.13 7.58 4 7 4c-2.21 0-4 1.79-4 4v8c0 3.87 3.13 7 7 7h4c3.87 0 7-3.13 7-7V8c0-2.21-1.79-4-4-4-.58 0-1.14.13-1.67.37-.5-1.7-2.06-2.87-3.83-2.87z" />
                        </svg>
                    </span>
                </button>

                {/* Label */}
                {showLabel && (
                    <span
                        style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: COLORS.text,
                            maxWidth: '200px',
                            lineHeight: 1.3,
                        }}
                    >
                        {label}
                    </span>
                )}
            </div>

            {/* Status indicator */}
            {isEnabled && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        fontSize: '12px',
                        color: COLORS.textMuted,
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <span
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: isLoading ? '#FCD34D' : COLORS.accent,
                            animation: isLoading ? 'pulse 1s infinite' : 'none',
                        }}
                    />
                    <span>
                        {isLoading
                            ? 'Generating translation...'
                            : selectedText
                                ? 'Translation ready'
                                : 'Select text to translate'}
                    </span>
                </div>
            )}

            {/* VR Avatar Mode Button */}
            {isEnabled && (
                <button
                    onClick={toggleVrAvatarMode}
                    style={{
                        marginTop: '8px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: vrAvatarMode ? `2px solid ${COLORS.accent}` : '2px solid transparent',
                        backgroundColor: vrAvatarMode ? COLORS.accent : 'rgba(255, 255, 255, 0.1)',
                        color: vrAvatarMode ? '#FFFFFF' : COLORS.text,
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        width: '100%',
                    }}
                    aria-pressed={vrAvatarMode}
                >
                    <span style={{ fontSize: '18px' }}>🤟</span>
                    <span>Enable VR Avatar Mode</span>
                </button>
            )}

            {/* Pulse animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            ` }} />
        </div>
    );
}

// ============================================================================
// HOOK FOR TEXT SELECTION HANDLING
// ============================================================================

export function useTextSelection(onSelect?: (text: string) => void) {
    const handleSelection = useCallback(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 0 && onSelect) {
            onSelect(text);
        }
    }, [onSelect]);

    useEffect(() => {
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection); // For keyboard selection

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
        };
    }, [handleSelection]);
}

// ============================================================================
// TRANSCRIPT TEXT WITH HIGHLIGHTING
// ============================================================================

export interface TranscriptTextProps {
    text: string;
    highlightedRange?: { start: number; end: number } | null;
    className?: string;
}

export function TranscriptText({ text, highlightedRange, className }: TranscriptTextProps) {
    if (!highlightedRange) {
        return <span className={className}>{text}</span>;
    }

    const { start, end } = highlightedRange;
    const before = text.slice(0, start);
    const highlighted = text.slice(start, end);
    const after = text.slice(end);

    return (
        <span className={className}>
            {before}
            <mark
                style={{
                    backgroundColor: `${COLORS.accent}40`,
                    color: 'inherit',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.accent}`,
                }}
            >
                {highlighted}
            </mark>
            {after}
        </span>
    );
}

export default SignLanguageToggle;
