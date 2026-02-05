"use client";

import { useGamification } from "@/lib/gamification";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakFlame() {
    const { stats, mounted } = useGamification();

    if (!mounted) return null;

    const isActive = stats.streak > 0;

    return (
        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
            <Flame
                className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-orange-500 fill-orange-500 animate-pulse" : "text-slate-300"
                )}
            />
            <span className={cn("font-bold", isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400")}>
                {stats.streak} Day Streak
            </span>
        </div>
    );
}
