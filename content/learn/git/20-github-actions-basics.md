---
title: 'GitHub Actions Basics: CI/CD Workflows & Automation'
description: 'Master GitHub Actions fundamentals: workflows (.github/workflows/), triggers (push, pull_request), jobs, steps, runners, secrets, and common CI pipelines (lint, test, build).'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/git/07-github-basics']
---

# GitHub Actions Basics: CI/CD Workflows & Automation

**GitHub Actions** is a continuous integration and continuous delivery (CI/CD) platform integrated directly into GitHub. It allows you to automate software workflows—running tests on every Pull Request, building production assets, scanning code for security vulnerabilities, and deploying applications to cloud infrastructure—all configured declaratively via YAML files in `.github/workflows/`.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Actions Architecture                 │
│                                                             │
│  Event Trigger (on: [push, pull_request])                   │
│             │                                               │
│             ▼                                               │
│  Workflow (.github/workflows/ci.yml)                        │
│             │                                               │
│             ▼                                               │
│  Job: 'build-and-test' (runs-on: ubuntu-latest)             │
│  ├── Step 1: Checkout Repository (actions/checkout@v4)      │
│  ├── Step 2: Setup Node.js (actions/setup-node@v4)          │
│  ├── Step 3: Install Dependencies (npm ci)                  │
│  ├── Step 4: Run Linter (npm run lint)                      │
│  ├── Step 5: Execute Unit Tests (npm test)                  │
│  └── Step 6: Build Production (npm run build)               │
└─────────────────────────────────────────────────────────────┘
```

## 1. Anatomy of a GitHub Actions Workflow

- **Event (`on`)**: The event that triggers the workflow (e.g. `push`, `pull_request`, `schedule`, `workflow_dispatch`).
- **Jobs (`jobs`)**: A collection of steps that execute on a runner. Multiple jobs run in parallel by default.
- **Runner (`runs-on`)**: The virtual machine (e.g. `ubuntu-latest`, `windows-latest`, `macos-latest`) executing the job.
- **Steps (`steps`)**: Individual tasks executed in sequence, either running shell commands (`run: ...`) or calling prebuilt actions (`uses: ...`).
- **Secrets (`secrets.VAR_NAME`)**: Encrypted environment variables configured in repository settings.

## 2. Complete Enterprise CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: Continuous Integration

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Cancel in-flight CI runs if new commits are pushed to the same PR
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Lint, Test & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint

      - name: Run Unit Tests
        run: npm test -- --coverage

      - name: Build Production Application
        run: npm run build -- --configuration=production
```

## Summary & Key Takeaways

- GitHub Actions automates CI/CD pipelines directly inside GitHub.
- Workflows are defined as YAML files placed in `.github/workflows/`.
- Use `npm ci` and caching in runners for fast, deterministic builds.
- Concurrency controls cancel redundant in-flight builds on new commits.

## Best Practices & Senior Guidance

1. **Always Pin Action Major Versions**: Use `@v4` (e.g. `actions/checkout@v4`) to receive security patches without breaking changes.
2. **Store Tokens in Repository Secrets**: Never hardcode API keys in workflow YAML; access them via `${{ secrets.API_KEY }}`.
