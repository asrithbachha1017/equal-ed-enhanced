"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { BookOpen, Database, ArrowRight, Search, X } from "lucide-react";
import type { MockCourse } from "@/lib/mock-db";

interface CourseSearchGridProps {
    courses: MockCourse[];
    /** Visual variant: "default" matches /courses page; "dashboard" matches /dashboard/courses */
    variant?: "default" | "dashboard";
}

export function CourseSearchGrid({ courses, variant = "default" }: CourseSearchGridProps) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return courses;
        return courses.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.levels.some(
                    (l) =>
                        l.title.toLowerCase().includes(q) ||
                        l.dataset.name.toLowerCase().includes(q)
                )
        );
    }, [query, courses]);

    return (
        <div className="space-y-6">
            {/* ── Search bar ── */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    id="course-search-input"
                    type="search"
                    placeholder="Search courses, levels, or datasets…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 pr-9"
                    aria-label="Search courses"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* ── Result count hint ── */}
            {query && (
                <p className="text-sm text-muted-foreground" aria-live="polite">
                    {filtered.length === 0
                        ? "No courses matched your search."
                        : `${filtered.length} course${filtered.length !== 1 ? "s" : ""} found`}
                </p>
            )}

            {/* ── Course grid ── */}
            {variant === "default" ? (
                <DefaultGrid courses={filtered} />
            ) : (
                <DashboardGrid courses={filtered} />
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Variant: /courses  (original card style)
───────────────────────────────────────────── */
function DefaultGrid({ courses }: { courses: MockCourse[] }) {
    if (courses.length === 0) return <EmptyState />;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <Card
                    key={course.id}
                    className="flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary"
                >
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {course.levels.length} Levels
                            </Badge>
                            <BookOpen className="h-5 w-5 text-slate-400" />
                        </div>
                        <CardTitle className="text-2xl">{course.title}</CardTitle>
                        <CardDescription className="text-base mt-2">
                            {course.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="space-y-3">
                            {course.levels.slice(0, 2).map((level) => (
                                <div
                                    key={level.id}
                                    className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                >
                                    <Database className="h-3 w-3" />
                                    <span className="truncate">{level.dataset.name}</span>
                                </div>
                            ))}
                            {course.levels.length > 2 && (
                                <div className="text-xs text-slate-400 pl-5">
                                    + {course.levels.length - 2} more levels
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/courses/${course.id}`} className="w-full">
                            <Button className="w-full gap-2 group">
                                Start Learning{" "}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Variant: /dashboard/courses  (original card style)
───────────────────────────────────────────── */
function DashboardGrid({ courses }: { courses: MockCourse[] }) {
    if (courses.length === 0) return <EmptyState />;
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
                <Card
                    key={course.id}
                    className="flex flex-col h-full border-2 hover:border-primary/50 transition-colors"
                >
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                                <Database className="w-3 h-3 mr-1" />
                                Data-Driven
                            </Badge>
                        </div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Levels &amp; Datasets
                        </h4>
                        <div className="space-y-3">
                            {course.levels.map((level) => (
                                <div
                                    key={level.id}
                                    className="p-3 bg-secondary/50 rounded-lg space-y-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-sm">{level.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Database className="w-3 h-3" />
                                        <span className="truncate">Source: {level.dataset.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Link href={`/courses/${course.id}`} className="w-full">
                            <Button className="w-full gap-2 group">
                                View Syllabus
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
            <Search className="h-10 w-10 opacity-30" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm">Try a different keyword — e.g. "Math", "ASL", or "Science".</p>
        </div>
    );
}
