"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '@/contexts/accessibility-context';

/**
 * Screen Narration Configuration
 */
const NARRATION_CONFIG = {
    /** Debounce delay in ms to prevent audio flooding */
    DEBOUNCE_MS: 800,
    /** Speech rate (0.5 = slow, 1.0 = normal, 1.5 = fast) */
    SPEECH_RATE: 0.9,
    /** Speech pitch */
    SPEECH_PITCH: 1.0,
};

/**
 * Get a human-readable description of an element
 */
function getElementDescription(element: Element | null): string | null {
    if (!element) return null;

    const tagName = element.tagName.toLowerCase();

    // Skip decorative/non-interactive elements
    const skipTags = ['script', 'style', 'meta', 'link', 'br', 'hr'];
    if (skipTags.includes(tagName)) return null;

    // Get the label/text content
    let label = '';
    let elementType = '';
    let state = '';
    let hint = '';

    // Priority 1: aria-label or aria-labelledby
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');

    if (ariaLabel) {
        label = ariaLabel;
    } else if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        if (labelElement) {
            label = labelElement.textContent?.trim() || '';
        }
    }

    // Priority 2: Element-specific text extraction
    if (!label) {
        if (element instanceof HTMLInputElement) {
            const inputType = element.type;
            elementType = inputType === 'submit' ? 'Submit Button' :
                inputType === 'text' ? 'Text Input' :
                    inputType === 'email' ? 'Email Input' :
                        inputType === 'password' ? 'Password Input' :
                            inputType === 'checkbox' ? 'Checkbox' :
                                inputType === 'radio' ? 'Radio Button' :
                                    `${inputType} Input`;

            // Get label from associated <label> element
            const id = element.id;
            if (id) {
                const labelEl = document.querySelector(`label[for="${id}"]`);
                if (labelEl) {
                    label = labelEl.textContent?.trim() || '';
                }
            }

            // Fallback to placeholder
            if (!label) {
                label = element.placeholder || element.name || '';
            }

            // State
            if (element.disabled) state = 'Disabled.';
            if (element.type === 'checkbox' && element.checked) state = 'Checked.';
            if (element.type === 'radio' && element.checked) state = 'Selected.';
            if (element.required) state += ' Required.';

        } else if (element instanceof HTMLButtonElement) {
            elementType = 'Button';
            label = element.textContent?.trim() || element.value || '';
            if (element.disabled) state = 'Disabled.';
            hint = 'Press Enter to activate.';

        } else if (element instanceof HTMLAnchorElement) {
            elementType = 'Link';
            label = element.textContent?.trim() || element.href || '';
            hint = 'Press Enter to follow link.';

        } else if (element instanceof HTMLSelectElement) {
            elementType = 'Dropdown';
            const id = element.id;
            if (id) {
                const labelEl = document.querySelector(`label[for="${id}"]`);
                if (labelEl) {
                    label = labelEl.textContent?.trim() || '';
                }
            }
            if (!label) label = element.name || '';
            const selectedOption = element.options[element.selectedIndex];
            if (selectedOption) {
                state = `Currently: ${selectedOption.text}.`;
            }
            hint = 'Use arrow keys to select.';

        } else if (element instanceof HTMLTextAreaElement) {
            elementType = 'Text Area';
            const id = element.id;
            if (id) {
                const labelEl = document.querySelector(`label[for="${id}"]`);
                if (labelEl) {
                    label = labelEl.textContent?.trim() || '';
                }
            }
            if (!label) label = element.placeholder || '';

        } else if (tagName.match(/^h[1-6]$/)) {
            const level = tagName.charAt(1);
            elementType = `Heading Level ${level}`;
            label = element.textContent?.trim() || '';

        } else if (tagName === 'nav') {
            elementType = 'Navigation';
            label = element.getAttribute('aria-label') || 'Main';

        } else if (tagName === 'main') {
            elementType = 'Main Content';
            label = '';

        } else if (tagName === 'section') {
            elementType = 'Section';
            const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
            label = heading?.textContent?.trim() || element.getAttribute('aria-label') || '';

        } else if (element.getAttribute('role') === 'button') {
            elementType = 'Button';
            label = element.textContent?.trim() || '';
            hint = 'Press Enter to activate.';

        } else {
            // Generic interactive element
            const role = element.getAttribute('role');
            if (role) {
                elementType = role.charAt(0).toUpperCase() + role.slice(1);
            }
            label = element.textContent?.trim().slice(0, 100) || '';
        }
    }

    // Build the narration string
    if (!label && !elementType) return null;

    let narration = '';
    if (elementType) {
        narration = `${elementType}${label ? ': ' + label : ''}`;
    } else {
        narration = label;
    }

    if (state) narration += ` ${state}`;
    if (hint) narration += ` ${hint}`;

    return narration.trim() || null;
}

