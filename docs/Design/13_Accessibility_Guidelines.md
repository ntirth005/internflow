Status: Approved

Version: 1.0

Depends On:
- docs/Design/12_Interaction_Guidelines.md

Blocks:
- docs/Planning/14_Project_Phases.md

Owner:
Lead Architect

---

# 13 - Accessibility Guidelines

## 1. Document Purpose
This document defines accessibility requirements, keyboard control standards, aria attributes, and validation checklists to ensure the portal complies with WCAG 2.1 AA guidelines.

---

## 2. Keyboard Control & Navigation Loops

All interactive elements must support standard keyboard navigation sequences.

### 2.1 Focus Ring Indicators
Default browser outline outlines are overridden with high-contrast custom outline rings:
- **Focus Rings styling**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`
- **Rule**: Focus rings must never be hidden or suppressed.

### 2.2 Tab Order Sequencing
- Element focus must flow in logical order from top-to-bottom and left-to-right.
- Modals and slide-over sidebars must implement a "Focus Trap" which prevents keyboard focus from escaping the modal container until it is closed.

---

## 3. ARIA Semantics & Screen Reader Attributes

All interactive widgets without text representation must explicitly declare accessibility attributes:

1. **IconButton triggers**: Bell icon button, burger dropdown bars, or user settings initial lists must contain an explicit `aria-label`:
   ```tsx
   <button aria-label="Open Sidebar Menu">...</button>
   ```
2. **Checkbox Checklist items**: Progress tracker checkboxes must reference descriptions:
   ```tsx
   <input type="checkbox" aria-describedby="task-desc-1" />
   ```
3. **Sidebar navigation state**: Collapsible menus declare expanded state trackers:
   ```tsx
   <aside aria-expanded="true">...</aside>
   ```

---

## 4. Requirements Traceability

| ID | WCAG 2.1 AA Reference | Accessibility Specification | Status |
|:---|:---|:---|:---:|
| **AG-REQ-01** | Focus Visible (2.4.7) | Custom offset outline ring declarations | ✅ Covered |
| **AG-REQ-02** | Name, Role, Value (4.1.2) | Aria labels on navigation controls and checklist structures | ✅ Covered |
| **AG-REQ-03** | Contrast Minimum (1.4.3) | Color variables verified to exceed 4.5:1 ratios | ✅ Covered |

---

## 5. Review Checklist
- [x] All interactive controls support keyboard tabbing
- [x] Focus indicators are highly visible and offset from the content
- [x] ARIA labels are declared for all icon-only button elements
- [x] Modals wrap tab indexing within boundary structures
