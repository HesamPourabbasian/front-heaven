---
title: 'Intermediate Projects: Team Collaboration & CI Labs'
description: 'Consolidate Level 2 Git & GitHub skills: multi-developer team collaboration, feature-branch workflows, resolving complex rebases, GitHub Actions CI pipelines, and automated releases.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 60
prerequisites: ['/learn/git/20-github-actions-basics']
---

# Intermediate Projects: Team Collaboration & CI Labs

Level 2 elevates your Git expertise from solo usage to professional multi-developer team collaboration: branching strategies, interactive rebasing, merge conflict resolution, CODEOWNERS governance, and automated CI pipelines.

To prove your intermediate capability, you will execute 6 comprehensive practical projects simulating enterprise team workflows.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Level 2 Enterprise Labs Portfolio           │
├────┬─────────────────────────────┬──────────────────────────┤
│ #  │ Project Lab                 │ Core Capabilities Tested │
├────┼─────────────────────────────┼──────────────────────────┤
│ 1  │ Simulated Team Repository   │ Multi-branch, PR reviews │
│ 2  │ Interactive Rebase Clean-Up │ git rebase -i, squashing │
│ 3  │ Merge Conflict Simulation   │ 3-way conflict resolution│
│ 4  │ GitHub Actions CI Pipeline  │ Lint, test, build auto   │
│ 5  │ Automated SemVer Releases   │ Tags, Release notes      │
│ 6  │ Open Source Contribution    │ Fork, Upstream sync, PR  │
└────┴─────────────────────────────┴──────────────────────────┘
```

## Lab 1: Multi-Developer Feature Branch & Code Review Simulation

1. **Configure Repository Governance**:
   - Create `.github/CODEOWNERS`.
   - Enable Branch Protection on `main` requiring 1 approving review and passing CI.
2. **Create Feature Branch**:
   - Branch: `feature/FH-301-user-auth`.
   - Commit atomic Conventional Commits (`feat(auth): ...`).
3. **Interactive Rebase Clean-Up**:
   - Rebase feature branch interactively onto `main`: `git rebase -i main`.
   - Squash WIP commits into clean, descriptive units.
4. **Open Pull Request & Verify CI**:
   - Open PR, verify GitHub Actions CI passes green, simulate code review feedback, and squash-and-merge.

## Summary & Key Takeaways

- Practical execution of team workflows solidifies collaboration confidence.
- Combining interactive rebasing, PR templates, and CI pipelines ensures enterprise code quality.

## Best Practices & Senior Guidance

1. **Automate Everything Possible in CI**: If a check can be done by a script (formatting, linting, unit tests, bundle budgets), never rely on manual human review.
