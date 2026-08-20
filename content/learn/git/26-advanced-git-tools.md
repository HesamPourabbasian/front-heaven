---
title: 'Advanced Git Tools: Bisect, Blame, Rerere & Worktree'
description: 'Master advanced Git CLI utilities: automated binary search bug hunting with git bisect, git blame, git rerere (reuse recorded resolution), git clean, git archive, and git bundle.'
order: 26
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/git/14-undoing-changes']
---

# Advanced Git Tools: Bisect, Blame, Rerere & Worktree

Beyond basic daily commits, Git provides a suite of advanced diagnostic, automation, and forensic tools designed to hunt down elusive regression bugs in minutes, reuse complex merge conflict resolutions automatically, and safely package repositories offline.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Binary Search Bug Hunting with git bisect   │
│                                                             │
│  v1.0.0 (Good: No bug)                 v2.0.0 (Bad: Bug present)
│  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐       │
│  │ C100 │──>│ C110 │──>│ C120 │──>│ C130 │──>│ C140 │       │
│  └──────┘   └──────┘   └──────┘   └──────┘   └──────┘       │
│                          ▲                                  │
│                          │ Git checks midpoint (C120)       │
│                                                             │
│  Tests ~1000 commits in ~10 steps using O(log N) search!    │
└─────────────────────────────────────────────────────────────┘
```

## 1. Automated Bug Hunting with `git bisect`

When a bug exists in production today but did not exist three months ago (and hundreds of commits were merged in between), finding the exact breaking commit manually is exhausting. **`git bisect`** executes a binary search ($O(\log N)$) through history:

```bash
# 1. Start bisect wizard
git bisect start

# 2. Tell Git the current commit has the bug
git bisect bad

# 3. Tell Git the last known working commit (e.g. tag v1.0.0)
git bisect good v1.0.0
```

Git checks out the midpoint commit. You test the code (or run an automated test script).
- If the bug is present: `git bisect bad`
- If the bug is absent: `git bisect good`

### Fully Automated Bisect with Test Scripts:

```bash
# Automatically runs test script on every step until the guilty commit is identified!
git bisect run npm test
```

Once finished, Git prints the exact author, commit hash, and message that introduced the bug. End bisect with `git bisect reset`.

## 2. Line-by-Line Code Archaeology (`git blame`)

`git blame` displays the author, commit hash, and timestamp for every single line of code in a file:

```bash
# Inspect who wrote each line in src/auth.service.ts
git blame src/auth.service.ts

# Inspect specific line range (-L start,end)
git blame -L 40,65 src/auth.service.ts

# Ignore whitespace-only commits when blaming
git blame -w src/auth.service.ts
```

## 3. Reusing Conflict Resolutions (`git rerere`)

**`git rerere`** stands for **"Reuse Recorded Resolution"**. When enabled, Git memorizes how you resolved a merge conflict. If the identical conflict occurs again (e.g. during a long rebase sequence or branch re-merge), Git resolves the conflict **automatically** without human intervention!

```bash
# Enable rerere globally
git config --global rerere.enabled true
```

## 4. Offline Backups & Sharing (`git bundle`)

When transferring an entire Git repository with all branches and history to an offline air-gapped machine without network access:

```bash
# Pack entire repository history into a single binary bundle file
git bundle create repo-backup.bundle --all

# Clone repository directly from the bundle file on another machine
git clone repo-backup.bundle my-restored-repo
```

## Summary & Key Takeaways

- `git bisect run <script>` automates binary search debugging to identify breaking commits in seconds.
- `git blame -w` traces author history line-by-line while ignoring whitespace edits.
- `git rerere` records and auto-replays merge conflict resolutions.
- `git bundle` packages entire repositories into single offline files.

## Best Practices & Senior Guidance

1. **Always Enable `git rerere`**: It saves hours of redundant conflict resolution when maintaining long-running branches.
2. **Write Pure Unit Test Scripts for `git bisect run`**: Ensure your test script exits with code `0` for good and `1` for bad.
