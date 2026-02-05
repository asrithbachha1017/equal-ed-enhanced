"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    showText?: boolean
    size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md", ...props }: LogoProps) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    }

    const textSizeClasses = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-3xl",
    }

    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            <div className={cn("relative text-indigo-600 dark:text-indigo-400", sizeClasses[size])}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full"
                    aria-hidden="true"
                >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M10 10h6" />
                    <path d="M10 6h6" />
                    <path d="M10 14h6" />
                </svg>
            </div>
            {showText && (
                <span className={cn("font-bold tracking-tight text-foreground", textSizeClasses[size])}>
                    EqualEd
                </span>
            )}
        </div>
    )
}
