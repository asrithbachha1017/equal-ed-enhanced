
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_DB } from "@/lib/mock-db";
import { BookOpen, Database, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Access Course Library</h1>
                <p className="text-muted-foreground">Master subjects using real-world datasets and AI-powered verification.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {MOCK_DB.courses.map((course) => (
                    <Card key={course.id} className="flex flex-col h-full border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                                    <Database className="w-3 h-3 mr-1" />
                                    Data-Driven
                                </Badge>
                            </div>
                            <CardTitle className="text-xl">{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Levels & Datasets</h4>
                            <div className="space-y-3">
                                {course.levels.map((level) => (
                                    <div key={level.id} className="p-3 bg-secondary/50 rounded-lg space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-sm">{level.title}</span>
                                            {/* <Badge variant="secondary" className="text-xs">{level.dataset.dataType}</Badge> */}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Database className="w-3 h-3" />
                                            <span className="truncate">Source: {level.dataset.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Link href={`/courses/${course.id}`} className="w-full">
                                <Button className="w-full gap-2 group">
                                    View Syllabus
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
