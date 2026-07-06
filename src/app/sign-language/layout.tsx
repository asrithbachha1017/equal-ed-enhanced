import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Language Interpreter | EqualEd",
    description: "AI-Powered Text and PDF to Sign Language translation player for inclusive education.",
    openGraph: {
        title: "Sign Language Interpreter | EqualEd",
        description: "AI-Powered Text and PDF to Sign Language translation player for inclusive education.",
        type: "website",
    }
};

export default function SignLanguageLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
