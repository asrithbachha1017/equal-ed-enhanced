"use client";

import { MOCK_DB } from "@/lib/mock-db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MoreHorizontal, Trophy, Flame, User } from "lucide-react";

export default function StudentsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground">Manage your class roster and track progress.</p>
                </div>
                <Button>Add Student</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_DB.students.map((student) => (
                    <Card key={student.id} className="hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                                    {student.status}
                                </Badge>
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-lg font-bold leading-none">{student.name}</p>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <Mail className="mr-1 h-3 w-3" /> {student.email}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <User className="h-3 w-3" /> Grade
                                    </span>
                                    <span className="font-semibold">{student.grade}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Trophy className="h-3 w-3" /> Progress
                                    </span>
                                    <span className="font-semibold">{student.progress}%</span>
                                </div>
                                <div className="flex flex-col gap-1 col-span-2">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Flame className="h-3 w-3 text-orange-500" /> Day Streak
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-500 rounded-full"
                                                style={{ width: `${Math.min(student.streak * 5, 100)}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-orange-600">{student.streak}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
