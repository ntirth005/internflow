Status: Approved

Version: 1.0

Depends On:
- docs/Architecture/08_Database_Architecture.md

Blocks:
- docs/Design/10_Design_System.md

Owner:
Lead Architect

---

# 09 - API Architecture

## 1. Document Purpose
This document specifies the Next.js Server Actions and Route Handlers for the SkillBridge Internship Management Portal (IMP). It outlines input/output payload structures, cryptographic verification algorithms, Zod validation schemas, and standard error-handling protocols.

---

## 2. Next.js Server Actions (Mutations)

All state-modifying actions execute on the server. They enforce security checks by validating JWT payloads via the `verifySession()` helper and parsing inputs using Zod.

### 2.1 Security Middleware & Access Controls
Every Server Action must execute the following sequence:
1. **`verifySession()` Check**: Decrypt the `sb_session` cookie. If missing or invalid, return `UNAUTHORIZED` (401).
2. **Role Verification (RBAC)**: Check if the session user's role matches the required role. If not, return `FORBIDDEN` (403).
3. **Zod Parsing**: Parse the input arguments. If validation fails, return `BAD_REQUEST` (400) with field-level details.
4. **Ownership Verification**: For actions modifying student-specific resources (checklist, submissions), ensure the calling user owns the record or is the assigned mentor.

---

### 2.2 Auth Server Actions

#### `registerAction(data: RegisterInput): Promise<ActionResult>`
- **Role Access**: Public
- **Zod Schema**: `RegisterInputSchema`
- **Behavior**:
  - Validates email is unique in the database.
  - Hashes the password using `bcrypt` (10 salt rounds).
  - Creates a `User` entity with role `STUDENT` and an associated empty `StudentProfile`.
  - Generates a JWT token and sets it in the `sb_session` HTTP-only, secure cookie.
- **Success Response**: `{ success: true, user: { id: string, name: string, email: string, role: "STUDENT" } }`

#### `loginAction(data: LoginInput): Promise<ActionResult>`
- **Role Access**: Public
- **Zod Schema**: `LoginInputSchema`
- **Behavior**:
  - Fetches the user by email.
  - Compares the password hash.
  - Generates a JWT token signed with `JWT_SECRET` containing the payload: `{ userId, email, role }`.
  - Sets the `sb_session` cookie (HttpOnly, Secure, SameSite=Lax, 7-day expiry).
- **Success Response**: `{ success: true, redirectUrl: "/dashboard/student" | "/dashboard/mentor" | "/dashboard/admin" }`

#### `logoutAction(): Promise<ActionResult>`
- **Role Access**: Authenticated (Student, Mentor, Admin)
- **Behavior**:
  - Deletes the `sb_session` cookie.
- **Success Response**: `{ success: true }`

---

### 2.3 Student Server Actions

#### `updateStudentProfile(data: ProfileUpdateInput): Promise<ActionResult>`
- **Role Access**: Student (Self)
- **Zod Schema**: `ProfileUpdateInputSchema`
- **Behavior**:
  - Updates the student's name in the `User` record.
- **Success Response**: `{ success: true }`

#### `toggleTaskCompletion(data: TaskToggleInput): Promise<ActionResult>`
- **Role Access**: Student (Self)
- **Zod Schema**: `TaskToggleInputSchema`
- **Behavior**:
  - Checks if the task is defined in the student's assigned `Project.tasks` JSON array.
  - Creates or updates a `StudentTaskCompletion` record.
  - Recalculates the student's overall progress percentage as:
    $$\text{progress} = \left( \frac{\text{Count of Completed Tasks}}{\text{Total Tasks in Project Template}} \right) \times 100$$
  - Commits the updated `progress` float to the `StudentProfile`.
- **Success Response**: `{ success: true, progress: number }`

#### `submitDeliverables(data: SubmissionInput): Promise<ActionResult>`
- **Role Access**: Student (Self)
- **Zod Schema**: `SubmissionInputSchema`
- **Behavior**:
  - Verifies that all tasks in the project template are marked complete (`progress === 100.0`).
  - Creates or updates the student's `Submission` record with `githubUrl` and `liveUrl`.
  - Transitions `StudentProfile.status` to `SUBMITTED`.
