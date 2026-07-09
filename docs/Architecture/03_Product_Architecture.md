Status: Approved

Version: 1.0

Depends On:
- docs/01_Project_Constitution.md
- docs/02_Documentation_Index.md

Blocks:
- docs/Architecture/04_UX_Architecture.md

Owner:
Lead Architect

---

# 03 - Product Architecture

## 1. Document Purpose
This document defines the high-level product architecture, user roles, state-flow mappings, and key functional flows of the SkillBridge Internship Management Portal (IMP).

## 2. Core User Flows

### 2.1 Student Registration & Onboarding
Users sign up through `/register` or log in through `/login`. Next.js Server Actions validate the request and perform password hashing (via bcrypt) before committing user records to PostgreSQL. The Next.js Middleware intercepts request routes and validates session JWTs to enforce Role-Based Access Control (RBAC) redirect mappings:
- **Student** -> `/dashboard/student`
- **Mentor** -> `/dashboard/mentor`
- **Administrator** -> `/dashboard/admin`

```mermaid
sequenceDiagram
    participant User as User (Student)
    participant Client as Next.js Client App
    participant Middleware as Next.js RBAC Middleware
    participant Action as Server Action (Auth)
    participant DB as PostgreSQL DB
    
    User->>Client: Open /register
    Client->>User: Display register form
    User->>Client: Input email, name, password
    Client->>Action: Invoke registerAction()
    Action->>Action: Validate fields (Zod)
    Action->>DB: Check if email exists
    DB-->>Action: Email free
    Action->>Action: Hash password (bcrypt)
    Action->>DB: Create User record (role: STUDENT)
    DB-->>Action: Success
    Action->>Action: Set JWT cookie session
    Action-->>Client: Success response
    Client->>Middleware: Navigate to /dashboard
    Middleware->>Middleware: Read JWT & extract role (STUDENT)
    Middleware-->>Client: Allow /dashboard/student
```

### 2.2 Project Allocation & Tracking
Once registered, students remain in an `UNASSIGNED` state until an Administrator assigns them a project template. Assigned projects display as structured task lists with checkboxes. The student's progress updates in real-time as they complete and toggle task items.

```mermaid
stateDiagram-v2
    [*] --> UNASSIGNED : Student Created
    UNASSIGNED --> ASSIGNED : Admin Assigns Project
    ASSIGNED --> IN_PROGRESS : Student checks first task
    IN_PROGRESS --> SUBMITTED : Student submits repo & deployment URLs
    REJECTED --> SUBMITTED : Student updates & resubmits links
    SUBMITTED --> REJECTED : Mentor rejects with feedback
    SUBMITTED --> APPROVED : Mentor approves
    APPROVED --> CERTIFIED : Admin generates certificate
    CERTIFIED --> [*]
```

### 2.3 Mentor Submission Review Lifecycle
When a student completes all tasks and inputs both their GitHub repository and live deployment URLs, their status transitions to `SUBMITTED`. The submission is pushed to the assigned Mentor's dashboard queue. Mentors audit the source code and deployment directly, providing structured comments in a feedback editor before issuing a final decision:
- **Approve**: Transition student status to `APPROVED`, unlocking certificate generation.
- **Reject**: Transition student status to `REJECTED`, allowing resubmission.

```mermaid
flowchart TD
    M[Mentor Dashboard] -->|View Queue| Q[Submissions Review Queue]
    Q -->|Select Student| S[Student Submission Detail]
    S -->|Inspect Deliverables| D[GitHub Link & Live URL]
    S -->|Write Feedback| F[Structured Feedback Editor]
    S -->|Action: Approve| App[Approve Submission]
    S -->|Action: Reject| Rej[Reject Submission]
    App -->|Update State to APPROVED| DB[(PostgreSQL)]
    Rej -->|Update State to REJECTED| DB
    DB -->|Notify Student via Dashboard| Stud[Student Dashboard updates]
```

### 2.4 Certificate Issuance & Verification
Once marked as `APPROVED` by their mentor, the student appears in the Admin dashboard. The administrator clicks "Generate Certificate". The platform generates a unique certificate record containing:
1. A unique UUID (Certificate ID).
2. A cryptographically verifiable signature hash derived using SHA-256 over the student's name, project details, issue date, and a private environment secret.

Students can download their certificate as a PDF directly from their dashboard. Public users (e.g. recruiters) can query `/verify?id=[id]` to inspect and verify the authenticity of the certificate.

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant System as Next.js Server Actions
    participant DB as PostgreSQL DB
    participant Student as Student Dashboard
    participant Public as Public Verify Route

    Admin->>System: Click "Generate Certificate" for Approved Student
    System->>System: Generate Certificate ID (UUID)
    System->>System: Compute Cryptographic Hash (SHA-256)
    System->>DB: Save Certificate (id, hash, studentId, projectId, issuedAt)
    DB-->>System: Success
    System-->>Admin: Certificate Generated Successfully

    Student->>DB: Fetch certificate details
    DB-->>Student: Return certificate info (ID, Hash)
    Student->>Student: View & Download PDF Certificate

    Public->>System: Query certificate verification (ID or Hash)
    System->>DB: Check certificate table
    DB-->>System: Return certificate metadata & validation status
    System-->>Public: Display Cryptographic Verification Badge (Valid/Invalid)
```

## 3. Product Integration & Boundaries
The platform operates as a self-contained web app using PostgreSQL for transactional data state persistence. The Next.js framework serves client bundles (HTML, CSS, React components) and runs backend Server Actions / API endpoint route handlers inside Serverless functions on Vercel. External integrations are strictly limited to repository references (GitHub) and external deployment URL verification.

## 4. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed Design Specification | Status |
|:---|:---|:---|:---:|
| **REQ-01** | Student Role | Profile dashboard, project tracking checklist, submit URLs, view feedback | ✅ Cover |
| **REQ-02** | Mentor Role | Audit assigned students, submission queue, review actions, feedback editor | ✅ Cover |
| **REQ-03** | Administrator Role | Manage students/projects, analytics, certificate generation | ✅ Cover |
| **REQ-04** | Authentication System | Email/Password credentials login/register, Next.js RBAC middleware routing | ✅ Cover |
| **REQ-05** | Student Dashboard | Checklists, links submission, project details view, feedback status view | ✅ Cover |
| **REQ-06** | Mentor Dashboard | Active queues, detail cards, reject/approve actions, feedback editor | ✅ Cover |
| **REQ-07** | Admin Dashboard | Student and Project CRUD tables, Certificate management interface | ✅ Cover |
| **REQ-08** | Analytics Module | Aggregations (Active students, completions, review counts, percent metrics) | ✅ Cover |
| **REQ-09** | Certificate Generation | UUID index, cryptographic hash verification check, downloadable PDF | ✅ Cover |
| **REQ-10** | Core Tech Stack | Next.js, React, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Vercel | ✅ Cover |

## 5. Architecture Review Checklist
- [x] Mapped all three mandatory roles (Student, Mentor, Administrator)
- [x] Described user registration & login flows
- [x] Mapped submission and approval state flows
- [x] Mapped certificate generation and lookup verification flows
- [x] Confirms to Project Constitution boundaries

