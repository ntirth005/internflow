"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import {
  UserCreateInputSchema,
  ProjectTemplateInputSchema,
  AssignProjectSchema,
  AssignMentorSchema,
} from "@/lib/validation";
import { ActionResult } from "./auth";

// Helper to enforce Admin-only access control
async function enforceAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function createUserAction(formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const parsed = UserCreateInputSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const { name, email, password, role } = parsed.data;

    // Check for email conflict
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        success: false,
        error: {
          code: "CONFLICT",
          message: "An account with this email address already exists.",
        },
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile
    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      });

      if (role === "STUDENT") {
        await tx.studentProfile.create({
          data: {
            userId: u.id,
            status: "UNASSIGNED",
            progress: 0.0,
          },
        });
      } else if (role === "MENTOR") {
        await tx.mentorProfile.create({
          data: {
            userId: u.id,
          },
        });
      }

      return u;
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true, data: { userId: newUser.id } };
  } catch (error: unknown) {
    console.error("Create user error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while creating the user.",
      },
    };
  }
}

export async function updateUserAction(id: string, formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const data = formData as { name: string; email: string; role: "STUDENT" | "MENTOR" | "ADMIN" };
    const { name, email, role } = data;
    if (!name || !email || !role) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Missing required fields." },
      };
    }

    // Get current user details
    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: { studentProfile: true, mentorProfile: true },
    });

    if (!currentUser) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "User not found." },
      };
    }

    // Check email conflict if changed
    if (email !== currentUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return {
          success: false,
          error: { code: "CONFLICT", message: "Email is already taken by another user." },
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      // Update User
      await tx.user.update({
        where: { id },
        data: { name, email, role },
      });

      // Handle role-profile swapping if role changed
      if (role !== currentUser.role) {
        // Delete old profile if exists
        if (currentUser.role === "STUDENT") {
          await tx.studentProfile.delete({ where: { userId: id } });
        } else if (currentUser.role === "MENTOR") {
          await tx.mentorProfile.delete({ where: { userId: id } });
        }

        // Create new profile
        if (role === "STUDENT") {
          await tx.studentProfile.create({
            data: { userId: id, status: "UNASSIGNED", progress: 0.0 },
          });
        } else if (role === "MENTOR") {
          await tx.mentorProfile.create({
            data: { userId: id },
          });
        }
      }
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: unknown) {
    console.error("Update user error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while updating the user.",
      },
    };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    await enforceAdmin();

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete user error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while deleting the user.",
      },
    };
  }
}

export async function createProjectTemplateAction(formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const parsed = ProjectTemplateInputSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const { title, description, tasks } = parsed.data;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        tasks: tasks as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/dashboard/admin/projects");
    return { success: true, data: { projectId: project.id } };
  } catch (error: unknown) {
    console.error("Create project error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while creating the project template.",
      },
    };
  }
}

export async function updateProjectTemplateAction(id: string, formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const parsed = ProjectTemplateInputSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const { title, description, tasks } = parsed.data;

    await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        tasks: tasks as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/dashboard/admin/projects");
    return { success: true };
  } catch (error: unknown) {
    console.error("Update project error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while updating the project template.",
      },
    };
  }
}

export async function deleteProjectTemplateAction(id: string): Promise<ActionResult> {
  try {
    await enforceAdmin();

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/projects");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete project error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "Could not delete project template. Verify it is not referenced by any certificates.",
      },
    };
  }
}

export async function assignProjectAction(formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const parsed = AssignProjectSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const { studentId, projectId } = parsed.data;

    await prisma.$transaction(async (tx) => {
      // Set projectId on StudentProfile
      await tx.studentProfile.update({
        where: { id: studentId },
        data: {
          projectId,
          status: "ASSIGNED",
          progress: 0.0,
        },
      });

      // Clear any previous completions
      await tx.studentTaskCompletion.deleteMany({
        where: { studentId },
      });
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: unknown) {
    console.error("Assign project error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while assigning the project.",
      },
    };
  }
}

export async function assignMentorAction(formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const parsed = AssignMentorSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const { studentId, mentorId } = parsed.data;

    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        mentorId,
      },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error: unknown) {
    console.error("Assign mentor error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while assigning the mentor.",
      },
    };
  }
}
