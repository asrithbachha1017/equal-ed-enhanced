export interface SignEntry {
    url: string;
    type: 'exact' | 'synonym' | 'category';
    label?: string;
}

// Reusing the valid demo URLs we have. 
// In a real app, these would be unique per word.
const VIDEOS = {
    HELLO: "/sign-language/welcome.png", // Hello/Welcome (Prototype Image)
    COURSE: "/vr-sign-video.mp4", // Course/Learn/Study (Using User Video)
    ACCESSIBILITY: "/sign-language/settings.png", // Accessibility (Prototype Image)
    READ: "/vr-sign-video.mp4", // Read/Book (Using User Video)
    SCIENCE: "/sign-language/solar_system.png", // Science/Solar System (Prototype Image)
    DEFAULT: "/vr-sign-video.mp4" // General speaking/default
};

export const SIGN_DICTIONARY: Record<string, SignEntry> = {
    // --- GREETINGS ---
    "hello": { url: VIDEOS.HELLO, type: 'exact', label: "Greeting" },
    "hi": { url: VIDEOS.HELLO, type: 'synonym', label: "Greeting" },
    "hey": { url: VIDEOS.HELLO, type: 'synonym', label: "Greeting" },
    "welcome": { url: VIDEOS.HELLO, type: 'exact', label: "Greeting" },
    "greetings": { url: VIDEOS.HELLO, type: 'synonym', label: "Greeting" },
    "good morning": { url: VIDEOS.HELLO, type: 'synonym', label: "Greeting" },
    "good afternoon": { url: VIDEOS.HELLO, type: 'synonym', label: "Greeting" },

    // --- EDUCATION ---
    "course": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "class": { url: VIDEOS.COURSE, type: 'synonym', label: "Education" },
    "lesson": { url: VIDEOS.COURSE, type: 'synonym', label: "Education" },
    "learn": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "learning": { url: VIDEOS.COURSE, type: 'synonym', label: "Education" },
    "study": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "studying": { url: VIDEOS.COURSE, type: 'synonym', label: "Education" },
    "student": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "teacher": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "school": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "university": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "college": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "exam": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "test": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "assignment": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "homework": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },
    "grade": { url: VIDEOS.COURSE, type: 'exact', label: "Education" },

    // --- ACCESSIBILITY ---
    "accessibility": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Accessibility" },
    "accessible": { url: VIDEOS.ACCESSIBILITY, type: 'synonym', label: "Accessibility" },
    "disability": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Accessibility" },
    "inclusion": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Accessibility" },
    "inclusive": { url: VIDEOS.ACCESSIBILITY, type: 'synonym', label: "Accessibility" },
    "sign language": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Accessibility" },
    "deaf": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Accessibility" },
    "hearing": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Accessibility" },

    // --- ACTIONS (Read/Write/Etc) ---
    "read": { url: VIDEOS.READ, type: 'exact', label: "Action" },
    "reading": { url: VIDEOS.READ, type: 'synonym', label: "Action" },
    "write": { url: VIDEOS.READ, type: 'exact', label: "Action" },
    "writing": { url: VIDEOS.READ, type: 'synonym', label: "Action" },
    "book": { url: VIDEOS.READ, type: 'exact', label: "Object" },
    "text": { url: VIDEOS.READ, type: 'exact', label: "Object" },
    "page": { url: VIDEOS.READ, type: 'exact', label: "Object" },
    "notes": { url: VIDEOS.READ, type: 'exact', label: "Object" },

    // --- SCIENCE & MATH ---
    "science": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "math": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "mathematics": { url: VIDEOS.SCIENCE, type: 'synonym', label: "Science" },
    "physics": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "biology": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "chemistry": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "experiment": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "calculate": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "formula": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },
    "equation": { url: VIDEOS.SCIENCE, type: 'exact', label: "Science" },

    // --- TECHNOLOGY ---
    "technology": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "computer": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "software": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "internet": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "website": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "app": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "code": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "program": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "digital": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },
    "data": { url: VIDEOS.ACCESSIBILITY, type: 'exact', label: "Technology" },

    // --- BASICS ---
    "yes": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "no": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "please": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "thank you": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "thanks": { url: VIDEOS.DEFAULT, type: 'synonym', label: "Basics" },
    "help": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "start": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "stop": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "begin": { url: VIDEOS.DEFAULT, type: 'synonym', label: "Basics" },
    "end": { url: VIDEOS.DEFAULT, type: 'synonym', label: "Basics" },
    "good": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },
    "bad": { url: VIDEOS.DEFAULT, type: 'exact', label: "Basics" },

    // --- FALLBACK ---
    "default": { url: VIDEOS.DEFAULT, type: 'category', label: "General" }
};
