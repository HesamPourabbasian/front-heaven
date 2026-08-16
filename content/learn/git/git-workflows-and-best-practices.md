---
title: 'Git workflows and best practices'
description: 'The conventions and habits that keep your project history clean, your team coordinated, and your code deployable at any time.'
order: 7
difficulty: 'beginner'
category: 'Best Practices'
estimatedMinutes: 25
prerequisites:
  - learn/git/pull-requests-and-collaboration
---

## Introduction

Knowing Git commands is not the same as using Git well. A team that commits directly to `main`, writes vague commit messages, and never cleans up branches will struggle with confusion, bugs, and deployment failures. A team that follows consistent workflows — branching strategies, commit conventions, review processes — works faster with fewer mistakes.

This lesson covers the workflows and best practices that professional teams use: how to structure branches, when to commit, how to write messages that tell a story, and the habits that keep a repository healthy over months and years.

## The Gitflow workflow

**Gitflow** is a branching model that defines the roles of different branches:

- **`main`** — the stable, production-ready branch. Every commit on `main` is deployable.
- **`develop`** — the integration branch where features are combined. It is the "next release" in progress.
- **`feature/*`** — branches for individual features, branched from `develop` and merged back.
- **`release/*`** — branches for preparing a release (version bumps, final testing), branched from `develop` and merged into both `main` and `develop`.
- **`hotfix/*`** — urgent fixes for production, branched from `main` and merged back.

The flow: features branch from `develop`, get reviewed via pull request, and merge back. When `develop` is ready for release, create a `release` branch, finalise it, and merge into `main` (tagging the release) and back into `develop`. For urgent bugs, `hotfix` branches fix production and propagate to `develop`.

Gitflow is thorough but can be heavy for small teams or projects with continuous deployment. It is most useful when you have distinct release cycles.

## The GitHub Flow

**GitHub Flow** is simpler and more popular for modern web development:

1. `main` is always deployable
2. Create a descriptive branch from `main` for every change
3. Commit and push the branch
4. Open a pull request
5. Discuss and review
6. Merge when approved
7. Deploy from `main`

There is no `develop` branch. There are no release branches. The simplicity works because modern deployment tools (Vercel, Netlify, CI/CD pipelines) can deploy any commit on `main` instantly. This is the workflow most front-end projects use today.

## Commit conventions

Consistent commit messages make a project's history readable. The **Conventional Commits** specification is the most widely adopted format:

```
<type>: <description>

[optional body]

[optional footer]
```

Types:

- **`feat`** — a new feature
- **`fix`** — a bug fix
- **`docs`** — documentation changes
- **`style`** — formatting (no code change)
- **`refactor`** — code restructuring (no feature or fix)
- **`test`** — adding or updating tests
- **`chore`** — maintenance (dependencies, CI config)

Examples:

```
feat: add newsletter signup form
fix: prevent form submission with invalid email
docs: update README with installation steps
refactor: extract validation into separate module
```

This format is machine-readable (tools can parse it for changelogs), human-readable (the type tells you the nature of the change), and consistent across teams. It is not mandatory for Git, but it is the professional standard.

## Writing meaningful commit messages

A good commit message answers: *What changed?* and *Why?*

- The first line is a summary in imperative mood ("Add", "Fix", "Update") under 50 characters
- Leave a blank line, then explain the context in a paragraph if needed
- Reference related issues or PRs

Bad:

```
fixed stuff
update
asdfasdf
```

Good:

```
Fix mobile navigation overflow on screens under 320px

The hamburger menu was positioned with a fixed left offset that
caused it to clip off-screen on very narrow devices. Switch to
percentage-based positioning with a min-width fallback.
```

The difference: the second message tells you what was wrong, what was changed, and why — without reading the code.

## Keeping history clean

### Rebase before merging

If your feature branch has fallen behind `main` and accumulated merge commits, **rebase** to clean up:

```bash
git switch feature/my-feature
git fetch origin
git rebase origin/main
```

