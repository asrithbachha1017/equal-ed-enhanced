"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Settings, Users, Bookmark } from "lucide-react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview",      href: "/dashboard"          },
    { icon: BookOpen,        label: "My Courses",    href: "/dashboard/courses"  },
    { icon: Bookmark,        label: "Saved Courses", href: "/saved-courses"      },
    { icon: Users,           label: "Students",      href: "/dashboard/students" },
    { icon: Settings,        label: "Settings",      href: "/dashboard/settings" },
]

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <aside
            aria-label="Sidebar navigation"
            className={cn(
                "pb-12 min-h-screen bg-background/80 backdrop-blur-sm border-r border-border/50",
                className
            )}
        >
            <div className="space-y-1 py-6 px-2">
                {/* Section label */}
                <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Learning
                </p>

                {sidebarItems.map((item) => {
                    const active = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                // Base — full-width flex row with icon
                                "group flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium",
                                "transition-all duration-150 ease-out",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                active
                                    ? "sidebar-item-active"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-4 w-4 shrink-0 transition-colors duration-150",
                                    active
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-accent-foreground"
                                )}
                            />
                            {item.label}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}
