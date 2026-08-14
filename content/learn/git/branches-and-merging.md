---
title: Branches and merging
description: Work on features, fixes and experiments in isolation — then combine them cleanly. Branches are Git's most powerful feature.
order: 4
difficulty: beginner
category: Fundamentals
estimatedMinutes: 30
prerequisites:
  - learn/git/init-add-and-commit
---

## Introduction

Without branches, every change happens on one timeline. You finish a feature and commit it directly to the main codebase. If the feature breaks something, you have to manually undo it. If you want to try two different approaches, you cannot — one overwrites the other. If you are mid-way through a feature and need to fix an urgent bug, you either commit unfinished work or stash it somewhere and hope you remember what you were doing.

**Branches** solve all of these problems. A branch is an independent line of development. When you create a branch, Git creates a new pointer that starts from the current commit. You work on the branch, make commits, and the main branch stays untouched. When the work is ready, you merge the branch back in. This is how every professional team works: the `main` branch stays stable, and all new work happens on branches until it is reviewed and ready.

## What a branch actually is

A branch in Git is remarkably simple: it is a lightweight, movable pointer to a commit. When you create a branch, Git creates a new file containing the 40-character hash of the commit it points to. That is it — no copying files, no new directories, no overhead. This is why branching in Git is nearly instantaneous, unlike older systems where branching meant duplicating the entire project directory.

The current branch is called `HEAD`. When you make a commit, `HEAD` (and the branch it points to) moves forward to the new commit. When you switch branches, `HEAD` moves to a different branch pointer. This is how Git knows which line of history you are on.

## Creating and switching branches

Create a new branch with:

```bash
git branch feature-contact-form
```

This creates a new branch called `feature-contact-form` at the current commit, but does not switch to it. To create and switch in one command:

```bash
git checkout -b feature-contact-form
```

Or using the modern Git syntax:

```bash
git switch -c feature-contact-form
```

Both do the same thing: create the branch and move `HEAD` to it. Now when you commit, the new commit goes to `feature-contact-form`, not `main`. The main branch remains at its last commit.

Check which branch you are on with:

```bash
git branch
```

The active branch is marked with an asterisk:

```
* feature-contact-form
  main
```

## Working on a branch

Make changes and commit as usual — Git records them on the current branch:

```bash
# On feature-contact-form
# ... edit files ...
git add .
git commit -m "Add contact form HTML and validation"
```

The commit is added to `feature-contact-form`. `main` has not moved — it still points to the commit where you branched off. You now have two independent lines of development.

You can check this with `git log` and the `--oneline --graph` flags:

```bash
git log --oneline --graph --all
```

The output shows both branches, visualised as parallel lines:

```
* a1b2c3d (feature-contact-form) Add contact form HTML and validation
| * b7c8d9e (main) Add initial project structure
|/
* e0f1a2b Initial commit
```

This graph is how you visualise your project's history — branches diverging and converging over time.

## Switching branches

Switch back to main with:

```bash
git switch main
```

Your working tree changes: files added or modified on `feature-contact-form` disappear, and the files from `main` reappear. This is Git swapping the working tree to match the target branch's latest commit. It is fast because Git only changes the files that differ between the two branches.

If you have uncommitted changes, Git will refuse to switch — you must commit or stash them first. This protects you from accidentally mixing work from different branches.

## Merging

When your feature is complete, you bring it back to `main` with a **merge**. Switch to the branch you want to merge *into*:

```bash
git switch main
git merge feature-contact-form
```

Git combines the two branches. If `main` has not changed since you branched, Git performs a **fast-forward merge**: it simply moves the `main` pointer forward to the `feature-contact-form` commit. No new commit is created — the history stays linear.

```
* a1b2c3d (main, feature-contact-form) Add contact form HTML and validation
| * b7c8d9e Add initial project structure
|/
* e0f1a2b Initial commit
```

If `main` *has* changed since you branched, Git creates a **merge commit** — a new commit with two parents that combines both lines of history:

