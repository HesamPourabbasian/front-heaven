---
title: 'GitHub Administration: Organizations, Teams & RBAC'
description: 'Master GitHub enterprise administration: organizations, team hierarchies, role-based access control (RBAC), organization-wide rulesets, audit logs, and SAML/SSO integration.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites: ['/learn/git/17-advanced-github']
---

# GitHub Administration: Organizations, Teams & RBAC

Enterprise software development requires centralized user management, fine-grained access control, and strict compliance auditing. **GitHub Organizations** and **GitHub Enterprise** allow administrators to organize hundreds of developers into functional team hierarchies, enforce security baselines across thousands of repositories, integrate Single Sign-On (SSO / SAML), and monitor security audit logs.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Organization Structure               │
│                                                             │
│  Enterprise Organization (@front-heaven-org)                │
│  ├── IdP Integration: Okta / Azure AD SSO (SAML 2.0)        │
│  ├── Organization-Wide Rulesets (Require 2 PR Approvals)    │
│  └── Team Hierarchy:                                        │
│      ├── @frontend-core (Read/Write on UI repos)            │
│      ├── @security-leads (Admin on auth repos)              │
│      └── @devops-admins (Admin on infrastructure repos)      │
└─────────────────────────────────────────────────────────────┘
```

## 1. Role-Based Access Control (RBAC)

GitHub provides five standard repository permission levels:
- **Read**: View code, open issues, pull branches, and clone.
- **Triage**: Manage issues and PRs (assign, label, close) without write access to code.
- **Write**: Push branches, merge PRs, and edit wiki.
- **Maintain**: Manage repository settings, issues, and releases without admin deletion rights.
- **Admin**: Full control (delete repository, configure secrets, manage access).

## 2. Organization-Wide Rulesets

Rather than configuring branch protection rules manually on 50 individual repositories, administrators define **Organization Rulesets** that enforce rules across all current and future repositories automatically:
- Mandate signed commits.
- Enforce strict branch naming conventions (`feature/*`, `fix/*`).
- Require automated security scanning (CodeQL) to pass before merge.

## Summary & Key Takeaways

- Organizations provide centralized management, team hierarchies, and billing.
- RBAC grants granular permissions (Read, Triage, Write, Maintain, Admin).
- Organization Rulesets enforce security standards across entire repository fleets.
- Enterprise audit logs track all permission changes, secret accesses, and repository deletions.

## Best Practices & Senior Guidance

1. **Enforce SSO / SAML with 2FA**: Mandate two-factor authentication across all organization members.
2. **Grant Access via Teams, Never Individual Users**: Assign repository permissions exclusively to GitHub Teams to ensure seamless onboarding and offboarding.
