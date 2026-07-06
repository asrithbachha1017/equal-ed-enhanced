import SignLanguageView from "@/components/sign-language-view";
import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Language Practice | EqualEd",
    description: "AI-Powered Sign Language Gesture Recognition and Practice Lab.",
    openGraph: {
        title: "Sign Language Practice | EqualEd",
        description: "AI-Powered Sign Language Gesture Recognition and Practice Lab.",
        type: "website",
    }
};

export default function MonitorPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-6">
                <h1 className="text-3xl font-bold mb-6 text-foreground px-6">Sign Language Practice</h1>
                <SignLanguageView />
            </div>
        </main>
    );
}
