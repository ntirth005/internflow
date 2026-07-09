# InternFlow

> A modern, production-ready Internship Management Platform built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.  
> Developed using a **Documentation-First** engineering workflow with scalable architecture and clean development practices.

---

## 🌐 Live Demo

- **Production:** https://your-vercel-app.vercel.app
- **Repository:** https://github.com/ntirth005/internflow

---

## ✨ Features

### 👨‍🎓 Student Workspace
- Dashboard
- Project Progress Tracking
- GitHub Repository Submission
- Deployment Link Submission
- Feedback Timeline
- Certificate Status

### 👨‍🏫 Mentor Workspace
- Assigned Students
- Project Reviews
- Feedback Management
- Approval / Rejection Workflow

### 🛠 Administrator Workspace
- User Management
- Internship Management
- Project Assignment
- Analytics Dashboard
- Certificate Generation

### 🌍 Public
- Certificate Verification
- Public Verification Portal

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma |
| Database | PostgreSQL |
| Deployment | Vercel |

---

# 📁 Project Structure

```text
.
├── docs/
│   ├── START_HERE.md
│   ├── CURRENT_PHASE.md
│   ├── 00_Project_Requirements.pdf
│   ├── 01_Project_Constitution.md
│   ├── 02_Documentation_Index.md
│   ├── Architecture/
│   ├── Design/
│   ├── Planning/
│   ├── Development/
│   └── Decision-Records/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── package.json
├── vercel.json
└── README.md
```

---

# 📖 Documentation

This project follows a **Documentation-First Development Workflow**.

Before contributing, please read:

1. `docs/START_HERE.md`
2. `docs/01_Project_Constitution.md`
3. `docs/CURRENT_PHASE.md`
4. `docs/02_Documentation_Index.md`

These documents form the **Single Source of Truth (SSOT)** for the repository.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/ntirth005/internflow.git
cd internflow
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env` file.

```env
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
CERTIFICATE_SECRET=...
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🚀 Deployment

This project is deployed using **Vercel**.

Every push to the **main** branch automatically creates a production deployment.

---

# 🤝 Contributing

Please follow the project workflow.

- Read the documentation before starting.
- Work only on the active phase.
- One task → One commit.
- Follow Conventional Commits.
- Update documentation whenever necessary.

Example:

```text
feat(auth): implement role-based authentication
```

---

# 📌 Project Status

| Phase | Status |
|--------|--------|
| Repository Foundation | ✅ Complete |
| Product & UX Architecture | ✅ Complete |
| Design System & Specifications | ✅ Complete |
| Frontend & Backend Architecture | ✅ Complete |
| Database & API Designs | ✅ Complete |
| Development & Coding | ✅ Complete |
| Testing & Verification | ✅ Complete |
| Production Deployment | ✅ Active |

---

# 📚 Documentation Workflow

Every AI assistant and contributor must follow this sequence:

```text
START_HERE.md
        │
        ▼
Project Constitution
        │
        ▼
CURRENT_PHASE.md
        │
        ▼
Architecture Documents
        │
        ▼
Implementation
```

---

# 🏗 Engineering Principles

- Documentation First
- Architecture First
- Interface First
- Modular Design
- Clean Git History
- Conventional Commits
- AI-Assisted Development
- Maintainable Codebase
- Production-Ready Practices

---

# 🛣 Roadmap

- ✅ Repository Foundation
- ✅ Product & UX Architecture
- ✅ Information Architecture & Design System
- ✅ Frontend & Backend Architecture
- ✅ Database & API Designs
- ✅ Development & Coding
- ✅ Testing & Verification
- ✅ Production Release / Deployment

---

# 📄 License

This project is released under the **MIT License**.