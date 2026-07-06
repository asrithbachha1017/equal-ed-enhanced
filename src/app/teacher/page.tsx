"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/teacher/analytics-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Activity, PlusCircle } from "lucide-react";
import { MOCK_DB } from "@/lib/mock-db"; // We'll access the mock DB to list courses

export default function TeacherDashboard() {
    // Mock Analytics Data
    const totalStudents = 142;
    const activeNow = 12;
    const completionRate = "78%";

    // Get all courses directly
    const allCourses = MOCK_DB.courses;

    // Simulate a 1.5-second data fetch on mount
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-8 space-y-8">
                {/* Header row */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-5 w-72" />
                    </div>
                    <Skeleton className="h-10 w-40 rounded-md" />
                </div>

                {/* Analytics stat cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>

                {/* Courses table skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-7 w-36" />
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="grid grid-cols-4 bg-muted border-b px-4 py-3 gap-4">
                            {["Title", "Source", "Levels", "Actions"].map((col) => (
                                <Skeleton key={col} className="h-4 w-16" />
                            ))}
                        </div>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-4 px-4 py-4 gap-4 border-b last:border-0">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-5 w-16" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-14 rounded-md" />
                                    <Skeleton className="h-8 w-16 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8 space-y-10 hero-gradient">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">Teacher Portal</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        Curriculum Manager
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage curriculum and track student progress.</p>
                </div>
                <Button asChild className="rounded-full gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                    <Link href="/teacher/courses/new">
                        <PlusCircle className="h-4 w-4" />
                        Create New Course
                    </Link>
                </Button>
            </div>

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent -mt-2" />

            {/* Analytics Row */}
            <div className="grid gap-5 md:grid-cols-3">
                <AnalyticsCard
                    title="Total Students"
                    value={totalStudents.toString()}
                    description="Enrolled across all grades"
                    icon={Users}
                    trend="+10%"
                />
                <AnalyticsCard
                    title="Active Learners"
                    value={activeNow.toString()}
                    description="Currently online"
                    icon={Activity}
                />
                <AnalyticsCard
                    title="Completion Rate"
                    value={completionRate}
                    description="Average module completion"
                    icon={BookOpen}
                    trend="+2.5%"
                />
            </div>

            {/* Course Management */}
            <section>
                <h2 className="text-lg font-semibold tracking-tight mb-4 text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                    Your Courses
                </h2>
                <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/60 border-b border-border">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground tracking-wide">Title</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground tracking-wide">Source</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground tracking-wide">Levels</th>
                                <th className="px-5 py-3.5 font-semibold text-muted-foreground tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {allCourses.length > 0 ? (
                                allCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-muted/40 transition-colors duration-150">
                                        <td className="px-5 py-4 font-medium text-foreground">{course.title}</td>
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                                Mock Data
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground">{course.levels.length} Levels</td>
                                        <td className="px-5 py-4 flex gap-2">
                                            <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary">Edit</Button>
                                            <Button variant="ghost" size="sm" className="rounded-full text-destructive hover:bg-destructive/10">Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-muted-foreground">
                                        No courses found. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
