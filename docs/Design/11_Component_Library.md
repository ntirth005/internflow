Status: Draft

Version: 0.2

Depends On:
- docs/Design/10_Design_System.md

Blocks:
- docs/Design/12_Interaction_Guidelines.md

Owner:
Lead Architect

---

# 11 - Component Library

## 1. Document Purpose
This document catalogs and specifies the reusable shared UI components, specialized business widgets, and layout boxes for the SkillBridge Internship Management Portal (IMP).

---

## 2. Core UI Components Inventory (Atomic Elements)

All atomic widgets are styled using the Tailwind tokens defined in the Design System.

### 2.1 Buttons (`Button`)
- **Variant Actions**:
  - `Primary`: `bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary`
  - `Secondary`: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
  - `Outline`: `border border-input bg-background hover:bg-accent hover:text-accent-foreground`
  - `Destructive`: `bg-destructive text-destructive-foreground hover:bg-destructive/90`
- **States**: Disabled (`disabled:opacity-50 disabled:pointer-events-none`), loading (displays small animated rotating spinner SVG).

### 2.2 Input Fields (`Input` / `Textarea`)
- **Style**: `w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`

### 2.3 Badges (`Badge`)
- **Roles & Status Indicators**:
  - `STUDENT` / `IN_PROGRESS`: `bg-primary/10 text-primary`
  - `MENTOR` / `APPROVED`: `bg-success/10 text-success`
  - `ADMIN` / `CERTIFIED`: `bg-warning/10 text-warning`
  - `REJECTED`: `bg-destructive/10 text-destructive`

### 2.4 Info Cards (`Card`)
- **Structure**: Rounded border box `rounded-lg border bg-card text-card-foreground shadow-sm` containing `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent` sub-elements.

---

## 3. Specialized Business Widgets

### 3.1 Checklist Widget (`ChecklistGrid`)
- **Location**: Student Dashboard.
- **Props**: `tasks: Task[]`, `completions: Completion[]`, `onToggle: (taskId: string, checked: boolean) => void`
- **Logic**: Maps checklist array to interactive checkboxes. Displays title text and completed state checked styles.

### 3.2 Progress Tracker Bar (`ProgressTrack`)
- **Location**: Student & Admin Dashboards.
- **Props**: `progress: number` (0 to 100)
- **Visuals**: Progress track overlay `w-full bg-secondary h-4 rounded-full overflow-hidden`. Target fill is `bg-primary h-full transition-all duration-300 ease-out`.

### 3.3 Submission Queue Row (`SubmissionRow`)
- **Location**: Mentor Dashboard Inbox.
- **Props**: `studentName: string`, `projectTitle: string`, `submittedAt: string`, `onReviewClick: () => void`
- **Layout**: Tabular row structure displaying student details, dates, and an outline trigger button.

### 3.4 Cryptographic Verification Badge (`VerifyBadge`)
- **Location**: Public Verification view.
- **Props**: `isValid: boolean`, `certId: string`, `hashSignature: string`
- **Layout**: If valid, displays a verified badge card `border-success/20 bg-success/5 text-success` showing confirmation hashes, and links to validation ledgers.

---

## 4. Layout Specifications
- **Sticky Workspace Header (`Header`)**: Height `h-16`, z-index `z-40`, sticky top alignment, container for burger triggers, page branding, notification badges, and user initials profile avatar dropdowns.
- **Side Workspace Drawer (`Sidebar`)**: Width `w-64`, persistent vertical scroll grid on desktop, collapsible modal off-canvas drawer on mobile viewports.

---

## 5. Requirements Traceability

| ID | UX / Requirement Mapping | Proposed Component Specification | Status |
|:---|:---|:---|:---:|
| **CL-REQ-01** | Student Checklists | `ChecklistGrid` checkbox mappings and `ProgressTrack` indicators | ✅ Covered |
| **CL-REQ-02** | Mentor Submissions | `SubmissionRow` layout lists and feedback rich text fields | ✅ Covered |
| **CL-REQ-03** | Public Lookup | `VerifyBadge` components displaying valid/invalid credentials | ✅ Covered |

---

## 6. Review Checklist
- [x] Components are designed to consume tokens from the Design System
- [x] No hardcoded colors or sizing margins present in specification templates
- [x] Elements include ARIA labels for accessibility compliance
- [x] Components strictly target React/Next.js/Tailwind stack
