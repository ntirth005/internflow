# Changelog

This document logs all major architectural revisions, governance updates, and structural adjustments for the SkillBridge Internship Management Portal (IMP).

---

## [1.2.0] — 2026-07-09

### docs(readme): sync active phase status with CURRENT_PHASE.md
- **Fix**: `docs/README.md` §"Current Project Status" previously stated "Active Phase: Phase 8: API Design 🚧 Active" — a stale value left over from earlier drafting. `docs/CURRENT_PHASE.md` (the single live source of truth per Constitution §3.1) shows Phases 1–9 all ✅ Approved and Phase 10 (Development Iterations) as the actual active phase (🚧 Active, Version 0.1).
- **Action**: Updated `docs/README.md` to reflect Phase 10 as active, Phase 9 as last completed, and added a clarifying note that `CURRENT_PHASE.md` is authoritative.

### docs(arch): specify HMAC-SHA256 certificate signing mechanism
- **Fix**: `docs/Architecture/09_API_Architecture.md` referenced "cryptographic verification algorithms" without specifying the signing mechanism. A raw SHA-256 hash is not tamper-proof (anyone with the same inputs can regenerate it). `docs/Architecture/08_Database_Architecture.md` described `hashSignature` only as "Verifiable signature (SHA-256 string)" — similarly underspecified.
- **Decision**: **Option A selected** — HMAC-SHA256 keyed with server-only `CERT_SIGNING_SECRET` env var (minimum 32-byte random hex string, never client-exposed).
- **Action**:
  - Defined canonical payload format: `studentId|projectId|issuedAt` (stable UUIDs + ISO-8601 timestamp; mutable human-readable fields excluded to prevent signature invalidation on data edits).
  - Documented `computeCertificateHMAC()` function (Node.js `crypto.createHmac`) and `verifyCertificateSignature()` function (constant-time `crypto.timingSafeEqual`).
  - Updated `docs/Architecture/08_Database_Architecture.md` `Certificate.hashSignature` field comment and `prisma/schema.prisma` to match.
  - Updated `GET /api/verify/[certId]` route description, requirements traceability table, and review checklist in `09_API_Architecture.md`.

---

## [1.1.0]

### Added
- Created `docs/CURRENT_PHASE.md` to track implementation milestones and approvals.
- Created `docs/CHANGELOG.md` to maintain formal document modifications.
- Established `docs/Decision-Records/ADR-000-Template.md` to format architectural decisions.
- Created placeholders for all 21 files under `Architecture/`, `Design/`, `Planning/`, and `Development/` subfolders.
- Added `docs/README.md` to orient developers on the documentation-first workflow.

### Changed
- Updated `docs/01_Project_Constitution.md` to Version 1.1 with Conventional Commits, AI alignment, allowed/prohibited rules, and Definition of Done.
- Renamed requirements PDF to `docs/00_Project_Requirements.pdf` to match hierarchy rules.
- Moved `docs/SSOT_Gemini_Master_Prompt.md` to `docs/Templates/SSOT_Gemini_Master_Prompt.md`.

### Removed
- Deleted obsolete file `docs/Product_Design_UX_Architecture_Specification.md`.

---

## [1.0.0]

### Added
- Established initial git repository structure.
- Created `docs/01_Project_Constitution.md` governing initial project stack and constraints.
- Created `docs/02_Documentation_Index.md` mapping documentation index.
- Created `docs/START_HERE.md` entry point for AI assistants.
