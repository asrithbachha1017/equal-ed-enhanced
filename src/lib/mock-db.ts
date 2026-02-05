// Fallback Mock Database for IASF-2K26
// Generating Grade 2-8 Curriculum content dynamically

export interface DatasetConfig {
    name: string;
    sourceUrl: string;
    dataType: "Image" | "Video" | "Text" | "Audio" | "Tabular";
    usage: string;
    description: string;
}

export interface MockLevel {
    id: string;
    title: string;
    description: string;
    dataset: DatasetConfig;
    modules: MockModule[];
}

export interface MockCourse {
    id: string;
    title: string;
    description: string;
    icon: string;
    levels: MockLevel[];
    aiMetadata?: AIMetadata;
    learningObjectives?: string[];
    introVideo?: {
        id: string;
        script: string;
        fallbackText: string[];
        videoUrl?: string;
        liveSummary?: {
            text: string;
            type: "overview" | "goal" | "method" | "differentiation";
        }[];
    };
}

export interface AIMetadata {
    modelName: string;
    confidenceScore: number;
    usage: string;
    citations: { title: string; url: string; type: "Dataset" | "Paper" }[];
}

export interface MockModule {
    id: string;
    title: string;
    content: string;
    videoUrl?: string;
    transcript?: string;
}

// *** REAL-WORLD DATASET CONFIGURATIONS ***

const ASL_COURSE: MockCourse = {
    id: "course-asl",
    title: "American Sign Language",
    description: "Master visual communication using Kaggle & WLASL datasets.",
    icon: "Hand",
    levels: [
        {
            id: "asl-l1",
            title: "Level 1: The Alphabet (Static)",
            description: "Learn the 26 static hand signs.",
            dataset: {
                name: "ASL Alphabet (Kaggle)",
                sourceUrl: "https://www.kaggle.com/datasets/grassknoted/asl-alphabet",
                dataType: "Image",
                usage: "Static Gesture Recognition",
                description: "87,000 images of the ASL alphabet for foundational practice."
            },
            modules: [
                {
                    id: "asl-m1",
                    title: "Introduction to Finger Spelling",
                    content: "Basics of hand shapes.",
                    transcript: "Welcome to ASL Level 1. In this lesson, we will cover the fundamental hand shapes used in finger spelling. Finger spelling is the process of spelling out words using hand signs that correspond to the letters of the alphabet. Watch closely as I demonstrate A, B, and C..."
                }
            ]
        },
        {
            id: "asl-l2",
            title: "Level 2: Dynamic Vocabulary",
            description: "Common words and phrases.",
            dataset: {
                name: "WLASL (World Level ASL)",
                sourceUrl: "https://dxli94.github.io/WLASL/",
                dataType: "Video",
                usage: "Dynamic Action Verification",
                description: "2,000 common words with skeletal pose data."
            },
            modules: []
        }
    ],
    aiMetadata: {
        modelName: "Google MediaPipe Hands",
        confidenceScore: 0.96,
        usage: "Real-time hand tracking and gesture classification.",
        citations: [
            { title: "MediaPipe Hands Paper", url: "https://arxiv.org/abs/2006.10214", type: "Paper" },
            { title: "WLASL Dataset", url: "https://dxli94.github.io/WLASL/", type: "Dataset" }
        ]
    },
    learningObjectives: [
        "Master the 26 static ASL alphabet hand signs.",
        "Recognize and sign 100+ common vocabulary words.",
        "Understand basic ASL grammar and syntax.",
        "Improve finger dexterity and coordination."
    ],
    introVideo: {
        id: "intro-asl",
        script: "Welcome to American Sign Language. This is a structured course designed to build your visual communication skills. First, you will learn the alphabet and finger spelling. Then, you will practice common vocabulary and sentence structures. By the end, you will sign clear sentences and understand basic conversations. Your progress is tracked in our system, allowing your teachers to monitor your growth and support your success.",
        fallbackText: [
            "Structured Learning Course",
            "Alphabet & Finger Spelling",
            "Vocabulary & Sentences",
            "Sign Clear Sentences",
            "Teacher-Monitored Growth"
        ],
        videoUrl: "https://www.youtube.com/embed/0FcwzMq4iWg?autoplay=1", // Placeholder ASL Intro
        liveSummary: [
            { type: "overview", text: "You are entering a structured curriculum for visual communication." },
            { type: "goal", text: "You will learn the alphabet, vocabulary, and sentence structures." },
            { type: "method", text: "You will practice signing to demonstrate your understanding." },
            { type: "differentiation", text: "Your progress is tracked so teachers can support your success." }
        ]
    }
};

