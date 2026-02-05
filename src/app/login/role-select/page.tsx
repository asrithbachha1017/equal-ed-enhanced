"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { getSavedProfile, UserRole } from "@/lib/auth-storage";

interface RoleOption {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
}

// EduAIThon Conference Theme - Clear, academic role selection
const ROLE_OPTIONS: RoleOption[] = [
    {
        role: 'STUDENT',
        title: 'Student',
        description: 'Access courses, practice, and track your progress',
        icon: <GraduationCap className="w-8 h-8" />,
    },
    {
        role: 'TEACHER',
        title: 'Teacher',
        description: 'Manage courses, monitor students, and create content',
        icon: <BookOpen className="w-8 h-8" />,
    },
    {
        role: 'PARENT',
        title: 'Parent',
        description: "View your child's progress and communicate with teachers",
        icon: <Users className="w-8 h-8" />,
    },
    {
        role: 'ADMIN',
        title: 'Administrator',
        description: 'Manage school, users, and platform settings',
        icon: <ShieldCheck className="w-8 h-8" />,
    }
];

export default function RoleSelectPage() {
    const router = useRouter();
    const [savedProfile, setSavedProfile] = useState<ReturnType<typeof getSavedProfile>>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setSavedProfile(getSavedProfile());
    }, []);

    const handleRoleSelect = (role: UserRole) => {
        router.push(`/login?role=${role.toLowerCase()}`);
    };

    const handleQuickLogin = () => {
        if (savedProfile) {
            router.push(`/login?role=${savedProfile.role.toLowerCase()}&quick=true`);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                    <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6">

            {/* Header */}
            <div className="text-center mb-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Equal access to learning for everyone</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                    Welcome to <span className="text-primary">EqualEd</span>
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Select your role to continue
                </p>
            </div>

            {/* Quick Login Banner (if saved profile exists) */}
            {savedProfile && (
                <Card className="w-full max-w-2xl mb-8 border-primary/20 bg-primary/5">
                    <CardContent className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back!</p>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Continue as {savedProfile.role === 'PARENT' ? (savedProfile as any).parentName : (savedProfile as any).name}
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleQuickLogin} className="gap-2">
                            Quick Login <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Select Login Role Label */}
            <div className="w-full max-w-3xl mb-4">
                <h2 className="text-lg font-semibold text-[#0F4C45] dark:text-[#D6C6A1]">
                    Select Login Role
                </h2>
            </div>

            {/* Role Cards Grid - Conference Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {ROLE_OPTIONS.map((option) => (
                    <Card
                        key={option.role}
                        className={`
                            relative overflow-hidden cursor-pointer transition-all duration-200
                            border-2 border-[#D6C6A1] bg-[#F2EAD3] dark:bg-[#0F4C45]
                            hover:border-[#0F4C45] hover:shadow-lg
                            group
                        `}
                        onClick={() => handleRoleSelect(option.role)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Login as ${option.title}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleRoleSelect(option.role);
                            }
                        }}
                    >
                        <CardHeader className="pb-2">
                            <div className="text-[#0F4C45] dark:text-white mb-2">
                                {option.icon}
                            </div>
                            <CardTitle className="text-xl font-bold text-[#2E2E2E] dark:text-white flex items-center gap-2">
                                {option.title}
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-transform text-[#0F4C45] dark:text-white" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-[#5A5A5A] dark:text-[#D6C6A1]/80 text-base">
                                {option.description}
                            </CardDescription>
                        </CardContent>

                        {/* Saved profile indicator */}
                        {savedProfile?.role === option.role && (
                            <div className="absolute top-3 right-3 bg-[#0F4C45] text-white text-xs px-2 py-1 rounded-full font-medium">
                                Saved
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Footer */}
            <p className="mt-10 text-sm text-slate-500 dark:text-slate-400 text-center">
                Need help? Contact your school administrator for login assistance.
            </p>
        </div>
    );
}
