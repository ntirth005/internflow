Status: Approved

Version: 1.0

Depends On:
- docs/Planning/17_Deployment_Strategy.md

Blocks:
- docs/Development/19_Git_Workflow.md

Owner:
Lead Architect

---

# 18 - Coding Standards

## 1. Document Purpose
This document establishes code quality boundaries, TypeScript compiler settings, ESLint constraints, code formatting rules (Prettier), and directory naming rules.

---

## 2. TypeScript & Linter Configuration

We enforce strict compilation rules to prevent runtime execution errors.

### 2.1 TypeScript Strict Mode
The `tsconfig.json` file must enable the following parameters:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```
- **Rule**: Explicit typings are required on all variables, inputs, and actions. The `any` escape keyword is strictly forbidden.

### 2.2 ESLint Rules
- Enforce ES6 standards.
- Block the use of native console logging (`console.log`) in production code; use structured utility logging instead to prevent credential leaks.

---

## 3. Formatting & Naming Rules

- **Prettier formatting**: Enforced via prepublish hooks. Double quotes, 2-space tab indent, trailing commas.
- **Naming Conventions**:
  - React Component files: PascalCase (e.g. `ChecklistGrid.tsx`).
  - Hooks, actions, and utility files: camelCase (e.g. `useAuth.ts`, `auth.ts`).
  - Directory folder paths: lowercase kebab-case (e.g. `components/shared`).

---

## 4. Requirements Traceability

| ID | Specification Reference | Coding Standard Rule | Status |
|:---|:---|:---|:---:|
| **CS-REQ-01** | Code Quality | TS compile strict checks with no implicit any | ✅ Covered |
| **CS-REQ-02** | Secure Logging | Restrictions on native print logs in production | ✅ Covered |
| **CS-REQ-03** | Formatting Consistency | Enforced Prettier rules and Pascal/camel naming guidelines | ✅ Covered |

---

## 5. Review Checklist
- [x] Strict compilation settings prevent type overrides
- [x] Linter settings block leakage of credentials
- [x] Prettier configurations align with standard repository setups
- [x] Naming rules preserve folder structure consistency
