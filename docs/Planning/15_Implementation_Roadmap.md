Status: Approved

Version: 1.0

Depends On:
- docs/Planning/14_Project_Phases.md

Blocks:
- docs/Planning/16_Testing_Strategy.md

Owner:
Lead Architect

---

# 15 - Implementation Roadmap

## 1. Document Purpose
This document provides the granular execution steps, dependency order, file scaffolding sequence, and task lists for development sprints of the SkillBridge Internship Management Portal (IMP).

---

## 2. Granular Task Playbooks

Development is organized into four sequential sprints matching the project milestones.

### 2.1 Sprint 1: Setup & Core Scaffold
1. **Initialize Framework**: Run `npx create-next-app` configurations with TypeScript, Tailwind, and App Router enabled.
2. **Database Integration**:
   - Write [schema.prisma](file:///home/ntirth005/Documents/IMP/docs/Architecture/08_Database_Architecture.md#L26-L187) containing relational tables and indexes.
   - Set up singleton wrapper `src/lib/prisma.ts` to prevent pool exhaustion.
   - Run `npx prisma db push` to synchronize local PostgreSQL.
3. **Core Styling & Fonts**:
   - Set up HSL theme variables in `src/app/globals.css` matching [10_Design_System.md](file:///home/ntirth005/Documents/IMP/docs/Design/10_Design_System.md#L21-L121).
   - Configure global page layout `src/app/layout.tsx` to load Inter and Outfit fonts.

### 2.2 Sprint 2: Authentication & Middleware Security
1. **JWT Operations Layer**:
   - Write `src/lib/auth.ts` to handle signing, cookie setting, and verifying JWT sessions.
2. **Edge Route Middleware**:
   - Write `src/middleware.ts` to inspect session tokens and enforce role-based redirection.
3. **Auth Actions**:
   - Write Server Actions `registerAction` and `loginAction` using bcrypt hashing and Zod parsing.
4. **Auth UI Layouts**:
   - Scaffold `/login` and `/register` client component forms.

### 2.3 Sprint 3: Dashboard Modules & Actions
1. **Admin Workspace Panels**:
   - Build student/mentor directory layout (`/dashboard/admin/users`) with CRUD actions.
   - Build project templates creator (`/dashboard/admin/projects`) to construct task JSON lists.
2. **Student checklist & submissions**:
   - Implement `/dashboard/student` fetching project task checklists.
   - Write `toggleTaskCompletion` Server Action recalculating progress.
   - Scaffold submission inputs (`/dashboard/student/submit`) validating URL fields.
3. **Mentor Review Queue**:
   - Build review inbox layout (`/dashboard/mentor`) querying pending reviews.
   - Build audit inspector (`/dashboard/mentor/students/[studentId]`) and write `submitReview` Server Action.

### 2.4 Sprint 4: Certificate Generation & Launch
1. **Cryptographic Signer**:
   - Implement certificate generation Server Action calculating HMAC-SHA256 signatures.
2. **Verification Lookup Views**:
   - Build public query inputs (`/verify`) and lookup details pages (`/verify/[certId]`).
   - Write route handler `GET /api/verify/[certId]` returning credential validation payloads.
3. **PDF Export**:
   - Integrate dynamic PDF builder on the client-side to export completion badges.

---

## 3. Dependency Path Mappings

To prevent compilation breaks and circular typing errors, developers must scaffold files in the following order:

```
[1] Configs & Prisma Schema (S1)
       │
       ▼
[2] DB Singleton wrapper (S1)
       │
       ▼
[3] Auth JWT helpers & Actions (S2)
       │
       ▼
[4] Edge Middleware guards (S2)
       │
       ▼
[5] Shared Layout components & UI widgets (S3)
       │
       ▼
[6] Specific Dashboard Pages & Mutator Actions (S3)
       │
       ▼
[7] Certificate Hash logic & Public Verify routes (S4)
```

---

## 4. Requirements Traceability

| ID | Roadmap Task Reference | Architecture/UX Traceability | Status |
|:---|:---|:---|:---:|
| **RM-REQ-01** | Sprint 1 Scaffolds | Exposes DB client for server components access | ✅ Covered |
| **RM-REQ-02** | Sprint 2 Auth logic | Restricts navigation access to validated role endpoints | ✅ Covered |
| **RM-REQ-03** | Sprint 3 UI Layouts | Implements custom interactive client checklist grids | ✅ Covered |
| **RM-REQ-04** | Sprint 4 Cert checks | Runs HMAC hash validation on verify paths | ✅ Covered |

---

## 5. Review Checklist
- [x] Task execution maps conform to dependency rules (sequential playbooks defined)
- [x] Scaffolding layouts prevent structural changes (order maps enforce dependencies first)
- [x] Tasks are sized cleanly for incremental execution (sprints separated by functional modules)
- [x] Steps enforce strict Conventional Commits checks (checklist item in transition gating)
