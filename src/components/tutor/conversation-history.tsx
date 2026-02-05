"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, X, Clock, BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationSummary {
    id: string;
    question: string;
    topic?: string;
    subject?: string;
    helpful?: boolean | null;
    createdAt: string;
}

interface TutorAnalytics {
    summary: {
        totalQuestions: number;
        averageResponseTime: number;
        topicsExplored: number;
        helpfulRating: number;
        streakDays: number;
    };
    topSubjects: Array<{ subject: string; count: number; percentage: number }>;
    topTopics: Array<{ topic: string; count: number }>;
    recentInteractions: ConversationSummary[];
    learningInsights: string[];
}

interface ConversationHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConversationHistory({ isOpen, onClose }: ConversationHistoryProps) {
    const [analytics, setAnalytics] = useState<TutorAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'history' | 'insights'>('history');

    useEffect(() => {
        if (isOpen) {
            fetchAnalytics();
        }
    }, [isOpen]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tutor/analytics');
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Card className="fixed bottom-6 left-6 w-80 md:w-96 h-[500px] shadow-2xl z-50 flex flex-col border-2 border-slate-200 dark:border-slate-700 animate-in slide-in-from-left-10 fade-in">
            <CardHeader className="p-4 border-b flex flex-row justify-between items-center space-y-0 bg-slate-50 dark:bg-slate-900">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4 text-indigo-600" />
                    Learning Progress
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                        activeTab === 'history'
                            ? "border-b-2 border-indigo-600 text-indigo-600"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Recent Questions
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                        activeTab === 'insights'
                            ? "border-b-2 border-indigo-600 text-indigo-600"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Insights
                </button>
            </div>

            <CardContent className="flex-1 p-0 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                    </div>
                ) : analytics ? (
                    <ScrollArea className="h-full">
                        {activeTab === 'history' ? (
                            <div className="p-4 space-y-4">
                                {/* Stats Summary */}
                                <div className="grid grid-cols-3 gap-2">
                                    <StatCard
                                        icon={<BookOpen className="h-4 w-4" />}
                                        value={analytics.summary.totalQuestions}
                                        label="Questions"
                                    />
                                    <StatCard
                                        icon={<TrendingUp className="h-4 w-4" />}
                                        value={analytics.summary.topicsExplored}
                                        label="Topics"
                                    />
                                    <StatCard
                                        icon={<Clock className="h-4 w-4" />}
                                        value={`${analytics.summary.streakDays}d`}
                                        label="Streak"
                                    />
                                </div>

                                {/* Recent Questions */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Recent Questions
                                    </h4>
                                    <div className="space-y-2">
                                        {analytics.recentInteractions.map((interaction) => (
                                            <div
                                                key={interaction.id}
                                                className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"
                                            >
                                                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                                                    {interaction.question}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {interaction.topic && (
                                                        <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                                                            {interaction.topic}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-slate-400">
                                                        {formatTimeAgo(interaction.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Subjects */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Top Subjects
                                    </h4>
                                    <div className="space-y-2">
                                        {analytics.topSubjects.slice(0, 3).map((subject) => (
                                            <div key={subject.subject} className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium">{subject.subject}</span>
                                                        <span className="text-slate-500">{subject.count} questions</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                            style={{ width: `${subject.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 space-y-4">
                                {/* Learning Insights */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                        Personalized Tips
                                    </h4>
                                    <div className="space-y-3">
                                        {analytics.learningInsights.map((insight, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg border border-amber-100 dark:border-amber-900"
                                            >
                                                <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {insight}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Topics */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Topics You've Explored
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analytics.topTopics.map((topic) => (
                                            <span
                                                key={topic.topic}
                                                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
                                            >
                                                {topic.topic}
                                                <span className="ml-1 text-slate-400">({topic.count})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Helpful Rating */}
                                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                            Helpful Rating
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {Math.round(analytics.summary.helpfulRating * 100)}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        Based on your feedback
                                    </p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        No data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
    return (
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
            <div className="flex justify-center text-indigo-600 mb-1">{icon}</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-200">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
        </div>
    );
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}
