Status: Approved

Version: 1.0

Depends On:
- docs/Architecture/06_Frontend_Architecture.md

Blocks:
- docs/Architecture/08_Database_Architecture.md

Owner:
Lead Architect

---

# 07 - Backend Architecture

## 1. Document Purpose
This document defines the backend server workflows, Next.js Server Actions execution middleware, role-based authorization security routing, session token validation, and logging policies.

## 2. Authentication & Authorization Workflow

### 2.1 JSON Web Token (JWT) Authentication
Authentication tokens are issued as stateless JSON Web Tokens (JWT) and stored inside a secure, encrypted `httpOnly`, `sameSite=lax`, `secure` cookie named `sb_session`:
- **JWT Alg**: HS256
- **Token Duration**: 7 Days
- **Session Payload Fields**:
  ```typescript
  interface SessionPayload {
    userId: string;       // Unique User UUID
    email: string;        // Account email address
    role: "STUDENT" | "MENTOR" | "ADMIN";
    iat: number;          // Timestamp when issued
    exp: number;          // Timestamp when expired
  }
  ```

### 2.2 Role-Based Middleware Checks (RBAC)
Next.js Edge middleware (`src/middleware.ts`) runs on every incoming request matching the `/dashboard/:path*` pattern:
1. **Decryption and Verification**: The middleware reads the `sb_session` cookie and decrypts it using the server-only environmental variable `JWT_SECRET`.
2. **Redirect Triggers**:
   - If the cookie is absent or verification fails, redirect the user to `/login`.
   - If the user attempts to access a path group that does not match their verified role, redirect them back to their appropriate home dashboard:
     - `/dashboard/student/:path*` -> Requires role `STUDENT`
     - `/dashboard/mentor/:path*` -> Requires role `MENTOR`
     - `/dashboard/admin/:path*` -> Requires role `ADMIN`

---

## 3. Server Actions & Mutations Security
Next.js Server Actions execute on the server but are compiled as endpoint paths. We enforce three security layers for every action:
1. **Session Auditing**: The action invokes a helper function `verifySession()` which reads headers, validates the session, and returns the caller's UUID and role.
2. **Access Control (RBAC)**: Enforce role requirements at the code execution level:
   ```typescript
   if (caller.role !== "ADMIN") {
     throw new Error("Unauthorized: Action requires Administrator access.");
   }
   ```
3. **Payload Sanitization (Zod)**: All input arguments pass through strict Zod schemas before database execution (e.g., parsing URLs, inputs, and IDs).
4. **Ownership Verification**: Actions modifying resources verify that the requester owns or is assigned to the target item (e.g., student matching the `studentId` parameter on checklist update actions).

---

## 4. Operational Logging
- **Console Log Output**: System logs operational events (e.g., `auth:register_success`, `submission:submitted`, `certificate:issued`) to stdout.
- **GDPR and Privacy Boundaries**: No plaintext passwords, email credentials, JWT strings, or certificate private hashes are permitted in logs.
- **Failures**: Database execution failures return user-friendly error codes (`DB_CONCURRENCY_ERROR`, `RECORD_NOT_FOUND`) to the client without exposing SQL structure details.

## 5. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed BE Implementation Specification | Status |
|:---|:---|:---|:---:|
| **BE-REQ-01** | Secure Authentication | JWT session payloads locked inside HttpOnly cookies | ✅ Cover |
| **BE-REQ-02** | RBAC Routing Middleware | Edge Middleware matching routes to JWT roles dynamically | ✅ Cover |
| **BE-REQ-03** | Server Mutations Security | Multi-layered validation (Zod, Session checks, Ownership verify) | ✅ Cover |

## 6. Architecture Review Checklist
- [x] Direct routing middlewares check authentication credentials
- [x] Safe validation of variables and payload parameters
- [x] System operates cleanly without external server processes (excluding Vercel Serverless)
- [x] Logging parameters prevent credentials leaking

