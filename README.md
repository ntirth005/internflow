# SkillBridge Internship Management Portal (IMP)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.0-teal?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A premium, production-grade enterprise platform designed to coordinate internship cohorts, track project milestone task completions, host auditor review workspaces, and issue cryptographically secure, publicly verifiable credentials.

---

## 🎯 Architectural Overview & Highlights

This portal is built as a monolithic Next.js application, utilizing Serverless Edge functions, relational database transaction pools, and stateless JWT-based Role-Based Access Controls (RBAC).

```
              ┌──────────────────────────────────────────────┐
              │              Client View (Web)               │
              └──────────────────────┬───────────────────────┘
                                     │ (Client Server Actions / GET Requests)
                                     ▼
                      ┌──────────────────────────────┐
                      │    Edge Routing Middleware   │ (Stateless JWT Verification)
                      └──────────────┬───────────────┘
                                     │
                  ┌──────────────────┴──────────────────┐
                  ▼                                     ▼
      ┌──────────────────────┐              ┌──────────────────────┐
      │   Serverless API     │              │    Public Verify     │ (Cryptographic Hash)
      │  / Action Handlers   │              │   Landing Page       │ (Timing-Safe Check)
      └──────────┬───────────┘              └──────────┬───────────┘
                 │                                     │
                 └───────────────────┬─────────────────┘
                                     │ (Connection Pooling PgBouncer)
                                     ▼
                      ┌──────────────────────────────┐
                      │    Relational PostgreSQL     │
                      └──────────────────────────────┘
```

---

## 🛠️ Key Engineering Achievements (For Lead Developers)

### 1. Timing-Safe Cryptographic Signature Verification
To safeguard public verification routes against side-channel timing attacks, certificates are protected by custom HMAC signatures:
*   **Signature Generation**: Computes a deterministic HMAC-SHA256 digest on the payload `studentId|projectId|issuedAt` using a server-side private `CERTIFICATE_SECRET`.
*   **Timing-Safe Evaluation**: Public query lookups compare the URL signature against the expected signature using Node's `crypto.timingSafeEqual`, preventing information leaks caused by character-by-character string comparison speed differences.

### 2. Next.js Server Actions & React 19 Optimistic State Updates
- **Instant Responsiveness**: Student project checklists leverage React 19 optimistic rendering states to toggle UI checkboxes instantly before database writes complete.
- **Atomic Database Operations**: Actions execute transactional updates (`prisma.$transaction`) to toggle task completion counters, recompute progress metrics, and automatically transition student profile statuses (`ASSIGNED` -> `IN_PROGRESS`).
- **Data Invalidation**: Uses Next's `revalidatePath` to trigger instant cache updates across active pages.

### 3. Edge Middleware Role-Based Access Control (RBAC)
- Stateless session management is achieved using JSON Web Tokens (JWT) signed with modern cryptographic algorithms (`jose` library) and stored in `httpOnly` secure cookies.
- Edge Middleware intercepts matching dashboard prefixes (`/dashboard/:path*`), verifies token payloads, and executes RBAC rules on incoming requests before page assets render.

### 4. Database Connection Pooling Safety
- To prevent Serverless function scaling from exhausting database connections, transaction strings utilize PgBouncer pool limits: `?connection_limit=10&pgbouncer=true`.
- Database schema changes and seed scripts execute using a direct `DIRECT_URL` string to bypass connection pool caches during schema sync.

---

## 💻 Core Features (For Recruiters & Interviewers)

- **Comprehensive Student Workspace**: Visual project progress rings, interactive task checklists, deliverable submit forms (validating repository URLs), and historical review timelines.
- **Mentor Audit Workspace**: A dedicated, searchable student review queue, evaluation workspaces, and formal sign-off components (`APPROVE` or `REJECT` inputs).
- **Admin Management Panel**: Full user directory lists, project template builders, cohort allocation selectors (assigning project tasks and mentors to students), and credential issuance switches.
- **Public Verification Directory**: Centered lookup route where employers or recruiters can paste signature hashes to verify the certificate's authenticity.

---

## 📂 Project Directory Structure

```
.
├── docs/                      # Gated architectural blueprints & standards
│   ├── Architecture/          # System designs (Product, UX, Database, API)
│   ├── Design/                # Component libraries & interaction guides
│   ├── Planning/              # Roadmaps, testing & deployment strategies
│   └── CURRENT_PHASE.md       # Live project development status tracker
├── prisma/                    # Database models, migrations, and seeds
│   ├── schema.prisma
│   └── seed.ts                # Populate demo users & certified graduates
├── src/
│   ├── app/                   # App Router views & Server Actions
│   │   ├── actions/           # Core mutations (Student, Mentor, Certificate)
│   │   ├── dashboard/         # Multi-role sub-directories
│   │   ├── verify/            # Public certificate search & validation routes
│   │   └── page.tsx
│   ├── components/            # Shared UI components (Card, Alert, Button)
│   └── lib/                   # Singletons & cryptographic utilities
├── vercel.json                # Production deployment settings
└── package.json
```

---

## 🚀 How to Run & Test the Demo Locally

### 1. Configure the Environment Profile
Create a `.env` file in the project root:
```bash
# Relational Database Connection (PgBouncer vs Direct)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillbridge_imp?schema=public&connection_limit=10&pgbouncer=true"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/skillbridge_imp?schema=public"

# Cryptographic Signer Secrets
JWT_SECRET="skillbridge_jwt_secret_token_signature_key_2026"
CERTIFICATE_SECRET="skillbridge_certificate_hmac_sha256_private_secret_key"
```

### 2. Install Dependencies & Build
```bash
npm install --ignore-scripts
npx prisma generate
```

### 3. Seed Database & Generate Demo Hash
Execute the seed runner to automatically populate initial users and generate a pre-graduated certified student record:
```bash
npx prisma db seed
```
This logs a pre-calculated demo verification link directly to your console, e.g.:
`http://localhost:3000/verify/249298a59cd741a96921d270b57cd7444ef37991a6ee4d15032bfdfaac744288`

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to test the login flows!

#### Demo Credentials (Password: `password123`)
- **System Admin**: `admin@interflow.co.in`
- **Mentor**: `mentor@interflow.co.in`
- **Student**: `student@interflow.co.in`
- **Pre-Certified Graduate**: `certified@interflow.co.in`
