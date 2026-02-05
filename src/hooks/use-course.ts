import { useQuery } from "@tanstack/react-query";
import { MOCK_DB, MockCourse } from "@/lib/mock-db";

// Simulated API call (replace with real API later)
const fetchCourse = async (courseId: string): Promise<MockCourse | null> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const course = MOCK_DB.getCourseById(courseId);
    return course || null;
};

export const useCourse = (courseId: string) => {
    return useQuery({
        queryKey: ["course", courseId],
        queryFn: () => fetchCourse(courseId),
        enabled: !!courseId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};
