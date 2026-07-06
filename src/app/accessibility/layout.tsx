import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Accessibility Statement | EqualEd",
    description: "EqualEd's WCAG 2.1 AA accessibility statement and commitments to inclusive digital learning.",
    openGraph: {
        title: "Accessibility Statement | EqualEd",
        description: "EqualEd's WCAG 2.1 AA accessibility statement and commitments to inclusive digital learning.",
        type: "website",
    }
};

export default function AccessibilityLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
