Status: Approved

Version: 1.0

Depends On:
- docs/Design/11_Component_Library.md

Blocks:
- docs/Design/13_Accessibility_Guidelines.md

Owner:
Lead Architect

---

# 12 - Interaction Guidelines

## 1. Document Purpose
This document establishes standard behavioral transitions, user interaction feedback mechanisms, button hover metrics, loading states, and notification workflows.

---

## 2. Interaction Transitions & Animations

All transitions are styled using Tailwind CSS animations to ensure high-performance execution.

### 2.1 Hover States
- **Standard Buttons**: Background colors fade dynamically over 200ms (`transition-colors duration-200`).
- **Interactive Cards**: Shift vertically on hover (`hover:-translate-y-0.5`) and expand card borders slightly (`transition-all duration-200 shadow-sm hover:shadow-md`).

### 2.2 Collapsible Sidebar Interaction
- Permanent sidebar transitions off-canvas on mobile using CSS transform translations:
  - Open: `translate-x-0`
  - Closed: `-translate-x-full`
  - Transition: `transition-transform duration-300 ease-in-out`

---

## 3. Dynamic States & Feedback Controls

### 3.1 Skeleton Loaders
To avoid visual layouts shifting during RSC hydration and data fetch, skeleton boxes mimic final widgets structures:
- **Class Configuration**: `animate-pulse rounded-md bg-muted`
- **Behavior**: Displays a smooth pulsating light-gray background representing content blocks while Server Actions return datasets.

### 3.2 Loading Spinners
During Server Action submissions (e.g. log in trigger, repository upload, decision approval clicks), buttons disable and render a spinning SVG loading indicator.

### 3.3 Toast Notifications
Success or failure responses from backend Server Actions dispatch persistent toast notifications in the bottom-right viewport:
- **Structure**: Small card border container `border bg-background text-foreground shadow-lg rounded-lg p-4 flex items-center gap-3`
- **Timing**: Automatically fades out after 5000ms.

---

## 4. Requirements Traceability

| ID | UX Guideline Reference | Interaction Specification | Status |
|:---|:---|:---|:---:|
| **IG-REQ-01** | Visual Feedback | Spinner states and disabled submit actions | ✅ Covered |
| **IG-REQ-02** | Page Hydrations | Skeleton loader blocks preventing layout shifts during loads | ✅ Covered |
| **IG-REQ-03** | Sidebar Drawer | Smooth CSS translate transforms for collapsible drawers | ✅ Covered |

---

## 5. Review Checklist
- [x] All interaction behaviors mapped to CSS animations
- [x] Standard loading sequences mapped to prevent double-submit states
- [x] Toast notification timeouts defined
