Status: Approved

Version: 1.0

Depends On:
- docs/Development/19_Git_Workflow.md

Blocks:
- docs/Development/21_Definition_of_Done.md

Owner:
Lead Architect

---

# 20 - Project Structure

## 1. Document Purpose
This document defines the absolute directory scaffolding paths, module boundaries, import aliases configurations, and file isolation rules for the SkillBridge Internship Management Portal (IMP).

---

## 2. Directory Mappings & Imports Configurations

The workspace enforces absolute import paths to prevent deep relative lookup paths (e.g. `../../../../components`).

### 2.1 Tsconfig Path Configurations
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2.2 Core Absolute Imports Aliases

- **Components**: `import { Button } from "@/components/ui/Button"`
- **Hooks**: `import { useAuth } from "@/hooks/useAuth"`
- **Utilities**: `import { prisma } from "@/lib/prisma"`
- **Contexts**: `import { AuthProvider } from "@/context/AuthContext"`
- **Server Actions**: `import { loginAction } from "@/app/actions/auth"`

---

## 3. Directory Layout Rules
- **Component Isolation**: Shared layout wrappers go into `src/components/shared/`. Modular components go into specific subdirectory packages (`src/components/student/`, `src/components/mentor/`, `src/components/admin/`).
- **Styles**: Custom CSS rules are isolated to `src/app/globals.css`.
- **Database Assets**: Prisma schema and migration files are placed inside the root `prisma/` folder.

---

## 4. Requirements Traceability

| ID | Specification Reference | Project Structure Configuration | Status |
|:---|:---|:---|:---:|
| **PS-REQ-01** | Absolute Aliases | Tsconfig aliases mapped to `@/*` | ✅ Covered |
| **PS-REQ-02** | Directory Separation| Modular separation of shared vs context components | ✅ Covered |
| **PS-REQ-03** | Style Isolation | Centralized styling configuration inside app router layout | ✅ Covered |

---

## 5. Review Checklist
- [x] Aliases map to absolute folders under src
- [x] Folder structures isolate shared widgets from role-specific components
- [x] Path definitions prevent relative imports
- [x] Directory layouts conform to Frontend Architecture specifications
