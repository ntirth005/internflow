Status: Approved

Version: 1.0

Depends On:
- docs/Development/18_Coding_Standards.md

Blocks:
- docs/Development/20_Project_Structure.md

Owner:
Lead Architect

---

# 19 - Git Workflow

## 1. Document Purpose
This document establishes rules for Git branch structures, conventional commits syntax verification, pull requests, and merge policies.

---

## 2. Branching Strategy

The repository operates on a trunk-based branching model.

- **Main Trunk (`main`)**: Reflects the active production environment. Direct commits to `main` are strictly prohibited.
- **Feature Branches (`feat/...`, `fix/...`, `docs/...`)**: Created for localized tasks. Branches are named using kebab-case and reference task IDs where applicable (e.g. `feat/auth-middleware`).

---

## 3. Commit Policy (Conventional Commits)

Commit messages must conform to the Conventional Commits Specification:
`<type>(<scope>): <description>`

- **Allowed Types**:
  - `feat`: A new user feature (e.g., `feat(auth): implement Edge middleware redirect`).
  - `fix`: A bug fix (e.g., `fix(cert): correct signature padding mismatch`).
  - `refactor`: Refactoring logic without modifying functionality.
  - `docs`: Documentation edits.
  - `style`: Layout/formatting modifications.
  - `test`: Adding/modifying test suites.
  - `perf`: Code optimizations.
  - `build`: Build setup/dependency upgrades.
  - `chore`: Infrastructure updates.

---

## 4. Pull Requests & Code Reviews

- **PR Requirements**:
  - Code must compile with zero errors.
  - Tests must pass.
  - Changes must align with the approved system design and documentation.
- **Merge Style**: Squash and Merge. This keeps the git history linear and clean.

---

## 5. Requirements Traceability

| ID | Specification Reference | Git Workflow Rule | Status |
|:---|:---|:---|:---:|
| **GW-REQ-01** | Git Conventions | Commit syntax rules matching the Project Constitution | ✅ Covered |
| **GW-REQ-02** | Branch Separation | Trunk-based models preventing direct commits to main | ✅ Covered |
| **GW-REQ-03** | Linear History | Squash and Merge policies for clean commit logs | ✅ Covered |

---

## 6. Review Checklist
- [x] Branch structures map cleanly to task types
- [x] Conventional Commit formats defined and enforced
- [x] Pull Request criteria enforce compilation and test passes
- [x] Merge guidelines enforce linear squashed history
