"use client";

import React, { useEffect, useState } from "react";
import { MOCK_DB } from "@/lib/mock-db"; // Mock Data
import { useAccessibility } from "@/contexts/accessibility-context"; // Context
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"; // UI Components
import {
    BookOpen,
    ArrowRight,
    Database,
    Star,
    Mic,
    MicOff,
    Keyboard,
    Accessibility,
    HelpCircle,
    MessageSquare
} from "lucide-react"; // Icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Feedback
import { ProgressChart } from "@/components/analytics/progress-chart";
import { StudentOverviewPanel } from "@/components/dashboard/student-overview-panel";

export default function DashboardPage() {
    const router = useRouter();
    const { voiceNavigation, setVoiceNavigation } = useAccessibility();
    const [announcement, setAnnouncement] = useState("");
    const [showOverview, setShowOverview] = useState(true); // Auto-show on load

    // Mock Data for "Continue Learning"
    const activeCourse = MOCK_DB.courses.find(c => c.title.includes("Science")) || MOCK_DB.courses[0];
    const currentUser = MOCK_DB.students[0]; // Alice (Mock Logic)
    const activeLesson = "Planetary Orbits";
    const activeProgress = 65;

    // Initial Announcement (Blind User Orientation)
    useEffect(() => {
        announceContext();
    }, []);

    const announceContext = () => {
        const msg = `Dashboard loaded. Active Grade: 5. You have 1 course in progress. Voice assistance is ${voiceNavigation ? "On" : "Off"}.`;
        setAnnouncement(msg);
    };

    const handleVoiceToggle = (checked: boolean) => {
        setVoiceNavigation(checked);
        const status = checked ? "Voice Assistance Enabled" : "Voice Assistance Disabled";
        setAnnouncement(status);
        toast.info(status);
    };

    const handleAction = (label: string, route: string) => {
        setAnnouncement(`Navigating to ${label}...`);
        toast.success(`Opening ${label}...`);
        // Simulate backend delay
        setTimeout(() => {
            router.push(route);
        }, 500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* GLOBAL FEEDBACK REGION (Hidden) */}
            <div role="status" aria-live="assertive" className="sr-only">
                {announcement}
            </div>

            {/* SECTION 1: ORIENTATION & CONTEXT */}
            <header className="space-y-4 border-b pb-6" aria-labelledby="dashboard-heading">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 id="dashboard-heading" className="text-4xl font-bold text-foreground" tabIndex={0}>
                            Student Dashboard
                        </h1>
                        <div className="flex flex-wrap gap-3 mt-2 text-muted-foreground">
                            <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/50">
                                Active Grade: 5
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/50">
                                Role: Student
                            </Badge>
                            <span className="text-sm flex items-center gap-1">
                                <Keyboard className="h-4 w-4" /> Keyboard Navigation: Active
                            </span>
                        </div>
                    </div>

                    {/* Accessibility Status Summary */}
                    <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border border-border">
                        <span className="text-sm font-medium px-2">Voice:</span>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="header-voice-toggle"
                                checked={voiceNavigation}
                                onCheckedChange={handleVoiceToggle}
                                aria-label="Toggle Voice Assistance"
                            />
                            <Label htmlFor="header-voice-toggle" className="text-sm cursor-pointer">
                                {voiceNavigation ? "On" : "Off"}
                            </Label>
                        </div>
                    </div>
                </div>
            </header>

            {/* SECTION 2: PRIMARY ACTIONS */}
            <nav aria-label="Primary Dashboard Actions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        size="lg"
                        variant="default"
                        className="h-auto py-6 flex flex-col gap-2 items-center text-center shadow-md bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => handleAction("All Courses", "/dashboard/courses")}
                    >
                        <Database className="h-8 w-8 mb-1" />
                        <span className="text-lg font-semibold">Browse All Courses</span>
                        <span className="text-indigo-200 text-xs font-normal">Explore Data-Driven Lessons</span>
                    </Button>

                    <Button
                        size="lg"
                        variant="default"
                        className="h-auto py-6 flex flex-col gap-2 items-center text-center shadow-md bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleAction("Sign Language Practice", "/monitor?mode=practice")}
                    >
                        <Star className="h-8 w-8 mb-1" />
                        <span className="text-lg font-semibold">Practice Sign Language</span>
                        <span className="text-emerald-200 text-xs font-normal">AI-Powered Gesture Lab</span>
                    </Button>

                    <Button
                        size="lg"
                        variant="secondary"
                        className="h-auto py-6 flex flex-col gap-2 items-center text-center shadow-sm border border-border"
                        onClick={() => handleAction("Accessibility Settings", "/accessibility")}
                    >
                        <Accessibility className="h-8 w-8 mb-1" />
                        <span className="text-lg font-semibold">Accessibility Settings</span>
                        <span className="text-muted-foreground text-xs font-normal">Adjust Text, Voice & Contrast</span>
                    </Button>
                </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">
                    {/* SECTION 3: CONTINUE LEARNING */}
                    <section aria-labelledby="continue-heading" className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6 glass-morphism">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h2 id="continue-heading" className="text-2xl font-bold">Continue Learning</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-3xl font-bold text-foreground mb-1">{activeCourse.title}</h3>
                                <p className="text-xl text-muted-foreground">Lesson: <span className="font-medium text-foreground">{activeLesson}</span></p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span aria-hidden="true">Progress</span>
                                    <span>{activeProgress}% Complete</span>
                                </div>
                                <div
                                    className="h-4 w-full bg-muted rounded-full overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={activeProgress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`Course Progress: ${activeProgress}%`}
                                >
                                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${activeProgress}%` }} />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14"
                                    onClick={() => handleAction(`Resuming ${activeCourse.title}`, `/courses/${activeCourse.id}`)}
                                >
                                    Resume Lesson <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: ASSISTANCE & HELP (Moved Up) */}
                    <section aria-labelledby="help-heading" className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900">
                        <h2 id="help-heading" className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                            <HelpCircle className="h-5 w-5" /> Need Assistance?
                        </h2>

                        <div className="space-y-6">
                            <div className="text-sm italic text-indigo-800 dark:text-indigo-200 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                <span className="font-bold block not-italic mb-1">💡 Access Tip:</span>
                                Use 'Tab' to navigate graphs and 'Enter' to announce data points.
                            </div>

                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
                                onClick={() => handleAction("Help Chat", "/help")}
                            >
                                <MessageSquare className="h-4 w-4" /> Start Support Chat
                            </Button>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* SECTION 5: LEARNING PROGRESS GRAPH */}
                    <section aria-labelledby="observation-heading" className="space-y-4">
                        <div id="observation-heading" className="sr-only">Learning Observation</div>
                        <ProgressChart />
                    </section>
                </div>
            </div>

            {/* AUTOMATED STUDENT OVERVIEW PANEL */}
            <StudentOverviewPanel
                isOpen={showOverview}
                onClose={() => setShowOverview(false)}
                student={currentUser}
            />
        </div>
    );
}
