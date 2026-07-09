"use server";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth";
import { RegisterInputSchema, LoginInputSchema } from "@/lib/validation";

export type ActionResult<T = unknown> =
  | { success: true; data?: T; redirectUrl?: string }
  | { success: false; error: { code: string; message: string; details?: unknown } };

export async function registerAction(formData: unknown): Promise<ActionResult> {
  try {
    const parsed = RegisterInputSchema.safeParse(formData);
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

    const { name, email, password } = parsed.data;

    // Check for existing user
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

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "STUDENT",
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: u.id,
          status: "UNASSIGNED",
          progress: 0.0,
        },
      });

      return u;
    });

    // Sign JWT and set cookie
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: "STUDENT",
    });

    const cookieStore = await cookies();
    cookieStore.set("sb_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "STUDENT" as const,
      },
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred during registration.",
      },
    };
  }
}

export async function loginAction(formData: unknown): Promise<ActionResult> {
  console.log("[Server Login] Action invoked. Input type:", typeof formData);
  try {
    const parsed = LoginInputSchema.safeParse(formData);
    if (!parsed.success) {
      console.log("[Server Login] Validation failed:", parsed.error.flatten().fieldErrors);
      return {
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
      };
    }

    const { email, password } = parsed.data;
    console.log("[Server Login] Input validation passed for email:", email);

    // Fetch user
    console.log("[Server Login] Fetching user from database...");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("[Server Login] No user found with email:", email);
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid email or password credentials.",
        },
      };
    }
    console.log("[Server Login] User found in database. Role:", user.role);

    // Compare password hash
    console.log("[Server Login] Comparing password hash...");
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.log("[Server Login] Password mismatch for user:", email);
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid email or password credentials.",
        },
      };
    }
    console.log("[Server Login] Password matches successfully.");

    // Sign JWT and set cookie
    console.log("[Server Login] Signing session JWT...");
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    console.log("[Server Login] Session JWT signed successfully.");

    console.log("[Server Login] Setting sb_session cookie...");
    const cookieStore = await cookies();
    cookieStore.set("sb_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    console.log("[Server Login] Cookie sb_session set complete.");

    // Return redirect destination
    const redirectUrl = `/dashboard/${user.role.toLowerCase()}`;
    console.log("[Server Login] Login successful. Returning redirectUrl:", redirectUrl);
    return {
      success: true,
      redirectUrl,
    };
  } catch (error) {
    console.error("[Server Login] Error occurred during login process:", error);
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An internal database error occurred during login.",
      },
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("sb_session");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: {
        code: "DB_ERROR",
        message: "An error occurred during logout.",
      },
    };
  }
}
