---
title: 'Advanced Branch Management & Fork Sync'
description: 'Master advanced branch management: complex multi-branch rebasing, remote tracking synchronization, branch pruning (git fetch -p), multiple remotes (upstream/origin), and fork synchronization.'
order: 25
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites: ['/learn/git/06-remote-repositories']
---

# Advanced Branch Management & Fork Sync

In enterprise open-source workflows and large multi-team organizations, branch management involves coordinating multiple remote repositories simultaneously (**`origin`** and **`upstream`**), managing long-running release branches, and pruning dead tracking references.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Open-Source Fork Synchronization Model      │
│                                                             │
│  Upstream Canonical Repo (github.com/angular/angular)       │
│  └── main branch                                            │
│            │                                                │
│            ▼  [git fetch upstream]                          │
│  Local Developer Machine                                    │
│  ├── remotes/upstream/main (Read-only reference)            │
│  ├── local main (Merged with upstream/main)                 │
│  └── local feature-branch (Rebased on local main)           │
│            │                                                │
│            ▼  [git push origin feature-branch]              │
│  Personal Fork Remote (github.com/hesam/angular)            │
│  └── feature-branch ──> [Open Pull Request to Upstream]     │
└─────────────────────────────────────────────────────────────┘
```

## 1. Multi-Remote Fork Synchronization

When contributing to a project where you are not a direct collaborator:

```bash
# 1. Clone your personal fork
git clone git@github.com:HesamPourabbasian/angular.git && cd angular

# 2. Add the original canonical repository as 'upstream' remote
git remote add upstream git@github.com:angular/angular.git

# 3. Fetch latest upstream commits
git fetch upstream

# 4. Synchronize local main with upstream main
git switch main
git merge --ff-only upstream/main

# 5. Push synchronized main to your personal fork
git push origin main
```

## 2. Advanced Multi-Branch Rebase (`git rebase --onto`)

When you branched `feature-B` off `feature-A`, but `feature-A` is refactored or merged into `main`, you can rebase `feature-B` directly onto `main` while skipping `feature-A` commits:

```bash
# Rebase feature-B onto main, starting after feature-A
git rebase --onto main feature-A feature-B
```

## 3. Pruning Stale Remote Tracking References

When branches are deleted on GitHub after PR merges, your local repository retains stale `origin/<branch>` pointers. Prune them with:

```bash
# Prune deleted remote branches during fetch
git fetch --prune origin

# Automatically configure Git to prune on every fetch globally
git config --global fetch.prune true
```

## Summary & Key Takeaways

- Configure `upstream` remotes to keep personal forks synchronized with canonical open-source repositories.
- `git rebase --onto` relocates sub-branches across different base branches cleanly.
- `git fetch --prune` cleans up stale remote-tracking branch references.

## Best Practices & Senior Guidance

1. **Enable Global Fetch Pruning**: Set `git config --global fetch.prune true` to keep branch lists clean automatically.
2. **Never Commit Directly to Fork Main**: Keep your fork's `main` branch synchronized 1:1 with `upstream/main` and do all development on dedicated feature branches.
