Status: Approved

Version: 1.0

Depends On:
- docs/Architecture/07_Backend_Architecture.md

Blocks:
- docs/Architecture/09_API_Architecture.md

Owner:
Lead Architect

---

# 08 - Database Architecture

## 1. Document Purpose
This document defines the relational PostgreSQL tables schema mapping, ORM parameters, referential integrity cascade constraints, connection pool setup, and query indexes.

## 2. Relational Schema Mapping

### 2.1 Prisma Schema Setup
The primary backend ORM layer uses Prisma. Below is the complete relational schema configuration:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  MENTOR
  ADMIN
}

enum ProjectStatus {
  UNASSIGNED
  ASSIGNED
  IN_PROGRESS
  SUBMITTED
  REJECTED
  APPROVED
  CERTIFIED
}

enum FeedbackDecision {
  APPROVE
  REJECT
}

model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  passwordHash String
  role         Role          @default(STUDENT)
  
  // Relations
  studentProfile  StudentProfile?
  mentorProfile   MentorProfile?
  feedbacksIssued Feedback[]     @relation("MentorFeedbacks")
  
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([email])
}

model StudentProfile {
  id        String        @id @default(uuid())
  userId    String        @unique
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  mentorId  String?
  mentor    MentorProfile? @relation(fields: [mentorId], references: [id], onDelete: SetNull)
  
  projectId String?
  project   Project?       @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  status    ProjectStatus @default(UNASSIGNED)
  progress  Float         @default(0.0)

  // Relations
  taskCompletions StudentTaskCompletion[]
  submission      Submission?
  feedbacks       Feedback[]              @relation("StudentFeedbacks")
  certificate     Certificate?

  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@index([mentorId])
  @@index([projectId])
  @@index([status])
}

model MentorProfile {
  id        String           @id @default(uuid())
  userId    String           @unique
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Relations
  assignedStudents StudentProfile[]
  
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}

model Project {
  id          String           @id @default(uuid())
  title       String
  description String
  tasks       Json             // Structured array: [{ id: string, label: string, position: number }]
  
  // Relations
  assignedStudents StudentProfile[]
  certificates     Certificate[]
  
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model StudentTaskCompletion {
  id        String         @id @default(uuid())
  studentId String
  student   StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  taskId    String         // Key referencing the task id in Project.tasks JSON
  completed Boolean        @default(false)
  
  updatedAt DateTime       @updatedAt

  @@unique([studentId, taskId])
  @@index([studentId])
}

model Submission {
  id         String         @id @default(uuid())
  studentId  String         @unique
  student    StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  githubUrl  String
  liveUrl    String
  
  submittedAt DateTime      @default(now())

  @@index([studentId])
}

model Feedback {
  id        String           @id @default(uuid())
  studentId String
  student   StudentProfile   @relation(name: "StudentFeedbacks", fields: [studentId], references: [id], onDelete: Cascade)
  
  mentorId  String
  mentor    User             @relation(name: "MentorFeedbacks", fields: [mentorId], references: [id], onDelete: Cascade)
  
  comments  String
  decision  FeedbackDecision
  
  createdAt DateTime         @default(now())

  @@index([studentId])
  @@index([mentorId])
}

model Certificate {
  id            String         @id @default(uuid()) // Unique verification ID
  studentId     String         @unique
  student       StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  projectId     String
  project       Project        @relation(fields: [projectId], references: [id], onDelete: Restrict)
  
  hashSignature String         @unique // HMAC-SHA256 hex digest (64 chars). Canonical payload: `studentId|projectId|issuedAt`. Key: CERTIFICATE_SECRET env var. Verified server-side by recomputing and comparing with timingSafeEqual.
  issuedAt      DateTime       @default(now())
  verified      Boolean        @default(true)

  @@index([hashSignature])
}
```

---

## 3. Database Constraints & Cascades
To prevent structural orphaned data:
- **`onDelete: Cascade`** is configured for child entities `StudentProfile` and `MentorProfile` linked to `User`. If a base user is removed, all matching profiles, submissions, task completions, feedbacks, and certificates are automatically deleted by the database.
- **`onDelete: SetNull`** is configured on `StudentProfile` for keys `mentorId` and `projectId` to prevent deletion errors if template projects or mentors are removed.
- **`onDelete: Restrict`** prevents a project template from being deleted if a certificate has already been issued matching that template.

## 4. Query Performance Optimization

### 4.1 Index Specifications
We define index constraints covering high-volume lookup criteria:
1. `User(email)`: Speeds up credentials checks during login processes.
2. `StudentProfile(mentorId, projectId, status)`: Accelerates mentor assignment joins, project distributions, and status lists on metrics boards.
3. `StudentTaskCompletion(studentId)`: Optimizes real-time progress aggregates.
4. `Feedback(studentId, mentorId)`: Accelerates feedback feeds retrieval.
5. `Certificate(hashSignature)`: Accelerates lookup verification checks on the public verify route.

### 4.2 Pool Allocation Setup
For serverless Vercel Deployments:
- Configure connection pooling parameters in database URLs using pgBouncer parameters: `?connection_limit=10&pgbouncer=true`.
- Reuse a singleton Prisma instance (`globalThis.prisma`) across Next.js dynamic routing contexts to prevent exhausting connection limits.

## 5. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed DB Implementation Specification | Status |
|:---|:---|:---|:---:|
| **DB-REQ-01** | Database Stack | Implements PostgreSQL engine configuration via Prisma ORM schemas | ✅ Cover |
| **DB-REQ-02** | Relation Constraints | Cascade delete, unique mapping constraints, foreign key restrictions | ✅ Cover |
| **DB-REQ-03** | Indexing Optimizations | Explicit indexes targeting lookup criteria (`email`, `status`, `hashSignature`) | ✅ Cover |

## 6. Architecture Review Checklist
- [x] Prisma structure complies with PostgreSQL capabilities
- [x] Database contains indexes on search criteria (`studentId`, `status`)
- [x] Cascades prevent orphaned data blocks
- [x] Connect protocols match Vercel Serverless requirements