Rebase replays your commits on top of the latest `main`, creating a linear history without merge commits. Resolve any conflicts during the rebase, then force-push the branch:

```bash
git push --force-with-lease
```

Use `--force-with-lease` instead of `--force` — it refuses to overwrite commits that someone else may have pushed, preventing you from accidentally erasing a teammate's work.

### Squash messy commits

If a branch has five "WIP" and "fix typo" commits, squash them before merging:

```bash
git rebase -i HEAD~5
```

In the interactive editor, change `pick` to `squash` (or `s`) for the commits you want to combine. This collapses them into a single, clean commit.

### Squash and merge on GitHub

GitHub's "Squash and merge" button combines all PR commits into one and adds it to `main`. This gives you the benefit of detailed commits during development (WIP, experiments, fixes) while keeping the `main` history clean and readable.

## Writing a useful README

Every project needs a README.md that answers:

- **What is this?** — one-sentence description
- **How do I install it?** — step-by-step commands
- **How do I run it?** — dev server, build, preview
- **How do I contribute?** — link to contribution guide or PR process

A README is the front door of your project. On GitHub, it is displayed on the repository homepage. A missing or empty README signals a project that is not ready for collaboration.

## .gitignore essentials

A comprehensive `.gitignore` prevents sensitive and unnecessary files from being tracked:

```
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
.next/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

Create this file at the start of every project — before your first commit. Once a file is committed, adding it to `.gitignore` does not remove it from history. You must `git rm --cached` it.

## Handling large files and secrets

Git is not designed for large binary files (videos, datasets, design files over 10MB). They bloat the repository history permanently. Use **Git LFS** (Large File Storage) for these, or host them externally and link to them.

Never commit secrets: API keys, passwords, tokens, private certificates. Add them to `.gitignore` immediately. If a secret is committed, rotate it — the commit is in the history and cannot be fully removed without rewriting history (which affects all collaborators).

## Tags and releases

**Tags** mark specific commits as important — usually releases:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Tags are permanent pointers to commits. Unlike branches, they never move. On GitHub, tags create "Releases" with downloadable archives. Use [semantic versioning](https://semver.org/) (MAJOR.MINOR.PATCH) for version numbers:

- **MAJOR** — breaking changes
- **MINOR** — new features (backward-compatible)
- **PATCH** — bug fixes

## Common mistakes

Not using branches — direct commits to `main` bypass review and risk breaking production. Writing vague commit messages — "fix" and "update" are useless when searching history. Never rebasing — merge commits accumulate and the history becomes unreadable. Committing secrets — once in history, they are accessible to anyone with repository access.

Also: force-pushing to `main` — this is almost always a mistake and is usually protected by branch rules. Leaving stale branches unmerged — they create confusion about what is active. Ignoring the README — an empty README signals an incomplete project.

## Best practices

- Use GitHub Flow for most projects: `main` is always deployable.
- Branch for every change, no matter how small.
- Follow Conventional Commits for message consistency.
- Rebase feature branches on `main` before opening PRs.
- Squash messy commits before merging.
- Keep `.gitignore` comprehensive and created before the first commit.
- Never commit secrets — use environment variables and `.env`.
- Tag releases with semantic version numbers.
- Write a clear README for every project.
- Clean up merged branches regularly.

## Summary

Professional Git usage is about consistent workflows, not just commands. GitHub Flow keeps things simple: branch, PR, merge, deploy. Conventional Commits make history readable. Rebase and squash keep the history clean. A comprehensive `.gitignore` and never committing secrets protect your project. Tags mark releases; a README welcomes collaborators. The habits in this lesson are what separate a messy repository from a professional one.

## Practice

Take an existing project and apply these practices retroactively: create a `.gitignore` if one does not exist, write a README with installation and usage instructions, and clean up any stale branches. For your next feature, follow the full workflow: create a branch with a descriptive name, make small focused commits with Conventional Commit messages, push, open a PR, review it yourself, and merge. Check `git log --oneline` afterwards — the history should read like a clear, chronological story of your work.
