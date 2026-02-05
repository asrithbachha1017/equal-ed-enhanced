"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Loader2, Send, Bot, X, Mic, MicOff,
    Volume2, VolumeX, Copy, Check, RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTutorChat, Message } from '@/hooks/use-tutor-chat';
import { useAccessibility } from '@/contexts/accessibility-context';
import { speechService } from '@/lib/voice/speech';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatAssistantProps {
    context?: string; // Optional educational content context
    lessonTopic?: string;
    courseId?: string;
    moduleId?: string;
}

export function ChatAssistant({ context, lessonTopic, courseId, moduleId }: ChatAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Access accessibility settings
    const { fontSize, highContrast, reducedMotion } = useAccessibility();

    // Use the tutor chat hook with streaming support
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
        lessonTopic: lessonTopic || 'General Learning',
        courseId,
        moduleId,
        accessibility: { fontSize, highContrast, reducedMotion }
    });

    // Auto-scroll to bottom when messages change
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

    const handleSubmit = (e?: React.FormEvent, overrideMsg?: string) => {
        e?.preventDefault();
        const msg = overrideMsg || input;
        if (!msg.trim() || isLoading) return;

        setInput('');
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
            // Approximate duration
            const duration = content.split(' ').length * 200;
            setTimeout(() => setIsSpeaking(false), duration);
        }
    };

    const copyToClipboard = async (content: string, messageId: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Quick action buttons for common requests
    const QuickActions = [
        { label: "Explain simply", prompt: "Explain this concept simply, like I'm 5." },
        { label: "Give example", prompt: "Can you give me a real-world example?" },
        { label: "Step by step", prompt: "Please explain this step by step." },
        { label: "Quiz me", prompt: "Ask me a question to test my understanding." },
    ];

    // Collapsed state - floating button
    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-xl z-50 p-0",
                    "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                    !reducedMotion && "hover:scale-105 transition-transform"
                )}
                aria-label="Open Learning Assistant"
            >
                <div className="relative h-10 w-10">
                    <Image
                        src="/chatbot-icon.png"
                        alt="AI Assistant"
                        fill
                        className="object-contain"
                        priority
                        onError={(e) => {
                            // Fallback to Bot icon if image fails
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <Bot className="h-8 w-8 text-white absolute inset-0 m-auto" />
                </div>
                {/* Connection status indicator */}
                <span
                    className={cn(
                        "absolute top-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white",
                        isConnected === true && "bg-green-500",
                        isConnected === false && "bg-amber-500",
                        isConnected === null && "bg-gray-400"
                    )}
                    aria-label={isConnected ? "Connected to AI" : "Running in demo mode"}
                />
            </Button>
        );
    }

    return (
        <Card className={cn(
            "fixed bottom-6 right-6 w-80 md:w-96 h-[550px] flex flex-col shadow-2xl z-50",
            "border-2 border-indigo-100 dark:border-indigo-900",
            !reducedMotion && "animate-in slide-in-from-bottom-10 fade-in duration-300"
        )}>
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6" aria-hidden="true" />
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            Learning Assistant
                            {isConnected ? (
                                <Wifi className="h-4 w-4 text-green-300" aria-label="Connected" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-amber-300" aria-label="Demo mode" />
                            )}
                        </CardTitle>
                        <p className="text-xs text-indigo-100 opacity-90">
                            {isConnected ? "AI-powered" : "Demo mode"} • {lessonTopic || 'Ready to help'}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                    aria-label="Close chat"
                >
                    <X className="h-5 w-5" />
                </Button>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    ref={scrollRef}
                    role="log"
                    aria-live="polite"
                    aria-label="Chat History"
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
                            <div className="bg-white dark:bg-slate-900 border px-4 py-3 rounded-2xl rounded-bl-none text-slate-400 text-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={stopGeneration}
                                    className="h-6 px-2 text-red-500 hover:text-red-600"
                                >
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
                                className="text-amber-600 border-amber-300"
                            >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Try again
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-indigo-50 dark:border-slate-800">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex w-max space-x-2 p-1">
                            {QuickActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSubmit(undefined, action.prompt)}
                                    disabled={isLoading}
                                    className={cn(
                                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                        "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
                                        "dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
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
            <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                    {/* Voice input button */}
                    <Button
                        type="button"
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={toggleVoiceInput}
                        className={cn("shrink-0", isListening && !reducedMotion && "animate-pulse")}
                        title={isListening ? "Stop listening" : "Voice input"}
                        aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Ask a question..."}
                        className="flex-1"
                        disabled={isLoading}
                        aria-label="Type your question"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 shrink-0"
                        aria-label="Send message"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
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
                            remarkPlugins={[remarkGfm]}
                            components={{
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
                            aria-label="Read message aloud"
                        >
                            {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCopy}
                            className="h-6 px-2 text-xs"
                            title="Copy to clipboard"
                            aria-label="Copy message"
                        >
                            {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
