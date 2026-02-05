import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Loader2 } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "secondary" | "outline" | "ghost" | "link" | "glass"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, isLoading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        if (asChild) {
            return (
                <Slot
                    className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                        {
                            "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
                            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
                            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
                            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
                            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
                            "text-primary underline-offset-4 hover:underline": variant === "link",
                            "glass-panel hover:bg-white/10 text-foreground": variant === "glass",
                            "h-10 px-4 py-2": size === "default",
                            "h-9 rounded-md px-3": size === "sm",
                            "h-11 rounded-md px-8": size === "lg",
                            "h-10 w-10": size === "icon",
                        },
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Slot>
            )
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    {
                        "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
                        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
                        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
                        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
                        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
                        "text-primary underline-offset-4 hover:underline": variant === "link",
                        "glass-panel hover:bg-white/10 text-foreground": variant === "glass",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    {
                        "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
                        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
                        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
                        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
                        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
                        "text-primary underline-offset-4 hover:underline": variant === "link",
                        "glass-panel hover:bg-white/10 text-foreground": variant === "glass",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
