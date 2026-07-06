"use client";

/**
 * BookmarkButton
 * ──────────────
 * A self-contained icon button that reads and writes bookmark state.
 * It calls useBookmarks() internally so any instance anywhere on the page
 * instantly reflects the same source of truth (localStorage + React state).
 *
 * Props:
 *   courseId  — the ID of the course to bookmark/un-bookmark
 *   className — optional extra Tailwind classes for positioning
 */

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface BookmarkButtonProps {
    courseId: string;
    className?: string;
}

export function BookmarkButton({ courseId, className }: BookmarkButtonProps) {
    const { isBookmarked, toggle, isHydrated } = useBookmarks();

    const saved = isBookmarked(courseId);

    function handleClick(e: React.MouseEvent) {
        // Prevent the parent <Link> / card click from firing
        e.preventDefault();
        e.stopPropagation();

        toggle(courseId);

        if (saved) {
            toast("Course removed", {
                description: "Removed from your saved courses.",
                icon: "🔖",
            });
        } else {
            toast.success("Course saved!", {
                description: "Added to your saved courses.",
                icon: "🔖",
            });
        }
    }

    return (
        <button
            aria-label={saved ? "Remove bookmark" : "Bookmark this course"}
            aria-pressed={saved}
            onClick={handleClick}
            disabled={!isHydrated}
            className={cn(
                // Base — invisible until hovered on card; always visible when saved
                "rounded-full p-1.5 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-40 disabled:cursor-wait",
                saved
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                className
            )}
        >
            <Bookmark
                className={cn(
                    "h-4 w-4 transition-all duration-200",
                    saved && "fill-primary"
                )}
                strokeWidth={2}
            />
        </button>
    );
}
