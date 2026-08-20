---
title: 'Branching Strategies: GitHub Flow, Git Flow & Trunk-Based'
description: 'Master enterprise branching models: Git Flow, GitHub Flow, Trunk-Based Development, release trains, hotfix workflows, and branch naming standards.'
order: 11
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/git/10-beginner-projects']
---

# Branching Strategies: GitHub Flow, Git Flow & Trunk-Based

In professional engineering organizations, code is never written or merged at random. Teams adhere to structured **Branching Strategies** that define how feature branches are created, how code is reviewed, how releases are stabilized, and how production hotfixes are deployed.

Choosing the right branching strategy depends on team size, release frequency, automated test coverage, and deployment infrastructure. The three dominant industry models are **GitHub Flow**, **Trunk-Based Development**, and classic **Git Flow**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Branching Strategies Compared               │
├───────────────────┬───────────────────┬─────────────────────┤
│ Model             │ Release Frequency │ Best Fit            │
├───────────────────┼───────────────────┼─────────────────────┤
│ GitHub Flow       │ Continuous (CD)   │ Web apps, SaaS,     │
│ (Feature -> main) │ Multiple per day  │ Agile squads        │
├───────────────────┼───────────────────┼─────────────────────┤
│ Trunk-Based       │ Continuous (CD)   │ High-scale tech     │
│ (Short-lived br)  │ Hourly / Instant  │ (Google, Meta, etc) │
├───────────────────┼───────────────────┼─────────────────────┤
│ Git Flow          │ Scheduled / Milest│ Mobile apps, OS,    │
│ (develop, release)│ Weekly / Monthly  │ Embedded firmware   │
└───────────────────┴───────────────────┴─────────────────────┘
```

## 1. GitHub Flow (Lightweight & Continuous)

**GitHub Flow** is the modern standard for web applications and SaaS products practicing Continuous Deployment:
1. **Single Source of Truth**: The `main` branch is always stable, deployable, and protected.
2. **Feature Branches**: To work on a new feature or fix, create a descriptively named branch off `main` (e.g. `feature/FH-201-dark-mode`).
3. **Regular Commits**: Commit and push changes to remote regularly.
4. **Pull Request**: Open a PR for code review and automated CI checks.
5. **Merge & Immediate Deploy**: Once approved, merge into `main` and deploy to production automatically.

## 2. Trunk-Based Development (Enterprise Velocity)

In **Trunk-Based Development**, developers merge small, frequent commits into the core "trunk" (`main`) multiple times a day. Branches are extremely short-lived (typically lasting less than 24 hours):
- **Feature Flags / Toggles**: Incomplete features are hidden behind runtime feature flags in production rather than lingering in unmerged long-lived branches.
- **Benefits**: Completely eliminates "merge hell", fosters continuous integration, and enforces small, reviewable code chunks.

## 3. Git Flow (Structured Release Cycles)

**Git Flow** is a traditional model designed for software with scheduled version releases (e.g. iOS/Android mobile apps, desktop software):
- **`main`**: Stores official release history (tagged with `v1.0.0`, `v1.1.0`).
- **`develop`**: Integration branch for features.
- **`feature/*`**: Branches off `develop` and merged back into `develop`.
- **`release/*`**: Created off `develop` when preparing a release; only bug fixes and documentation are committed here before merging into both `main` and `develop`.
- **`hotfix/*`**: Created directly off `main` for critical production emergencies; merged into both `main` and `develop`.

```text
┌─────────────────────────────────────────────────────────────┐
│                     Classic Git Flow Architecture           │
│                                                             │
│  main      ───────● (v1.0) ─────────────────● (v1.1) ───────│
│                    \                       / ^              │
│  hotfix             \───●─────────────────/  │ (hotfix)     │
│                          \                   │              │
│  release                  \───●─────────────●               │
│                                ^           /                │
│  develop   ───●───────────────●─\─────────●─────────────────│
│                \             /   \       /                  │
│  feature        \──●───────●/     \──●──/                   │
└─────────────────────────────────────────────────────────────┘
```

## Summary & Key Takeaways

- GitHub Flow uses simple feature branches off `main` and merges via PR for continuous deployment.
- Trunk-Based Development uses ultra short-lived branches combined with Feature Flags.
- Git Flow uses dedicated `develop`, `release`, and `hotfix` branches for scheduled release cycles.
- Clear branch naming conventions (`feature/`, `fix/`, `hotfix/`) maintain repository readability.

## Best Practices & Senior Guidance

1. **Default to GitHub Flow or Trunk-Based for Web Apps**: Avoid Git Flow for SaaS web applications; the overhead of synchronizing `develop` and `main` slows down deployment velocity.
2. **Keep Branches Under 48 Hours**: If a branch takes a week to build, break it into smaller sub-tasks behind feature flags to merge incrementally.
