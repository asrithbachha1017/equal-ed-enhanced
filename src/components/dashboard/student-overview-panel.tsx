"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    GraduationCap,
    BookOpen,
    Activity,
    Volume2,
    VolumeX,
    Pause,
    Play,
    RotateCcw,
    Gauge,
    Info
} from "lucide-react";
import { MockStudent, MOCK_DB } from "@/lib/mock-db";

export interface StudentOverviewPanelProps {
    isOpen: boolean;
    onClose: () => void;
    student: MockStudent;
    variant?: "default" | "home"; // "default" = Dashboard (Full), "home" = Home Screen (Simple)
}

export function StudentOverviewPanel({ isOpen, onClose, student, variant = "default" }: StudentOverviewPanelProps) {
    // Speech State
    const [isMuted, setIsMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Prepare Data Reference
    const currentCourse = MOCK_DB.getCourseById(student.currentCourseId);
    const enrolledCount = student.enrolledCourses.length;

    // Construct the "Teacher Script" based on Variant
    let introScript = "";

    if (variant === "home") {
        // STRICT HOME RULE: Name, Grade, Current Course. Simple Tone.
        introScript = `
            You are logged in as ${student.name}.
            Class: Grade ${student.grade}.
            Current course: ${currentCourse?.title || "None Selected"}.
        `;
    } else {
        // DASHBOARD RULE: Institutional, full context.
        introScript = `
            Student Identity Confirmed. 
            Welcome, ${student.name}. 
            You are logged in with Student ID ${student.id}.
            Your current academic level is Grade ${student.grade}.
            You have ${enrolledCount} active courses enrolled.
            Your primary focus is currently ${currentCourse?.title || "Unknown Course"}.
            Your overall learning progress is tracked at ${student.progress}%.
            System is ready. You may proceed.
        `;
    }

    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // SPEECH LOGIC (Adapted from CourseIntroModal for consistency)
    const speakOverview = useCallback(() => {
        if (isMuted || !isOpen) return;

        window.speechSynthesis.cancel(); // Clear previous

        const utterance = new SpeechSynthesisUtterance(introScript);
        utterance.rate = playbackRate * 0.95; // Slightly slower/clearer
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Samantha")
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onpause = () => setIsSpeaking(false);
        utterance.onresume = () => setIsSpeaking(true);

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [introScript, isMuted, isOpen, playbackRate]);

    // Auto-Start Speech on Open (after 500ms delay for stability)
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                speakOverview();
            }, 800);
            return () => {
                clearTimeout(timer);
                window.speechSynthesis.cancel();
            };
        }
    }, [isOpen, speakOverview]);

    // Controls
    const togglePause = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        } else {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            // If we unmute, we might want to restart or resume if it was playing? 
            // For simplicity, let's just allow replay manually if missed.
        } else {
            setIsMuted(true);
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const toggleSpeed = () => {
        const newRate = playbackRate === 1.0 ? 0.8 : playbackRate === 0.8 ? 1.2 : 1.0;
        setPlaybackRate(newRate);
        // If speaking, restart to apply rate
        if (isSpeaking || isPaused) {
            window.speechSynthesis.cancel();
            speakOverview();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent
                className="max-w-2xl bg-slate-50 dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 p-0 shadow-2xl"
            // Prevent outside click close to ensure they acknowledge? User said "User can dismiss it after narration".
            // Default dialog behavior allows outside click. We'll keep it standard but emphasize the "Acknowledge" button.
            >
                <div role="document" aria-label="Student Orientation Panel">

                    {/* HEADER: Institutional Identity */}
                    <div className="bg-indigo-700 text-white p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <GraduationCap className="w-32 h-32" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                                <Badge variant="secondary" className="bg-white/20 hover:bg-white/20 text-white border-0">
                                    ID: {student.id.toUpperCase()}
                                </Badge>
                                Student Identity Confirmed
                            </DialogTitle>
                        </DialogHeader>
                        <p className="mt-2 text-indigo-100 font-medium">
                            Academic Session Active • Grade {student.grade}
                        </p>
                    </div>

                    {/* BODY: Structured Grid Data */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-950">

                        {/* Column 1: Profile */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                <User className="w-4 h-4" /> Profile Details
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                                <div>
                                    <label className="text-xs text-slate-500 block">Student Name</label>
                                    <div className="font-bold text-lg text-slate-900 dark:text-slate-100">{student.name}</div>
                                </div>
                                { /* HOME VARIANT RULE: Only Name, Grade, Enrolled Course. Hide Role/Status complexity if 'home' */}
                                {variant !== "home" && (
                                    <>
                                        <div>
                                            <label className="text-xs text-slate-500 block">Role</label>
                                            <div className="font-medium text-slate-700 dark:text-slate-300">Enrolled Student</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 block">Status</label>
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 mt-1">
                                                {student.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Academic Status */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Academic Status
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                                <div>
                                    <label className="text-xs text-slate-500 block">Current Focus</label>
                                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{currentCourse?.title}</div>
                                </div>
                                {variant !== "home" && (
                                    <>
                                        <div>
                                            <label className="text-xs text-slate-500 block">Active Courses</label>
                                            <div className="font-medium">{enrolledCount} Courses Enrolled</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 block">Overall Progress</label>
                                            <div className="flex items-center gap-2 font-bold mt-1">
                                                <Activity className="w-4 h-4 text-indigo-500" />
                                                {student.progress}%
                                            </div>
                                        </div>
                                    </>
                                )}
                                {variant === "home" && (
                                    <div>
                                        <label className="text-xs text-slate-500 block">Class / Grade</label>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">Grade {student.grade}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER: Accessible Controls */}
                    <DialogFooter className="bg-slate-100 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex-col sm:flex-row gap-4 items-center justify-between">

                        {/* Audio Controls */}
                        <div className="flex items-center gap-2 bg-white dark:bg-black/20 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto justify-center">
                            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wide">
                                Voice Agent
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => { window.speechSynthesis.cancel(); speakOverview(); }} className="h-8 w-8" title="Replay">
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={togglePause} className="h-8 w-8" title={isPaused ? "Resume" : "Pause"}>
                                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={toggleSpeed} className="h-8 px-2 text-xs w-auto" title="Speed">
                                <Gauge className="w-3 h-3 mr-1" /> {playbackRate}x
                            </Button>
                            <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8" title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-green-600" />}
                            </Button>
                        </div>

                        {/* Dismiss Action */}
                        <Button
                            onClick={onClose}
                            className="w-full sm:w-auto bg-indigo-700 hover:bg-indigo-800 text-white shadow-md font-bold"
                            size="lg"
                        >
                            ACKNOWLEDGE & BEGIN
                        </Button>

                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
