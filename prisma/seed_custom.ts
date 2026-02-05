// @ts-ignore - Import from generated path
import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

const SUBJECTS = ["Mathematics", "Science", "English"];

const TOPICS_BY_SUBJECT: Record<string, string[]> = {
    Mathematics: ["Arithmetic", "Geometry", "Algebra", "Data Handling", "Measurements"],
    Science: ["Plants & Animals", "Human Body", "Matter", "Force & Energy", "Space"],
    English: ["Grammar", "Vocabulary", "Reading Comprehension", "Storytelling", "Writing"],
};

async function main() {
    console.log("🌱 Starting Database Seeding (Custom Client)...");

    // 1. Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: "teacher@iasf.org" },
        update: {},
        create: {
            email: "teacher@iasf.org",
            name: "Admin Educator",
            role: "EDUCATOR",
        },
    });

    // 2. Loop Grades 2-8
    for (let grade = 2; grade <= 8; grade++) {
        console.log(`Generating Grade ${grade}...`);
        for (const subject of SUBJECTS) {
            const course = await prisma.course.create({
                data: {
                    title: `Grade ${grade} ${subject}`,
                    description: `Curriculum for Grade ${grade}`,
                    educatorId: teacher.id,
                },
            });

            const topics = TOPICS_BY_SUBJECT[subject];
            for (let i = 0; i < topics.length; i++) {
                const topic = topics[i];

                // Create Module
                const module = await prisma.module.create({
                    data: {
                        title: `Unit ${i + 1}: ${topic}`,
                        courseId: course.id,
                        order: i,
                    },
                });

                // Create Content
                await prisma.content.create({
                    data: {
                        moduleId: module.id,
                        title: `Intro to ${topic}`,
                        originalText: `This is a comprehensive lesson on ${topic} for Grade ${grade}.`,
                        type: "TEXT"
                    }
                });

                // Create Assignment
                await prisma.assignment.create({
                    data: {
                        title: `${topic} Assessment`,
                        description: `Quiz for ${topic}`,
                        gradeLevel: grade,
                    },
                });
            }
        }
    }

    // 3. Students
    const students = [
        { name: "Blind Student", email: "student_blind@iasf.org" },
        { name: "Deaf Student", email: "student_deaf@iasf.org" },
    ];

    for (const s of students) {
        await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                email: s.email, name: s.name, role: "STUDENT", gradeLevel: 5
            }
        });
    }

    console.log("✅ Seeding Completed!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
