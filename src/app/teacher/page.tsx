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
        <div className="min-h-screen bg-background p-8 space-y-8">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Teacher Portal
                    </h1>
                    <p className="text-muted-foreground">Manage curriculum and track student progress.</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/teacher/courses/new">
                        <span className="flex items-center">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Course
                        </span>
                    </Link>
                </Button>
            </div>

            {/* Analytics Row */}
            <div className="grid gap-4 md:grid-cols-3">
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
                <h2 className="text-xl font-bold mb-4 text-foreground">Your Courses</h2>
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-muted border-b border-border">
                            <tr>
                                <th className="p-4 font-semibold text-muted-foreground">Title</th>
                                <th className="p-4 font-semibold text-muted-foreground">Source</th>
                                <th className="p-4 font-semibold text-muted-foreground">Levels</th>
                                <th className="p-4 font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {allCourses.length > 0 ? (
                                allCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="p-4 font-medium text-foreground">{course.title}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                                                Mock Data
                                            </span>
                                        </td>
                                        <td className="p-4 text-foreground">{course.levels.length} Levels</td>
                                        <td className="p-4 flex gap-2">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
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
