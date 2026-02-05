"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Trophy, Delete } from "lucide-react";
import Link from "next/link";
import { useGamification } from "@/lib/gamification";
import confetti from "canvas-confetti";

interface Question {
    text: string;
    answer: number;
    type: "Arithmetic" | "Algebra";
}

export default function MathDrillsView() {
    const { addXP } = useGamification();
    const [question, setQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState(""); // String to allow typing
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);

    // --- Procedural Generation Engine ---
    const generateQuestion = useCallback(() => {
        const types = ["Arithmetic", "Algebra"] as const;
        // Simple difficulty scaling: mostly arithmetic until streak > 5
        const type = streak > 5 && Math.random() > 0.5 ? "Algebra" : "Arithmetic";

        let q: Question;

        if (type === "Arithmetic") {
            const ops = ["+", "-", "*"];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const a = Math.floor(Math.random() * 20) + 1;
            const b = Math.floor(Math.random() * 20) + 1;

            let text = "";
            let ans = 0;

            if (op === "+") { ans = a + b; text = `${a} + ${b}`; }
            else if (op === "-") { ans = a - b; text = `${a} - ${b}`; } // Check for negatives? Allow for now.
            else { ans = a * b; text = `${a} × ${b}`; }

            q = { text: `${text} = ?`, answer: ans, type };
        } else {
            // Algebra: x + a = b  => x = b - a
            const a = Math.floor(Math.random() * 10) + 1;
            const x = Math.floor(Math.random() * 10) + 1; // The implementation answer
            const b = x + a;
            q = { text: `x + ${a} = ${b}, x = ?`, answer: x, type };
        }

        setQuestion(q);
        setUserAnswer("");
        setFeedback(null);
    }, [streak]);

    // Initial Load
    useEffect(() => {
        generateQuestion();
    }, [generateQuestion]);

    const handleSubmit = () => {
        if (!question) return;
        const val = parseInt(userAnswer);

        if (isNaN(val)) return;

        if (val === question.answer) {
            setFeedback("correct");
            setStreak(s => s + 1);
            const xpGain = 10 + (streak * 2); // Bonus for streak
            setScore(s => s + xpGain);
            addXP(xpGain);
            triggerConfetti();

            setTimeout(generateQuestion, 1500);
        } else {
            setFeedback("incorrect");
            setStreak(0);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const handleKeypad = (key: string) => {
        if (key === "DEL") {
            setUserAnswer(prev => prev.slice(0, -1));
        } else if (key === "ENTER") {
            handleSubmit();
        } else if (key === "-") {
            // Allow negative sign only at start
            if (userAnswer === "") setUserAnswer("-");
        } else {
            // Limit length
            if (userAnswer.length < 6) setUserAnswer(prev => prev + key);
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= "0" && e.key <= "9") handleKeypad(e.key);
            if (e.key === "Backspace") handleKeypad("DEL");
            if (e.key === "Enter") handleKeypad("ENTER");
            if (e.key === "-") handleKeypad("-");
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [question, userAnswer]); // Dependencies for closure state

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 p-4 md:p-8 gap-6">

            {/* Sidebar / Stats */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                <Button variant="ghost" asChild className="self-start -ml-2 mb-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                </Button>

                <Card className="p-6 bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Current Session XP</p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score} XP</h2>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Streak Multiplier</span>
                            <span className="font-bold text-orange-500">x{1 + Math.floor(streak / 5)}</span>
                        </div>
                        <Progress value={Math.min(streak * 10, 100)} className="h-2 bg-slate-100" indicatorClassName="bg-orange-500" />
                        <p className="text-xs text-center text-slate-400">
                            {streak} correct in a row!
                        </p>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl hidden md:block">
                    <h3 className="font-semibold mb-2">Math Lab Instructions</h3>
                    <ul className="text-sm space-y-2 text-indigo-100 list-disc list-inside">
                        <li>Solve the equation displayed.</li>
                        <li>Type your answer or use the keypad.</li>
                        <li>Press Enter to submit.</li>
                        <li>Maintain your streak for XP bonuses!</li>
                    </ul>
                </Card>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col justify-center">
                <Card className="relative overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 mb-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <div className="text-center space-y-8">
                        <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {question?.type || "Loading..."} Data
                        </span>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-slate-100 tracking-tight font-mono">
                            {question?.text || "..."}
                        </h1>

                        <div className={`
                            transform transition-all duration-500 ease-out
                            ${feedback === 'correct' ? 'scale-110' : ''}
                            ${feedback === 'incorrect' ? 'shake text-red-500' : ''}
                        `}>
                            <div className="relative inline-block max-w-[200px] w-full">
                                <input
                                    type="text"
                                    readOnly
                                    value={userAnswer}
                                    placeholder="?"
                                    className={`
                                        w-full text-center text-4xl font-bold py-4 bg-slate-50 dark:bg-slate-950 
                                        border-b-4 focus:outline-none rounded-t-lg
                                        ${feedback === 'correct' ? 'border-green-500 text-green-600' :
                                            feedback === 'incorrect' ? 'border-red-500 text-red-600' :
                                                'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'}
                                    `}
                                />
                                {feedback === 'correct' && (
                                    <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in spin-in-180">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                )}
                                {feedback === 'incorrect' && (
                                    <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-red-500 animate-in zoom-in">
                                        <XCircle className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {feedback === 'incorrect' && (
                            <p className="text-red-500 font-medium animate-in fade-in slide-in-from-top-2">
                                Incorrect. Try again!
                            </p>
                        )}
                    </div>
                </Card>

                {/* Virtual Keypad */}
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Button
                            key={num}
                            variant="outline"
                            className="h-16 text-2xl font-bold rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:scale-95 transition-transform"
                            onClick={() => handleKeypad(num.toString())}
                        >
                            {num}
                        </Button>
                    ))}
                    <Button
                        variant="secondary"
                        className="h-16 text-xl font-bold rounded-2xl text-slate-500"
                        onClick={() => handleKeypad("-")}
                    >
                        -
                    </Button>
                    <Button
                        variant="outline"
                        className="h-16 text-2xl font-bold rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:scale-95 transition-transform"
                        onClick={() => handleKeypad("0")}
                    >
                        0
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-16 text-xl font-bold rounded-2xl text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleKeypad("DEL")}
                    >
                        <Delete className="w-6 h-6" />
                    </Button>
                </div>

                <Button
                    size="lg"
                    className="mt-6 w-full max-w-xs mx-auto h-14 text-xl font-bold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all"
                    onClick={handleSubmit}
                    disabled={feedback === 'correct'}
                >
                    {feedback === 'correct' ? "Nice Job!" : "Submit Answer"}
                </Button>

            </div>
        </div>
    );
}
