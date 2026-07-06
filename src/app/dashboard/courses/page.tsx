
"use client";

import { MOCK_DB } from "@/lib/mock-db";
import { CourseSearchGrid } from "@/components/course/course-search-grid";
import { Database } from "lucide-react";

export default function CoursesPage() {
    return (
        <div className="space-y-10">
            {/* ── Page header ── */}
            <div className="space-y-4">
                {/* Icon + label row */}
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                        <Database className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                        Course Library
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                    Access Course Library
                </h1>
                <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
                    Master subjects using real-world datasets and AI-powered
                    verification. Search, filter, and bookmark courses below.
                </p>

                {/* Gradient divider */}
                <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            </div>

            {/* CourseSearchGrid handles real-time filtering internally */}
            <CourseSearchGrid courses={MOCK_DB.courses} variant="dashboard" />
        </div>
    );
}
