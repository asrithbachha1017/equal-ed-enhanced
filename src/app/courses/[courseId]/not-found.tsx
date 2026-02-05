import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, BookOpen } from "lucide-react";

export default function CourseNotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-6">
                <Search className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Course Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
                We couldn't locate the course you're looking for. It might have been moved
                or the ID is incorrect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <Link href="/courses">
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                        <BookOpen className="w-4 h-4" /> Browse Catalog
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button className="w-full sm:w-auto gap-2">
                        <Home className="w-4 h-4" /> Dashboard
                    </Button>
                </Link>
            </div>
        </main>
    );
}
