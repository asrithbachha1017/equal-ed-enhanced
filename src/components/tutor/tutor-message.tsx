"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Volume2, VolumeX, ThumbsUp, ThumbsDown } from "lucide-react";
import { speechService } from "@/lib/voice/speech";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";

export interface TutorMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

interface TutorMessageBubbleProps {
    message: TutorMessage;
    reducedMotion?: boolean;
    onFeedback?: (messageId: string, helpful: boolean) => void;
}

export function TutorMessageBubble({ message, reducedMotion, onFeedback }: TutorMessageBubbleProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [feedback, setFeedback] = useState<boolean | null>(null);

    const isUser = message.role === 'user';

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopiedId(message.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const speakMessage = () => {
        if (isSpeaking) {
            speechService.silence();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            speechService.speak(message.content);
            const duration = message.content.split(' ').length * 200;
            setTimeout(() => setIsSpeaking(false), duration);
        }
    };

    const handleFeedback = (helpful: boolean) => {
        setFeedback(helpful);
        onFeedback?.(message.id, helpful);
    };

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed group relative",
                    isUser
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
                )}
            >
                {/* Message content */}
                {isUser ? (
                    <p>{message.content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                // Custom code block styling
                                code: ({ className, children, ...props }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                        <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-xs overflow-x-auto my-2">
                                            <code className={cn("font-mono", className)} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    );
                                },
                                // Math block styling (for display math)
                                p: ({ children, ...props }) => (
                                    <p className="my-1" {...props}>{children}</p>
                                ),
                                // Ensure links open in new tab
                                a: ({ children, href, ...props }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline"
                                        {...props}
                                    >
                                        {children}
                                    </a>
                                ),
                                // Better list styling
                                ul: ({ children, ...props }) => (
                                    <ul className="list-disc list-inside space-y-0.5" {...props}>{children}</ul>
                                ),
                                ol: ({ children, ...props }) => (
                                    <ol className="list-decimal list-inside space-y-0.5" {...props}>{children}</ol>
                                ),
                                // Better heading styling
                                h1: ({ children, ...props }) => (
                                    <h1 className="text-lg font-bold mt-3 mb-1" {...props}>{children}</h1>
                                ),
                                h2: ({ children, ...props }) => (
                                    <h2 className="text-base font-bold mt-2 mb-1" {...props}>{children}</h2>
                                ),
                                h3: ({ children, ...props }) => (
                                    <h3 className="text-sm font-bold mt-2 mb-1" {...props}>{children}</h3>
                                ),
                                // Better blockquote styling
                                blockquote: ({ children, ...props }) => (
                                    <blockquote
                                        className="border-l-4 border-indigo-300 dark:border-indigo-700 pl-3 my-2 italic text-slate-600 dark:text-slate-400"
                                        {...props}
                                    >
                                        {children}
                                    </blockquote>
                                ),
                                // Better table styling
                                table: ({ children, ...props }) => (
                                    <div className="overflow-x-auto my-2">
                                        <table className="min-w-full border-collapse border border-slate-200 dark:border-slate-700 text-xs" {...props}>
                                            {children}
                                        </table>
                                    </div>
                                ),
                                th: ({ children, ...props }) => (
                                    <th className="border border-slate-200 dark:border-slate-700 px-2 py-1 bg-slate-100 dark:bg-slate-800 font-semibold" {...props}>
                                        {children}
                                    </th>
                                ),
                                td: ({ children, ...props }) => (
                                    <td className="border border-slate-200 dark:border-slate-700 px-2 py-1" {...props}>
                                        {children}
                                    </td>
                                ),
                            }}
                        >
                            {message.content || (message.isStreaming ? '▌' : '')}
                        </ReactMarkdown>
                    </div>
                )}

                {/* Streaming cursor */}
                {message.isStreaming && message.content && (
                    <span className={cn("inline-block w-2 h-4 bg-indigo-500 ml-0.5", !reducedMotion && "animate-pulse")} />
                )}

                {/* Action buttons for assistant messages */}
                {!isUser && !message.isStreaming && message.content && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={speakMessage}
                            className="h-7 px-2 text-xs"
                            title="Read aloud"
                        >
                            {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                            className="h-7 px-2 text-xs"
                            title="Copy to clipboard"
                        >
                            {copiedId === message.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>

                        <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />

                        {/* Feedback buttons */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(true)}
                            className={cn(
                                "h-7 px-2 text-xs",
                                feedback === true && "bg-green-100 dark:bg-green-900 text-green-600"
                            )}
                            title="Helpful"
                        >
                            <ThumbsUp className={cn("h-3 w-3", feedback === true && "fill-current")} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback(false)}
                            className={cn(
                                "h-7 px-2 text-xs",
                                feedback === false && "bg-red-100 dark:bg-red-900 text-red-600"
                            )}
                            title="Not helpful"
                        >
                            <ThumbsDown className={cn("h-3 w-3", feedback === false && "fill-current")} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
