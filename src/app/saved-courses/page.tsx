"use client";

/**
 * /saved-courses
 * ──────────────
 * Displays every course the user has bookmarked.
 * Reads bookmarks from localStorage via useBookmarks().
 * Re-uses CourseSearchGrid (variant="default") so the card
 * style, search bar, and empty-state are all consistent.
 */

import { useMemo } from "react";
import { Navbar } from "@/components/layout/navbar";
import { CourseSearchGrid } from "@/components/course/course-search-grid";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { MOCK_DB } from "@/lib/mock-db";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SavedCoursesPage() {
    const { bookmarkedIds, isHydrated } = useBookmarks();

    // Derive the bookmarked course objects from the full MOCK_DB list.
    // When real API data lands this single line changes to a filtered API call.
    const savedCourses = useMemo(
        () => MOCK_DB.courses.filter((c) => bookmarkedIds.has(c.id)),
        [bookmarkedIds]
    );

    return (
        <main className="min-h-screen bg-background hero-gradient">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-14 pb-24 space-y-10">
                {/* ── Page heading ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary shrink-0">
                            <Bookmark className="h-5 w-5 fill-primary" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                            My Library
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                        Saved Courses
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Your personally bookmarked courses — ready to pick up where you left off.
                    </p>
                    <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                </div>

                {/* ── Content ── */}
                {!isHydrated ? (
                    /* Loading skeleton while localStorage hydrates */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col space-y-4 rounded-xl border p-5 bg-white dark:bg-slate-900">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-5 rounded" />
                                </div>
                                <Skeleton className="h-7 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-10 w-full rounded-md mt-auto" />
                            </div>
                        ))}
                    </div>
                ) : savedCourses.length === 0 ? (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                        {/* Illustrated icon */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bookmark className="h-10 w-10 text-primary/40" strokeWidth={1.5} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-lg">
                                📚
                            </div>
                        </div>

                        <div className="space-y-2 max-w-sm">
                            <h2 className="text-2xl font-bold text-foreground">No saved courses yet</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Bookmark any course by clicking the{" "}
                                <Bookmark className="inline h-3.5 w-3.5 mx-0.5" />
                                {" "}icon on a course card — it&apos;ll appear here instantly.
                            </p>
                        </div>

                        <Link href="/courses">
                            <Button className="gap-2 mt-2">
                                Browse Courses
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* ── Saved course grid (reuses CourseSearchGrid with search) ── */
                    <CourseSearchGrid courses={savedCourses} variant="default" />
                )}
            </div>
        </main>
    );
}
