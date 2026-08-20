---
title: 'Commits, Conventional Commits & Atomic History'
description: 'Master Git commits: commit anatomy, SHA-1 / SHA-256 hashes, atomic commits, writing professional commit messages, Conventional Commits standard, and commit metadata.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/git/03-basic-workflow']
---

# Commits, Conventional Commits & Atomic History

A **Commit** is the fundamental unit of history in Git. It is an immutable cryptographic snapshot of your entire project repository at a specific point in time. Each commit stores a pointer to a root tree object (representing the directory structure), author metadata (name, email, timestamp), committer metadata, one or more parent commit hashes, and a human-readable commit message.

Writing high-quality, atomic commits structured according to the **Conventional Commits** specification is one of the most visible indicators of software engineering professionalism.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Anatomy of a Git Commit Object              │
│                                                             │
│  Commit Hash: 7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Tree: d8a9f1b... (Pointer to file snapshot tree)      │  │
│  │ Parent: 3c4d5e... (Pointer to preceding commit)       │  │
│  │ Author: Hesam Pourabbasian <hesam@front-heaven.com>   │  │
│  │ Date:   Thu Aug 20 15:45:00 2026 +0330                │  │
│  │                                                       │  │
│  │ Commit Message:                                       │  │
│  │ feat(auth): add pkce code challenge generator         │  │
│  │                                                       │  │
│  │ Implements crypto SHA-256 code verifier calculation   │  │
│  │ to support secure OAuth 2.0 PKCE authentication flow. │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 1. What Makes an "Atomic Commit"?

An **Atomic Commit** encapsulates exactly one single, complete logical change. It should be:
- **Focused**: It addresses one bug fix, one feature addition, or one refactoring task—never a blend of all three.
- **Complete**: The codebase compiles, builds, and passes all unit tests at that exact commit.
- **Reversible**: If the change causes a regression in production, the entire commit can be safely reverted with `git revert <hash>` without breaking unrelated features.

### Bad Commit (Non-Atomic):
`"Fixed login bug, updated CSS header styles, upgraded Angular to v19, and refactored table"`

### Good Commits (Atomic Sequence):
1. `fix(auth): prevent empty username submission in login form`
2. `style(header): align navigation items to center on mobile`
3. `chore(deps): upgrade @angular/core to v19.0.0`
4. `refactor(table): extract pagination logic into custom hook`

## 2. The Conventional Commits Specification

The **Conventional Commits** standard is a lightweight convention on top of commit messages used across major open-source repositories and enterprise engineering teams. It provides structured metadata that automated tools use to generate changelogs (`CHANGELOG.md`) and bump semantic versions (`semver`).

### Commit Message Structure:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Common Commit Types:
- **`feat`**: A new feature for the user or consumer.
- **`fix`**: A bug fix.
- **`docs`**: Documentation-only changes.
- **`style`**: Changes that do not affect code logic (formatting, whitespace, semi-colons).
- **`refactor`**: Code changes that neither fix a bug nor add a feature.
- **`perf`**: A code change that improves performance.
- **`test`**: Adding missing tests or correcting existing tests.
- **`build`**: Changes affecting build systems or external dependencies (npm, Vite, esbuild).
- **`ci`**: Changes to CI/CD configuration files and scripts (GitHub Actions).
- **`chore`**: Maintenance tasks that do not modify `src` or test files.

### Real-World Conventional Commit Example:

```text
feat(cart): implement multi-currency price conversion

Adds real-time currency conversion using exchange rates fetched from
the central rates API. Automatically recalculates taxes and subtotal
when user selects a different country currency.

Closes #142
BREAKING CHANGE: CartItem interface now requires currencyCode property.
```

## 3. Commit Hashes (SHA-1 & SHA-256)

Git generates a 40-character hexadecimal cryptographic hash (SHA-1 or SHA-256) computed from the commit contents, tree, parent hash, author, and timestamp. Because the hash is content-addressed, it is mathematically impossible to alter any file in Git history without changing every subsequent commit hash.

In terminal commands, you rarely need to type all 40 characters; the first 7 characters (e.g. `d0e1819`) are almost always uniquely sufficient.

## Summary & Key Takeaways

- A Git commit is an immutable cryptographic snapshot of the project history.
- Atomic commits isolate a single logical change, ensuring the project builds and can be safely reverted.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`) provide machine-readable history for automated release notes and semantic versioning.
- Commit hashes (SHA) guarantee data integrity across distributed repository copies.

## Best Practices & Senior Guidance

1. **Write in the Imperative Mood**: Write `"feat: add search filter"`, not `"added search filter"` or `"adds search filter"`. Think: *"If applied, this commit will..."*
2. **Keep the Header Under 72 Characters**: Concise headers render cleanly in GitHub, GitLab, and terminal logs without truncation.
3. **Use the Body for the "Why", Not the "What"**: The diff shows *what* changed; use the commit message body to explain *why* the design decision was made.
