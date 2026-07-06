/**
 * useBookmarks — LocalStorage-backed bookmark hook
 *
 * Storage key : "eq_bookmarked_courses"
 * Storage value: JSON array of bookmarked course IDs, e.g. ["course-math","course-asl"]
 *
 * How it works
 * ─────────────
 * 1. On first render (useEffect) the hook reads localStorage and hydrates React state.
 *    We intentionally skip this during SSR (typeof window === "undefined") to avoid
 *    a hydration mismatch — Next.js renders the server pass with an empty set, then
 *    the client immediately reconciles with the real localStorage values.
 * 2. Every time `bookmarkedIds` changes we persist the new array back to localStorage
 *    via a second useEffect.  This keeps the two sources always in sync without any
 *    manual "save" calls scattered across the codebase.
 * 3. `toggle(courseId)` adds the ID if missing, removes it if present.
 * 4. `isBookmarked(courseId)` is a pure O(1) look-up against the Set.
 */

"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "eq_bookmarked_courses";

interface UseBookmarksReturn {
    /** The full set of bookmarked course IDs (for iteration on /saved-courses) */
    bookmarkedIds: Set<string>;
    /** Returns true when the given courseId is bookmarked */
    isBookmarked: (courseId: string) => boolean;
    /** Adds the course if not bookmarked; removes it if already bookmarked */
    toggle: (courseId: string) => void;
    /** True during the initial localStorage hydration (avoids flicker) */
    isHydrated: boolean;
}

export function useBookmarks(): UseBookmarksReturn {
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [isHydrated, setIsHydrated] = useState(false);

    // ── Step 1: Read from localStorage on client mount ───────────────────────
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed: string[] = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setBookmarkedIds(new Set(parsed));
                }
            }
        } catch {
            // Corrupted storage — start with an empty set
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    // ── Step 2: Persist to localStorage whenever state changes ────────────────
    useEffect(() => {
        if (!isHydrated) return; // Don't overwrite storage before we've read it
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(bookmarkedIds)));
        } catch {
            // Storage quota exceeded or private-browsing restriction — silently ignore
        }
    }, [bookmarkedIds, isHydrated]);

    // ── toggle ────────────────────────────────────────────────────────────────
    const toggle = useCallback((courseId: string) => {
        setBookmarkedIds((prev) => {
            const next = new Set(prev);
            if (next.has(courseId)) {
                next.delete(courseId);
            } else {
                next.add(courseId);
            }
            return next;
        });
    }, []);

    // ── isBookmarked ──────────────────────────────────────────────────────────
    const isBookmarked = useCallback(
        (courseId: string) => bookmarkedIds.has(courseId),
        [bookmarkedIds]
    );

    return { bookmarkedIds, isBookmarked, toggle, isHydrated };
}
