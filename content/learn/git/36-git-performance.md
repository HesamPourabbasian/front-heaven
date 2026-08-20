---
title: 'Git Performance & Repository Optimization'
description: 'Master Git performance engineering: commit-graph generation, multi-pack indexes (MIDX), repository size auditing, fsmonitor filesystem monitoring, and CI caching optimization.'
order: 36
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites: ['/learn/git/23-advanced-git-internals']
---

# Git Performance & Repository Optimization

In high-scale enterprise repositories, standard operations like `git status` or `git log --graph` can degrade from milliseconds to several seconds. Optimizing Git performance requires understanding how the Git engine queries the filesystem, traversing graph metadata using **Commit-Graphs**, consolidating packfile indexes with **Multi-Pack Indexes (MIDX)**, and utilizing **Built-in Filesystem Monitors (`fsmonitor`)**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Git Performance Optimization Tools          │
├───────────────────┬─────────────────────────────────────────┤
│ Optimization Tool │ Performance Benefit                     │
├───────────────────┼─────────────────────────────────────────┤
│ fsmonitor         │ Eliminates filesystem scanning on       │
│                   │ `git status` via OS file events.        │
├───────────────────┼─────────────────────────────────────────┤
│ Commit-Graph      │ Pre-computed binary commit matrix       │
│ (.git/objects/inf)│ speeds up `git log` and merges by 10x.  │
├───────────────────┼─────────────────────────────────────────┤
│ Multi-Pack Index  │ Single binary index across all packfiles│
│ (MIDX)            │ speeds up object lookups across repos.  │
├───────────────────┼─────────────────────────────────────────┤
│ git maintenance   │ Automated background maintenance tasks. │
└───────────────────┴─────────────────────────────────────────┘
```

## 1. Instant `git status` with Built-in `fsmonitor`

On Windows and macOS repositories with over 100,000 files, `git status` has to check `stat()` on every single file on disk. Enabling Git's built-in **`fsmonitor`** uses native OS filesystem event notifications (FSEvents on macOS / ReadDirectoryChangesW on Windows) to track modifications instantly:

```bash
# Enable built-in filesystem monitor for instant status
git config core.fsmonitor true
git config core.untrackedCache true
```

## 2. Commit-Graph Optimization

The **Commit-Graph** file (`.git/objects/info/commit-graph`) pre-computes generation numbers and parent graphs, speeding up `git log --graph`, merge base calculations, and commit reachability checks by up to 1000%:

```bash
# Generate commit-graph binary
git commit-graph write --reachable --changed-paths
```

## 3. Automated Background Maintenance (`git maintenance`)

Modern Git can schedule automated background maintenance (hourly packfile compression, commit-graph generation, and incremental garbage collection):

```bash
# Register repository for automated background maintenance
git maintenance start
```

## Summary & Key Takeaways

- `core.fsmonitor` provides instant `git status` by leveraging OS filesystem events.
- Commit-Graphs pre-compute DAG graph paths for lightning-fast history traversals.
- Multi-Pack Indexes (MIDX) optimize object lookups across multiple packfiles.
- `git maintenance start` schedules automated background optimization.

## Best Practices & Senior Guidance

1. **Enable `core.fsmonitor` on Large Monorepos**: It reduces `git status` latency from seconds to under 50ms.
2. **Run Maintenance in CI Pipelines**: Ensure self-hosted CI runners run `git maintenance` to prevent runner disk degradation.
