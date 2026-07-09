Status: Draft

Version: 0.2

Depends On:
- docs/Planning/16_Testing_Strategy.md

Blocks:
- docs/Development/18_Coding_Standards.md

Owner:
Lead Architect

---

# 17 - Deployment Strategy

## 1. Document Purpose
This document defines the production hosting parameters (Vercel), database connection pooling configurations, environment variable matrices, and release rollback procedures.

---

## 2. Infrastructure Setup & Environment Matrix

### 2.1 Target Hosting Environment
- **Platform**: Vercel (Serverless Functions architecture).
- **Regions**: Database is hosted near Vercel serverless locations (e.g. `us-east-1` or `eu-central-1`) to minimize database query latency.

### 2.2 Environment Variables Matrix

| Key | Scope | Purpose | Required in Dev |
|:---|:---|:---|:---:|
| `DATABASE_URL` | Server | PostgreSQL transaction connection string. | Yes |
| `DIRECT_URL` | Server | Direct connection string for Prisma migrations. | Yes |
| `JWT_SECRET` | Server | Key for signing and decrypting session cookies. | Yes |
| `CERTIFICATE_SECRET` | Server | Key for cryptographic HMAC signature validation. | Yes |

---

## 3. Database Connection Pooling

To prevent Serverless function scaling from exhausting database connections:
- Transaction strings use PgBouncer pool connection limit parameters: `?connection_limit=10&pgbouncer=true`.
- Schema migrations execute using `DIRECT_URL` bypassing PgBouncer.

---

## 4. Build Optimization & Rollouts

- **Build Target**: Next.js optimized build (`next build`).
- **Rollout gates**: Deployments trigger automatically on pull request merge to `main`.
- **Rollbacks**: If a runtime regression is found, Vercel is rolled back instantly to the last healthy commit build.

---

## 5. Requirements Traceability

| ID | Specification Reference | Deployment Configuration | Status |
|:---|:---|:---|:---:|
| **DS-REQ-01** | Production Stack | Vercel Serverless Hosting with PostgreSQL | ✅ Covered |
| **DS-REQ-02** | Secure Secrets | Encryption of critical env parameters | ✅ Covered |
| **DS-REQ-03** | Connection Limits | PgBouncer pool limits integrated | ✅ Covered |

---

## 6. Review Checklist
- [x] Host configurations align with Project Constitution stack (Vercel)
- [x] Env variables matrix isolates secrets from frontend builds
- [x] Connection pooling settings prevent database starvation
- [x] Rollback criteria defined for recovery
