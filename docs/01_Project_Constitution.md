Status: Approved

Version: 1.1

Depends On:
- docs/SkillBridge Internship Program.pdf

Blocks:
- docs/02_Documentation_Index.md

Author:
Gemini (Architecture Mode)

Last Updated:
2026-07-09

---

# Project Constitution
## SkillBridge Internship Management Portal (IMP)

This document is the governing constitution for the SkillBridge Internship Management Portal (IMP) repository. It establishes the authoritative architectural rules, development practices, git conventions, and alignment guidelines for both human engineers and AI assistants.

---

## 1. Project Overview & Scope
The SkillBridge Internship Management Portal (IMP) is a full-stack web application designed to streamline internship program operations. The system coordinates project assignment, progress monitoring, review workflows, and completion certification.

---

## 2. Core Constraints (Immutable Requirements)
All implementation work must strictly conform to the following boundaries defined in the product specification:

### 2.1 Mandatory User Roles
Only the following three user roles may exist in the system:
1.  **Student**: Manages student profile, views assigned project instructions, tracks checklist completion, submits GitHub repository and live deployment URLs, and reviews mentor feedback.
2.  **Mentor**: Audits assigned students, reviews submissions, approves or rejects project work, and provides structured feedback.
3.  **Administrator**: Manages students and projects, tracks platform-wide progress, audits cohort analytics, and generates/verifies completion certificates.

### 2.2 Mandatory Functional Modules
The platform is composed of six core functional modules:
1.  **Authentication System**: Secure registration, login, and Role-Based Access Control (RBAC).
2.  **Student Dashboard**: Visual status tracking, project instructions view, and submission form.
3.  **Mentor Dashboard**: Review inbox queue, action controls (Approve/Reject), and feedback text editor.
4.  **Admin Dashboard**: Student management table, project creator, and certificate generation tables.
5.  **Analytics Module**: Real-time tracking of total students, active students, completed projects, pending reviews, and completion percentages.
6.  **Certificate Generation**: Automatic generation of unique, cryptographically verifiable, and downloadable completion certificates.

### 2.3 Mandatory Technology Stack
The technology stack is fixed and cannot be replaced or augmented with conflicting frameworks:
*   **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
*   **Database**: PostgreSQL
*   **ORM**: Prisma ORM
*   **Deployment**: Vercel

---

## 3. Repository Governance & Documentation Hierarchy
This repository follows a strict documentation-first development methodology. No implementation code may be introduced until the corresponding architectural and design documentation has been formally reviewed and approved.

### 3.1 Documentation Hierarchy & Precedence
Every document generated in the repository belongs to a defined hierarchy. Higher-level documents strictly override lower-level documents in the event of a conflict:

```
docs/00_Project_Requirements.pdf (Immutable - Authoritative Requirements)
   │
   ▼
docs/01_Project_Constitution.md (Single Source of Truth)
   │
   ▼
Approved Architecture Documents (03_Product_Architecture.md to 09_API_Architecture.md)
   │
   ▼
Implementation Documents (10_Design_System.md to 13_Accessibility_Guidelines.md)
   │
   ▼
Testing & Planning (14_Project_Phases.md to 17_Deployment_Strategy.md)
   │
   ▼
Development Guidelines (18_Coding_Standards.md to 21_Definition_of_Done.md)
```

### 3.2 Documentation Dependency Rules
Every architectural and planning document must declare:
*   Its immediate document dependencies.
*   The documents it affects.
*   The documents it blocks from generation.
No document in the hierarchy may be generated until all of its declared dependencies have been completed and marked as `Approved`.

---

## 4. Documentation Workflow & Approval Protocol
The development lifecycle progresses document-by-document.
1.  **Drafting**: The AI assistant drafts a single document from the hierarchy, starting with metadata (Status: Draft, Version 0.1, Dependencies, Blocks, Author, Date).
2.  **Architecture Review**: The AI reviews the drafted document against this Constitution and the SkillBridge Requirements PDF.
3.  **Approval Request**: The AI stops execution and presents the document for review.
4.  **Action**: The user provides approval via command (`Approved`, `Continue`, `Next Document`, `Proceed`, `Generate Next`) or requests revisions.
5.  **Status Transition**: Upon approval, the document status block is updated to `Status: Approved` and versioned as `1.0`.

---

## 5. Change Management & Architecture Preservation
*   **Preservation Rule**: Approved documents are stable baselines. AI assistants must never modify approved architectural or design decisions without explicit, authorized instructions.
*   **Conflict Resolution**: If a proposed implementation change conflicts with an approved document, the AI must:
    1.  Flag the conflict immediately in the chat interface.
    2.  Detail the architectural and code impact of the conflict.
    3.  Suggest resolutions.
    4.  Wait for explicit user approval before applying changes.

---

## 6. Git Commit Policy (Conventional Commits)
To maintain a clear and searchable project history, the repository strictly enforces the Conventional Commits Specification. Commit messages must follow the format:
`<type>(<scope>): <description>`

