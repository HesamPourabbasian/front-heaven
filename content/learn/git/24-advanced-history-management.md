---
title: 'Advanced History Management & git-filter-repo'
description: 'Master advanced Git history operations: autosquash, fixup commits, cherry-pick with mainline parent flags, rewriting history with git-filter-repo, and purging sensitive secrets.'
order: 24
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/git/13-rebasing']
---

# Advanced History Management & git-filter-repo

In enterprise environments, history management extends far beyond basic interactive rebasing. You must surgically extract specific commits across disparate branches (**`git cherry-pick`**), automate fixup rebase squashes (**`--autosquash`**), and purge accidentally committed passwords or multi-gigabyte binary files across thousands of historical commits using **`git-filter-repo`**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Cherry-Picking Across Branches              │
│                                                             │
│  main:       C1 ── C2 ── C3 ── C6                           │
│                           \                                 │
│  feature-B:                \── C7 ── C8 [Cherry-Pick C5] ──>│
│                                       \                     │
│  feature-A:  C1 ── C2 ── C4 ── C5 ────┘                     │
│                                                             │
│  git cherry-pick C5 copies the exact changes of C5          │
│  and applies them as a new commit on feature-B.             │
└─────────────────────────────────────────────────────────────┘
```

## 1. Cherry-Picking Commits (`git cherry-pick`)

`git cherry-pick` takes the diff introduced by an existing commit on any branch and applies it as a brand new commit on your current active branch:

```bash
# Cherry-pick a specific commit hash
git cherry-pick 7f8a9b0

# Cherry-pick a range of commits (from A up to B)
git cherry-pick 3c4d5e1..7f8a9b0

# Cherry-pick without committing immediately (-n / --no-commit)
git cherry-pick -n 7f8a9b0
```

## 2. Automated Fixup Workflows (`--fixup` & `--autosquash`)

Instead of opening an interactive rebase editor manually to squash bug fixes:

```bash
# 1. Make your code fix, then commit directly targeting the original commit hash:
git commit --fixup 7f8a9b0

# 2. Run rebase with autosquash:
git rebase -i --autosquash HEAD~5
```

Git automatically positions the fixup commit directly below commit `7f8a9b0` with the `fixup` command pre-configured in the todo list!

## 3. Purging Secrets & Large Files with `git-filter-repo`

If an AWS secret key or private `.env` file was committed 6 months ago, deleting it in a new commit does NOT remove it from history—it remains downloadable in the Git object database.

Use **`git-filter-repo`** (the official, high-speed Python replacement for legacy `git filter-branch` and BFG):

```bash
# Install git-filter-repo
pip install git-filter-repo

# Completely scrub a sensitive file from every commit in repository history
git filter-repo --path src/secrets.json --invert-paths

# Scrub all files larger than 50MB from history
git filter-repo --strip-blobs-bigger-than 50M

# Replace sensitive API keys with redacted placeholders across all history
git filter-repo --replace-text expressions.txt
```

> [!WARNING]
> Running `git-filter-repo` rewrites every commit hash in the repository. All team members must re-clone the repository after a history scrub.

## Summary & Key Takeaways

- `git cherry-pick` applies specific commits from other branches onto your active branch.
- `git commit --fixup` + `git rebase --autosquash` automates commit cleanups without manual editor shuffling.
- `git-filter-repo` permanently scrubs sensitive secrets or massive binary files across historical commits.

## Best Practices & Senior Guidance

1. **Rotate Leaked Secrets Immediately**: Never assume a history scrub makes a leaked credential safe; revoke and regenerate the compromised API key immediately upon detection.
2. **Coordinate History Rewrites**: When executing a repository-wide history cleanup with `git-filter-repo`, schedule maintenance windows with all engineering teams.
