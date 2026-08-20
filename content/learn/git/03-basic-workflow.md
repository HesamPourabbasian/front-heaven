---
title: 'Basic Workflow: Status, Staging, Diff & Logs'
description: 'Master the daily Git development cycle: git status, git add, git commit, inspecting changes with git diff and git show, discarding changes with git restore, and moving files with git mv.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/git/02-repository-basics']
---

# Basic Workflow: Status, Staging, Diff & Logs

The daily life of a software engineer involves a continuous, disciplined cycle: modifying code in the working directory, reviewing differences, staging related changes into the index, and committing atomic snapshots with clear descriptions.

Mastering fundamental inspection commands—`git status`, `git diff`, `git log`, and `git show`—gives you total visibility over your codebase and complete confidence before committing.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The Core Git Command Lifecycle              │
│                                                             │
│  1. Check what changed         ──>  git status / git diff   │
│  2. Stage specific changes     ──>  git add <file>          │
│  3. Review staged snapshot     ──>  git diff --staged       │
│  4. Record permanent commit    ──>  git commit -m "..."     │
│  5. Verify history timeline    ──>  git log --oneline       │
└─────────────────────────────────────────────────────────────┘
```

## 1. Checking Repository State (`git status`)

`git status` is the most frequently used command in Git. It displays:
- The currently checked-out branch.
- Changes staged for the next commit.
- Changes not staged for commit.
- Untracked files (files not yet registered with Git).

```bash
# Standard status output
git status

# Compact short-format status
git status -s
```

In short format (`-s`), the left column shows the status in the staging area, and the right column shows the status in your working tree (`M` = modified, `A` = added, `??` = untracked).

## 2. Staging Changes (`git add`)

`git add` copies file contents from your working directory into the staging area (index):

```bash
# Stage a specific file
git add src/app.ts

# Stage all files in a specific directory
git add src/components/

# Stage all modified and untracked files in the repository
git add .

# Interactive staging: review and stage individual chunks/hunks
git add -p
```

### Pro Tip: Patch Staging (`git add -p`)
`git add -p` opens an interactive prompt allowing you to review each individual code diff "hunk" and decide whether to stage (`y`), skip (`n`), or split (`s`) it. This enables clean, atomic commits even if you edited multiple features in the same file.

## 3. Inspecting Differences (`git diff`)

- `git diff`: Shows differences between your **working directory** and the **staging area** (unstaged edits).
- `git diff --staged` (or `git diff --cached`): Shows differences between the **staging area** and the **last commit** (what will be committed).
- `git diff HEAD`: Shows all changes in both working directory and staging area compared to the last commit.

```bash
# View unstaged changes
git diff

# View staged changes ready to be committed
git diff --staged
```

## 4. Committing Snapshots (`git commit`)

A commit stores a permanent snapshot of the staging area in the repository database:

```bash
# Commit with an inline message
git commit -m "feat(auth): implement jwt token refresh interceptor"

# Open configured text editor for multi-line commit message
git commit
```

## 5. Viewing History (`git log` & `git show`)

```bash
# View recent commit history
git log

# Clean, single-line format
git log --oneline -n 10

# Graphical visual history with branch pointers
git log --oneline --graph --decorate --all

# Inspect metadata and exact patch diff of a specific commit
git show a1b2c3d
```

## 6. Discarding Changes & Moving Files (`git restore`, `git rm`, `git mv`)

```bash
# Discard unstaged working directory changes in a file (revert to last commit)
git restore src/app.ts

# Unstage a staged file (keep working tree edits intact)
git restore --staged src/app.ts

# Rename or move a file (updates Git index automatically)
git mv src/old-name.ts src/new-name.ts

# Remove a file from working directory and stage deletion
git rm src/deprecated-file.ts
```

## Summary & Key Takeaways

- `git status` reveals the state of tracked, untracked, and staged files.
- `git add` stages files; `git add -p` stages individual hunks interactively.
- `git diff` inspects unstaged modifications; `git diff --staged` inspects what will be committed.
- `git commit` records a permanent snapshot of the staging area into `.git/objects`.
- `git restore` safely discards working directory changes or unstages staged files.

## Best Practices & Senior Guidance

1. **Always Run `git diff --staged` Before Committing**: Review your exact staged changes line-by-line before writing your commit message to catch debug logs or unintended changes.
2. **Master `git add -p`**: Practice interactive patch staging to separate unrelated changes into clean, distinct commits.
3. **Never Use `git commit -a` Blindly**: The `-a` flag skips the staging area and commits all modified files, often accidentally including unfinished edits.
