"use client";

/**
 * Sign Language Translation Feature
 * 
 * Complete export of all components for the sign language video player
 * and related functionality.
 * 
 * Usage:
 * ```tsx
 * import { SignLanguageProvider, SignLanguagePlayer, SignLanguageToggle } from '@/components/sign-language';
 * 
 * function App() {
 *   return (
 *     <SignLanguageProvider>
 *       <SignLanguageToggle position="fixed" />
 *       <SignLanguagePlayer />
 *       <YourContent />
 *     </SignLanguageProvider>
 *   );
 * }
 * ```
 */

// Context and state management
export {
    SignLanguageProvider,
    useSignLanguage,
    type TranslationLanguage,
    type SignLanguageState,
} from '@/contexts/sign-language-context';

// Main video player component
export {
    SignLanguagePlayer,
    type SignLanguagePlayerProps,
} from './sign-language-player';

// Toggle switch and utilities
export {
    SignLanguageToggle,
    TranscriptText,
    useTextSelection,
    type SignLanguageToggleProps,
    type TranscriptTextProps,
} from './sign-language-toggle';

export { SignLanguageListener } from './sign-language-listener';

// VR Avatar Panel
export { VrAvatarPanel } from './vr-avatar-panel';

// ============================================================================
// COMBINED WRAPPER COMPONENT
// ============================================================================

import React from 'react';
import { SignLanguageProvider } from '@/contexts/sign-language-context';
import { SignLanguagePlayer } from './sign-language-player';
import { SignLanguageToggle } from './sign-language-toggle';
import { VrAvatarPanel } from './vr-avatar-panel';

export interface SignLanguageFeatureProps {
    /** API endpoint for translation (default: /api/sign-language/translate) */
    apiEndpoint?: string;
    /** Position of the toggle switch */
    togglePosition?: 'fixed' | 'inline';
    /** Show the toggle label */
    showToggleLabel?: boolean;
    /** Custom toggle label */
    toggleLabel?: string;
    /** Additional class name for the toggle */
    toggleClassName?: string;
    /** Additional class name for the player */
    playerClassName?: string;
    /** Children to wrap with the provider */
    children: React.ReactNode;
}

/**
 * Complete Sign Language Feature
 * 
 * Wraps children with the SignLanguageProvider and renders
 * both the toggle and player components.
 */
export function SignLanguageFeature({
    apiEndpoint,
    togglePosition = 'fixed',
    showToggleLabel = true,
    toggleLabel,
    toggleClassName,
    playerClassName,
    children,
}: SignLanguageFeatureProps) {
    return (
        <SignLanguageProvider apiEndpoint={apiEndpoint}>
            {children}
            <SignLanguageToggle
                position={togglePosition}
                showLabel={showToggleLabel}
                label={toggleLabel}
                className={toggleClassName}
            />
            <SignLanguagePlayer className={playerClassName} />
            <VrAvatarPanel />
        </SignLanguageProvider>
    );
}

export default SignLanguageFeature;