const MATH_COURSE: MockCourse = {
    id: "course-math",
    title: "Adaptive Mathematics",
    description: "Computational logic powered by DeepMind & OpenAI datasets.",
    icon: "Calculator",
    levels: [
        {
            id: "math-l1",
            title: "Foundation: Numeracy",
            description: "Arithmetic & Basic Algebra.",
            dataset: {
                name: "DeepMind Mathematics",
                sourceUrl: "https://github.com/google-deepmind/mathematics_dataset",
                dataType: "Text",
                usage: "Infinite Procedural Drills",
                description: "Generative QA pairs for arithmetic, algebra, and calculus."
            },
            modules: []
        },
        {
            id: "math-l2",
            title: "Advanced: Problem Solving",
            description: "Complex word problems.",
            dataset: {
                name: "GSM8K (Grade School Math)",
                sourceUrl: "https://github.com/openai/grade-school-math",
                dataType: "Text",
                usage: "Chain-of-Thought Verification",
                description: "High-quality grade school math problems."
            },
            modules: []
        }
    ],
    aiMetadata: {
        modelName: "OpenAI GPT-4o (Math)",
        confidenceScore: 0.99,
        usage: "Generates step-by-step solutions and adaptive problem sets.",
        citations: [
            { title: "GSM8K Dataset", url: "https://github.com/openai/grade-school-math", type: "Dataset" },
            { title: "DeepMind Mathematics", url: "https://github.com/google-deepmind/mathematics_dataset", type: "Dataset" }
        ]
    },
    learningObjectives: [
        "Solve complex word problems using logical reasoning.",
        "Master arithmetic operations with high accuracy.",
        "Apply algebraic thinking to real-world scenarios.",
        "Develop problem-solving strategies for competitive math."
    ],
    introVideo: {
        id: "intro-math",
        script: "Welcome to the Adaptive Mathematics program. This course adjusts to your personal learning pace. You will solve logic puzzles and math problems, starting with basic numbers. As you improve, you will tackle complex algebra and reasoning tasks. You will demonstrate mastery by solving new problems correctly. Your results are recorded so your instructors can see exactly what you understand.",
        fallbackText: [
            "Adaptive Learning Pace",
            "Logic Puzzles & Math",
            "Algebra & Reasoning",
            "Demonstrate Mastery",
            "Instructor-Viewable Results"
        ],
        liveSummary: [
            { type: "overview", text: "This is a guided course that adjusts to your pace." },
            { type: "goal", text: "You will solve problems from basic numbers to algebra." },
            { type: "method", text: "You must solve problems correctly to prove mastery." },
            { type: "differentiation", text: "Instructors can see your results to help you improve." }
        ]
    }
};

