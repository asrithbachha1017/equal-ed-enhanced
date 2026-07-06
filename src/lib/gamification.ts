"use client";

import { useState, useEffect, useCallback } from "react";

// Types
export interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    lastLogin: string | null; // ISO Date String
}

const STORAGE_KEY = "iasf_gamification_v1";

// Leveling Logic: Level = sqrt(XP) * 0.1 (Simplified RPG curve)
export const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp) * 0.2) + 1;
export const calculateNextLevelXP = (level: number) => Math.pow((level) / 0.2, 2);

export const useGamification = () => {
    const [stats, setStats] = useState<GamificationState>({
        xp: 0,
        level: 1,
        streak: 0,
        lastLogin: null
    });

    const [mounted, setMounted] = useState(false);

    const save = useCallback((newStats: GamificationState) => {
        setStats(newStats);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        }
    }, []);

    // Daily Streak Logic
    const checkStreak = useCallback((currentStats: GamificationState) => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = currentStats.lastLogin ? currentStats.lastLogin.split('T')[0] : null;

        if (lastDate === today) return; // Already logged in today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = currentStats.streak;
        if (lastDate === yesterdayStr) {
            newStreak += 1; // Continued streak
        } else {
            newStreak = 1; // Broken streak
        }

        save({ ...currentStats, streak: newStreak, lastLogin: new Date().toISOString() });
    }, [save]);

    // Load from Storage on Mount
    useEffect(() => {
        // Defer to next tick to avoid synchronous cascading renders warning
        const timer = setTimeout(() => {
            setMounted(true);
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setStats(parsed);
                    checkStreak(parsed);
                } catch (e) {
                    console.error("Failed to parse gamification data", e);
                }
            } else {
                // New User - Initialize
                save({ xp: 0, level: 1, streak: 1, lastLogin: new Date().toISOString() });
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [checkStreak, save]);

    const addXP = useCallback((amount: number) => {
        let levelUp = false;
        let newLevel = stats.level;

        setStats(prev => {
            const newXP = prev.xp + amount;
            newLevel = calculateLevel(newXP);
            levelUp = newLevel > prev.level;
            const updated = {
                ...prev,
                xp: newXP,
                level: newLevel
            };
            // Side effect: save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }
            return updated;
        });

        return { newLevel, levelUp };
    }, [stats.level]);

    return {
        stats,
        addXP,
        mounted
    };
};
