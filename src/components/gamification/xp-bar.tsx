"use client";

import { useGamification, calculateNextLevelXP } from "@/lib/gamification";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export function XPBar() {
    const { stats, mounted } = useGamification();

    if (!mounted) return null; // Avoid hydration mismatch

    const nextLevelXP = calculateNextLevelXP(stats.level);
    const progressPercent = Math.min(100, (stats.xp / nextLevelXP) * 100);

    return (
        <div className="flex flex-col gap-1 w-full max-w-xs">
            <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Level {stats.level}
                </span>
                <span className="text-slate-500 text-xs">
                    {Math.floor(stats.xp)} / {Math.floor(nextLevelXP)} XP
                </span>
            </div>

            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}
