---
title: 'GitHub API, CLI (gh) & Custom GitHub Apps'
description: 'Master GitHub automation: GitHub REST & GraphQL APIs, the official GitHub CLI (gh), creating custom GitHub Apps, and configuring real-time webhooks.'
order: 33
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/git/20-github-actions-basics']
---

# GitHub API, CLI (gh) & Custom GitHub Apps

For senior engineers and DevOps architects, interacting with GitHub via the web browser is often too slow for repetitive or bulk workflows. GitHub exposes complete programmatic control over repositories, issues, pull requests, releases, and users via the **GitHub CLI (`gh`)**, **REST API (v3)**, **GraphQL API (v4)**, and **Webhooks**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Automation Channels                  │
├───────────────────┬─────────────────────────────────────────┤
│ Channel           │ Primary Use Case & Characteristics      │
├───────────────────┼─────────────────────────────────────────┤
│ GitHub CLI (gh)   │ Terminal velocity: PR creation, checks, │
│                   │ releases, and issue management.         │
├───────────────────┼─────────────────────────────────────────┤
│ GitHub REST API   │ Standard JSON CRUD operations for       │
│                   │ custom automation scripts and bots.     │
├───────────────────┼─────────────────────────────────────────┤
│ GitHub GraphQL API│ Fine-grained, single-request data       │
│                   │ retrieval for high-scale telemetry.     │
├───────────────────┼─────────────────────────────────────────┤
│ Webhooks & Apps   │ Real-time event notifications to        │
│                   │ external web servers (Slack bots, etc.) │
└───────────────────┴─────────────────────────────────────────┘
```

## 1. The GitHub CLI (`gh`)

The official GitHub CLI brings GitHub features directly into your terminal:

```bash
# Authenticate GitHub CLI via browser / SSH
gh auth login

# Create a Pull Request directly from the terminal
gh pr create --title "feat(auth): add PKCE generator" --body "Closes #42" --web

# View the status of in-flight CI checks
gh pr checks

# Check out a colleague's PR locally in one command!
gh pr checkout 108

# Create a new GitHub Release with automatic notes
gh release create v1.2.0 --generate-notes
```

## 2. GitHub REST & GraphQL API

Querying repository details using `curl` or Node.js:

```bash
# Fetch latest repository release via REST API
curl -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer <TOKEN>" \
     https://api.github.com/repos/HesamPourabbasian/front-heaven/releases/latest
```

## 3. Real-Time Event Webhooks & GitHub Apps

**Webhooks** configure GitHub to send an HTTP POST payload to your backend server whenever specific events occur (e.g. `pull_request.opened`, `issues.labeled`, `release.published`). **GitHub Apps** act as secure, first-class bots with fine-grained permissions that can comment on PRs, run automated code reviews, and deploy preview environments.

## Summary & Key Takeaways

- The GitHub CLI (`gh`) automates PRs, issues, and releases directly from your shell.
- The REST and GraphQL APIs enable custom automation scripts and metrics collection.
- Webhooks send real-time JSON payloads to external services upon repository events.
- GitHub Apps provide secure, token-rotated bots for enterprise workflow automation.

## Best Practices & Senior Guidance

1. **Adopt the GitHub CLI for Daily PR Work**: Running `gh pr create` and `gh pr checkout` saves minutes of context-switching daily.
2. **Use GitHub Apps Over Personal Bot Accounts**: GitHub Apps provide scoped permissions and avoid consuming individual employee seat licenses.
