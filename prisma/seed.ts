import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

function generateCertificateHash(
  studentId: string,
  projectId: string,
  issuedAt: Date
): string {
  const payload = `${studentId}|${projectId}|${issuedAt.toISOString()}`;
  const secret = process.env.CERTIFICATE_SECRET || "skillbridge_certificate_hmac_sha256_private_secret_key";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

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

  // 1. Create Project template
  const defaultProject = await prisma.project.create({
    data: {
      title: "React & Next.js Core Milestone",
      description: "Build a production-ready application layout utilizing app-routing grids, Edge middleware role security, and Server Actions database transitions.",
      tasks: [
        { id: "e1b20ad3-6df5-4ab2-9e20-80a563914a80", label: "Initialize folder structures and Next.js workspace configurations", position: 0 },
        { id: "a758ff21-c4d6-4447-9759-cd912bc0b985", label: "Configure Prisma database connection pools and migrations", position: 1 },
        { id: "3bd9a941-86d1-419b-ab25-2ff112ef2c2c", label: "Implement JWT signing layers and Edge cookies RBAC filters", position: 2 },
        { id: "fc82d56a-11d2-4309-9524-11cfba6e2b10", label: "Design atomic inputs, buttons, and layouts sidebar boxes", position: 3 },
      ],
    },
  });
  console.log(`Created Default Project Template: ${defaultProject.title}`);

  // 2. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@interflow.co.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`Created Admin: ${admin.email}`);

  // 3. Create Mentor
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

  // 4. Create John Doe (Student in progress)
  const johnUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "student@interflow.co.in",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
  });

  const johnProfile = await prisma.studentProfile.create({
    data: {
      userId: johnUser.id,
      projectId: defaultProject.id,
      mentorId: mentorProfile.id,
      status: "ASSIGNED",
      progress: 0.0,
    },
  });
  console.log(`Created Student John Doe: ${johnUser.email} (Profile ID: ${johnProfile.id})`);

  // 5. Create Jane Graduate (Pre-certified demo Student)
  const janeUser = await prisma.user.create({
    data: {
      name: "Jane Graduate",
      email: "certified@interflow.co.in",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
  });

  const janeProfile = await prisma.studentProfile.create({
    data: {
      userId: janeUser.id,
      projectId: defaultProject.id,
      mentorId: mentorProfile.id,
      status: "CERTIFIED",
      progress: 100.0,
    },
  });

  // Add completions for Jane
  await prisma.studentTaskCompletion.createMany({
    data: [
      { studentId: janeProfile.id, taskId: "e1b20ad3-6df5-4ab2-9e20-80a563914a80", completed: true },
      { studentId: janeProfile.id, taskId: "a758ff21-c4d6-4447-9759-cd912bc0b985", completed: true },
      { studentId: janeProfile.id, taskId: "3bd9a941-86d1-419b-ab25-2ff112ef2c2c", completed: true },
      { studentId: janeProfile.id, taskId: "fc82d56a-11d2-4309-9524-11cfba6e2b10", completed: true },
    ],
  });

  // Add submission for Jane
  await prisma.submission.create({
    data: {
      studentId: janeProfile.id,
      githubUrl: "https://github.com/jane-graduate/next-core-milestone",
      liveUrl: "https://next-core-milestone.vercel.app",
    },
  });

  // Generate certificate for Jane
  const issuedAt = new Date();
  const hashSignature = generateCertificateHash(janeProfile.id, defaultProject.id, issuedAt);

  await prisma.certificate.create({
    data: {
      studentId: janeProfile.id,
      projectId: defaultProject.id,
      hashSignature,
      issuedAt,
      verified: true,
    },
  });

  console.log(`Created Certified Demo Student: ${janeUser.email} (Profile ID: ${janeProfile.id})`);
  console.log(`Pre-generated Certificate Hash: ${hashSignature}`);
  console.log(`Verification demo URL: http://localhost:3000/verify/${hashSignature}`);

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
