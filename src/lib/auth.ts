import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_purposes_only";
const key = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function verifySession(): Promise<JWTPayload> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sb_session")?.value;

  if (!sessionToken) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = await verifyJWT(sessionToken);
  if (!payload) {
    throw new Error("UNAUTHORIZED");
  }

  return payload;
}