- **Success Response**: `{ success: true, status: "SUBMITTED" }`

---

### 2.4 Mentor Server Actions

#### `submitReview(data: ReviewInput): Promise<ActionResult>`
- **Role Access**: Mentor
- **Zod Schema**: `ReviewInputSchema`
- **Behavior**:
  - Verifies the mentor is assigned to this student profile (or is an Admin override).
  - Creates a `Feedback` record containing comments and the decision (`APPROVE` or `REJECT`).
  - Transitions `StudentProfile.status` based on decision:
    - `APPROVE` -> `APPROVED`
    - `REJECT` -> `REJECTED`
- **Success Response**: `{ success: true, status: "APPROVED" | "REJECTED" }`

---

### 2.5 Admin Server Actions

#### `createUser(data: UserCreateInput): Promise<ActionResult>`
- **Role Access**: Admin
- **Zod Schema**: `UserCreateInputSchema`
- **Behavior**:
  - Creates a new `User` account (Student, Mentor, or Admin).
  - Instantiates corresponding `StudentProfile` or `MentorProfile` entities.
- **Success Response**: `{ success: true, userId: string }`

#### `updateUser(id: string, data: UserUpdateInput): Promise<ActionResult>`
- **Role Access**: Admin
- **Behavior**:
  - Modifies name, email, or role on target `User` record.
- **Success Response**: `{ success: true }`

#### `deleteUser(id: string): Promise<ActionResult>`
- **Role Access**: Admin
- **Behavior**:
  - Deletes the target user. Database cascade constraints handle deleting child profiles, submissions, task completions, and feedbacks.
- **Success Response**: `{ success: true }`

#### `createProjectTemplate(data: ProjectTemplateInput): Promise<ActionResult>`
- **Role Access**: Admin
- **Zod Schema**: `ProjectTemplateInputSchema`
- **Behavior**:
  - Saves a new project template to the database.
- **Success Response**: `{ success: true, projectId: string }`

#### `updateProjectTemplate(id: string, data: ProjectTemplateInput): Promise<ActionResult>`
- **Role Access**: Admin
- **Behavior**:
  - Modifies title, description, and checklist items.
- **Success Response**: `{ success: true }`

#### `deleteProjectTemplate(id: string): Promise<ActionResult>`
- **Role Access**: Admin
- **Behavior**:
  - Deletes the project template. Fails if a certificate referencing this project has already been generated (`onDelete: Restrict`).
- **Success Response**: `{ success: true }`

#### `assignProject(data: AssignProjectSchema): Promise<ActionResult>`
- **Role Access**: Admin
- **Zod Schema**: `AssignProjectSchema`
- **Behavior**:
  - Sets `projectId` in `StudentProfile`.
  - Clears any previous `StudentTaskCompletion` records for this student.
  - Resets progress to `0.0` and status to `ASSIGNED`.
- **Success Response**: `{ success: true }`

#### `assignMentor(data: AssignMentorSchema): Promise<ActionResult>`
- **Role Access**: Admin
- **Zod Schema**: `AssignMentorSchema`
- **Behavior**:
  - Sets `mentorId` in `StudentProfile`.
- **Success Response**: `{ success: true }`

