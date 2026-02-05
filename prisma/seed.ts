import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SUBJECTS = ["Mathematics", "Science", "English"];

const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Mathematics: ["Arithmetic", "Geometry", "Algebra", "Data Handling", "Measurements"],
  Science: ["Plants & Animals", "Human Body", "Matter", "Force & Energy", "Space"],
  English: ["Grammar", "Vocabulary", "Reading Comprehension", "Storytelling", "Writing"],
};

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create Teacher Account
  const hashedPassword = await bcrypt.hash("teacher", 10);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@iasf.org" },
    update: {},
    create: {
      email: "teacher@iasf.org",
      username: "teacher",
      password: hashedPassword,
      name: "Admin Educator",
      role: "EDUCATOR",
    },
  });
  console.log("Created Educator:", teacher.email);

  // 2. Loop through Grades 2-8
  for (let grade = 2; grade <= 8; grade++) {
    console.log(`\n📚 Generating Content for Grade ${grade}...`);

    for (const subject of SUBJECTS) {
      // Create Course
      const course = await prisma.course.create({
        data: {
          title: `Grade ${grade} ${subject}`,
          description: `Complete ${subject} curriculum for Grade ${grade} students.`,
          educatorId: teacher.id,
          // The schema update only added gradeLevel to User and Assignment.
          // We will just put it in the title/desc for now or rely on Assignment gradeLevel.
        },
      });

      const topics = TOPICS_BY_SUBJECT[subject];

      // Create Modules for the Course
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];

        const module = await prisma.module.create({
          data: {
            title: `Unit ${i + 1}: ${topic}`,
            courseId: course.id,
            order: i,
          },
        });

        // Create Content (Text & Lessons)
        await prisma.content.createMany({
          data: [
            {
              moduleId: module.id,
              title: `Introduction to ${topic}`,
              originalText: `Welcome to the unit on ${topic}. In this lesson, we will explore the fundamental concepts suitable for Grade ${grade}.`,
              type: "TEXT",
            },
            {
              moduleId: module.id,
              title: `${topic} - Core Concepts`,
              originalText: `Here are the key points about ${topic}. Remember to practice regularly. This content is designed to be accessible.`,
              type: "TEXT",
            },
          ],
        });

        // Create Assignment
        await prisma.assignment.create({
          data: {
            title: `${topic} Quiz`,
            description: `Assessment for Grade ${grade} ${topic}.`,
            gradeLevel: grade,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due in 7 days
          },
        });
      }
      console.log(`   - Created Course: ${course.title} with ${topics.length} modules.`);
    }
  }

  // 3. Create Sample Students
  const students = [
    { name: "Blind Student", email: "student_blind@iasf.org", impairment: "visual", grade: 5 },
    { name: "Deaf Student", email: "student_deaf@iasf.org", impairment: "hearing", grade: 5 },
  ];

  for (const s of students) {
    const studentPassword = await bcrypt.hash("student", 10);
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        username: s.email.split('@')[0],
        password: studentPassword,
        name: s.name,
        role: "STUDENT",
        gradeLevel: s.grade,
      },
    });

    await prisma.accessibilityProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        visualImpairment: s.impairment === "visual",
        hearingImpairment: s.impairment === "hearing",
      },
    });
    console.log(`Created Student: ${s.name}`);
  }

  console.log("\n✅ Seeding Completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
