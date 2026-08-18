---
title: 'CI/CD Foundations, Git Workflows & Automated Delivery'
description: 'Master enterprise CI/CD pipelines: Trunk-Based Development, Conventional Commits, Semantic Versioning, GitHub Actions automation, Staging/Production environments, and Automated Rollbacks.'
order: 15
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/14-frontend-security
---

# CI/CD Foundations, Git Workflows & Automated Delivery

High-performing software engineering teams measure delivery using **DORA Metrics** (Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Time to Restore Service). Achieving daily production deployments requires strict Git workflows, automated Continuous Integration (**CI**) verification, and Continuous Deployment (**CD**) automation.

In this lesson, we explore **Trunk-Based Development**, Semantic Versioning (**SemVer**), Conventional Commits, GitHub Actions pipeline architecture, multi-environment promotion (Staging → Production), and automated rollback mechanisms.

```text
┌────────────────────────────────────────────────────────────┐
│                    The CI/CD Delivery Pipeline             │
├────────────────────────────────────────────────────────────┤
│ Developer Push / Pull Request                              │
│       │                                                    │
│       ▼                                                    │
│ 1. CI Pipeline (Parallel Jobs):                            │
│    ├── Type Check (`tsc --noEmit`)                         │
│    ├── Linter (`eslint .`)                                 │
│    ├── Unit Tests (`vitest run --coverage`)                │
│    └── E2E Tests (`playwright test --shard=1/4`)           │
│       │                                                    │
│       ▼ (Merge to main)                                    │
│ 2. CD Pipeline:                                            │
│    ├── Build Production Artifacts (`dist/`, `.output/`)    │
│    ├── Deploy to Staging Preview (Automated Smoke Tests)   │
│    └── Promote to Production CDN with Instant Rollback     │
└────────────────────────────────────────────────────────────┘
```

## 1. Branching Strategies: Trunk-Based Development vs Git Flow

- **Git Flow (Legacy)**: Uses long-lived branches (`develop`, `feature/*`, `release/*`, `hotfix/*`). Feature branches stay open for weeks, resulting in painful "merge hell" and slow release cadences.
- **Trunk-Based Development (Modern Industry Standard)**: All engineers commit short-lived branches (lasting less than 1-2 days) directly to a single shared branch (`main`). Incomplete features are hidden behind runtime **Feature Flags**, allowing code to be merged and deployed to production continuously without blocking releases.

## 2. Conventional Commits & Semantic Versioning (SemVer)

Using structured commit messages allows automated tools (like `release-please` or `semantic-release`) to determine version bumps and generate changelogs automatically:

```text
feat(auth): add biometric WebAuthn login support        ──► Bumps MINOR version (1.1.0 -> 1.2.0)
fix(checkout): resolve cart discount calculation bug    ──► Bumps PATCH version (1.2.0 -> 1.2.1)
feat(api)!: remove deprecated v1 legacy endpoints      ──► Bumps MAJOR version (1.2.1 -> 2.0.0)
```

## 3. Production-Ready GitHub Actions CI Pipeline

A modular, parallelized GitHub Actions workflow that catches bugs before pull requests can be merged:

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true # Cancels outdated builds when new commits are pushed!

jobs:
  validate:
    name: Code Quality & Type Safety
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile

      # Parallel static verification
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test:unit --coverage

  e2e:
    name: Playwright Integration Tests
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e
```

## 4. Continuous Deployment (CD) & Environment Promotion

The CD pipeline takes verified production artifacts and promotes them through isolated environments:
1. **Pull Request Preview Environments**: Ephemeral preview URLs (e.g., `pr-142.app.dev`) deployed automatically for design and QA review.
2. **Staging Environment**: Exact replica of production infrastructure with sanitized test databases.
3. **Production Deployment**: Edge CDN deployment with automated health check verification.

## 5. Automated Rollbacks & Feature Flags

If a production deployment introduces critical errors:
- **Instant CDN Rollback**: Modern hosting platforms (Vercel, Cloudflare Pages, AWS CloudFront) store immutable historical deployment hashes. Rolling back reverts the active CDN alias pointer to the previous build hash in less than 5 seconds.
- **Feature Flags (LaunchDarkly / Unleash)**: Wrap risky code paths in dynamic feature toggles to disable failing features instantly without needing a full redeploy or Git revert.

## Summary

- Trunk-Based Development replaces long-lived branches with short-lived feature branches and runtime Feature Flags.
- Conventional Commits automate Semantic Versioning (`fix:` = Patch, `feat:` = Minor, `BREAKING CHANGE:` = Major).
- GitHub Actions concurrency groups cancel redundant in-progress builds on new commits.
- CI pipelines run type checking, linting, unit tests, and E2E tests in parallel stages.
- Automated rollbacks and Feature Flags protect production uptime during regressions.

## Best Practices

1. **Keep Pull Requests Small (< 400 lines of code)**: Small PRs are reviewed faster, have fewer merge conflicts, and lower change failure rates.
2. **Cancel Redundant CI Runs with `cancel-in-progress`**: Save CI runner minutes and get faster feedback on rapid commits.
3. **Use `--frozen-lockfile` in CI**: Ensure exact dependency versions are installed during builds.
4. **Decouple Deployment from Release via Feature Flags**: Deploy code to production early and toggle it on for users when ready.