### Commit Types and Examples
*   **`feat`**: A new user-facing feature.
    *   *Example*: `feat(auth): implement role-based access control middleware for Next.js routes`
*   **`fix`**: A bug fix.
    *   *Example*: `fix(cert): correct cryptographic hash signature mismatch on certificate export`
*   **`refactor`**: Code changes that neither fix a bug nor add a feature.
    *   *Example*: `refactor(db): rewrite prisma transaction wrapper for batch project assignments`
*   **`docs`**: Documentation changes only.
    *   *Example*: `docs(constitution): update allowed improvements list and commit policy`
*   **`style`**: Layout changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).
    *   *Example*: `style(dashboard): adjust modal alignment and focus indicators in student view`
*   **`test`**: Adding missing tests or correcting existing tests.
    *   *Example*: `test(api): add integration test suite for submission verification route`
*   **`perf`**: A code change that improves performance.
    *   *Example*: `perf(analytics): add database index to studentId and status columns for fast reads`
*   **`build`**: Changes that affect the build system or external dependencies.
    *   *Example*: `build(npm): upgrade prisma client to support new connection pooler options`
*   **`chore`**: Other changes that do not modify src or test files.
    *   *Example*: `chore(git): add build artifacts to gitignore`

---

## 7. AI Governance & Decision Rules
All AI assistants operating on this repository must work as the project's Principal Architect, exercising strict self-discipline to prevent architectural drift.

### 7.1 Allowed Improvements
AI assistants are encouraged to optimize and refine:
*   **User Experience (UX)**: Smooth navigation flows, page transitions, and clear error notifications.
*   **Design System & Components**: Unified color tokens, component reusability, and grid structures.
*   **Accessibility & Responsiveness**: WCAG compliance and fluid breakpoints.
*   **Performance & Maintainability**: Clean, readable, documented code, and resource efficiency.
These improvements must never violate the Project Constitution or the SkillBridge requirements.

### 7.2 Prohibited Changes
AI assistants are strictly prohibited from:
*   Replacing Next.js, PostgreSQL, Prisma, Tailwind CSS, or React.
*   Modifying or inventing user roles (only Student, Mentor, Administrator).
*   Removing or merging the six mandatory modules.
*   Modifying approved workflows (e.g. bypass mentor approval to issue certificates).
*   Introducing unnecessary third-party utility frameworks.
*   Silently changing or altering previously approved architectural decisions.

### 7.3 AI Self-Validation Checklist
Before concluding any step or presenting a file for approval, the AI must validate the work against the following checklist:
- [x] **Requirements Compliance**: Fully consistent with `docs/SkillBridge Internship Program.pdf`.
- [x] **Constitution Alignment**: Adheres to the rules and structures in `docs/01_Project_Constitution.md`.
- [x] **Architecture Continuity**: Preserves approved directory structures, routing schemes, and schemas.
- [x] **Technology Guardrails**: Confined to Next.js, Prisma, PostgreSQL, React, and Tailwind.
- [x] **Engineering Quality**: Maintains static typing, clear documentation comments, and design system tokens.

If any self-validation check fails, the AI must revise the solution before presenting it.

---

## 8. Definition of Done (DoD)
A development task is considered complete ("Done") only when it meets all of the following conditions:
1.  **Acceptance Criteria**: The code fully satisfies all functional requirements in the user story and specification.
2.  **Responsive Layout**: Interface is verified across all device breakpoints (mobile, tablet, desktop).
3.  **Accessibility (a11y)**: Elements pass WCAG 2.1 AA keyboard navigation and screen-reader accessibility rules.
4.  **Linting & Testing**: Code successfully compiles, passes all linting rules, and passes the TypeScript static compiler check with zero typing overrides (`any`).
5.  **Documentation**: Relevant architectural plans, component maps, and README logs are updated.
6.  **Architecture Consistency**: The implementation preserves the project structure and does not introduce design drift.
7.  **Performance Impact**: Query execution paths, static generation layouts, and load times are checked and optimized.
8.  **Design System Alignment**: Reusable UI parts are strictly constructed using the token classes defined in the Design System.
9.  **Constitution Compliance**: Code is free of any prohibited modifications, extra roles, or stack substitutions.

---

## 9. Versioning Policy
This repository utilizes Semantic Versioning (SemVer) for both documentation and code:
*   **Major Version (`X.0.0`)**: Backwards-incompatible changes (requires updating the Project Constitution).
*   **Minor Version (`0.Y.0`)**: Added functionality, new architecture files drafted, or non-breaking extensions.
*   **Patch Version (`0.0.Z`)**: Minor documentation corrections, typographical fixes, or localized bug fixes.
*   *Note*: During the documentation phase, files start as version `0.1` (Draft) and transition to `1.0` (Approved).

---
*End of governing Project Constitution.*
