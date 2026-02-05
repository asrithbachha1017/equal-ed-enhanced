"use server";

import { MOCK_DB, MockCourse } from "@/lib/mock-db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourseAction(formData: FormData) {
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const gradeLevel = parseInt(formData.get("gradeLevel") as string);

    if (!title || !subject || !description || !gradeLevel) {
        throw new Error("Missing required fields");
    }

    const newCourse: MockCourse = {
        id: `course-${Date.now()}`,
        title,
        description,
        icon: "BookOpen", // Default icon
        levels: [] // Start with empty levels
    };

    MOCK_DB.addCourse(newCourse);

    revalidatePath("/teacher");
    revalidatePath("/dashboard");
    redirect("/teacher");
}
