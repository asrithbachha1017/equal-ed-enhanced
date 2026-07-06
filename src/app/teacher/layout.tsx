export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teacher Portal | EqualEd",
    description: "Manage curriculum courses, track student analytics, and build custom lessons.",
    openGraph: {
        title: "Teacher Portal | EqualEd",
        description: "Manage curriculum courses, track student analytics, and build custom lessons.",
        type: "website",
    }
};

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
