---
title: 'GitHub Actions Advanced: Matrix, OIDC & Reusable CI/CD'
description: 'Master advanced GitHub Actions: reusable workflows, composite actions, matrix testing strategies, artifact caching, OpenID Connect (OIDC) cloud auth, and multi-environment deployment pipelines.'
order: 30
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/git/20-github-actions-basics']
---

# GitHub Actions Advanced: Matrix, OIDC & Reusable CI/CD

In enterprise organizations, building scalable CI/CD pipelines requires advanced orchestration patterns: eliminating duplicated YAML through **Reusable Workflows** and **Composite Actions**, testing across matrix combinations of operating systems and Node versions, accelerating builds via **Dependency and Cache Subsystems**, and authenticating securely to AWS/Azure/GCP without static long-lived credentials using **OpenID Connect (OIDC)**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Matrix & Reusable CI/CD Architecture        │
│                                                             │
│  Caller Workflow (.github/workflows/deploy.yml)             │
│  └── Calls: .github/workflows/reusable-build.yml            │
│            │                                                │
│            ▼                                                │
│  Matrix Strategy (Parallel Matrix Runners)                  │
│  ├── Node 20 / Ubuntu-Latest                                │
│  ├── Node 22 / Ubuntu-Latest                                │
│  └── Node 22 / Windows-Latest                               │
│            │                                                │
│            ▼                                                │
│  OIDC Cryptographic Auth (No static API secrets stored!)    │
│  └── Authenticates directly with AWS IAM / Cloudflare API   │
│            │                                                │
│            ▼                                                │
│  Deployment to Production with Required Approvals           │
└─────────────────────────────────────────────────────────────┘
```

## 1. Matrix Build Strategies

A matrix strategy runs jobs across multiple permutations of operating systems, Node.js versions, and browser targets simultaneously:

```yaml
jobs:
  matrix-test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [20.x, 22.x]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

## 2. Reusable Workflows (`workflow_call`)

Reusable workflows allow centralized DevOps teams to define standard security, test, and release templates that dozens of application repositories can call with zero code duplication:

```yaml
# .github/workflows/reusable-quality-gate.yml
name: Reusable Quality Gate

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '22'
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

Calling the reusable workflow from another pipeline:

```yaml
jobs:
  quality-check:
    uses: ./.github/workflows/reusable-quality-gate.yml
    with:
      node-version: '22'
```

## 3. Secure Cloud Authentication with OIDC

Storing long-lived cloud credentials (e.g. `AWS_SECRET_ACCESS_KEY`) in GitHub Secrets creates serious security risks if leaked. **OpenID Connect (OIDC)** allows GitHub Actions to request short-lived, dynamically generated access tokens directly from cloud providers (AWS, GCP, Azure, HashiCorp Vault):

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Mandatory for OIDC token exchange
      contents: read

    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubDeployRole
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://my-production-app/
```

## Summary & Key Takeaways

- Matrix strategies test multiple OS and runtime combinations in parallel.
- Reusable workflows (`workflow_call`) centralize enterprise CI/CD standards.
- OIDC eliminates static long-lived cloud credentials in favor of dynamic short-lived tokens.
- GitHub Actions caching dramatically accelerates build and dependency installation times.

## Best Practices & Senior Guidance

1. **Enforce `permissions: read-all` by Default**: Follow the principle of least privilege; explicitly grant `id-token: write` or `contents: write` only to the specific jobs that require them.
2. **Use `concurrency: cancel-in-progress: true`**: Automatically cancel obsolete CI builds when developers push new commits to an open PR to save runner minutes.
