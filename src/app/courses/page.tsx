import { Navbar } from "@/components/layout/navbar";
import { MOCK_DB } from "@/lib/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Database, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Courses | IASF-2K26",
    description: "Explore our AI-driven curriculum.",
};

export default function CoursesIndexPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Available Courses
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                        Explore our dataset-driven curriculum designed to teach critical thinking and AI literacy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_DB.courses.map((course) => (
                        <Card key={course.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                                        {course.levels.length} Levels
                                    </Badge>
                                    {/* Icon placeholder if needed */}
                                    <BookOpen className="h-5 w-5 text-slate-400" />
                                </div>
                                <CardTitle className="text-2xl">{course.title}</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {course.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-3">
                                    {course.levels.slice(0, 2).map((level) => (
                                        <div key={level.id} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                            <Database className="h-3 w-3" />
                                            <span className="truncate">{level.dataset.name}</span>
                                        </div>
                                    ))}
                                    {course.levels.length > 2 && (
                                        <div className="text-xs text-slate-400 pl-5">
                                            + {course.levels.length - 2} more levels
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/courses/${course.id}`} className="w-full">
                                    <Button className="w-full gap-2 group">
                                        Start Learning <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
