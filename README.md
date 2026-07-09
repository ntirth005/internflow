# SkillBridge Internship Management Portal (IMP)

Welcome to the **SkillBridge Internship Management Portal (IMP)**. This platform coordinates project distribution, student progress tracking, submission reviews, and cryptographic certificate generation.

---

## 🚀 Technical Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Hosting**: Vercel

---

## 📂 Project Directory Structure

```
.
├── docs/                      # Gated project documentation hierarchy
│   ├── 00_Project_Requirements.pdf
│   ├── 01_Project_Constitution.md
│   ├── CURRENT_PHASE.md       # Live project phase and document status tracker
│   └── ...
├── prisma/                    # Relational database models and schemas
│   └── schema.prisma
├── src/
│   ├── app/                   # App Router views, landing pages, and endpoints
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   ├── components/            # Reusable UI widgets
│   ├── lib/                   # Shared client helpers (e.g., Prisma singleton)
│   └── ...
├── .env                       # Environment profiles (Database strings, JWT secrets)
└── package.json
```

---

## 🛠️ How to Run Locally

### 1. Prerequisites
Ensure you have **Node.js** and **PostgreSQL** installed locally.

### 2. Set Up Environment Variables
Create a `.env` file in the project root folder (or copy from the provided template):
```bash
# PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillbridge_imp?schema=public&connection_limit=10&pgbouncer=true"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/skillbridge_imp?schema=public"

# Cryptographic Signer Secrets
JWT_SECRET="your_jwt_secret_token_signature_key"
CERTIFICATE_SECRET="your_certificate_hmac_sha256_private_secret_key"
```

### 3. Install Dependencies
Run the installation with the `--ignore-scripts` flag as required by repository safety guidelines:
```bash
npm install --ignore-scripts
```

### 4. Generate Prisma Client
Build the database interface bindings:
```bash
npx prisma generate
```

### 5. Start Development Server
Launch the compiler and hot-reloader:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the portal.

---

## 📈 Development Workflow & Governance

This project implements a strict **documentation-first workflow**. All 21 documentation files (covering architecture, design systems, and testing rules) must be approved before shipping code features.

- **Gating Log**: Refer to [CURRENT_PHASE.md](file:///home/ntirth005/Documents/IMP/docs/CURRENT_PHASE.md) for live phase tracking.
- **Commit Format**: All commit messages must follow the Conventional Commits Specification:
  - `feat(scope): <description>` (new features)
  - `fix(scope): <description>` (bug fixes)
  - `docs(scope): <description>` (documentation updates)
  - `refactor(scope): <description>` (refactoring checks)

For a deep-dive into the specifications, browse the files in the [docs](file:///home/ntirth005/Documents/IMP/docs/) folder.
