// Route-level loading skeleton for /saved-courses.
// Mirrors the page heading + 3-column course-card grid.
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedCoursesLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="h-16 border-b bg-background" />
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-8">
                {/* Heading */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-10 w-56" />
                    </div>
                    <Skeleton className="h-6 w-[480px] max-w-full" />
                </div>
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-4 rounded-xl border p-5 bg-white dark:bg-slate-900">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-5 w-5 rounded" />
                            </div>
                            <Skeleton className="h-7 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-10 w-full rounded-md mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
