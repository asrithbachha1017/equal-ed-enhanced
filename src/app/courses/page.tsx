import { Navbar } from "@/components/layout/navbar";
import { MOCK_DB } from "@/lib/mock-db";
import { CourseSearchGrid } from "@/components/course/course-search-grid";

export const metadata = {
    title: "Courses | IASF-2K26",
    description: "Explore our AI-driven curriculum.",
};

export default function CoursesIndexPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Available Courses
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                        Explore our dataset-driven curriculum designed to teach critical thinking and AI literacy.
                    </p>
                </div>

                {/* Client component owns search state; page itself stays a Server Component */}
                <CourseSearchGrid courses={MOCK_DB.courses} variant="default" />
            </div>
        </main>
    );
}
