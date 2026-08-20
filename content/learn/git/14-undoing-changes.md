---
title: 'Undoing Changes: Restore, Reset, Revert & Reflog'
description: 'Master undoing changes in Git: git restore, git reset (soft, mixed, hard), git revert, detached HEAD state, and recovering 'lost' commits using git reflog.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/git/03-basic-workflow']
---

# Undoing Changes: Restore, Reset, Revert & Reflog

One of Git's greatest superpowers is that **almost nothing is truly lost**. Whether you accidentally modified a file, committed to the wrong branch, executed a bad merge, or even deleted a branch containing days of work, Git's internal safety logs (**`git reflog`**) and history undo tools allow you to recover gracefully.

Understanding the precise differences between **`git restore`**, **`git reset`**, and **`git revert`** ensures you can undo mistakes safely without damaging team history.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Undoing Tools Matrix                        │
├─────────────┬───────────────────────────┬───────────────────┤
│ Command     │ Scope & Mechanism         │ Safe for Public?  │
├─────────────┼───────────────────────────┼───────────────────┤
│ git restore │ Discards uncommitted      │ Yes (Local only)  │
│             │ working directory edits   │                   │
├─────────────┼───────────────────────────┼───────────────────┤
│ git reset   │ Moves branch pointer back;│ NO (Rewrites local│
│             │ modifies index/worktree   │     history)      │
├─────────────┼───────────────────────────┼───────────────────┤
│ git revert  │ Creates a NEW commit that │ YES (Safe for all │
│             │ reverses a past commit    │     shared repos) │
├─────────────┼───────────────────────────┼───────────────────┤
│ git reflog  │ Audit journal of all HEAD │ Yes (Emergency    │
│             │ pointer movements         │     recovery)     │
└─────────────┴───────────────────────────┴───────────────────┘
```

## 1. Discarding Uncommitted Work (`git restore`)

```bash
# Discard uncommitted working directory edits in a file
git restore src/app.ts

# Unstage a staged file (keep working tree edits intact)
git restore --staged src/app.ts

# Restore working tree from a specific commit in history
git restore --source=HEAD~2 src/app.ts
```

## 2. Moving Branch Pointers (`git reset`)

`git reset` moves the current branch pointer backward in history. It offers three modes:

- **`--soft`**: Moves the branch pointer back, but leaves the Staging Area and Working Directory untouched. All changes from the undone commits remain staged! Ideal for combining the last 3 commits into one.
- **`--mixed` (Default)**: Moves the branch pointer back and clears the staging area, but preserves all file edits in your Working Directory.
- **`--hard`**: Moves the branch pointer back and **wipes out all staged and working directory changes**. (Destructive).

```bash
# Soft reset: Undo last commit, keep changes staged
git reset --soft HEAD~1

# Mixed reset: Undo last commit, keep changes unstaged in files
git reset HEAD~1

# Hard reset: Completely obliterate the last commit and all file changes
git reset --hard HEAD~1
```

## 3. Public Undo with `git revert`

When a buggy commit has already been pushed to a shared remote repository (`main`), using `git reset` will break your teammates' repositories. Instead, use **`git revert`**:

```bash
# Create a new commit that inverts the exact diff of commit 7f8a9b0
git revert 7f8a9b0 -m "revert: rollback broken payment gateway integration"
```

`git revert` does not rewrite history; it records a new commit that reverses the target changes, making it 100% safe for shared public branches.

## 4. Emergency Recovery with `git reflog`

The **Reference Log (`reflog`)** is an immutable local journal that records every time `HEAD` changes position (via commit, switch, checkout, rebase, reset, or pull).

Even if you run `git reset --hard` or delete a branch, the commits still exist in `.git/objects` and are listed in the reflog for at least 30 to 90 days.

```bash
# Inspect the reflog history
git reflog
```

Output:
```text
7f8a9b0 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
1d2e3f4 HEAD@{1}: commit: feat(auth): add pkce verifier  <-- "LOST" COMMIT!
3c4d5e1 HEAD@{2}: checkout: moving from feature to main
```

To recover your "lost" commit:

```bash
# Restore branch pointer to the state before the reset
git reset --hard HEAD@{1}
# or:
git switch -c recovered-branch 1d2e3f4
```

## Summary & Key Takeaways

- Use `git restore` for uncommitted files.
- `git reset --soft` undoes commits while keeping changes staged.
- `git revert` safely rolls back public pushed commits without rewriting history.
- `git reflog` is your safety net to recover lost commits, deleted branches, and botched rebases.

## Best Practices & Senior Guidance

1. **Always Use `git revert` for Shared Branches**: Never use `git reset` on commits that other team members have pulled.
2. **Check `git status` Before `git reset --hard`**: A hard reset destroys uncommitted working directory files that have never been committed; these cannot be recovered from the reflog!
