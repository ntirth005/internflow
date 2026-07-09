"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ActionResult } from "./auth";
import { ProfileUpdateInputSchema, SubmissionInputSchema } from "@/lib/validation";

// Helper to enforce Student-only access control
async function enforceStudent() {
  const session = await verifySession();
  if (session.role !== "STUDENT") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function updateStudentProfile(formData: unknown): Promise<ActionResult> {
  try {
    const session = await enforceStudent();

    const parsed = ProfileUpdateInputSchema.safeParse(formData);
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

    const { name } = parsed.data;

    await prisma.user.update({
      where: { id: session.userId },
      data: { name },
    });

    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error) {
    console.error("Update student profile error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while updating profile.",
      },
    };
  }
}

export async function toggleTaskCompletion(formData: {
  taskId: string;
  completed: boolean;
}): Promise<ActionResult<{ progress: number }>> {
  try {
    const session = await enforceStudent();

    const { taskId, completed } = formData;
    if (!taskId) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Task ID is required." },
      };
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile || !profile.projectId) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "You do not have an active project assigned.",
        },
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Upsert the completion record
      await tx.studentTaskCompletion.upsert({
        where: {
          studentId_taskId: {
            studentId: profile.id,
            taskId,
          },
        },
        update: { completed },
        create: {
          studentId: profile.id,
          taskId,
          completed,
        },
      });

      // Query total completed tasks
      const completedCount = await tx.studentTaskCompletion.count({
        where: {
          studentId: profile.id,
          completed: true,
        },
      });

      // Get the project details to find the tasks count
      const project = await tx.project.findUnique({
        where: { id: profile.projectId! },
      });

      let totalTasks = 0;
      if (project?.tasks && Array.isArray(project.tasks)) {
        totalTasks = project.tasks.length;
      }

      const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

      // Update student profile progress
      // Transition from ASSIGNED or REJECTED to IN_PROGRESS if they start working
      let newStatus = profile.status;
      if (progress > 0 && progress < 100 && (profile.status === "ASSIGNED" || profile.status === "REJECTED")) {
        newStatus = "IN_PROGRESS";
      }

      await tx.studentProfile.update({
        where: { id: profile.id },
        data: {
          progress,
          status: newStatus,
        },
      });

      return { progress };
    });

    revalidatePath("/dashboard/student");
    return { success: true, data: result };
  } catch (error) {
    console.error("Toggle task completion error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while updating task status.",
      },
    };
  }
}

export async function submitDeliverables(formData: unknown): Promise<ActionResult> {
  try {
    const session = await enforceStudent();

    const parsed = SubmissionInputSchema.safeParse(formData);
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

    const { githubUrl, liveUrl } = parsed.data;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile || !profile.projectId) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "You do not have an active project assigned.",
        },
      };
    }

    // Verify task completion is 100%
    if (profile.progress < 100) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "You must complete all task items before submitting deliverables.",
        },
      };
    }

    await prisma.$transaction(async (tx) => {
      // Upsert submission
      await tx.submission.upsert({
        where: { studentId: profile.id },
        update: {
          githubUrl,
          liveUrl: liveUrl || "",
          submittedAt: new Date(),
        },
        create: {
          studentId: profile.id,
          githubUrl,
          liveUrl: liveUrl || "",
        },
      });

      // Update profile status to SUBMITTED
      await tx.studentProfile.update({
        where: { id: profile.id },
        data: {
          status: "SUBMITTED",
        },
      });
    });

    revalidatePath("/dashboard/student");
    return { success: true };
  } catch (error) {
    console.error("Submit deliverables error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while submitting deliverables.",
      },
    };
  }
}
