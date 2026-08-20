---
title: 'Branches & Isolated Workflows'
description: 'Master Git branching: what a branch is, git branch, modern git switch, git checkout, creating, renaming, deleting branches, and managing default branch pointers.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/git/04-commits']
---

# Branches & Isolated Workflows

In Git, a **Branch** is not a heavy copy of your project folder. It is simply a lightweight, movable 41-byte pointer to a specific commit in the history graph. Because branches in Git are just tiny text files containing a 40-character commit hash (`.git/refs/heads/main`), creating, switching, and deleting branches is virtually instantaneous (executing in under 10 milliseconds regardless of codebase size).

Branching allows multiple developers to work in parallel on separate features, bug fixes, and experiments without interfering with the stable production code on the `main` branch.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Git Branching Architecture                  │
│                                                             │
│                   (feature/login)                           │
│                         ┌──────┐   ┌──────┐  [HEAD, login]  │
│                         │ C3   │──>│ C4   │                 │
│                        /└──────┘   └──────┘                 │
│                       /                                     │
│  ┌──────┐   ┌──────┐ /                                      │
│  │ C1   │──>│ C2   │──────────────────────> [main]          │
│  └──────┘   └──────┘                                        │
│                                                             │
│  - 'main' points to commit C2                               │
│  - 'feature/login' points to commit C4                      │
│  - HEAD points to the currently active checked-out branch   │
└─────────────────────────────────────────────────────────────┘
```

## 1. Creating and Switching Branches (`git switch` vs `git checkout`)

Historically, the overloaded `git checkout` command was used for both switching branches and discarding file modifications. To eliminate confusion, Git 2.23+ introduced **`git switch`** dedicated exclusively to branch navigation.

```bash
# List all local branches (* indicates currently active branch)
git branch

# Create a new branch without switching to it
git branch feature/user-profile

# Switch to an existing branch
git switch feature/user-profile

# Create AND switch to a new branch in a single command (Recommended)
git switch -c feature/payment-gateway

# Legacy equivalent:
git checkout -b feature/payment-gateway
```

## 2. How `HEAD` Tracks the Active Branch

`HEAD` is a special symbolic reference inside `.git/HEAD` that points to the currently active branch. When you make a new commit:
1. A new commit object is created pointing to the previous commit.
2. The active branch pointer moves forward to the new commit hash.
3. `HEAD` follows the active branch pointer automatically.

## 3. Renaming and Deleting Branches

```bash
# Rename the current active branch
git branch -m feature/new-branch-name

# Rename a specific branch from anywhere
git branch -m old-branch-name new-branch-name

# Safely delete a merged branch (prevents accidental deletion of unmerged work)
git branch -d feature/user-profile

# Force-delete an unmerged branch (DANGER: Discards unmerged branch commits)
git branch -D feature/experimental-prototype
```

## 4. Branch Naming Conventions in Enterprise Teams

Professional teams enforce standardized branch naming prefixes to keep repositories organized:
- `feature/<ticket-id>-<short-description>`: e.g. `feature/FH-102-cart-drawer`
- `fix/<ticket-id>-<short-description>`: e.g. `fix/FH-405-login-redirect`
- `refactor/<short-description>`: e.g. `refactor/state-cleanup`
- `docs/<short-description>`: e.g. `docs/api-guide`
- `hotfix/<short-description>`: Urgent production fixes applied directly to `main`.

## Summary & Key Takeaways

- A Git branch is a lightweight pointer to a commit hash in the history graph.
- `git switch -c <name>` creates and switches to a new branch in a single step.
- `HEAD` tracks which branch is currently checked out in your working tree.
- Use `git branch -d` for safe deletion and `git branch -D` for force deletion.
- Standardized branch naming (`feature/`, `fix/`, `refactor/`) maintains order in multi-developer teams.

## Best Practices & Senior Guidance

1. **Keep Branches Short-Lived**: Feature branches should live for 1–3 days at most before merging into `main` to prevent massive merge conflicts.
2. **Never Commit Directly to `main`**: In team environments, protect the `main` branch with GitHub branch protection rules and require Pull Requests.
3. **Delete Merged Branches Promptly**: Delete local and remote feature branches once merged to prevent repository clutter.
