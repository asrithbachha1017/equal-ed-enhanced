// Next.js route-level loading UI for /dashboard/courses.
// Mirrors the "Access Course Library" heading + 3-column card grid
// with level/dataset rows inside each card.
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardCoursesLoading() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Page heading */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96 max-w-full" />
            </div>

            {/* Search bar placeholder (matches CourseSearchGrid) */}
            <Skeleton className="h-10 w-full max-w-md rounded-md" />

            {/* Course card grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col space-y-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 p-5 bg-card"
                    >
                        {/* Icon + badge row */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        {/* Title */}
                        <Skeleton className="h-6 w-3/4" />
                        {/* Description */}
                        <Skeleton className="h-4 w-full" />

                        {/* Levels & Datasets section */}
                        <div className="space-y-3 pt-2">
                            <Skeleton className="h-4 w-32" />
                            {[1, 2].map((j) => (
                                <div
                                    key={j}
                                    className="p-3 bg-secondary/50 rounded-lg space-y-2"
                                >
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            ))}
                        </div>

                        {/* CTA button */}
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
}
