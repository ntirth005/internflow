# Single Source of Truth (SSOT)

## Gemini Master Prompt --- SkillBridge Internship Management Portal

> **Purpose**
>
> This prompt is the authoritative instruction set for generating the
> **Product Design & UX Architecture Specification**.
>
> The attached **SkillBridge Internship Program PDF** is the **single
> source of truth** for all mandatory requirements.

------------------------------------------------------------------------

# Non-Negotiable Rule

Treat the attached **SkillBridge Internship Program PDF** as the
**authoritative specification**.

You MUST NOT:

-   Modify mandatory requirements.
-   Replace the recommended technology stack.
-   Remove required modules.
-   Rename required roles.
-   Invent additional mandatory features.
-   Change the project scope.
-   Ignore evaluation criteria.

You MAY ONLY improve:

-   User Experience
-   Information Architecture
-   Design System
-   Frontend Architecture
-   Navigation
-   Component Design
-   Accessibility
-   Responsiveness
-   Performance
-   Maintainability

Any additional idea MUST be clearly labeled:

> **Optional Future Enhancement**

Never mix optional enhancements with mandatory requirements.

------------------------------------------------------------------------

# Project

Design an **Internship Management Portal** exactly as described in the
attached PDF.

------------------------------------------------------------------------

# Mandatory Roles

-   Student
-   Mentor
-   Administrator

No additional mandatory roles.

------------------------------------------------------------------------

# Mandatory Functional Modules

Design around the required modules from the PDF:

-   Authentication
-   Student Dashboard
-   Mentor Dashboard
-   Admin Dashboard
-   Analytics
-   Certificate Generation

Do not remove or merge these modules in a way that changes their intent.

------------------------------------------------------------------------

# Mandatory Technology Stack

The following technology stack is fixed.

Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS

Database

-   PostgreSQL

ORM

-   Prisma

Deployment

-   Vercel

Do NOT recommend replacing these technologies.

Additional libraries are allowed only if fully compatible with this
stack and clearly identified as optional implementation choices.

------------------------------------------------------------------------

# Your Role

Act as a multidisciplinary review board consisting of:

-   Principal Product Designer
-   UX Architect
-   Frontend Architect
-   Design System Lead
-   Accessibility Expert
-   Enterprise SaaS Architect

Your responsibility is to produce documentation that a professional
frontend team could implement directly.

------------------------------------------------------------------------

# Design Goals

The interface should be:

-   Modern
-   Premium
-   Minimal
-   Lightweight
-   Responsive
-   Professional
-   AI-ready (future compatible)
-   Easy to maintain

Avoid generic admin-template designs.

------------------------------------------------------------------------

# AI Constraint

Design the UI so AI can be integrated later without redesigning the
application.

Examples:

-   AI Assistant
-   AI summaries
-   AI recommendations
-   AI command palette

These are OPTIONAL FUTURE ENHANCEMENTS.

The application must function perfectly without AI.

------------------------------------------------------------------------

# Workspace Philosophy

The interface should behave like a modern productivity workspace.

If docking, movable panels, or widget layouts are proposed, they MUST be
marked:

**Optional Future Enhancement**

They must never conflict with the assignment requirements.

------------------------------------------------------------------------

# Performance Requirements

Every recommendation should support:

-   Fast loading
-   Lazy loading
-   Modular architecture
-   Code splitting
-   Responsive rendering
-   Scalability

Avoid unnecessary complexity.

------------------------------------------------------------------------

# Required Deliverables

Produce a professional Markdown document containing:

1.  Executive Summary
2.  Requirement Analysis
3.  Product Vision
4.  UX Principles
5.  Information Architecture
6.  Navigation Architecture
7.  Role-Based Experience
8.  Design System
9.  Component Inventory
10. Frontend Architecture
11. Responsive Strategy
12. Accessibility
13. Performance Strategy
14. Implementation Phases
15. Risk Analysis
16. Future Enhancements (clearly separated)
17. Requirement Traceability Matrix

------------------------------------------------------------------------

# Requirement Traceability Matrix (Mandatory)

Create a table mapping every requirement from the PDF.

  PDF Requirement          Proposed Solution   Status
  ------------------------ ------------------- --------
  Authentication           ...                 ✅
  Student Dashboard        ...                 ✅
  Mentor Dashboard         ...                 ✅
  Admin Dashboard          ...                 ✅
  Analytics                ...                 ✅
  Certificate Generation   ...                 ✅
  Next.js                  ...                 ✅
  React                    ...                 ✅
  TypeScript               ...                 ✅
  Tailwind CSS             ...                 ✅
  Prisma                   ...                 ✅
  PostgreSQL               ...                 ✅
  Vercel                   ...                 ✅

No mandatory requirement should remain unmapped.

------------------------------------------------------------------------

# Self Review Checklist

Before producing the final document verify:

-   No PDF requirement was changed.
-   Technology stack remains unchanged.
-   Every required module exists.
-   Every required role exists.
-   All optional ideas are clearly labeled.
-   The UI is modern but realistic.
-   The architecture is maintainable.
-   The document is internally consistent.
-   The output is suitable as the project's Single Source of Truth.

If any requirement fails, revise the document before presenting the
final answer.

Generate the final document entirely in Markdown using clear headings,
tables, diagrams, and professional formatting suitable for inclusion
directly in the project repository.
