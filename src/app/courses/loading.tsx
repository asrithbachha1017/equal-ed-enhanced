// Next.js will automatically show this while /courses page is loading.
// Mirrors the heading + 3-column card grid from app/courses/page.tsx.
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Navbar placeholder */}
            <div className="h-16 border-b bg-background" />

            <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-8">
                {/* Page heading */}
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-[520px] max-w-full" />
                </div>

                {/* Search bar placeholder */}
                <Skeleton className="h-10 w-full max-w-md rounded-md" />

                {/* Course card grid — 3 columns matching the real layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900"
                        >
                            {/* Badge + icon row */}
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-5 w-5 rounded" />
                            </div>
                            {/* Title */}
                            <Skeleton className="h-7 w-3/4" />
                            {/* Description */}
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            {/* Dataset rows */}
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            {/* CTA button */}
                            <Skeleton className="h-10 w-full rounded-md mt-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
