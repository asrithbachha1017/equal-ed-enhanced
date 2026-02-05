"use client";


import React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, UserCog, LogOut } from "lucide-react"
import { AccessibilitySettings } from "@/components/features/accessibility-settings"
import { Logo } from "@/components/ui/logo"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-background/95 sticky top-0 z-50 glass-morphism !border-0 shadow-sm">
            <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Logo />
                    </div>
                </Link>



                <div className="flex items-center gap-4">
                    <AccessibilitySettings />
                    <Link href="/dashboard">
                        <Button variant="ghost">Dashboard</Button>
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-2">
                            {session.user?.role === 'teacher' && (
                                <Link href="/teacher">
                                    <Button variant="outline" size="sm" className="gap-2 border-indigo-200 bg-indigo-50 text-indigo-700">
                                        <UserCog className="h-4 w-4" /> Teacher Portal
                                    </Button>
                                </Link>
                            )}
                            <Button variant="default" size="sm" onClick={() => signOut()} className="gap-2">
                                <LogOut className="h-4 w-4" /> Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm" className="gap-2">
                                <UserCog className="h-4 w-4" /> Teacher Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
