"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MessageCircle, X, Send, ChevronDown, RefreshCw,
    Mic, MicOff, Volume2, VolumeX, Wifi, WifiOff,
    StopCircle, Trash2, Copy, Check, History
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAccessibility } from "../contexts/accessibility-context";
import { useTutorChat, Message } from "@/hooks/use-tutor-chat";
import { speechService } from "@/lib/voice/speech";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ConversationHistory } from "@/components/tutor/conversation-history";

export function AITutor() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const { fontSize, highContrast, reducedMotion } = useAccessibility();

    const getLessonTopic = (path: string) => {
        if (path.includes('math')) return 'Mathematics';
        if (path.includes('science')) return 'Science';
        if (path.includes('history')) return 'History';
        if (path.includes('reading')) return 'Reading';
        if (path.includes('asl')) return 'American Sign Language';
        return 'General Learning';
    };

    const {
        messages,
        isLoading,
        isConnected,
        error,
        sendMessage,
        stopGeneration,
        retryLastMessage,
        clearMessages
    } = useTutorChat({
        lessonTopic: getLessonTopic(pathname),
        pathname,
        accessibility: { fontSize, highContrast, reducedMotion }
    });

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Don't show on login page
    if (pathname === "/login") return null;

    const handleSend = (e?: React.FormEvent, overrideMsg?: string) => {
        e?.preventDefault();
        const msg = overrideMsg || input;
        if (!msg.trim()) return;

        setInput("");
        sendMessage(msg);
    };

    const toggleVoiceInput = () => {
        if (isListening) {
            speechService.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            speechService.start(
                (transcript) => {
                    setInput(prev => prev + transcript);
                },
                (error) => {
                    console.error("Voice input error:", error);
                    setIsListening(false);
                }
            );
        }
    };

    const speakMessage = (content: string) => {
        if (isSpeaking) {
            speechService.silence();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            speechService.speak(content);
            // Approximate duration (200ms per word)
            const duration = content.split(' ').length * 200;
            setTimeout(() => setIsSpeaking(false), duration);
        }
    };

    const copyToClipboard = async (content: string, messageId: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const QuickActions = [
        { label: "Explain simply", prompt: "Explain this concept simply, like I'm 5." },
        { label: "Give example", prompt: "Can you give me a real-world example of this?" },
        { label: "Summarize", prompt: "Please summarize the key points of this lesson." },
        { label: "Quiz me", prompt: "Ask me a revision question about this topic." },
    ];

    // Collapsed state - floating button
    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    !reducedMotion && "hover:scale-105 transition-transform"
                )}
                aria-label="Open EqualEd Tutor"
            >
                <MessageCircle className="h-8 w-8" />
                {/* Connection indicator dot */}
                <span
                    className={cn(
                        "absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                        isConnected === true && "bg-emerald-500",
                        isConnected === false && "bg-amber-500",
                        isConnected === null && "bg-muted-foreground"
                    )}
                    aria-label={isConnected ? "Connected to AI" : "Running in demo mode"}
                />
            </Button>
        );
    }

    return (
        <Card className={cn(
            "fixed bottom-6 right-6 w-80 md:w-96 h-[600px] shadow-2xl z-50 flex flex-col",
            "border border-border/50 glass-morphism",
            !reducedMotion && "animate-in slide-in-from-bottom-10 fade-in"
        )}>
            {/* Header - Deep Teal */}
            <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl flex flex-row justify-between items-center space-y-0 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2 text-primary-foreground">
                            Lumina Tutor
                            {isConnected ? (
                                <Wifi className="h-4 w-4 text-emerald-300" aria-label="Connected" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-amber-300" aria-label="Demo mode" />
                            )}
                        </CardTitle>
                        <p className="text-xs text-primary-foreground/80 opacity-90">
                            {isConnected ? "AI-powered" : "Demo mode"} • {getLessonTopic(pathname)}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-primary-foreground hover:bg-white/20 h-8 w-8"
                        title="Learning progress"
                    >
                        <History className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearMessages}
                        className="text-primary-foreground hover:bg-white/20 h-8 w-8"
                        title="Clear conversation"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-primary-foreground hover:bg-white/20 h-8 w-8"
                    >
                        <ChevronDown className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden bg-background/50 backdrop-blur-sm flex flex-col">
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    ref={scrollRef}
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                >
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onSpeak={() => speakMessage(msg.content)}
                            onCopy={() => copyToClipboard(msg.content, msg.id)}
                            isSpeaking={isSpeaking}
                            isCopied={copiedId === msg.id}
                            reducedMotion={reducedMotion}
                        />
                    ))}

                    {/* Loading indicator */}
                    {isLoading && messages[messages.length - 1]?.content === '' && (
                        <div className="flex justify-start">
                            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-none text-muted-foreground text-sm flex items-center gap-2 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span>Thinking...</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={stopGeneration}
                                    className="h-6 px-2 text-destructive hover:text-destructive/90"
                                >
                                    <StopCircle className="h-3 w-3 mr-1" />
                                    Stop
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Error with retry */}
                    {error && (
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={retryLastMessage}
                                className="text-destructive border-destructive/50 hover:bg-destructive/10"
                            >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="p-2 bg-muted/30 backdrop-blur-sm border-t border-border">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex w-max space-x-2 p-1">
                            {QuickActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(undefined, action.prompt)}
                                    disabled={isLoading}
                                    className={cn(
                                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                                        "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10",
                                        "dark:border-primary/30 dark:bg-primary/10 dark:text-primary-foreground",
                                        isLoading && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>

            {/* Input Footer */}
            <CardFooter className="p-3 bg-card border-t border-border">
                <form onSubmit={handleSend} className="flex gap-2 w-full">
                    {/* Voice input button */}
                    <Button
                        type="button"
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={toggleVoiceInput}
                        className={cn("shrink-0", isListening && "animate-pulse")}
                        title={isListening ? "Stop listening" : "Voice input"}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Ask a question..."}
                        className="flex-1 bg-background"
                        disabled={isLoading}
                        autoFocus
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="bg-primary hover:bg-primary/90 shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>

            {/* Conversation History Panel */}
            <ConversationHistory
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
            />
        </Card>
    );
}

// Message Bubble Component with Markdown rendering
interface MessageBubbleProps {
    message: Message;
    onSpeak: () => void;
    onCopy: () => void;
    isSpeaking: boolean;
    isCopied: boolean;
    reducedMotion: boolean;
}

function MessageBubble({ message, onSpeak, onCopy, isSpeaking, isCopied, reducedMotion }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed group relative",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border border-border text-card-foreground rounded-bl-none shadow-sm"
                )}
            >
                {/* Message content */}
                {isUser ? (
                    <p>{message.content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Custom code block styling
                                code: ({ className, children, ...props }) => {
                                    const isInline = !className;
                                    return isInline ? (
                                        <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code className={cn("block bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-x-auto", className)} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                // Ensure links open in new tab
                                a: ({ children, href, ...props }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline" {...props}>
                                        {children}
                                    </a>
                                )
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
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSpeak}
                            className="h-6 px-2 text-xs"
                            title="Read aloud"
                        >
                            {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCopy}
                            className="h-6 px-2 text-xs"
                            title="Copy to clipboard"
                        >
                            {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
