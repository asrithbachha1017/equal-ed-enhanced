import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | EqualEd",
    description: "Sign in to EqualEd to access your learning portal, courses, and settings.",
    openGraph: {
        title: "Login | EqualEd",
        description: "Sign in to EqualEd to access your learning portal, courses, and settings.",
        type: "website",
    }
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
