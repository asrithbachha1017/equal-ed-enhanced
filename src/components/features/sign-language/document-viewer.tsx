"use client";

import { cn } from "@/lib/utils";
import { SignLanguageSegment } from "@/lib/sign-language/types";

interface DocumentViewerProps {
    segments: SignLanguageSegment[];
    currentSegmentId: string | null;
    onSegmentClick: (segmentId: string) => void;
}

export function DocumentViewer({
    segments,
    currentSegmentId,
    onSegmentClick
}: DocumentViewerProps) {
    return (
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none p-6 md:p-10 bg-card rounded-lg border shadow-sm min-h-[500px]">
            <div className="space-y-4">
                {segments.length === 0 ? (
                    <p className="text-muted-foreground italic">No content to display.</p>
                ) : (
                    <div className="leading-relaxed">
                        {segments.map((segment) => (
                            <span
                                key={segment.id}
                                id={`text-${segment.id}`}
                                onClick={() => onSegmentClick(segment.id)}
                                className={cn(
                                    "cursor-pointer transition-colors duration-200 px-1 rounded mx-0.5 inline-block hover:bg-primary/10",
                                    currentSegmentId === segment.id
                                        ? "bg-yellow-200 dark:bg-yellow-900/50 text-foreground ring-2 ring-yellow-400/50"
                                        : ""
                                )}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSegmentClick(segment.id);
                                    }
                                }}
                                aria-label={`Interpret segment: ${segment.text}`}
                            >
                                {segment.text}{" "}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
