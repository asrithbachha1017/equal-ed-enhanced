
"use client";

import { MOCK_DB } from "@/lib/mock-db";
import { CourseSearchGrid } from "@/components/course/course-search-grid";

export default function CoursesPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Access Course Library</h1>
                <p className="text-muted-foreground">Master subjects using real-world datasets and AI-powered verification.</p>
            </div>

            {/* CourseSearchGrid handles real-time filtering internally */}
            <CourseSearchGrid courses={MOCK_DB.courses} variant="dashboard" />
        </div>
    );
}

