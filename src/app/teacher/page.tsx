"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/teacher/analytics-card";
import { Users, BookOpen, Activity, PlusCircle } from "lucide-react";
import { MOCK_DB } from "@/lib/mock-db"; // We'll access the mock DB to list courses

export default function TeacherDashboard() {
    // Mock Analytics Data
    const totalStudents = 142;
    const activeNow = 12;
    const completionRate = "78%";

    // Get all courses directly
    const allCourses = MOCK_DB.courses;

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
