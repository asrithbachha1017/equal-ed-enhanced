import { Navbar } from "@/components/layout/navbar";
import { MOCK_DB } from "@/lib/mock-db";
import { CourseSearchGrid } from "@/components/course/course-search-grid";
import { BookOpen } from "lucide-react";

export const metadata = {
    title: "Courses | EqualEd",
    description: "Explore our AI-driven curriculum.",
};

export default function CoursesIndexPage() {
    return (
        <main className="min-h-screen bg-background hero-gradient">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-14 pb-24 space-y-10">

                {/* ── Page header ── */}
                <div className="space-y-4">
                    {/* Icon + label row */}
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary shrink-0">
                            <BookOpen className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                            Curriculum Library
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                        Available Courses
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Explore our dataset-driven curriculum designed to teach critical
                        thinking and AI literacy across every grade level.
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent mt-2" />
                </div>

                {/* Client component owns search state; page itself stays a Server Component */}
                <CourseSearchGrid courses={MOCK_DB.courses} variant="default" />
            </div>
        </main>
    );
}
