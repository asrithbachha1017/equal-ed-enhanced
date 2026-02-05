"use client";

import { useCallback } from "react";

export const useHaptics = () => {
    const vibrate = useCallback((pattern: number | number[] = 50) => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    const triggerSuccess = () => vibrate([50, 50, 50]); // Two short pulses
    const triggerError = () => vibrate([200]); // One long pulse
    const triggerClick = () => vibrate(20); // Very short tick

    return { vibrate, triggerSuccess, triggerError, triggerClick };
};
