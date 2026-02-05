"use client";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, FileText, Download, ShieldCheck, Eye, Mic, Keyboard } from "lucide-react";
import Link from "next/link";

export default function AccessibilityStatement() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Header with Visual Badge */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 mb-4 animate-in fade-in zoom-in duration-500">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="font-semibold">WCAG 2.1 AA Compliant</span> // Self-Declared
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Accessibility Statement
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        EqualEd is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone.
                    </p>
                </div>

                {/* Core Pillars */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-indigo-500" /> Visual Accessibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <FeatureItem text="High Contrast Mode for low-vision users" />
                            <FeatureItem text="Resizable Text (up to 200%) without overflow" />
                            <FeatureItem text="Dyslexia-friendly font toggle" />
                            <FeatureItem text="Screen Reader compatible (JAWS, NVDA, VoiceOver)" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mic className="h-5 w-5 text-indigo-500" /> Voice & Motor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <FeatureItem text="Complete Keyboard Navigation" />
                            <FeatureItem text="Voice Control for hands-free learning" />
                            <FeatureItem text="Reduced Motion support" />
                            <FeatureItem text="Focus indicators for all interactive elements" />
                        </CardContent>
                    </Card>
                </div>

                {/* Research Validation Section */}
                <Card className="bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900">
                    <CardHeader>
                        <CardTitle>Research & Validation</CardTitle>
                        <CardDescription>
                            We log anonymous usage data to verify the effectiveness of our accessibility interventions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4 items-start">
                        <Button className="gap-2" onClick={() => alert("Downloading Accessibility_Test_Report_v1.2.pdf...")}>
                            <FileText className="h-4 w-4" /> Download Test Report (PDF)
                        </Button>
                        <div className="text-xs text-muted-foreground mt-2 sm:mt-0">
                            Report covers testing with WAVE, Axe DevTools, and manual user testing with 5 visually impaired students.
                        </div>
                    </CardContent>
                </Card>

                {/* Contact */}
                <div className="text-center text-sm text-slate-500">
                    <p>
                        Feedback is welcome. Please report issues to <a href="mailto:access@equaled.org" className="text-primary hover:underline">access@equaled.org</a>.
                    </p>
                    <p className="mt-2">Last updated: January 2026</p>
                </div>
            </div>
        </main>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
}
