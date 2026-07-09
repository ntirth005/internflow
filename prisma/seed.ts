import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data (using a transaction for safety)
  await prisma.$transaction([
    prisma.certificate.deleteMany(),
    prisma.feedback.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.studentTaskCompletion.deleteMany(),
    prisma.studentProfile.deleteMany(),
    prisma.mentorProfile.deleteMany(),
    prisma.user.deleteMany(),
    prisma.project.deleteMany(),
  ]);

  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash("password123", saltRounds);
  const mentorPasswordHash = await bcrypt.hash("password123", saltRounds);
  const studentPasswordHash = await bcrypt.hash("password123", saltRounds);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@interflow.co.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`Created Admin: ${admin.email}`);

  // 2. Create Mentor
  const mentorUser = await prisma.user.create({
    data: {
      name: "Alice Smith",
      email: "mentor@interflow.co.in",
      passwordHash: mentorPasswordHash,
      role: "MENTOR",
    },
  });

  const mentorProfile = await prisma.mentorProfile.create({
    data: {
      userId: mentorUser.id,
    },
  });
  console.log(`Created Mentor: ${mentorUser.email} (Profile ID: ${mentorProfile.id})`);

  // 3. Create Student
  const studentUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "student@interflow.co.in",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
  });

  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      status: "UNASSIGNED",
      progress: 0.0,
    },
  });
  console.log(`Created Student: ${studentUser.email} (Profile ID: ${studentProfile.id})`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
