import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Saved Courses | EqualEd",
    description: "Access and resume your bookmarked and favorite courses on EqualEd.",
    openGraph: {
        title: "Saved Courses | EqualEd",
        description: "Access and resume your bookmarked and favorite courses on EqualEd.",
        type: "website",
    }
};

export default function SavedCoursesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
