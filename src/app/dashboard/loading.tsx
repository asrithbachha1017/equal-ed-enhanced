// Next.js route-level loading UI for the /dashboard segment.
// Mirrors the dashboard layout: sidebar + main content area.
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar placeholder */}
            <div className="h-16 border-b bg-background shrink-0" />

            <div className="flex flex-1 w-full">
                {/* Sidebar placeholder */}
                <aside className="hidden md:flex flex-col w-64 shrink-0 border-r p-4 space-y-3">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full rounded-md" />
                    ))}
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 pt-8 space-y-8">
                    {/* Header row */}
                    <div className="flex justify-between items-start border-b pb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-56" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-28 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>

                    {/* 3 primary action buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-28 w-full rounded-xl" />
                        ))}
                    </div>

                    {/* Two-column lower section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Continue learning card */}
                        <div className="lg:col-span-2 space-y-4 rounded-xl border p-6">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                            <div className="space-y-1 pt-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <Skeleton className="h-4 w-full rounded-full" />
                            </div>
                            <Skeleton className="h-14 w-full rounded-md mt-4" />
                        </div>

                        {/* Side chart placeholder */}
                        <div className="space-y-4">
                            <Skeleton className="h-7 w-36" />
                            <Skeleton className="h-[350px] w-full rounded-xl" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