#### `generateCertificate(data: CertificateInput): Promise<ActionResult>`
- **Role Access**: Admin
- **Zod Schema**: `CertificateInputSchema`
- **Behavior**:
  - Verifies `StudentProfile.status` is `APPROVED`.
  - Retrieves student's `id`, `name`, and the assigned project's `id` and `title`.
  - Captures `issuedAt` as the current UTC timestamp in ISO-8601 format (e.g. `2026-07-09T09:30:00.000Z`).
  - **Constructs the canonical signing payload** by joining three fixed fields with a pipe delimiter:
    ```
    canonicalPayload = studentId + "|" + projectId + "|" + issuedAt
    ```
    > **Rationale for payload fields**: `studentId` and `projectId` are stable UUIDs that uniquely identify the parties. `issuedAt` adds a time component preventing replay of the same payload across re-issues. Human-readable fields (name, title) are intentionally excluded because they are mutable — renaming a student or project would break existing signatures.
  - **Computes HMAC-SHA256** using Node.js `crypto` module with the server-only secret:
    ```typescript
    import { createHmac } from "crypto";

    function computeCertificateHMAC(
      studentId: string,
      projectId: string,
      issuedAt: string // ISO-8601 UTC string, e.g. new Date().toISOString()
    ): string {
      const secret = process.env.CERT_SIGNING_SECRET;
      if (!secret) throw new Error("CERT_SIGNING_SECRET env var is not set");
      const payload = `${studentId}|${projectId}|${issuedAt}`;
      return createHmac("sha256", secret).update(payload).digest("hex");
    }
    ```
    - **Key**: `process.env.CERT_SIGNING_SECRET` — a minimum 32-byte random hex string stored exclusively in server-side environment variables (`.env.local` locally; Vercel Environment Variables in production). It is **never exposed to the client**.
    - **Output**: A 64-character lowercase hex string (256-bit HMAC digest).
  - Creates the `Certificate` record mapping: `id` (new UUID), `studentId`, `projectId`, `hashSignature` (the HMAC output), and `issuedAt`.
  - Updates `StudentProfile.status` to `CERTIFIED`.
- **Success Response**: `{ success: true, certificateId: string }`

##### Certificate Verification Function Signature
The public `/api/verify/[certId]` route reconstructs and validates the signature server-side:
```typescript
async function verifyCertificateSignature(certId: string): Promise<boolean> {
  // 1. Fetch the stored Certificate record by UUID
  const cert = await prisma.certificate.findUnique({ where: { id: certId } });
  if (!cert) return false;

  // 2. Recompute HMAC over the same canonical payload using the same secret
  const expected = computeCertificateHMAC(
    cert.studentId,
    cert.projectId,
    cert.issuedAt.toISOString()
  );

  // 3. Constant-time comparison to prevent timing attacks
  const { timingSafeEqual } = await import("crypto");
  return timingSafeEqual(
    Buffer.from(cert.hashSignature, "hex"),
    Buffer.from(expected, "hex")
  );
}
```
> **Security note**: `timingSafeEqual` prevents timing side-channel attacks that could otherwise leak information by measuring how long a string comparison takes.


---

## 3. Public API Route Handlers

The application exposes a single read-only public endpoint to allow external verification of completion credentials.

### `GET /api/verify/[certId]`
- **Request Parameters**:
  - `certId` (URL Path Parameter): The UUID of the certificate record.
- **Access Level**: Public (No authentication required)
- **Response Format**: `JSON`
- **Verification Mechanism**: Calls `verifyCertificateSignature(certId)` server-side. Fetches the stored `Certificate` by UUID, recomputes `HMAC-SHA256(studentId|projectId|issuedAt, CERT_SIGNING_SECRET)`, and performs a constant-time comparison against `Certificate.hashSignature`. Returns `valid: false` on any mismatch or missing record.
- **Success Response (200 OK)**:
  ```json
  {
    "valid": true,
    "certificate": {
      "id": "c1a01c3e-2b4a-4d7a-8f9b-6d9b4b0d0c3e",
      "studentName": "John Doe",
      "projectTitle": "IMP Portal System Development",
      "issuedAt": "2026-07-09T09:29:00.000Z",
      "hashSignature": "9b12a83c74e892d3cf8813e01a8f902264bd9f02c63ef281b37dd12a201de33c"
    }
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "valid": false,
    "error": {
      "code": "NOT_FOUND",
      "message": "No matching certificate record was found."
    }
  }
  ```

---

## 4. Zod Input Validation Schemas

Standardized validation objects imported by both the client layouts and the Server Actions.

