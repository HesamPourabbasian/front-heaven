---
title: 'Git Worktrees: Parallel Branching Environments'
description: 'Master Git Worktrees: managing multiple simultaneous working directories linked to a single .git repository, parallel development, instant hotfix contexts, and automation.'
order: 27
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites: ['/learn/git/05-branches']
---

# Git Worktrees: Parallel Branching Environments

In standard Git workflows, switching branches requires updating your single working directory. If you are midway through compiling a massive project with long build times or uncommitted experiments and need to switch branches to review a PR or fix an emergency hotfix, stashing or stowing your workspace introduces friction.

**Git Worktrees (`git worktree`)** allow you to check out **multiple branches simultaneously into separate directory folders** while sharing a single underlying `.git` repository and object database!

```text
┌─────────────────────────────────────────────────────────────┐
│                 Git Worktree Shared Object Architecture     │
│                                                             │
│                   Central .git Database                     │
│               ┌───────────────────────────┐                 │
│               │ .git/objects, refs, logs  │                 │
│               └───────────────────────────┘                 │
│                      ▲             ▲                        │
│         ┌────────────┘             └────────────┐           │
│         ▼                                       ▼           │
│  Directory 1 (/projects/main)           Directory 2 (/projects/hotfix)
│  Checked out to 'main'                  Checked out to 'hotfix-102'
│  (Running production dev server)        (Editing emergency fix)
└─────────────────────────────────────────────────────────────┘
```

## 1. Creating and Managing Worktrees

```bash
# 1. Add a new worktree folder checked out to a new branch
git worktree add ../front-heaven-hotfix -b hotfix/login-crash

# 2. List all active worktrees and their checked-out branches
git worktree list
```

Output:
```text
/Users/hesam/projects/front-heaven          7f8a9b0 [main]
/Users/hesam/projects/front-heaven-hotfix   3c4d5e1 [hotfix/login-crash]
```

You can now open `../front-heaven-hotfix` in a completely separate VS Code window, run tests, commit, and push without ever interrupting your development server in `front-heaven`!

## 2. Removing Worktrees

```bash
# Remove worktree folder and release branch lock
git worktree remove ../front-heaven-hotfix

# Clean up stale worktree administrative metadata
git worktree prune
```

## Summary & Key Takeaways

- `git worktree` enables multiple working directories linked to a single `.git` repository.
- Eliminates context-switching friction when executing urgent hotfixes or long build workflows.
- All worktrees share the same commit history, stashes, and Git objects without duplicating disk space.

## Best Practices & Senior Guidance

1. **Use Worktrees for Long-Running Reviews**: Check out heavy teammate PR branches into a dedicated `../review-worktree` folder to avoid invalidating local build caches.
2. **Never Check Out the Same Branch Twice**: Git strictly forbids checking out the same branch in two different worktrees simultaneously to prevent race condition corruptions.
