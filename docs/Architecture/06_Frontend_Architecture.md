Status: Approved

Version: 1.0

Depends On:
- docs/Architecture/05_Information_Architecture.md

Blocks:
- docs/Architecture/07_Backend_Architecture.md

Owner:
Lead Architect

---

# 06 - Frontend Architecture

## 1. Document Purpose
This document defines the Next.js App Router structure, component rendering strategies (RSC vs RCC), global client state context management, API data fetching layer, and performance setups.

## 2. Directory Structure Setup

The application enforces a modular and organized file layout inside the `src/` directory:

```
src/
├── app/
│   ├── layout.tsx                # Global HTML shell (metadata, fonts, layout providers)
│   ├── page.tsx                  # Home landing router & redirection dispatcher
│   ├── login/
│   │   └── page.tsx              # Credential authentication interface
│   ├── register/
│   │   └── page.tsx              # Student registration page
│   ├── verify/
│   │   ├── page.tsx              # Public certificate signature lookup
│   │   └── [certId]/
│   │       └── page.tsx          # Public cryptographic authenticity certificate
│   └── dashboard/
│       ├── layout.tsx            # Authenticated workspace layout (Sidebar & Header grid)
│       ├── page.tsx              # Session role checker / Router redirect
│       ├── student/
│       │   ├── page.tsx          # Student dashboard (Project checklist widget)
│       │   └── profile/
│       │       └── page.tsx      # Student profile metadata editor
│       ├── mentor/
│       │   ├── page.tsx          # Mentor submission review queue interface
│       │   └── students/
│       │       └── [studentId]/
│       │           └── page.tsx  # Mentor student workspace inspector
│       └── admin/
│           ├── page.tsx          # Administrator cohort metrics dashboard
│           ├── users/
│           │   └── page.tsx      # Admin directory (Student/Mentor CRUD)
│           ├── projects/
│           │   └── page.tsx      # Admin project template catalog CRUD
│           └── certificates/
│               └── page.tsx      # Admin ledger for signature generation
├── components/
│   ├── ui/                       # Atomic styling widgets (Button, Input, Table, Alert)
│   ├── shared/                   # Workspace shell widgets (Header, Sidebar, Spinner)
│   ├── student/                  # Student modules (ChecklistGrid, SubmissionBox)
│   ├── mentor/                   # Mentor modules (SubInboxTable, FeedbackEditor)
│   └── admin/                    # Admin modules (AnalyticsConsole, TemplateEditor)
├── context/
│   └── AuthContext.tsx           # Client session credential state manager
├── hooks/
│   ├── useAuth.ts                # Custom session hook
│   └── useDebounce.ts            # Input optimization debounce hook
├── lib/
│   ├── prisma.ts                 # Prisma DB Client client-connection pool wrapper
│   └── utils.ts                  # Class merge styling helper (clsx + tailwind-merge)
```

---

## 3. Rendering Strategy & Data Fetching

### 3.1 React Server Components (RSC)
By default, all page layouts and directories in `src/app/` are React Server Components:
1. **Direct DB Querying**: RSC fetches data directly from the PostgreSQL instance using the Prisma Client. This removes the need for local endpoint roundtrips.
2. **Hydration Strategy**: Data retrieved on the server is dehydrated and passed down to subcomponents as static typed props.
3. **Data Security**: Secure keys and transactional procedures remain completely hidden from the browser.

### 3.2 React Client Components (RCC)
Interactive pages are designated as client components by inserting the `"use client"` directive at the top of the file:
1. **User Forms**: Interfaces requiring client-side validation (using React Hook Form and Zod) are rendered on the client.
2. **Interactive Widgets**: Checklist toggles, collapsible menus, alerts, and overlay modals operate as RCC.
3. **Data Mutations**: Client operations invoke **Next.js Server Actions** for handling backend database writes. Server Actions execute asynchronously and trigger `revalidatePath` to re-fetch and refresh page layouts on completion.

---

## 4. State Management
- **URL-Based State Routing**: Dashboard routes and entity inspections (e.g. `/students/[studentId]`) use path variables as the single source of state truth.
- **Client Session Context**: The `AuthContext` provider exposes active session metadata (name, email, role) to layout components.
- **Form State**: Maintained locally using libraries (e.g. React Hook Form) and synchronized only on submission.

## 5. Performance Strategy
- **Static vs Dynamic Rendering**: Public static routes (like `/verify` lookup screens) are statically compiled. Dynamic routes (dashboards) use `dynamic = 'force-dynamic'` for real-time reads.
- **Skeleton Loaders**: Custom `loading.tsx` layout structures provide immediate visual feedback during data hydration.
- **Optimistic UI Updates**: Toggling tasks updates the UI checkbox state optimistic-locally using the `useOptimistic` hook, then updates PostgreSQL asynchronously.

## 6. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed FE Implementation Specification | Status |
|:---|:---|:---|:---:|
| **FE-REQ-01** | App Router | Structuring app routing folder layout to isolate Student, Mentor, Admin views | ✅ Cover |
| **FE-REQ-02** | Technology Integration | Integrates React, Next.js, TypeScript, and Tailwind CSS configuration | ✅ Cover |
| **FE-REQ-03** | Hydration Routing | Direct Server Component database querying using Prisma Client | ✅ Cover |

## 7. Architecture Review Checklist
- [x] Next.js stack confirmed
- [x] Dynamic components separated from server layout scripts
- [x] Asset routing structures mapped logically
- [x] Folder structure preserves naming consistency

