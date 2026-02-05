import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
            <div className="bg-muted/30 p-8 rounded-full mb-8">
                <FileQuestion className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center">Page Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <Link href="/dashboard">
                <Button size="lg">Return to Dashboard</Button>
            </Link>
        </div>
    );
}
