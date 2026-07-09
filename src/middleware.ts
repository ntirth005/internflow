import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_purposes_only";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sb_session")?.value;

  console.log(`[Middleware] Pathname: ${pathname} | sb_session cookie present: ${!!sessionToken}`);

  // 1. Verify token
  let payload: { userId: string; email: string; role: string } | null = null;
  if (sessionToken) {
    try {
      const { payload: verifiedPayload } = await jwtVerify(sessionToken, key, {
        algorithms: ["HS256"],
      });
      payload = verifiedPayload as unknown as { userId: string; email: string; role: string };
      console.log(`[Middleware] JWT verified. User ID: ${payload.userId} | Role: ${payload.role}`);
    } catch (e) {
      console.error("[Middleware] JWT Verification failed error:", e);
    }
  }

  // 2. Redirect unauthenticated users trying to access dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      console.log(`[Middleware] Unauthenticated access to ${pathname}. Redirecting to /login`);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Enforce Role-Based Access Control (RBAC)
    const role = payload.role;

    // Handle base dashboard route redirect
    if (pathname === "/dashboard") {
      const dashboardHome = new URL(`/dashboard/${role.toLowerCase()}`, request.url);
      console.log(`[Middleware] Base dashboard hit. Redirecting to home: ${dashboardHome.pathname}`);
      return NextResponse.redirect(dashboardHome);
    }

    // Direct dashboard checks
    if (pathname.startsWith("/dashboard/student") && role !== "STUDENT") {
      const fallbackUrl = new URL(`/dashboard/${role.toLowerCase()}`, request.url);
      console.log(`[Middleware] Access violation: ${pathname} by ${role}. Redirecting to: ${fallbackUrl.pathname}`);
      return NextResponse.redirect(fallbackUrl);
    }

    if (pathname.startsWith("/dashboard/mentor") && role !== "MENTOR") {
      const fallbackUrl = new URL(`/dashboard/${role.toLowerCase()}`, request.url);
      console.log(`[Middleware] Access violation: ${pathname} by ${role}. Redirecting to: ${fallbackUrl.pathname}`);
      return NextResponse.redirect(fallbackUrl);
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      const fallbackUrl = new URL(`/dashboard/${role.toLowerCase()}`, request.url);
      console.log(`[Middleware] Access violation: ${pathname} by ${role}. Redirecting to: ${fallbackUrl.pathname}`);
      return NextResponse.redirect(fallbackUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
