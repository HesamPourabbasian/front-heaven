---
title: 'Merging & Merge Conflict Resolution'
description: 'Master Git merging: fast-forward vs 3-way recursive merge, merge commits, conflict markers (<<<<<<<, =======, >>>>>>>), aborting merges, and resolving complex merge conflicts.'
order: 12
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/git/11-branching-strategies']
---

# Merging & Merge Conflict Resolution

**Merging** is the process of combining divergent lines of development from two branches into a unified history. Whether integrating completed feature branches into `main` or pulling the latest team updates into your local branch, understanding how Git resolves histories and how to calmly resolve **Merge Conflicts** is a vital skill.

Git employs two primary merge algorithms: **Fast-Forward Merges** and **Three-Way Recursive (ORT) Merges**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Fast-Forward vs Three-Way Merge             │
├──────────────────────────────┬──────────────────────────────┤
│ Fast-Forward Merge           │ Three-Way Merge (True Merge) │
├──────────────────────────────┼──────────────────────────────┤
│ Before:                      │ Before:                      │
│ C1 ── C2 [main]              │ C1 ── C2 ── C4 [main]        │
│         \                    │         \                    │
│          C3 [feature]        │          C3 [feature]        │
│                              │                              │
│ After `git merge feature`:   │ After `git merge feature`:   │
│ C1 ── C2 ── C3 [main, feat]  │ C1 ── C2 ── C4 ─────── C5[M] │
│ (Pointer simply slides fwd;  │         \             /      │
│  no new commit created)      │          C3 ─────────┘       │
│                              │ (New merge commit C5 created)│
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Fast-Forward Merges

A Fast-Forward merge occurs when no new commits have been added to the target branch (`main`) since the feature branch was created. Because history is linear, Git simply moves the target branch pointer forward to point to the latest commit on the feature branch. No extra merge commit is created.

```bash
# Checkout main and merge feature branch
git switch main
git merge feature/user-profile
```

### Forcing a Merge Commit (`--no-ff`)
In some team workflows, maintaining explicit merge commit records is preferred:

```bash
git merge --no-ff feature/user-profile -m "merge: integrate user profile feature"
```

## 2. Three-Way Merge

When both `main` and the feature branch have diverged (both have new commits created after their common ancestor), Git performs a **Three-Way Merge** using:
1. The common ancestor commit.
2. The latest commit on branch A.
3. The latest commit on branch B.

Git calculates the diffs and automatically creates a new **Merge Commit** with two parent hashes.

## 3. Understanding & Resolving Merge Conflicts

A merge conflict occurs when both branches modified the **exact same line in a file**, or one branch deleted a file that the other branch modified. Git cannot guess which change is correct, so it pauses the merge, writes **Conflict Markers** directly into the affected files, and prompts the developer to resolve the conflict.

### Anatomy of Conflict Markers:

```text
<<<<<<< HEAD (Current Branch / main)
const API_BASE_URL = "https://api.front-heaven.com/v2";
=======
const API_BASE_URL = "https://api.front-heaven.com/v3-beta";
>>>>>>> feature/api-upgrade (Incoming Branch)
```

- `<<<<<<< HEAD`: Content from the currently checked-out branch.
- `=======`: The divider separating conflicting versions.
- `>>>>>>> <branch>`: Content from the incoming branch being merged.

### Step-by-Step Conflict Resolution:

1. **Locate Conflicted Files**:
   ```bash
   git status
   # Conflicted files are listed under "Unmerged paths" (both modified: src/config.ts)
   ```
2. **Edit Files**: Open the conflicted files in your editor (VS Code provides helpful buttons: "Accept Current", "Accept Incoming", or "Accept Both"). Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and save the intended code.
3. **Stage Resolved Files**:
   ```bash
   git add src/config.ts
   ```
4. **Finalize Merge**:
   ```bash
   git commit -m "merge: resolve API base URL conflict"
   ```

### Aborting a Merge (`--abort`)

If a conflict is overwhelming or triggered by mistake, you can safely abort and return your repository to the exact pre-merge state:

```bash
git merge --abort
```

## Summary & Key Takeaways

- Fast-Forward merges slide the branch pointer forward when history has not diverged.
- Three-way merges reconcile diverged branches by creating a merge commit with two parents.
- Merge conflicts happen when the same lines are modified in both branches.
- `<<<<<<< HEAD`, `=======`, and `>>>>>>>` mark conflicting code sections.
- `git merge --abort` safely cancels a merge in progress.

## Best Practices & Senior Guidance

1. **Pull and Rebase/Merge Main Frequently**: Keep your feature branch updated with `main` daily to resolve conflicts in small, manageable increments rather than facing a massive conflict at the end of the sprint.
2. **Run Tests Immediately After Resolving Conflicts**: Merge conflict resolution can introduce subtle logic bugs; always run your full test suite (`npm test`) before pushing the merge commit.
