"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ActionResult } from "./auth";
import { ReviewInputSchema } from "@/lib/validation";

// Helper to enforce Mentor-only (or Admin) access control
async function enforceMentor() {
  const session = await verifySession();
  if (session.role !== "MENTOR" && session.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function submitReview(formData: unknown): Promise<ActionResult> {
  try {
    const session = await enforceMentor();

    const parsed = ReviewInputSchema.safeParse(formData);
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

    const { studentId, comments, decision } = parsed.data;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!studentProfile) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Student profile not found." },
      };
    }

    if (studentProfile.status !== "SUBMITTED") {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "This student does not have an active submission pending review.",
        },
      };
    }

    await prisma.$transaction(async (tx) => {
      // Create feedback log
      await tx.feedback.create({
        data: {
          studentId,
          mentorId: session.userId,
          comments,
          decision,
        },
      });

      // Update student status
      const nextStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
      await tx.studentProfile.update({
        where: { id: studentId },
        data: {
          status: nextStatus,
        },
      });
    });

    revalidatePath("/dashboard/mentor");
    revalidatePath(`/dashboard/mentor/students/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error("Submit review error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while submitting review.",
      },
    };
  }
}
