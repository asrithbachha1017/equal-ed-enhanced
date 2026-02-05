"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// A simple Slider component replacing Radix UI to avoid dependency issues
// Props are compatible with Radix UI Slider for drop-in replacement
// Omit 'value' from InputHTMLAttributes because we want to redefine it as number[]
interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
    value?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {

        // Handle both controlled and uncontrolled usage if needed, but here simple mapping
        const currentValue = value ? value[0] : 0;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = parseFloat(e.target.value);
            if (onValueChange) {
                onValueChange([newVal]);
            }
        };

        return (
            <input
                type="range"
                ref={ref}
                className={cn(
                    "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
                    className
                )}
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleChange}
                {...props}
            />
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
