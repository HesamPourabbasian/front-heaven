---
title: 'Advanced GitHub: CODEOWNERS, Templates & Protection'
description: 'Master advanced GitHub repository governance: PR and Issue templates, CODEOWNERS rules, branch protection rules, required reviews, status checks, and merge queues.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/git/09-basic-collaboration']
---

# Advanced GitHub: CODEOWNERS, Templates & Protection

As engineering teams expand from a handful of developers to hundreds of contributors, manual oversight is insufficient to guarantee code quality and security. GitHub provides sophisticated repository governance mechanisms: **Branch Protection Rules / Rulesets**, **Automated CODEOWNERS Review Assignments**, **Pull Request & Issue Templates**, and **Merge Queues**.

These tools automate compliance, ensuring that no code reaches production without passing CI pipelines, security audits, and domain expert reviews.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Enterprise Governance Guardrails     │
│                                                             │
│  Pull Request Created                                       │
│             │                                               │
│             ▼                                               │
│  1. Apply PR Template (.github/pull_request_template.md)    │
│             │                                               │
│             ▼                                               │
│  2. Auto-Assign Reviewers via CODEOWNERS (.github/CODEOWNERS)│
│     ├── /src/auth/  ──> @security-team                      │
│     └── /src/ui/    ──> @design-system-team                 │
│             │                                               │
│             ▼                                               │
│  3. Branch Protection Enforcement                           │
│     ├── Require 2 Approving Reviews                         │
│     ├── Require Status Checks to Pass (CI Lint, Test, Build)│
│     └── Require Up-to-Date Branch with main                 │
│             │                                               │
│             ▼                                               │
│  4. Merge Queue (Auto-tests and merges in parallel batch)   │
└─────────────────────────────────────────────────────────────┘
```

## 1. Automated Review Routing with `CODEOWNERS`

The **`CODEOWNERS`** file (`.github/CODEOWNERS`) automatically assigns specific developers or teams as mandatory reviewers whenever a Pull Request modifies files in their domain:

```text
# .github/CODEOWNERS

# Default catch-all owner for the entire repo
* @HesamPourabbasian

# Core security and authentication files
/src/app/core/auth/ @enterprise-security-team
/src/environments/ @devops-admins

# Design system UI components
/src/app/shared/ui/ @frontend-core-team @ui-lead

# Build and CI configuration
/.github/workflows/ @devops-admins
/package.json @frontend-core-team
```

When a developer modifies `/src/app/core/auth/jwt.service.ts`, GitHub automatically marks `@enterprise-security-team` as a required reviewer and blocks merging until their approval is recorded.

## 2. Standardizing Contributions with Templates

### Pull Request Template (`.github/pull_request_template.md`):

```markdown
## 📌 Summary of Changes
<!-- Describe what this PR does and why -->

## 🔗 Related Issues
Closes #

## 🧪 Testing Checklist
- [ ] Unit tests added / updated and passing
- [ ] Tested locally on Chrome, Firefox, Safari
- [ ] Accessibility (a11y) verified with screen reader

## 📸 Screenshots / Video
<!-- Attach before & after visual captures for UI changes -->
```

## 3. Branch Protection Rules & Rulesets

In **Repository Settings -> Rules -> Rulesets**, configure guardrails on `main`:
1. **Restrict Deletions & Force Pushes**: Prevents accidental deletion or history overwrites of `main`.
2. **Require a Pull Request Before Merging**: Blocks direct `git push origin main`.
3. **Require Approvals**: Enforce a minimum of 1 or 2 approving reviews before merge.
4. **Require Status Checks to Pass**: Specify required CI checks (e.g. `validate (test, lint, build)`). Code cannot be merged if any test fails.
5. **Require Linear History**: Enforces Squash or Rebase merging to prevent messy merge commits.

## 4. The Merge Queue

In large teams where dozens of PRs merge daily, two PRs that pass CI independently might break when merged together. The **GitHub Merge Queue** automatically tests PRs in an integrated staging batch before merging them into `main`, guaranteeing that `main` is never broken.

## Summary & Key Takeaways

- `CODEOWNERS` automatically routes review requests to appropriate domain owners.
- Issue and PR templates standardize bug reports and submission quality across contributors.
- Branch protection rules enforce required reviews, status checks, and linear histories.
- Merge Queues prevent integration breaks caused by concurrent PR merges.

## Best Practices & Senior Guidance

1. **Protect `main` on Day One**: Always enable branch protection requiring PR reviews and CI passes on newly initialized repositories.
2. **Use GitHub Teams in `CODEOWNERS`**: Assign teams (`@org/security-team`) rather than individual usernames so ownership remains unbroken when personnel changes occur.
