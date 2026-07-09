Status: Draft

Version: 0.2

Depends On:
- docs/Planning/15_Implementation_Roadmap.md

Blocks:
- docs/Planning/17_Deployment_Strategy.md

Owner:
Lead Architect

---

# 16 - Testing Strategy

## 1. Document Purpose
This document establishes the testing framework, unit-test configs (Vitest), end-to-end scenarios (Playwright), mock configurations, and coverage requirements for the portal.

---

## 2. Testing Framework Setup

The project uses a two-tier testing setup to validate code correctness and user interactions.

```
+--------------------------------------------------------+
| Playwright E2E Tests (Dashboard Flows, Middleware Guard)|
+--------------------------------------------------------+
                           │
                           ▼
+--------------------------------------------------------+
| Vitest Unit Tests (Server Actions, Schemas, Hash Logic)|
+--------------------------------------------------------+
```

### 2.1 Unit & Integration Testing (Vitest)
- **Engine**: Vitest combined with `@testing-library/react`.
- **Purpose**: Validate data inputs parsing, cryptographic HMAC calculations, and Server Action execution logic.
- **Coverage Goal**: Minimum **80% code coverage** required for utility files and Server Actions.

### 2.2 End-to-End Testing (Playwright)
- **Engine**: Playwright.
- **Purpose**: Verify multi-role user dashboards, Edge Middleware path redirection, and certificate verification paths.
- **Configurations**:
  - Test suites simulate user login inputs, dashboard navigations, toggling checklists, submitting mock deliverables, and certificate issuance verification.

---

## 3. Mock Configurations & Test Database

- **Database Mocking**: Unit tests utilize a mocked Prisma Client wrapper to bypass live PostgreSQL queries.
- **Integration Test environment**: Integration/E2E test pipelines run migrations against a transient local PostgreSQL Docker container.

---

## 4. Requirements Traceability

| ID | Specification Reference | Testing Specification | Status |
|:---|:---|:---|:---:|
| **TS-REQ-01** | Cryptographic Logic | Unit tests validating certificate HMAC consistency | ✅ Covered |
| **TS-REQ-02** | Middleware RBAC | Playwright tests confirming route redirects and JWT session gates | ✅ Covered |
| **TS-REQ-03** | Progress Calculation | Unit tests validating progress math transitions | ✅ Covered |

---

## 5. Review Checklist
- [x] Test framework configs match standard Next.js layouts
- [x] Coverage benchmarks specified for core logic handlers
- [x] Mock configurations isolate backend logic from external integrations
- [x] Test pipelines integrated with PR gating checks
