"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

export interface TutorChatState {
    messages: Message[];
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
}

interface UseTutorChatOptions {
    lessonTopic?: string;
    subject?: string;
    pathname?: string;
    courseId?: string;
    moduleId?: string;
    accessibility?: {
        fontSize?: string;
        highContrast?: boolean;
        reducedMotion?: boolean;
    };
    onMessage?: (message: Message) => void;
}

export function useTutorChat(options: UseTutorChatOptions = {}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm Lumina, your EqualEd Tutor. I can help explain your lessons in a way that works best for you. Try asking me to explain something simply!",
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    // Check connection status on mount
    useEffect(() => {
        checkConnectionStatus();
    }, []);

    const checkConnectionStatus = async () => {
        try {
            const res = await fetch('/api/ai/status');
            const data = await res.json();
            setIsConnected(data.connected);
        } catch {
            setIsConnected(false);
        }
    };

    const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        setError(null);

        // Add user message
        const userMessage: Message = {
            id: generateMessageId(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Create placeholder for assistant response
        const assistantId = generateMessageId();
        const assistantMessage: Message = {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true
        };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            // Cancel any ongoing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/tutor/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content.trim(),
                    history: messages.filter(m => m.id !== 'welcome').map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    lessonTopic: options.lessonTopic,
                    subject: options.subject,
                    pathname: options.pathname,
                    courseId: options.courseId,
                    moduleId: options.moduleId,
                    accessibility: options.accessibility
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response');
            }

            // Handle SSE streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) {
                                throw new Error(data.error);
                            }

                            if (data.done) {
                                // Streaming complete
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId
                                        ? { ...m, isStreaming: false }
                                        : m
                                ));
                            } else if (data.content) {
                                fullContent += data.content;
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId
                                        ? { ...m, content: fullContent }
                                        : m
                                ));
                            }
                        } catch (parseError) {
                            // Ignore parse errors for incomplete chunks
                        }
                    }
                }
            }

            // Call onMessage callback if provided
            if (options.onMessage) {
                options.onMessage({
                    id: assistantId,
                    role: 'assistant',
                    content: fullContent,
                    timestamp: new Date()
                });
            }

        } catch (err: any) {
            if (err.name === 'AbortError') {
                // Request was cancelled, ignore
                return;
            }

            const errorMessage = err.message || "Sorry, I'm having trouble connecting right now.";
            setError(errorMessage);

            // Update the assistant message with error
            setMessages(prev => prev.map(m =>
                m.id === assistantId
                    ? { ...m, content: errorMessage, isStreaming: false }
                    : m
            ));
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading, options]);

    const stopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
        setMessages(prev => prev.map(m =>
            m.isStreaming ? { ...m, isStreaming: false } : m
        ));
    }, []);

    const retryLastMessage = useCallback(() => {
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        if (lastUserMessage) {
            // Remove the last assistant message (error response)
            setMessages(prev => prev.slice(0, -1));
            sendMessage(lastUserMessage.content);
        }
    }, [messages, sendMessage]);

    const clearMessages = useCallback(() => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm Lumina, your EqualEd Tutor. I can help explain your lessons in a way that works best for you. Try asking me to explain something simply!",
            timestamp: new Date()
        }]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        isConnected,
        error,
        sendMessage,
        stopGeneration,
        retryLastMessage,
        clearMessages,
        checkConnectionStatus
    };
}
