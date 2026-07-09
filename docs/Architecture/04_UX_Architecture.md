Status: Draft

Version: 0.1

Depends On:
- docs/Architecture/03_Product_Architecture.md

Blocks:
- docs/Architecture/05_Information_Architecture.md

Owner:
Lead Architect

---

# 04 - UX Architecture

## 1. Document Purpose
This document defines the User Experience (UX) wireframes, dashboard grid layouts, core layouts, and role-based interaction paths for the platform.

## 2. Global Layout & Structural Design

The application uses a responsive outer shell with a flexible grid layout:
- **Desktop (1024px and up)**: Left-aligned persistent collapsible sidebar (256px wide) and a top-fixed sticky header (64px high) with a main scrollable content area.
- **Tablet/Mobile (Below 1024px)**: Sidebar collapses into a modal slide-over drawer triggered by a header hamburger menu button.

```
+-------------------------------------------------------------------+
|  [=]  SkillBridge IMP   | [Search...]     (O) Notifications  [JD] | Header
+-------------------------------------------------------------------+
| Sidebar  | Main Content                                           |
|          |                                                        |
| Dashboard|  [ Welcome Back, John Doe! ]                           |
| Projects |                                                        |
| Reviews  |  +------------------------+  +----------------------+  |
| Profile  |  | Widget A               |  | Widget B             |  |
|          |  +------------------------+  +----------------------+  |
+----------+--------------------------------------------------------+
```

### 2.1 Workspace Header
The sticky header aligns to the top of the viewport (z-index 40) containing:
1. **Sidebar Toggle**: Hamburger icon to open/collapse the sidebar navigation.
2. **App Branding**: Logo and name link routing back to `/`.
3. **Command Palette Input**: Focusable input field displaying `Search or commands...` (*Optional AI Enhancement*).
4. **Notification Center**: Bell icon showing a red dot badge count for unread reviews or comments.
5. **Profile Dropdown Menu**: Circular user avatar displaying initials. Clicking opens a dropdown menu containing Profile settings, theme preference toggler (Light/Dark), and Logout button.

### 2.2 Collapsible Sidebar
An offset panel displaying primary navigation items grouped dynamically based on the current user's role:
- **Student Menu**:
  - `/dashboard/student` -> Dashboard Home (checklist tracker, project specifications).
  - `/dashboard/student/submit` -> Submission Form (deliverables upload).
  - `/dashboard/student/feedback` -> Mentor Reviews Archive.
  - `/dashboard/student/certificate` -> Certificate Download.
- **Mentor Menu**:
  - `/dashboard/mentor` -> Review Inbox (submission verification queue).
  - `/dashboard/mentor/students` -> Assigned Cohort (progress dashboard).
  - `/dashboard/mentor/archive` -> Review History.
- **Administrator Menu**:
  - `/dashboard/admin` -> Command Console (cohort analytics dashboard).
  - `/dashboard/admin/users` -> Student & Mentor Directory.
  - `/dashboard/admin/projects` -> Project templates CRUD.
  - `/dashboard/admin/certificates` -> Signature & Issuance Ledger.

---

## 3. Role-Based Dashboard Outlines

### 3.1 Student Workspace Wireframe
The student dashboard acts as a singular hub tracking their active project lifecycle.

```
+-------------------------------------------------------------------+
| PROJECT: PORTAL SYSTEM DEVELOPMENT                        [IN_PROG] |
| Assigned: 2026-07-01  |  Mentor: Alice Smith                      |
+-------------------------------------------------------------------+
| PROGRESS                                                    [60%] |
| [========================>------------------]                      |
|                                                                   |
| Tasks checklist:                                                  |
| [x] Task 1: Initialize Git and directory layout                   |
| [x] Task 2: Configure database and ORM schema                    |
| [x] Task 3: Draft initial API specifications                      |
| [ ] Task 4: Complete frontend dashboard layout wireframe          |
| [ ] Task 5: Implement cryptographic verification functions        |
+-------------------------------------------------------------------+
| DELIVERABLE SUBMISSION                                            |
| GitHub Repository URL:                                            |
| [https://github.com/student/myproject                        ]    |
| Live Deployment URL:                                              |
| [https://myproject.vercel.app                                ]    |
|                                                                   |
| [ Submit Deliverables ] (Disabled unless all tasks are checked)   |
+-------------------------------------------------------------------+
```

