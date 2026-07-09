Status: Approved

Version: 1.0

Depends On:
- docs/Architecture/04_UX_Architecture.md

Blocks:
- docs/Architecture/06_Frontend_Architecture.md

Owner:
Lead Architect

---

# 05 - Information Architecture

## 1. Document Purpose
This document defines the content structure, sitemaps, directory navigation, categorization, metadata schema, and site taxonomy of the portal.

## 2. Platform Sitemap
The site navigation maps to the following directory routes, enforcing strict role-based access control:

| Route Path | View Access Role | Content / Functional Purpose |
|:---|:---|:---|
| `/` | Public | Landing page outlining internship program and entry login router. |
| `/login` | Public | Login portal for students, mentors, and administrators. |
| `/register` | Public (Student) | Sign-up portal for prospective students. |
| `/verify` | Public | Public certificate lookup search field. |
| `/verify/[certId]` | Public | Public cryptographic verification status badge view. |
| `/dashboard` | Authenticated | Redirect gateway to corresponding role dashboard based on JWT payload. |
| `/dashboard/student` | Student | Student portal detailing checklist, project guidelines, status. |
| `/dashboard/student/profile` | Student | Student profile update section (name, contact detail). |
| `/dashboard/mentor` | Mentor | Mentor queue listing pending reviews and review history. |
| `/dashboard/mentor/students/[id]` | Mentor | Audit panel for student's deliverables, checklist progress, and feedback input. |
| `/dashboard/admin` | Administrator | Core analytics widget grid, active metrics charts. |
| `/dashboard/admin/users` | Administrator | Student/Mentor account listing and mapping. |
| `/dashboard/admin/projects` | Administrator | Project template CRUD interface. |
| `/dashboard/admin/certificates`| Administrator | Certificate issuance ledger. |

---

## 3. Metadata Schemes

### 3.1 Project Asset Attributes
The project definition template schema represents standardized requirements distributed by admins:
- `id`: UUID (Primary Key)
- `title`: String (Name of software project template)
- `description`: String (Scope, details, links to instructions)
- `tasks`: JSON Array (Ordered array of tasks: `[{ id: string, label: string, position: number }]`)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 3.2 Certificate Asset Attributes
Verifiable credentials generated on final project approval:
- `id`: UUID (Primary Key)
- `studentId`: UUID (Foreign Key referencing Student, Unique)
- `projectId`: UUID (Foreign Key referencing Project)
- `hashSignature`: String (SHA-256 cryptographic check hash)
- `issuedAt`: DateTime
- `verified`: Boolean (Credential state check flag, defaults to true)

### 3.3 Core User Entities
- **User Record**:
  - `id`: UUID (PK)
  - `name`: String
  - `email`: String (Unique)
  - `passwordHash`: String
  - `role`: Enum (`STUDENT`, `MENTOR`, `ADMIN`)
- **Student Profile Extension**:
  - `userId`: UUID (FK referencing User, Unique)
  - `mentorId`: UUID (FK referencing User/Mentor, Nullable)
  - `projectId`: UUID (FK referencing Project, Nullable)
  - `status`: Enum (`UNASSIGNED`, `ASSIGNED`, `IN_PROGRESS`, `SUBMITTED`, `REJECTED`, `APPROVED`, `CERTIFIED`)
  - `progress`: Float (Percentage calculated dynamically based on checked tasks)

---

## 4. Search & Tag Taxonomy
1. **User Directories**: Index tables searchable via string matches against `name` and `email` columns, with multi-select filter parameters mapping to `role` or student `status`.
2. **Review Inbox**: Filtered by active states (`SUBMITTED`), query sorted chronologically by ascending `submittedAt` values.
3. **Verification Ledger**: Verifies matching records on the public route by performing index lookups against either `id` (UUID) or `hashSignature` columns.

## 5. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed IA Implementation Specification | Status |
|:---|:---|:---|:---:|
| **IA-REQ-01** | Routing Hierarchy | Defined URL paths including separate public, dashboard, audit, and verify routes | ✅ Cover |
| **IA-REQ-02** | Metadata Schema | Detailed database fields, data types, and primary/foreign keys for all modules | ✅ Cover |
| **IA-REQ-03** | Status Attributes | Standardized state transitions matching the project requirements lifecycle | ✅ Cover |

## 6. Architecture Review Checklist
- [x] Complete navigation paths mapped for all roles
- [x] Directory layout aligned with security boundaries
- [x] Meta attributes define complete tracking fields
- [x] Site map conforms to the Project Constitution

