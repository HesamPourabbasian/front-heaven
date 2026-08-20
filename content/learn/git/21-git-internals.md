---
title: 'Git Internals: Objects, Blobs, Trees & The Index'
description: 'Master Git internal architecture: the 4 core object types (Blob, Tree, Commit, Tag), content-addressable storage, SHA hashing, the Index file, and special refs (HEAD, ORIG_HEAD, FETCH_HEAD).'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/git/04-commits']
---

# Git Internals: Objects, Blobs, Trees & The Index

To truly master Git and troubleshoot complex repository states, you must understand Git's underlying data model. Under the hood, Git is not a complex mystery—it is a simple, elegant **Content-Addressable Key-Value Data Store**.

Every file, directory structure, commit, and tag in your repository is stored inside `.git/objects` as a compressed object named after its 40-character cryptographic SHA hash.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The 4 Fundamental Git Objects               │
├─────────────┬───────────────────────────────────────────────┤
│ Object Type │ Purpose & Content                             │
├─────────────┼───────────────────────────────────────────────┤
│ Blob        │ Stores raw file content (data). Contains NO   │
│             │ filename, permissions, or timestamps.         │
├─────────────┼───────────────────────────────────────────────┤
│ Tree        │ Represents a directory. Maps filenames and    │
│             │ permissions (100644) to Blob and Tree hashes. │
├─────────────┼───────────────────────────────────────────────┤
│ Commit      │ Points to a top-level Tree, parent commit(s), │
│             │ author metadata, and commit message.          │
├─────────────┼───────────────────────────────────────────────┤
│ Tag         │ An annotated permanent pointer to a specific  │
│             │ commit object with tagger metadata.           │
└─────────────┴───────────────────────────────────────────────┘
```

## 1. Plumbing Commands: Peeking Under the Hood

Git commands are divided into two categories:
- **Porcelain Commands**: User-friendly high-level commands (`git status`, `git commit`, `git checkout`).
- **Plumbing Commands**: Low-level internal commands that inspect and manipulate `.git` directly (`git cat-file`, `git hash-object`, `git ls-tree`).

```bash
# Hash a string into a SHA-1 Git object
echo "Hello Front-Heaven" | git hash-object --stdin
# Output: 5f8a9...

# Inspect the TYPE of an object hash
git cat-file -t 7f8a9b0
# Output: commit (or blob / tree)

# Inspect the exact raw CONTENTS of an object hash
git cat-file -p 7f8a9b0
```

## 2. How Git Stores Files (Blobs & Trees)

If you have a file `src/app.ts`, Git creates:
1. A **Blob** containing the raw source code text of `app.ts`.
2. A **Tree** object representing the `src/` folder: `100644 blob 5a8f9... app.ts`.
3. A root **Tree** object representing the project root: `040000 tree 8b1c2... src`.

Because blobs store only raw data, if two files across your repository have identical contents (or a file is renamed), Git stores exactly ONE blob in `.git/objects`, saving immense disk space!

```text
┌─────────────────────────────────────────────────────────────┐
│                 Object Graph Relationships                  │
│                                                             │
│                   [ Commit Object ]                         │
│                    - Tree: 8a9b...                          │
│                    - Parent: 3c4d...                        │
│                           │                                 │
│                           ▼                                 │
│                   [ Root Tree: 8a9b ]                       │
│                    ├── src (Tree: 1f2e)                     │
│                    └── README.md (Blob: 4d5e)               │
│                           │                                 │
│                           ▼                                 │
│                   [ Sub-Tree: 1f2e (src) ]                  │
│                    ├── app.ts (Blob: 9a0b)                  │
│                    └── styles.css (Blob: 7c8d)              │
└─────────────────────────────────────────────────────────────┘
```

## 3. Special Pointer References

- **`HEAD`**: Points to the currently checked-out branch (or commit in detached HEAD mode).
- **`ORIG_HEAD`**: Set by destructive commands (`reset`, `rebase`, `merge`) to store the previous HEAD position before the operation, enabling quick rollback (`git reset --hard ORIG_HEAD`).
- **`FETCH_HEAD`**: Records the state of branches downloaded during the last `git fetch`.

## Summary & Key Takeaways

- Git is a content-addressable key-value store in `.git/objects`.
- The 4 object types are Blob (file content), Tree (directory), Commit (snapshot metadata), and Tag.
- Identical file contents share the same Blob hash across the entire repository.
- Plumbing commands (`git cat-file -p <hash>`) allow you to inspect the object graph directly.

## Best Practices & Senior Guidance

1. **Understand `ORIG_HEAD` for Instant Undo**: If a rebase or merge goes wrong, `git reset --hard ORIG_HEAD` instantly restores your exact pre-operation state.
2. **Never Edit Files Inside `.git/objects` Manually**: Manually modifying internal object files corrupts the cryptographic checksums and destroys repository integrity.
