// Next.js route-level loading UI for /teacher.
// Mirrors the Teacher Portal layout:
//   - Header row (title + Create button)
//   - 3 analytics stat cards
//   - Courses table with 4 columns
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherLoading() {
    return (
        <div className="min-h-screen bg-background p-8 space-y-8">
            {/* Header row */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            {/* Analytics stat cards (3-column) */}
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card p-5 space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                ))}
            </div>

            {/* Courses table */}
            <section className="space-y-4">
                <Skeleton className="h-7 w-36" />
                <div className="rounded-xl border bg-card overflow-hidden">
                    {/* Table head */}
                    <div className="grid grid-cols-4 bg-muted border-b px-4 py-3 gap-4">
                        {["Title", "Source", "Levels", "Actions"].map((col) => (
                            <Skeleton key={col} className="h-4 w-16" />
                        ))}
                    </div>
                    {/* Table rows */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-4 px-4 py-4 gap-4 border-b last:border-0"
                        >
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-16" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-14 rounded-md" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