### 3.2 Mentor Workspace Wireframe
The mentor interface centralizes task audits to allow high-frequency feedback cycles.

```
+-------------------------------------------------------------------+
| REVIEW QUEUE (3 PENDING)                                          |
| Student             Project           Submitted    Action         |
| 1. Bob Johnson      IMP Portal        10 mins ago  [ Review ]     |
| 2. Charlie Brown    IMP Portal        2 hours ago  [ Review ]     |
| 3. Dave Miller      IMP Portal        Yesterday    [ Review ]     |
+-------------------------------------------------------------------+
| AUDIT WORKSPACE: Bob Johnson                                      |
| GitHub Link: [github.com/bob/imp]  |  Live URL: [imp-bob.vercel.app] |
|                                                                   |
| FEEDBACK COMMENTS:                                                |
| +---------------------------------------------------------------+ |
| | Please add cryptographic signature hash verification routing   | |
| | before exporting the PDF certificates...                      | |
| +---------------------------------------------------------------+ |
| Decision: ( ) Approve Submission    (*) Request Revision          |
|                                                                   |
| [ Submit Review Decision ]                                        |
+-------------------------------------------------------------------+
```

### 3.3 Admin Control Panel Wireframe
The administrator panel features platform-wide statistics overlays and user directories.

```
+-------------------------------------------------------------------+
| ANALYTICS:                                                        |
| Total: 154  |  Active: 120  |  Completed: 24  |  Pending Rev: 10  |
+-------------------------------------------------------------------+
| COHORT INVENTORY:                                   [+ Add User]  |
| Name           Email             Role     Project       Status    |
| Bob Johnson    bob@school.edu    STUDENT  IMP Portal    SUBMITTED |
| Alice Smith    alice@corp.com    MENTOR   -             ACTIVE    |
+-------------------------------------------------------------------+
| CERTIFICATE LEDGER:                                               |
| Student        Project           Approved By    Action            |
| Frank White    IMP Portal        Alice Smith    [Issue Cert]      |
| Grace Green    IMP Portal        Alice Smith    [Verifying ]      |
+-------------------------------------------------------------------+
```

---

## 4. Interaction Guidelines & State Transitions
To guarantee a responsive and fluid interface:
1. **Interactive Hover Effects**: All buttons, links, and grid items transition background color and shadow with a smooth CSS decay (`transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`).
2. **Asynchronous Loaders**: All forms display a disabled state and standard animated CSS spinner icons within buttons during Next.js Server Action execution.
3. **Toast Notifications**: System displays overlay alert popups at the bottom-right corner for success/error responses upon action dispatching.
4. **Keyboard Navigation & Accessibility (WCAG 2.1 AA)**:
   - Interactive controls must contain high-contrast visible focus indicators using custom focus rings (`outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px hsl(var(--primary));`).
   - Logical tab-index sequences map left-to-right, top-to-bottom.
   - Screen reader aria-labels added to all icon-only action triggers (e.g. `aria-label="Toggle Navigation Sidebar"`).

## 5. Requirements Traceability

| ID | PDF / Constitution Requirement | Proposed UX Implementation Specification | Status |
|:---|:---|:---|:---:|
| **UX-REQ-01** | Dashboard Layout | Multi-panel responsive grid layout with sticky top header and side-drawer | ✅ Cover |
| **UX-REQ-02** | Student Portal | Checklists, repository submit fields, feedback histories panel | ✅ Cover |
| **UX-REQ-03** | Mentor Queue | Review tables, feedback rich-text fields, decision buttons | ✅ Cover |
| **UX-REQ-04** | Admin Analytics | 4-card analytics overview grid and user management tables | ✅ Cover |
| **UX-REQ-05** | Accessibility (a11y) | Focus rings, key tab loops, aria-labels complying with WCAG 2.1 AA | ✅ Cover |

## 6. Architecture Review Checklist
- [x] Responsive behavior sketched for mobile, tablet, and desktop viewports
- [x] Role-specific dashboards conform to the three mandatory roles
- [x] No application code or UI styles generated in this specification
- [x] Keyboard navigation visual focus outlines defined

