import React from "react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // Guard access to admin role only
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm">You do not have permission to view the User Management Directory.</p>
      </div>
    );
  }

  // Fetch all users with their profile data
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      studentProfile: {
        include: {
          project: {
            select: { title: true },
          },
          mentor: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });

  // Fetch all mentors for dropdown allocations
  const mentors = await prisma.mentorProfile.findMany({
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  // Fetch all projects for dropdown allocations
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  // Format users to match expected typing structures
  const formattedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    studentProfile: u.studentProfile
      ? {
          id: u.studentProfile.id,
          projectId: u.studentProfile.projectId,
          mentorId: u.studentProfile.mentorId,
          status: u.studentProfile.status,
          progress: u.studentProfile.progress,
          project: u.studentProfile.project,
          mentor: u.studentProfile.mentor,
        }
      : null,
  }));

  return (
    <UsersClient
      users={formattedUsers}
      mentors={mentors}
      projects={projects}
    />
  );
}