const SCIENCE_COURSE: MockCourse = {
    id: "course-science",
    title: "Science Explorer",
    description: "Natural world logic using ARC & ScienceQA.",
    icon: "FlaskConical",
    levels: [
        {
            id: "sci-l1",
            title: "Natural Science",
            description: "Reasoning about the physical world.",
            dataset: {
                name: "AI2 ARC (Reasoning Challenge)",
                sourceUrl: "https://allenai.org/data/arc",
                dataType: "Text",
                usage: "Reasoning Context & QA",
                description: "Grade-school science questions requiring knowledge retrieval."
            },
            modules: []
        }
    ],
    aiMetadata: {
        modelName: "AllenAI Macaw-11B",
        confidenceScore: 0.92,
        usage: "Provides scientific reasoning and explanation for natural phenomena.",
        citations: [
            { title: "AI2 ARC Dataset", url: "https://allenai.org/data/arc", type: "Dataset" },
            { title: "ScienceQA Paper", url: "https://arxiv.org/abs/2209.09513", type: "Paper" }
        ]
    },
    learningObjectives: [
        "Understand core concepts of natural science and physics.",
        "Apply scientific reasoning to answer complex questions.",
        "Analyze diagrams and visual scientific data.",
        "Evaluate hypotheses based on evidence."
    ],
    introVideo: {
        id: "intro-science",
        script: "Welcome to Science Explorer. This program focuses on scientific reasoning and evidence. You will learn to analyze data, read charts, and test hypotheses about the natural world. Instead of just memorizing facts, you will use logic to explain why things happen. Your reasoning skills are evaluated at every step. This data helps your teachers confirm that you are truly thinking like a scientist.",
        fallbackText: [
            "Scientific Reasoning Focus",
            "Analyze Data & Charts",
            "Explain Why Things Happen",
            "Evaluated at Every Step",
            "Confirm Scientific Thinking"
        ],
        liveSummary: [
            { type: "overview", text: "This program focuses on evidence and scientific reasoning." },
            { type: "goal", text: "You will analyze data and test hypotheses." },
            { type: "method", text: "You will use logic to explain natural phenomena." },
            { type: "differentiation", text: "Your reasoning is evaluated to confirm true understanding." }
        ]
    }
};

// ALIASES for Legacy Routes / Landing Page Compatibility
const SCIENCE_COURSE_LEGACY: MockCourse = { ...SCIENCE_COURSE, id: "course-g5-science" };

const COURSES = [ASL_COURSE, MATH_COURSE, SCIENCE_COURSE, SCIENCE_COURSE_LEGACY];

// Generic Educational Videos (Embed Links) - Keeping for reference if needed
const VIDEO_MAP: Record<string, string> = {
    Mathematics: "https://www.youtube.com/embed/MjSCP8SYfC8", // Math Antics - Basic
    Science: "https://www.youtube.com/embed/libKVRa01L8", // Solar System
    English: "https://www.youtube.com/embed/8Gv0H-vPoDc", // Grammar
};

export interface MockStudent {
    id: string;
    name: string;
    email: string;
    grade: number;
    progress: number;
    streak: number;
    status: "Active" | "Inactive";
    enrolledCourses: string[]; // Course IDs
    currentCourseId: string;
}

const STUDENTS: MockStudent[] = [
    {
        id: "s1",
        name: "Alice Johnson",
        email: "alice@example.com",
        grade: 5,
        progress: 85,
        streak: 12,
        status: "Active",
        enrolledCourses: ["course-math", "course-science", "course-asl"],
        currentCourseId: "course-science"
    },
    {
        id: "s2",
        name: "Bob Smith",
        email: "bob@example.com",
        grade: 5,
        progress: 45,
        streak: 3,
        status: "Active",
        enrolledCourses: ["course-math"],
        currentCourseId: "course-math"
    },
    {
        id: "s3",
        name: "Charlie Brown",
        email: "charlie@example.com",
        grade: 6,
        progress: 92,
        streak: 30,
        status: "Active",
        enrolledCourses: ["course-math", "course-science"],
        currentCourseId: "course-math"
    },
    {
        id: "s4",
        name: "Diana Prince",
        email: "diana@example.com",
        grade: 4,
        progress: 15,
        streak: 0,
        status: "Inactive",
        enrolledCourses: [],
        currentCourseId: ""
    },
    {
        id: "s5",
        name: "Evan Wright",
        email: "evan@example.com",
        grade: 5,
        progress: 60,
        streak: 5,
        status: "Active",
        enrolledCourses: ["course-asl"],
        currentCourseId: "course-asl"
    },
];

export const MOCK_DB = {
    courses: COURSES,
    students: STUDENTS,
    getCourseById: (id: string) => MOCK_DB.courses.find(c => c.id === id),
    // Helper to get all levels across all courses
    getAllLevels: () => MOCK_DB.courses.flatMap(c => c.levels),
    addCourse: (course: MockCourse) => {
        MOCK_DB.courses.push(course);
    }
};
