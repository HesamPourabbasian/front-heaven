---
title: 'Stashing & Working Directory Management'
description: 'Master Git stashing: git stash, stash pop, stash apply, stash list, named stashes, stashing untracked files, and managing dirty working directories.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites: ['/learn/git/03-basic-workflow']
---

# Stashing & Working Directory Management

During daily software development, interruptions happen frequently: while midway through implementing a complex feature with half-written code in your working directory, a critical production bug emerges that requires you to immediately switch branches and deploy a hotfix.

You cannot switch branches with a dirty working directory if the target branch conflicts with your unstaged edits. **`git stash`** solves this problem by taking your uncommitted changes (both staged and unstaged), storing them on a local temporary stack, and reverting your working directory to a clean `HEAD` state.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Git Stashing Stack Lifecycle                │
│                                                             │
│   Dirty Working Directory (WIP code)                        │
│                 │                                           │
│                 ▼  [git stash save "WIP cart layout"]       │
│   Clean Working Directory (Ready to switch branches)        │
│                 │                                           │
│                 │ (Execute hotfix on main, deploy, etc.)    │
│                 │                                           │
│                 ▼  [git switch feature && git stash pop]    │
│   Restored Working Directory (Continue work seamlessly)     │
└─────────────────────────────────────────────────────────────┘
```

## 1. Stashing Changes (`git stash`)

```bash
# Basic stash (saves tracked modified files)
git stash

# Stash with a descriptive message (Strongly Recommended)
git stash push -m "WIP: cart checkout discount calculation"

# Stash including untracked (newly created) files (-u)
git stash -u -m "WIP: new auth components and styles"

# Stash including untracked AND ignored files (-a / --all)
git stash -a
```

## 2. Inspecting Stashed Work

```bash
# View the list of saved stashes on the stack
git stash list
```

Output:
```text
stash@{0}: On feature/cart: WIP: cart checkout discount calculation
stash@{1}: On main: WIP: header dark mode toggle
```

```bash
# Inspect the diff contents of a specific stash without applying it
git stash show -p stash@{0}
```

## 3. Re-Applying Stashed Changes

- **`git stash pop`**: Applies the changes from the top of the stack (`stash@{0}`) and removes the stash entry from the stack.
- **`git stash apply`**: Applies the changes from the stash, but preserves the stash entry on the stack for future use.

```bash
# Pop the latest stash
git stash pop

# Apply a specific stash from the list without deleting it
git stash apply stash@{1}

# Delete a specific stash entry
git stash drop stash@{0}

# Delete all stashed entries on the stack
git stash clear
```

## 4. Creating a Branch from a Stash

If your stashed changes conflict heavily with recent changes on your branch, you can create a new branch directly from the stash:

```bash
# Creates a new branch from the commit where the stash was created and applies it
git stash branch feature/cart-recovery stash@{0}
```

## Summary & Key Takeaways

- `git stash` saves uncommitted working directory edits to a local stack and restores a clean `HEAD`.
- Use `git stash -u` to include newly created untracked files.
- `git stash pop` restores and deletes the stash; `git stash apply` restores while preserving the stash.
- Named stashes (`git stash push -m "description"`) prevent confusion when multiple stashes exist.

## Best Practices & Senior Guidance

1. **Always Give Stashes Descriptive Names**: Use `git stash push -m "..."` instead of plain `git stash`. Unnamed stashes in a long stack become impossible to identify.
2. **Do Not Treat Stash as Long-Term Storage**: Stashes are temporary local buffers. If work is meant to be kept for more than a day, commit it to an explicit feature or WIP branch instead.
