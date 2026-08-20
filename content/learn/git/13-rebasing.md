---
title: 'Rebasing & Interactive History Rewriting'
description: 'Master Git rebasing: git rebase, rebase vs merge, interactive rebase (git rebase -i), squashing, fixup, reordering, dropping commits, and resolving rebase conflicts.'
order: 13
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/git/12-merging']
---

# Rebasing & Interactive History Rewriting

In Git, **Rebasing** is the process of moving or reapplying a sequence of commits onto a new base commit. While merging joins two divergent histories by creating a new merge commit, rebasing rewrites history by taking each commit on your feature branch and replaying it on top of the target branch, producing a perfectly linear, clean commit history.

Mastering **Interactive Rebasing (`git rebase -i`)** gives you complete editorial power over your local commit history before publishing your work to shared remote repositories.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Merge vs Rebase Comparison                  │
├──────────────────────────────┬──────────────────────────────┤
│ Merging (Branch Join)        │ Rebasing (Linear Replay)     │
├──────────────────────────────┼──────────────────────────────┤
│ C1 ── C2 ── C4 [main]        │ C1 ── C2 ── C4 [main]        │
│   \        / (Merge commit)  │              \               │
│    C3 ────┘                  │               C3' [feature]  │
│                              │                              │
│ Non-linear, preserves branch │ Perfectly linear timeline.   │
│ history graph and commits.   │ Replays C3 as new commit C3'.│
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Rebasing a Feature Branch onto `main`

When new commits have landed on `main` while you were building your feature branch:

```bash
# On your feature branch:
git switch feature/auth-flow

# Replay feature commits on top of latest main
git rebase main
```

During a rebase, Git temporarily sets your branch back to the common ancestor, applies all new commits from `main`, and then replays your feature commits one by one on top.

## 2. Interactive Rebasing (`git rebase -i`)

Interactive rebasing allows you to modify, reorder, squash, or delete past commits before opening a Pull Request:

```bash
# Interactively rebase the last 4 commits on the current branch
git rebase -i HEAD~4
```

Git opens your configured editor displaying an interactive todo list:

```text
pick 7f8a9b0 feat(cart): add cart state signal
pick 3c4d5e1 fix typo in cart subtotal
pick 8a9b0c2 style(cart): format price column
pick 1d2e3f4 test(cart): add unit test suite

# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = meld into previous commit and combine messages
# f, fixup <commit> = like "squash", but discard this commit's log message
# d, drop <commit> = remove commit
```

### Squashing Dirty WIP Commits:

Change the action commands to squash messy intermediate commits:

```text
pick 7f8a9b0 feat(cart): add cart state signal
fixup 3c4d5e1 fix typo in cart subtotal
fixup 8a9b0c2 style(cart): format price column
pick 1d2e3f4 test(cart): add unit test suite
```

When saved, Git collapses the four commits into two clean, atomic commits!

## 3. Resolving Rebase Conflicts

If a conflict occurs while replaying a commit:
1. Git pauses the rebase and identifies the conflicting commit.
2. Edit the conflicting files and remove conflict markers.
3. Stage the resolved files: `git add <file>`.
4. **DO NOT COMMIT**; continue the rebase:
   ```bash
   git rebase --continue
   ```
5. If something goes wrong, abort and return to the pre-rebase state:
   ```bash
   git rebase --abort
   ```

## 4. The Golden Rule of Rebasing

> [!CAUTION]
> **The Golden Rule of Rebasing**: NEVER rebase commits that have been pushed to a public or shared remote branch (such as `main` or a shared staging branch).

Rebasing creates brand-new commit hashes. If you rebase public history, other developers whose work is based on the original commit hashes will have their local branches broken. **Only rebase local, private feature branches.**

## Summary & Key Takeaways

- Rebasing replays commits on top of another base commit to maintain a clean, linear history.
- `git rebase -i HEAD~N` provides interactive control: `pick`, `squash`, `fixup`, `reword`, `drop`.
- `fixup` combines commits while discarding redundant intermediate messages.
- Use `git rebase --continue` after staging conflict fixes, or `git rebase --abort` to cancel.

## Best Practices & Senior Guidance

1. **Clean History Before Opening a PR**: Use `git rebase -i` to squash "wip", "fixed typo", and "oops" commits into clean, atomic Conventional Commits before requesting code review.
2. **Use `git pull --rebase`**: Prevent unnecessary merge commits when pulling remote changes.
