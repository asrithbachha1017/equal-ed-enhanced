export const dynamic = 'force-dynamic';

import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <div className="flex flex-1 w-full">
                {/* Sidebar — hidden on mobile, fixed-width on md+ */}
                <aside className="hidden md:block w-60 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)]">
                    <Sidebar />
                </aside>

                {/* Main content — consumes remaining width */}
                <main
                    id="dashboard-main"
                    className="flex-1 min-w-0 p-6 md:p-8 pt-8"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
