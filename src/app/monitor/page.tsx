import SignLanguageView from "@/components/sign-language-view";
import { Navbar } from "@/components/layout/navbar";

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
