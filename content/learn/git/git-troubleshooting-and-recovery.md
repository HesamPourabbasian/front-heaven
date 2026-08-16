---
title: 'Git troubleshooting and recovery'
description: 'Everyone makes mistakes with Git — the key is knowing how to undo them. Learn to recover lost work, fix errors and escape common traps.'
order: 8
difficulty: 'intermediate'
category: 'Best Practices'
estimatedMinutes: 30
prerequisites:
  - learn/git/git-workflows-and-best-practices
---

## Introduction

Git is powerful, and with power comes the potential for confusing situations: commits that seem lost, files that disappeared, merges that went wrong, and error messages that make no sense. The good news is that Git is extremely resilient — almost nothing is truly lost. The history in the `.git` folder is a complete, append-only record, and with the right commands, you can recover from nearly any mistake.

This lesson teaches you how to diagnose problems, undo changes at every stage, recover lost work, and escape the most common Git traps.

## Git is hard to break

The most important thing to know: **Git rarely loses data**. The `.git` folder contains every commit ever made. Even when you delete a branch, reset a commit, or force-push, the objects usually remain in the repository until Git's garbage collector removes them (typically after 30 days). This means that even dramatic mistakes — deleting the wrong branch, resetting to the wrong commit, amending a committed message — are almost always recoverable.

The caveat: recovering data requires understanding Git's internals at a basic level. The commands in this lesson range from simple to advanced, but they all follow the same principle: Git keeps everything, and you can almost always find it.

## Undoing changes in the working tree

If you have edited a file and want to discard the changes:

```bash
git checkout -- file.html
```

Or with the modern syntax:

```bash
git restore file.html
```

This replaces the file with the version from the last commit (or the staging area if it is staged). **This is irreversible** — the changes are gone. Use it only when you are certain you want to throw away the edits.

To see what you would discard before discarding:

```bash
git diff file.html
```

Always check the diff before restoring — it shows exactly what would be lost.

## Unstaging changes

If you have staged a file with `git add` but want to unstage it:

```bash
git reset HEAD file.html
```

Or with the modern syntax:

```bash
git restore --staged file.html
```

This moves the file out of the staging area back into the working tree. The file itself is not modified — only its staging status changes. This is safe and reversible; you can re-stage it anytime with `git add`.

## Amending the last commit

If you committed and realised you forgot a file, or the message has a typo:

```bash
# Stage the forgotten file
git add forgotten-file.html

# Amend the last commit
git commit --amend -m "Corrected commit message"
```

This replaces the last commit with a new one containing the additional file and the new message. The old commit is overwritten — but it still exists in Git's object store until garbage collection.

**Important:** Only amend commits that have not been pushed. Amending a pushed commit rewrites history, which causes problems for collaborators. If you need to fix a pushed commit, create a new commit instead.

## Reverting a commit

**Revert** creates a *new* commit that undoes the changes from a previous commit. This is the safe way to undo a pushed commit:

```bash
git revert abc1234
```

Git opens your editor for a commit message (defaulting to "Revert 'original message'"). Save and close. The new commit negates the changes from `abc1234` without removing it from history.

Revert is safe because it does not rewrite history — it adds to it. Collaborators who have pulled the original commit will see the revert when they pull again. Use revert for commits that are already on `main` or shared with others.

## Resetting to a previous commit

**Reset** moves the current branch pointer to a different commit. It has three modes:

### Soft reset

```bash
git reset --soft HEAD~1
```

Moves the branch pointer back one commit, but keeps the changes staged. Useful when you committed too early and want to re-stage or amend.

### Mixed reset (default)

```bash
git reset HEAD~1
```

Moves the branch pointer back and unstages the changes, but keeps them in the working tree. This is the default and most common mode — you can re-arrange the changes and commit again.

### Hard reset

```bash
git reset --hard HEAD~1
```

