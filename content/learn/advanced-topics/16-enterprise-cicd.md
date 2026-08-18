---
title: 'Enterprise CI/CD, Quality Gates & Progressive Delivery'
description: 'Master enterprise deployment pipelines: Monorepo remote build caching with Turborepo, Canary deployments, Blue-Green environments, Lighthouse CI performance budgets, and bundle size gates.'
order: 16
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/15-cicd-foundations
---

# Enterprise CI/CD, Quality Gates & Progressive Delivery

In large engineering organizations managing massive monorepos with dozens of interconnected applications, standard CI workflows can quickly become slow and expensive. Senior engineers implement **Monorepo Remote Caching**, automated **Performance Budgets**, **Lighthouse CI Quality Gates**, and **Progressive Delivery (Canary / Blue-Green)** strategies.

In this lesson, we explore how to optimize enterprise CI pipelines using **Turborepo**, enforce bundle size limits with `size-limit`, run automated Lighthouse audits in pull requests, and deploy zero-downtime Canary releases.

```text
┌────────────────────────────────────────────────────────────┐
│              Enterprise Monorepo Remote Caching            │
├────────────────────────────────────────────────────────────┤
│ Developer A builds `packages/ui` on Mac ──► Remote Cache   │
│                                                   │        │
│ CI Pipeline on Linux checks commit hash           ▼        │
│ └── Cache HIT! Replays build in 0.2s (Zero rebuild penalty)│
├────────────────────────────────────────────────────────────┤
│ Enterprise Quality Gates Block PR if:                      │
│ - Bundle size increases by > 5 KB                          │
│ - Lighthouse Performance Score < 90                        │
│ - Security vulnerabilities detected in npm audit           │
└────────────────────────────────────────────────────────────┘
```

## 1. Remote Build Caching with Turborepo / Nx

In a monorepo containing 10 apps and 20 shared packages, rebuilding every package on every commit wastes massive CI compute resources.

**Turborepo** hashes the source files, dependencies, and environment variables of each task. If the hash has been built previously anywhere in the company or in CI, it downloads the cached output artifacts directly from the **Remote Cache** in milliseconds:

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".output/**"],
      "env": ["VITE_API_URL", "NODE_ENV"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

Running `turbo run build` across 30 packages executes only the changed packages while replaying cached results for unchanged ones.

## 2. Enforcing Bundle Size Budgets with `size-limit`

Unchecked dependencies bloat client bundles over time. **`size-limit`** prevents PRs from merging if bundle size budgets are exceeded:

```json
// package.json
{
  "size-limit": [
    {
      "path": "dist/assets/index-*.js",
      "limit": "80 KB",
      "brotli": true
    },
    {
      "path": "dist/assets/vendor-*.js",
      "limit": "150 KB",
      "brotli": true
    }
  ],
  "scripts": {
    "size": "size-limit"
  }
}
```

If a developer accidentally imports a 200 KB date-parsing library instead of a 2 KB modular alternative, the CI step immediately fails with an exact diff.

## 3. Automated Lighthouse CI Performance Audits

**Lighthouse CI (LHCI)** executes automated audits against pull request preview builds, failing the pipeline if Core Web Vitals or accessibility scores regress:

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: "npm run preview",
      url: ["http://localhost:3000/", "http://localhost:3000/catalog"],
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

## 4. Progressive Delivery: Canary & Blue-Green Deployments

- **Blue-Green Deployment**: Maintains two identical production environments (*Blue* is live; *Green* is idle). The new release is deployed to Green, verified with automated health checks, and the router router instantly flips 100% of live traffic from Blue to Green.
- **Canary Deployment**: Routes a small percentage of real production traffic (e.g., 5%) to the new version while monitoring error rates, latency, and Core Web Vitals in real time:

```text
Incoming Traffic (100%)
       │
       ├──► 95% Traffic ──► Production Stable (v1.4)
       │
       └──►  5% Traffic ──► Canary Release   (v1.5)
                 │
                 ▼ (Monitor Error Rates for 15 minutes)
             [ Error Rate Normal ] ──► Promote Canary to 100%
             [ Error Rate Spikes ] ──► Automated Immediate Rollback!
```

## Summary

- Remote caching (Turborepo) shares build and test artifact caches across team members and CI runners.
- `size-limit` enforces strict bundle size limits to prevent runaway JavaScript bloat.
- Lighthouse CI validates Core Web Vitals and accessibility scores on preview deployments before PR merges.
- Blue-Green deployments provide zero-downtime cutovers between verified environments.
- Canary deployments route a small percentage of live user traffic to detect edge-case regressions safely.

## Best Practices

1. **Enable Remote Caching on Monorepos**: Drastically reduce CI queue times and cloud compute costs.
2. **Set Hard Budget Limits on Critical JS Chunks**: Limit initial main-thread JavaScript to ≤ 100 KB gzipped.
3. **Run Lighthouse Audits on Pull Requests**: Catch LCP, CLS, and a11y regressions before code reaches staging.
4. **Automate Canary Rollbacks on Error Spikes**: Configure real-time APM triggers that automatically revert Canary routing if 5xx errors exceed 0.5%.
