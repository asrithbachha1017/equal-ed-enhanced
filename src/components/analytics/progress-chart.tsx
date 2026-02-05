"use client";

import { useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, GraduationCap, Eye } from "lucide-react";

// MOCK DATA: Time-series learning data
const STUDENT_DATA = [
    { module: "Mod 1", mastery: 45, avg: 50, date: "Jan 1" },
    { module: "Mod 2", mastery: 52, avg: 55, date: "Jan 3" },
    { module: "Mod 3", mastery: 48, avg: 60, date: "Jan 5" }, // Drop-off
    { module: "Mod 4", mastery: 65, avg: 65, date: "Jan 8" }, // Recovery
    { module: "Mod 5", mastery: 78, avg: 70, date: "Jan 10" },
    { module: "Mod 6", mastery: 82, avg: 75, date: "Jan 12" },
];

// Teacher View Aggregations (Mock)
const CLASS_DATA = STUDENT_DATA.map(d => ({ ...d, mastery: d.avg, avg: d.avg })); // Just using avg as main line

export function ProgressChart() {
    const [viewMode, setViewMode] = useState<"student" | "teacher">("student");
    const data = viewMode === "student" ? STUDENT_DATA : CLASS_DATA;

    // INSIGHT LAYER: Simple logic to generate observational text
    const generateInsight = (data: typeof STUDENT_DATA) => {
        const last = data[data.length - 1];
        const prev = data[data.length - 2];
        const trend = last.mastery - prev.mastery;

        if (viewMode === "teacher") return "Class average shows steady progression aligned with curriculum milestones.";

        if (trend > 10) return "Significant improvement in conceptual understanding observed in recent modules.";
        if (trend > 0) return "Steady accumulating progress. Consistent engagement detected.";
        if (trend < -5) return "Performance dip detected. Review of previous module concepts recommended.";
        return "Learning pattern is stable. Continued practice recommended for mastery.";
    };

    const insight = useMemo(() => generateInsight(data), [data, viewMode]);

    return (
        <Card className="col-span-1 lg:col-span-1 h-full shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
                <div className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-600" />
                            {viewMode === "student" ? "My Learning Trajectory" : "Class Performance Overview"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Measured Mastery vs. Curriculum Timeline
                        </CardDescription>
                    </div>
                    {/* Role Toggle (Mock for Demo) */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("student")}
                            className={`h-6 text-xs px-2 ${viewMode === "student" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}
                        >
                            Student
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("teacher")}
                            className={`h-6 text-xs px-2 ${viewMode === "teacher" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}
                        >
                            Teacher
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="module"
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                stroke="#94a3b8"
                            />
                            <YAxis
                                tick={{ fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                stroke="#94a3b8"
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "#1e293b" }}
                            />
                            {/* Class Average Reference (Ghost Line) */}
                            {viewMode === "student" && (
                                <Line
                                    type="monotone"
                                    dataKey="avg"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    name="Class Avg"
                                />
                            )}
                            {/* Main Progress Line */}
                            <Line
                                type="monotone"
                                dataKey="mastery"
                                stroke={viewMode === "student" ? "#4f46e5" : "#059669"}
                                strokeWidth={3}
                                dot={{ fill: viewMode === "student" ? "#4f46e5" : "#059669", r: 4, strokeWidth: 0 }}
                                name="Mastery %"
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* INSIGHT LAYER: Textual Observation */}
                <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex gap-3 items-start">
                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-600 dark:text-indigo-400 mt-0.5">
                        <Eye className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                            {viewMode === "student" ? "Observation Log" : "Class Analysis"}
                        </h4>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">
                            {insight}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
