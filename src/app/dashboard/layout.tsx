export const dynamic = 'force-dynamic';

import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 w-full items-stretch">
                <aside className="hidden md:block w-64 shrink-0 h-full">
                    <Sidebar />
                </aside>
                <main className="flex-1 w-full p-6 md:p-8 pt-24">
                    {children}
                </main>
            </div>
        </div>
    )
}