Moves the branch pointer back and **discards all changes** in the staging area and working tree. This is the dangerous one — the changes are gone (though recoverable from Git's object store for a while).

Use hard reset when you are certain you want to throw away the last commit and its changes. For shared commits, prefer `revert`.

## Recovering a deleted branch

If you deleted a branch with `git branch -D` and need it back:

```bash
git reflog
```

The **reflog** is Git's journal of every movement of `HEAD` and branch pointers. It shows something like:

```
a1b2c3d HEAD@{0}: checkout: moving from feature-deleted to main
b7c8d9e HEAD@{1}: commit: Add feature
c3d4e5f HEAD@{2}: checkout: moving from main to feature-deleted
```

Find the last commit on the deleted branch (it will be the one before the checkout away from it), then recreate the branch:

```bash
git branch feature-deleted b7c8d9e
```

The branch is restored with all its commits. The reflog is your safety net — it records everything, even things that "disappeared."

## Recovering lost commits

If you reset hard and want the commits back, the reflog works here too:

```bash
git reflog
# find the commit hash before the reset
git cherry-pick abc1234
# or
git branch recovered abc1234
```

Git's object store retains unreachable commits for about 30 days. As long as you can find the hash (via reflog or other means), you can recover the commit.

## Resolving merge conflicts

Merge conflicts happen when Git cannot automatically combine changes. The process:

1. Git marks the conflicts in the file with markers (`<<<<<<<`, `=======`, `>>>>>>>`)
2. You edit the file to resolve each conflict (choose one side, combine both, or write something new)
3. Remove the conflict markers
4. Stage the resolved file: `git add file.html`
5. Complete the merge: `git commit`

To abort a merge entirely and go back to the state before:

```bash
git merge --abort
```

This is safe — it restores your working tree to the pre-merge state.

## Common Git error messages

### "fatal: not a git repository"

You are not inside a Git repository (or not inside the `.git` folder's parent directory). Run `git status` to check, and `cd` to the correct directory.

### "error: failed to push some refs"

Your local branch has diverged from the remote. Pull first (`git pull`) to integrate remote changes, then push. Or, if you are certain your local history should override, use `git push --force-with-lease`.

### "CONFLICT (content): Merge conflict"

As described above — resolve the conflict markers in the affected files, stage them, and commit.

### "fatal: refusing to merge unrelated histories"

This happens when you try to merge two repositories that do not share a common ancestor. Use `--allow-unrelated-histories` if you are intentionally combining repositories.

## Stashing changes

If you need to switch branches but are not ready to commit your current changes:

```bash
git stash
```

This saves your working tree and staging area to a temporary area and restores a clean working tree. Switch branches, do your work, then return and apply the stash:

```bash
git switch main
# ... do emergency work ...
git switch feature/my-feature
git stash pop
```

`stash pop` applies the stashed changes and removes them from the stash. Use `stash apply` to apply without removing (keeping the stash for later).

## Git bisect

**Bisect** is a binary search through your commit history to find which commit introduced a bug:

```bash
git bisect start
git bisect bad          # current commit is broken
git bisect good abc1234 # this commit was working
```

Git checks out a commit in the middle. You test it, then tell Git whether it is good or bad:

```bash
git bisect good  # if this commit works
git bisect bad   # if this commit is broken
```

Git narrows down until it finds the exact commit that introduced the bug. This is invaluable for large projects with hundreds of commits.

## Common mistakes

Using `git reset --hard` without checking what you are losing — always verify with `git status` and `git diff` first. Force-pushing to shared branches — this overwrites collaborators' work. Ignoring the reflog — it is your safety net for recovering "lost" commits. Resolving merge conflicts incorrectly — always read both sides carefully.

Another mistake: amending a pushed commit, which breaks the history for anyone who has pulled the original. And stashing without popping — stashes accumulate and become confusing; apply or drop them regularly.

## Best practices

- Run `git status` before every operation — know your current state.
- Use `git diff` and `git log` to verify before destructive commands.
- Prefer `revert` over `reset` for shared commits — do not rewrite history.
- Use `reflog` to recover from almost any mistake.
- Stash only when necessary — commit is usually better.
- Use `--force-with-lease` instead of `--force` for safer force-pushes.
- Write tests and use `git bisect` to find regressions efficiently.
- Back up your `.git` folder for critical projects — it contains everything.
- Learn to read Git error messages — they usually tell you exactly what to do.

## Summary

Git is resilient — almost nothing is truly lost. Discard working tree changes with `restore`. Unstage with `restore --staged`. Amend the last commit with `--amend`. Revert pushed commits safely with `revert`. Reset to undo commits locally (soft, mixed, hard). Recover deleted branches and lost commits with `reflog`. Resolve merge conflicts by editing the marked files and committing. Stash to temporarily shelve work. Bisect to find bugs. The reflog is your ultimate safety net — it records every reference movement and makes recovery possible.

## Practice

Create a repository with five commits. Deliberately make mistakes and recover from them: reset hard to an earlier commit, then recover using `reflog`. Amend a commit to add a forgotten file. Create a branch, make a commit, delete the branch, and recover it from the reflog. Stage a file, unstage it, and verify the file is unchanged. Start a merge, create a conflict, abort it with `--abort`, and try again. Each exercise builds the muscle memory you need when a real mistake happens — because it will, and now you will know how to fix it.
