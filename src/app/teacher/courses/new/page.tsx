"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { createCourseAction } from "@/app/actions";

export default function NewCoursePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex justify-center items-start">
            <div className="w-full max-w-2xl space-y-6">

                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/teacher">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Course</CardTitle>
                        <CardDescription>
                            Add a new subject to the curriculum.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createCourseAction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input id="title" name="title" placeholder="e.g., Advanced Mathematics" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                        <option value="History">History</option>
                                        <option value="Art">Art</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gradeLevel">Grade Level</Label>
                                    <select
                                        id="gradeLevel"
                                        name="gradeLevel"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        {[2, 3, 4, 5, 6, 7, 8].map(g => (
                                            <option key={g} value={g}>Grade {g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Briefly describe what students will learn..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" asChild>
                                    <Link href="/teacher">Cancel</Link>
                                </Button>
                                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Course
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
