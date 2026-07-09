"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ActionResult } from "./auth";
import { CertificateInputSchema } from "@/lib/validation";
import { generateCertificateHash } from "@/lib/certificate";

// Helper to enforce Admin-only access control
async function enforceAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function issueCertificateAction(formData: unknown): Promise<ActionResult> {
  try {
    await enforceAdmin();

    const parsed = CertificateInputSchema.safeParse(formData);
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

    const { studentId } = parsed.data;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!studentProfile) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Student profile not found." },
      };
    }

    if (studentProfile.status !== "APPROVED") {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Student project must be in APPROVED state to issue a certificate.",
        },
      };
    }

    if (!studentProfile.projectId) {
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Student does not have an active project assigned.",
        },
      };
    }

    const issuedAt = new Date();
    const hashSignature = generateCertificateHash(studentProfile.id, studentProfile.projectId, issuedAt);

    await prisma.$transaction(async (tx) => {
      // Create Certificate
      await tx.certificate.create({
        data: {
          studentId: studentProfile.id,
          projectId: studentProfile.projectId!,
          hashSignature,
          issuedAt,
          verified: true,
        },
      });

      // Update Student status to CERTIFIED
      await tx.studentProfile.update({
        where: { id: studentProfile.id },
        data: {
          status: "CERTIFIED",
        },
      });
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Issue certificate error:", error);
    const err = error as Error;
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return { success: false, error: { code: err.message, message: "Access denied." } };
    }
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred while generating certificate.",
      },
    };
  }
}
