import { Navbar } from "@/components/layout/navbar";
import { ProgressChart } from "@/components/analytics/progress-chart";
import { ExportButton } from "@/components/analytics/export-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Learning Analytics
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Track student mastery and export data for research.
                        </p>
                    </div>
                    <ExportButton />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Avg. Class Mastery</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">78%</div>
                            <p className="text-xs text-muted-foreground">+12% from last week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">85% engagement rate</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Data Points Collected</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,240</div>
                            <p className="text-xs text-muted-foreground">For dataset validation</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Mastery Progression</CardTitle>
                        <CardDescription>
                            Concept retention over the 6-week pilot program.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ProgressChart />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
