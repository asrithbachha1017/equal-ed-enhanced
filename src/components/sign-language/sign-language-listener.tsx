"use client";
import { useEffect } from 'react';
import { useSignLanguage } from '@/contexts/sign-language-context';

import { toast } from "sonner";

export function SignLanguageListener() {
    const { isEnabled, generateTranslation } = useSignLanguage();

    useEffect(() => {
        if (isEnabled) {
            toast.success("Sign Language Practice Mode Active", {
                description: "Select any text to translate it into sign language.",
                duration: 3000,
            });
        }
    }, [isEnabled]);

    useEffect(() => {
        if (!isEnabled) return;

        const handleMouseUp = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();

            if (text && text.length > 0 && text.length < 2000) {
                generateTranslation(text);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, [isEnabled, generateTranslation]);

    return null;
}
