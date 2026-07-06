"use client";

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCog, LogOut, Bookmark } from "lucide-react"
import { AccessibilitySettings } from "@/components/features/accessibility-settings"
import { Logo } from "@/components/ui/logo"
import { useSession, signOut } from "next-auth/react"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { cn } from "@/lib/utils"

/** Nav links that get active-state highlighting */
const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/courses",   label: "Courses"   },
] as const;

export function Navbar() {
    const { data: session } = useSession();
    const { bookmarkedIds, isHydrated } = useBookmarks();
    const pathname = usePathname();
    const savedCount = bookmarkedIds.size;

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <nav
            aria-label="Main navigation"
            className="bg-background/95 sticky top-0 z-50 glass-morphism !border-0 shadow-sm"
        >
            <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto gap-6">
                {/* ── Logo ── */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                    aria-label="EqualEd home"
                >
                    <Logo />
                </Link>

                {/* ── Primary nav links (desktop) ── */}
                <div className="hidden md:flex items-center gap-1 flex-1">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
                                "hover:bg-accent hover:text-accent-foreground",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isActive(href)
                                    ? "nav-link-active text-primary"
                                    : "text-muted-foreground"
                            )}
                            aria-current={isActive(href) ? "page" : undefined}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* ── Right-side actions ── */}
                <div className="flex items-center gap-2 ml-auto">
                    <AccessibilitySettings />

                    {/* Saved Courses link with live badge */}
                    <Link href="/saved-courses" className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "gap-1.5 rounded-full px-3 transition-colors duration-150",
                                isActive("/saved-courses")
                                    ? "text-primary bg-primary/8"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            aria-label={
                                isHydrated && savedCount > 0
                                    ? `Saved courses, ${savedCount} bookmarked`
                                    : "Saved courses"
                            }
                        >
                            <Bookmark
                                className={cn(
                                    "h-4 w-4 transition-all duration-150",
                                    isHydrated && savedCount > 0
                                        ? "fill-primary text-primary"
                                        : ""
                                )}
                            />
                            <span className="hidden sm:inline text-sm font-medium">Saved</span>
                            {isHydrated && savedCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {savedCount > 9 ? "9+" : savedCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Auth section */}
                    {session ? (
                        <div className="flex items-center gap-2">
                            {session.user?.role === "teacher" && (
                                <Link href="/teacher">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors duration-150"
                                    >
                                        <UserCog className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Teacher Portal</span>
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => signOut()}
                                className="gap-1.5 rounded-full transition-colors duration-150"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 rounded-full transition-colors duration-150"
                            >
                                <UserCog className="h-3.5 w-3.5" />
                                Teacher Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