```
*   f3g4h5i (main) Merge branch 'feature-contact-form'
|\
| * a1b2c3d (feature-contact-form) Add contact form HTML and validation
* | c6d7e8f Fix navigation alignment
|/
* b7c8d9e Add initial project structure
```

This merge commit represents the point where the two branches came together. It preserves the complete history of both lines.

## Merge conflicts

Sometimes Git cannot automatically combine changes — for example, when two branches modify the same line of the same file. This is a **merge conflict**. Git marks the conflicting files with conflict markers:

```
<h1>Contact Us</h1>
<<<<<<< HEAD
<p>Reach out to our team.</p>
=======
<p>Get in touch with us.</p>
>>>>>>> feature-contact-form
```

The top section (`<<<<<<< HEAD`) is what `main` has. The bottom section (`>>>>>>> feature-contact-form`) is what the branch has. You must manually choose which version to keep (or combine them), then remove the conflict markers and commit:

```bash
# After resolving conflicts in the files
git add .
git commit -m "Merge feature-contact-form, resolving contact copy conflict"
```

Conflicts are normal and not errors — they are Git asking you to make a decision that it cannot make automatically. The more frequently you merge (keeping branches short-lived), the fewer and smaller conflicts you will have.

## Deleting branches

After merging, the branch is no longer needed:

```bash
git branch -d feature-contact-form
```

The `-d` flag deletes only if the branch has been fully merged. If you want to delete a branch that has not been merged (abandoning the work), use `-D` (capital D):

```bash
git branch -D abandoned-experiment
```

Cleaning up merged branches keeps your repository tidy. The commits are not lost — they are preserved in the `main` branch's history.

## Branch naming conventions

Teams use naming conventions to communicate what a branch contains:

- `feature/` — new functionality (`feature/user-auth`)
- `fix/` — bug fixes (`fix/mobile-nav-overflow`)
- `hotfix/` — urgent production fixes (`hotfix/security-patch`)
- `chore/` — maintenance tasks (`chore/update-dependencies`)

Using slashes creates a visual hierarchy in branch lists. The convention is not enforced by Git — it is a social agreement that makes team workflows clearer.

## Common mistakes

Committing directly to `main` instead of creating a branch — this bypasses the entire review and isolation workflow. Leaving branches unmerged and undeleted — they accumulate and create confusion about what is active. Creating branches that are too large — a branch with fifty commits and ten files changed is hard to review and merge; keep branches focused and short-lived.

Another mistake is merging `main` into your feature branch repeatedly instead of rebasing — this creates unnecessary merge commits and a noisy history. And resolving conflicts incorrectly — blindly accepting one side without understanding what changed — introduces bugs. Always read the conflict markers carefully.

## Best practices

- Create a branch for every feature, fix, or experiment — no matter how small.
- Keep branches short-lived: merge or delete within a few days.
- Name branches descriptively: `feature/payment-form` not `my-branch`.
- Merge frequently to avoid large, conflict-heavy merges.
- Use `git log --oneline --graph --all` regularly to visualise your branch structure.
- Delete merged branches to keep the repository clean.
- Never commit directly to `main` in a team project — always use branches.
- Resolve merge conflicts carefully — understand both sides before choosing.

## Summary

Branches are lightweight, independent lines of development created from any commit. `git switch -c` creates and enters a branch; commits on it do not affect other branches. Merging combines branches: fast-forward merges move the pointer forward when `main` has not changed; merge commits combine diverged histories. Conflicts occur when changes overlap and must be resolved manually. Branches are deleted after merging. The branching model — isolated work merged into a stable `main` — is the backbone of professional Git workflows.

## Practice

Start on `main` and create a branch called `feature-about-page`. On that branch, create an `about.html` file with a heading and a paragraph. Commit it. Switch back to `main` — notice the file disappears. Create another branch `feature-contact-page` from `main`, add a `contact.html` file, and commit. Switch back to `main` and merge `feature-about-page`. Then merge `feature-contact-page`. If a conflict arises, resolve it manually. Run `git log --oneline --graph` to see the full branch-and-merge history. Delete both feature branches.
