---
title: 'Technical Leadership, RFCs & Engineering Excellence'
description: 'Master senior technical leadership: Request for Comments (RFCs), Architecture Decision Records (ADRs), Technical Debt management, Strangler Fig migration, Code Reviews, and Blameless Post-Mortems.'
order: 24
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/23-cloud-and-infrastructure
---

# Technical Leadership, RFCs & Engineering Excellence

A senior front-end engineer is not merely someone who writes complex code; they are a force multiplier for the entire engineering organization. Senior engineers write **Technical Design Documents (RFCs)**, document architectural trade-offs through **Architecture Decision Records (ADRs)**, manage technical debt strategically, conduct thorough code reviews, and communicate effectively with product managers and non-technical stakeholders.

In this lesson, we explore how to author persuasive RFCs, evaluate architectural trade-offs, execute legacy system migrations with the **Strangler Fig Pattern**, and lead blameless incident post-mortems.

```text
┌────────────────────────────────────────────────────────────┐
│              The Senior Engineering Decision Loop          │
├────────────────────────────────────────────────────────────┤
│ 1. Product Requirement / Technical Problem Discovery       │
│       │                                                    │
│       ▼                                                    │
│ 2. RFC Document (Options, Trade-offs, Scalability, Cost)   │
│       │                                                    │
│       ▼ (Cross-Team Alignment & Stakeholder Review)        │
│ 3. Architecture Decision Record (ADR) Commited to Git      │
│       │                                                    │
│       ▼                                                    │
│ 4. Incremental Migration (Strangler Fig Pattern)           │
│       │                                                    │
│       ▼                                                    │
│ 5. Observability Verification & Blameless Post-Mortems     │
└────────────────────────────────────────────────────────────┘
```

## 1. Writing High-Impact Technical Design Docs (RFCs)

Before writing code for large features or architectural migrations, author a **Request for Comments (RFC)** document:

```markdown
# RFC: Migration to TanStack Query for Server State Management

## 1. Context & Problem Statement
Currently, our application manages all server API responses inside global Pinia stores.
This has resulted in:
- High code duplication for loading/error state booleans across 45 components.
- Pervasive cache staleness bugs where updated data in one tab is not reflected in another.
- Unbounded memory consumption from global response caching.

## 2. Proposed Solution
Migrate from manual Pinia fetchers to TanStack Query v5.
- Centralize all query key factories in `@/api/queries`.
- Leverage automated background refetching on window focus.
- Keep Pinia strictly for transient local UI state (modals, active drawer).

## 3. Alternative Solutions Considered
- **RTK Query**: Rejected due to heavier boilerplate and React-centric defaults.
- **Custom SWR Utility**: Rejected to avoid maintaining custom in-house cache synchronization logic.

## 4. Rollout & Migration Plan
- Phase 1: Install TanStack Query and migrate the `UserProfile` widget (Sprint 12).
- Phase 2: Migrate checkout and billing features (Sprint 13-14).
- Phase 3: Deprecate legacy Pinia API stores (Sprint 15).

## 5. Risks & Mitigation
- **Risk**: Team unfamiliarity with query key caching invalidations.
- **Mitigation**: Host a 1-hour internal tech-talk and provide standardized code templates.
```

## 2. Documenting Architecture Decisions (ADRs)

Store **Architecture Decision Records (ADRs)** directly in your Git repository under `docs/adr/` to preserve organizational context:

```markdown
# ADR 008: Adopt Feature-Sliced Design (FSD) Folder Structure

- **Status**: Accepted
- **Date**: 2026-04-10
- **Deciders**: Front-End Architecture Guild

### Context
Our codebase has grown beyond 100k lines with 18 engineers. The previous `components/` and `utils/` flat structure led to circular dependencies and difficult code reviews.

### Decision
We will adopt the Feature-Sliced Design (FSD) methodology with strict linting rules prohibiting lower layers from importing higher layers.

### Consequences
- **Positive**: Clear boundaries, higher component reusability, predictable PR scope.
- **Negative**: Initial learning curve and file relocation overhead during the first month.
```

## 3. Legacy Migrations: The Strangler Fig Pattern

Never attempt a "Big Bang" complete rewrite of a massive production application; they almost always exceed schedules, introduce regressions, and fail.

Use the **Strangler Fig Pattern** to replace legacy systems incrementally piece-by-piece:

```text
Incoming User Requests
       │
       ▼ (Edge Router / Reverse Proxy)
┌────────────────────────────────────────────────────────────┐
│ Route /checkout/*  ──► New Modern Micro-App (Nuxt / Vue 3) │
│ Route /* (All Else)──► Legacy Monolith (Old Angular/React) │
└────────────────────────────────────────────────────────────┘
```

As more routes are rebuilt in the modern stack, the legacy application shrinks until it can be safely decommissioned with zero business downtime.

## 4. Constructive Code Reviews & Mentorship

High-performing code reviews focus on architecture, security, edge cases, and maintainability, leaving formatting and styling to automated linters:

```markdown
### Code Review Guidelines:
- **Prefix comments with intent**:
  - `[Blocker]`: Must be addressed before merging (e.g., security vulnerability, memory leak).
  - `[Suggestion]`: Non-blocking optimization or alternative pattern.
  - `[Question]`: Seeking clarification on design decision.
  - `[Praise]`: Highlighting clean, elegant code.
- **Explain the "Why"**: Always provide architectural rationale and links to documentation rather than personal opinion.
```

## 5. Leading Blameless Incident Post-Mortems

When a major production outage occurs:
1. **Focus on Systemic Failures, Not Human Error**: Never blame individuals. Ask: *Why did our automated CI tests fail to catch this? Why did our monitoring alerts not trigger sooner?*
2. **Establish Action Items with Owners**: Every post-mortem must produce actionable engineering improvements (e.g., add Playwright regression test, adjust Circuit Breaker threshold).

## Summary

- RFCs communicate technical proposals, trade-offs, alternatives, and rollout plans across teams.
- Architecture Decision Records (ADRs) document why technical decisions were made directly in Git.
- The Strangler Fig pattern migrates legacy applications incrementally through routing proxies.
- Code reviews should be constructive, categorized with prefixes, and focused on architecture and security.
- Blameless post-mortems transform production outages into systemic engineering improvements.

## Best Practices

1. **Write RFCs for Large Architectural Changes**: Gather feedback and alignment before writing code.
2. **Document Decisions in ADRs**: Prevent recurring debates over previously settled architectural choices.
3. **Never Attempt Big Bang Rewrites**: Migrate large systems incrementally using the Strangler Fig pattern.
4. **Automate Style in CI; Review Architecture in PRs**: Let Prettier and ESLint enforce formatting so reviewers can focus on logic and security.