/**
 * Get page-level context when no element is focused
 */
function getPageContext(): string {
    // Try h1 first
    const h1 = document.querySelector('h1');
    if (h1) {
        return `Page: ${h1.textContent?.trim()}`;
    }

    // Fall back to document title
    if (document.title) {
        return `Page: ${document.title}`;
    }

    return 'Page loaded';
}

/**
 * Speak text using Web Speech API
 */
function speakText(text: string): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = NARRATION_CONFIG.SPEECH_RATE;
    utterance.pitch = NARRATION_CONFIG.SPEECH_PITCH;
    utterance.lang = 'en-US';

    // Use a calm, clear voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
        v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    try {
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        // Silently fail - do not block keyboard input
        console.warn('[ScreenNarration] Speech failed:', error);
    }
}

/**
 * Hook for keyboard-activated screen narration
 */
export function useScreenNarration() {
    const { screenNarration, setScreenNarration, voiceNavigation } = useAccessibility();

    // Track state to prevent repeat narrations
    const lastNarrationRef = useRef<string>('');
    const lastFocusedElementRef = useRef<Element | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isActiveRef = useRef(false);

    // Narration should only work when both accessibility mode and screen narration are on
    const isEnabled = voiceNavigation && screenNarration;

    /**
     * Perform narration for current focus/context
     */
    const narrateCurrentContext = useCallback(() => {
        if (!isEnabled) return;

        const activeElement = document.activeElement;
        let textToSpeak: string | null = null;

        // Priority 1: Currently focused element
        if (activeElement && activeElement !== document.body) {
            // Check if focus changed
            if (activeElement !== lastFocusedElementRef.current) {
                textToSpeak = getElementDescription(activeElement);
                lastFocusedElementRef.current = activeElement;
            }
        }

        // Priority 2: If no focused element or same element, try page context
        if (!textToSpeak && lastFocusedElementRef.current === null) {
            textToSpeak = getPageContext();
        }

        // Only speak if content is new
        if (textToSpeak && textToSpeak !== lastNarrationRef.current) {
            lastNarrationRef.current = textToSpeak;
            speakText(textToSpeak);
        }
    }, [isEnabled]);

    /**
     * Handle keyboard events with debounce
     */
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isEnabled) return;

        // Handle toggle shortcut: Ctrl+Shift+V
        if (event.ctrlKey && event.shiftKey && event.key === 'V') {
            event.preventDefault();
            setScreenNarration(!screenNarration);
            const status = !screenNarration ? 'Screen narration enabled' : 'Screen narration disabled';
            speakText(status);
            return;
        }

        // Debounce narration to prevent audio flooding
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            narrateCurrentContext();
        }, NARRATION_CONFIG.DEBOUNCE_MS);

    }, [isEnabled, screenNarration, setScreenNarration, narrateCurrentContext]);

    /**
     * Handle focus changes (for mouse users or programmatic focus)
     */
    const handleFocusIn = useCallback(() => {
        if (!isEnabled) return;

        // Short delay to let focus settle
        setTimeout(() => {
            narrateCurrentContext();
        }, 100);
    }, [isEnabled, narrateCurrentContext]);

    // Setup event listeners
    useEffect(() => {
        if (!isEnabled) {
            isActiveRef.current = false;
            return;
        }

        // Don't setup listeners on server
        if (typeof window === 'undefined') return;

        isActiveRef.current = true;

        // Announce when narration becomes active
        if (!lastNarrationRef.current) {
            speakText('Screen narration active. Navigate with keyboard to hear element descriptions.');
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('focusin', handleFocusIn);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('focusin', handleFocusIn);

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [isEnabled, handleKeyDown, handleFocusIn]);

    // Preload voices
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Trigger voice loading
            window.speechSynthesis.getVoices();
        }
    }, []);

    return {
        isEnabled,
        toggleNarration: () => setScreenNarration(!screenNarration),
    };
}
