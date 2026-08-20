---
title: 'GitHub Security: Dependabot, Secret Scanning & CodeQL'
description: 'Master GitHub enterprise security: Dependabot dependency management, automated secret scanning, SAST with CodeQL code scanning, security advisories, and supply-chain hardening.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/git/08-github-authentication']
---

# GitHub Security: Dependabot, Secret Scanning & CodeQL

Securing modern web applications requires securing the entire software supply chain. Over 80% of code in a typical enterprise web project comes from third-party open-source npm dependencies. A single compromised package can introduce severe vulnerabilities or backdoor exploits.

GitHub provides an enterprise security suite: **Dependabot**, **Secret Scanning**, **CodeQL Static Application Security Testing (SAST)**, and **Security Advisories**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Security Suite Integration           │
│                                                             │
│  1. Secret Scanning (Push Protection)                       │
│     └── Blocks git push if API keys / tokens are detected   │
│                                                             │
│  2. Dependabot Alerts & Automated Version Updates           │
│     └── Opens automated PRs to patch vulnerable npm packages│
│                                                             │
│  3. CodeQL Code Scanning (SAST)                             │
│     └── Analyzes code for XSS, SQLi, and logic flaws on PRs │
│                                                             │
│  4. Private Security Advisories & Coordinated Disclosure    │
│     └── Privately fix zero-day exploits before public release│
└─────────────────────────────────────────────────────────────┘
```

## 1. Automated Dependency Auditing with Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Check npm dependencies weekly
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "HesamPourabbasian"
    labels:
      - "dependencies"
      - "security"

  # Check GitHub Actions dependencies monthly
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

## 2. Static Code Analysis with CodeQL

CodeQL treats source code as data, querying codebases for known security vulnerabilities (XSS, Prototype Pollution, Insecure Regex, Path Traversal):

```yaml
# .github/workflows/codeql.yml
name: CodeQL Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # Run weekly on Sunday

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read

    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
      - uses: github/codeql-action/analyze@v3
```

## 3. Secret Scanning & Push Protection

GitHub's Secret Scanning automatically detects leaked API tokens (Stripe, AWS, Slack, GitHub PATs). Enabling **Push Protection** blocks developers from completing a `git push` if a recognized secret signature is detected in the commit diff.

## Summary & Key Takeaways

- Dependabot automatically scans for and patches known vulnerabilities in npm packages.
- CodeQL performs static analysis to detect security flaws in TypeScript/JavaScript code.
- Secret Scanning with Push Protection blocks accidental credential leaks before they enter remote history.

## Best Practices & Senior Guidance

1. **Enable Push Protection Globally**: In repository settings, toggle "Push protection" to intercept secret leaks on developer machines.
2. **Never Ignore Dependabot Security Alerts**: Prioritize security PRs above standard feature development.