```typescript
import { z } from "zod";

// Authentication Schemas
export const RegisterInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const LoginInputSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

// Student Profile Updates
export const ProfileUpdateInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

// Student Task Progress Checklists
export const TaskToggleInputSchema = z.object({
  taskId: z.string().uuid("Invalid task ID format"),
  completed: z.boolean(),
});

// Student Deliverable Submissions
export const SubmissionInputSchema = z.object({
  githubUrl: z
    .string()
    .url("Invalid URL format")
    .regex(/github\.com\//, "Must be a valid GitHub repository URL"),
  liveUrl: z.string().url("Invalid URL format"),
});

// Mentor Review Form
export const ReviewInputSchema = z.object({
  studentId: z.string().uuid("Invalid student ID format"),
  comments: z.string().min(10, "Feedback comments must be at least 10 characters long"),
  decision: z.enum(["APPROVE", "REJECT"]),
});

// Admin Control Panel Schemas
export const UserCreateInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]),
});

export const ProjectTemplateInputSchema = z.object({
  title: z.string().min(5, "Project title must be at least 5 characters"),
  description: z.string().min(20, "Project description must be at least 20 characters"),
  tasks: z.array(
    z.object({
      id: z.string().uuid(),
      label: z.string().min(3, "Task description must be at least 3 characters"),
      position: z.number().int().nonnegative(),
    })
  ).min(1, "Project template must contain at least 1 task checklist item"),
});

export const AssignProjectSchema = z.object({
  studentId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const AssignMentorSchema = z.object({
  studentId: z.string().uuid(),
  mentorId: z.string().uuid(),
});

export const CertificateInputSchema = z.object({
  studentId: z.string().uuid(),
});
```

---

## 5. API Response Codes & Error Protocols

To maintain uniform API structures, all error exceptions are formatted using a standard layout and HTTP response mapping.

### 5.1 Standard Error Payload
All rejected Server Actions and API responses return an error container:
```typescript
interface APIErrorPayload {
  success: false;
  error: {
    code: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "DB_ERROR";
    message: string;
    details?: any; // Field-level errors (e.g. Zod validation issues)
  };
}
```

### 5.2 HTTP Response Mappings

| Error Code | HTTP Status | Contextual Trigger |
|:---|:---|:---|
| `BAD_REQUEST` | 400 | Missing request parameters or Zod validation parsing failure. |
| `UNAUTHORIZED` | 401 | Authenticated cookie `sb_session` missing or verification failed. |
| `FORBIDDEN` | 403 | Authenticated user role does not match required RBAC boundaries. |
| `NOT_FOUND` | 404 | Database row query returned no matching entities (e.g., verify lookup). |
| `CONFLICT` | 409 | Attempting to create duplicate unique entity columns (e.g., existing user email). |
| `DB_ERROR` | 500 | Database connection failures, transaction aborts, or constraint violation. |

---

## 6. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed API Architecture Specification | Status |
|:---|:---|:---|:---:|
| **API-REQ-01** | Student Submission | `submitDeliverables` action validates GitHub/Live URLs and checks progress | ✅ Covered |
| **API-REQ-02** | Mentor Decision | `submitReview` writes feedback and toggles state to `APPROVED` or `REJECTED` | ✅ Covered |
| **API-REQ-03** | Admin Certificate | `generateCertificate` computes `HMAC-SHA256(studentId\|projectId\|issuedAt, CERT_SIGNING_SECRET)` and stores the 64-char hex digest as `hashSignature`; `verifyCertificateSignature` recomputes server-side using `timingSafeEqual` | ✅ Covered |
| **API-REQ-04** | Security RBAC | Standard middleware verifies session parameters and roles on execution | ✅ Covered |
| **API-REQ-05** | Public Lookups | `GET /api/verify/[certId]` route exposes authentic metadata to public requests | ✅ Covered |

---

## 7. Architecture Review Checklist
- [x] Direct routing payloads mapped to validation checkers (Zod schemas defined)
- [x] Safe verification routes handle invalid/non-existent certificates (server-side HMAC recomputation + `timingSafeEqual` guard)
- [x] Certificate signing uses HMAC-SHA256 with canonical payload `studentId|projectId|issuedAt` and server-only `CERT_SIGNING_SECRET` env var
- [x] Responses enforce consistent JSON layout formatting (success and error types defined)
- [x] No structural drift from Project Constitution (restricted to standard student, mentor, admin roles and actions)
