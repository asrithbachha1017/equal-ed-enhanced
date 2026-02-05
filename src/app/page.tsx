"use client";

import { useEffect, useState } from "react";

import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Play, BookOpen, Mic, HandMetal, ArrowRight, Menu, Headset } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"
import { ProgressChart } from "@/components/analytics/progress-chart"
import { StudentOverviewPanel } from "@/components/dashboard/student-overview-panel"
import { MOCK_DB } from "@/lib/mock-db"
import { useSignLanguage } from "@/contexts/sign-language-context"



export default function Home() {
  const router = useRouter();
  const { isEnabled, vrAvatarMode, toggleVrAvatarMode, setEnabled, toggleEnabled } = useSignLanguage();


  const [selectedGrade, setSelectedGrade] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic "Last Learnt" data based on Grade
  const lastLesson = {
    title: selectedGrade <= 5 ? "The Solar System" : "Advanced Physics",
    subject: "Science",
    grade: selectedGrade,
    progress: 65,
    image: selectedGrade <= 5 ? "🪐" : "⚛️",
    courseId: `course-g${selectedGrade}-science`
  };

  // Mock Current User - identity panel removed (now handled by login flow)
  const currentUser = MOCK_DB.students[0];

  // Handle VR Avatar click - enable sign language first if not enabled
  const handleVrAvatarClick = () => {
    if (!isEnabled) {
      setEnabled(true);
    }
    toggleVrAvatarMode();
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Quick Access Toolbar - Below Navbar */}
      <div className="bg-card border-b sticky top-16 z-40 px-6 py-3 shadow-sm flex items-center gap-3 overflow-x-auto no-scrollbar justify-center md:justify-start">

        {/* Grade Selector Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Select Grade</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? "default" : "ghost"}
                  className="justify-start w-full"
                  onClick={() => {
                    setSelectedGrade(grade);
                    setIsOpen(false);
                  }}
                >
                  Grade {grade}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 hidden md:block">Active: Grade {selectedGrade}</span>

        <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10" onClick={() => router.push('/dashboard')}>
          <BookOpen className="h-4 w-4" /> Browse Courses
        </Button>

        <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary dark:text-white" onClick={() => router.push('/sign-language')}>
          <HandMetal className="h-4 w-4" /> Sign Interpreter
        </Button>

        <Button
          variant={isEnabled ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full gap-2 transition-all",
            isEnabled
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-primary/20 hover:bg-primary/5 hover:text-primary dark:text-white"
          )}
          onClick={toggleEnabled}
        >
          <HandMetal className="h-4 w-4" />
          {isEnabled ? "Stop Practice Mode" : "Practice Sign Language"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`rounded-full gap-2 ${vrAvatarMode
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'} transition-all`}
          onClick={handleVrAvatarClick}
        >
          <Headset className="h-4 w-4" /> VR Sign Assistant
        </Button>

        <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground cursor-default hover:bg-transparent">
          <Mic className="h-3 w-3 animate-pulse text-destructive" /> Voice Active
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-8">

        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-5 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, Student! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to learn something new today?
            </p>
          </div>


        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column: Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Play className="h-5 w-5 text-primary" />
                  Continue Learning
                </h2>
              </div>

              <Card className="border-l-4 border-l-primary hover:shadow-md transition-all group overflow-hidden relative bg-card">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl select-none group-hover:scale-110 transition-transform duration-500 text-foreground">
                  {lastLesson.image}
                </div>
                <CardHeader>
                  <div className="text-sm font-medium text-primary mb-1">Grade {lastLesson.grade} • {lastLesson.subject}</div>
                  <CardTitle className="text-2xl text-foreground">{lastLesson.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">You left off at "Planetary Orbits"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-foreground">
                      <span>Progress</span>
                      <span className="font-bold">{lastLesson.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[65%]" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push(`/courses/${lastLesson.courseId}`)}>
                    Resume Lesson <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>

          {/* Side Column: Achievements & Tips (Removed Quick Links which are now at top) */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4 text-foreground">Learning Pattern</h2>
              <div className="h-[350px]">
                <ProgressChart />
              </div>
            </section>

            <Card className="bg-primary text-primary-foreground border-none relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Daily Tip 💡
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/90 text-sm italic">
                  "Regular review sessions help solidify long-term memory."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </main>
  );
}
