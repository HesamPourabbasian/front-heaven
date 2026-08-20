---
title: 'Nx & Enterprise Monorepo Architecture'
description: 'Master Nx monorepos for Angular: workspace architecture, apps vs libs, project dependency graphs, computation caching (local and remote), affected commands, and CI optimization.'
order: 34
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/33-large-scale-architecture']
---

# Nx & Enterprise Monorepo Architecture

In large engineering organizations, managing multiple separate Git repositories (polyrepos) creates severe friction: duplicated code, fragmented design systems, dependency version drift, and painful cross-team integration testing. **Monorepo Architecture** consolidates multiple applications and shared libraries into a single repository.

**Nx** is the industry-standard enterprise build framework for Angular monorepos. It provides interactive project dependency graph visualizers, distributed computation caching, smart `affected` command execution, and automated workspace migrations.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Nx Enterprise Monorepo Structure            │
│                                                             │
│  apps/                                                      │
│  ├── customer-portal/          # Angular Client Application │
│  ├── admin-dashboard/          # Angular Admin Application  │
│  └── mobile-companion/         # Ionic / Capacitor App      │
│                                                             │
│  libs/                                                      │
│  ├── shared/                                                │
│  │   ├── design-system/        # Shared Reusable UI (Dumb)  │
│  │   └── auth/                 # Shared Authentication SDK  │
│  └── customer/                                              │
│      ├── feature-checkout/     # Checkout Container         │
│      └── data-access-orders/   # Orders Store & API         │
│                                                             │
│  Computation Cache: Instant test/build replays              │
│  Affected Graph: Test ONLY modified projects on PRs         │
└─────────────────────────────────────────────────────────────┘
```

## 1. Creating an Nx Workspace

```bash
# Initialize a modern Angular Nx monorepo
npx create-nx-workspace@latest enterprise-suite --preset=angular-monorepo

# Generate a new shared UI library with standalone components
npx nx g @nx/angular:library ui-buttons --directory=libs/shared/ui-buttons --standalone
```

## 2. Interactive Dependency Graph Visualization

Nx analyzes TypeScript `import` statements across the entire repository to construct an exact, real-time dependency graph:

```bash
# Launch interactive 3D dependency graph in browser
npx nx graph
```

## 3. Computation Caching & `affected` Commands

Nx tracks file hashes, environment flags, and command inputs. If a task has been run before with identical inputs, Nx replays the cached output instantly (in milliseconds):

```bash
# Run tests ONLY for applications and libraries affected by current Git branch
npx nx affected:test --base=origin/main

# Build only affected apps for production
npx nx affected:build --base=origin/main --configuration=production
```

## 4. Enforcing Boundaries with ESLint Rules

Nx enforces strict dependency rules in `.eslintrc.json`, preventing apps or features from creating circular or illegal imports:

```json
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          {
            "sourceTag": "type:feature",
            "onlyDependOnLibsWithTags": ["type:ui", "type:data-access", "type:util"]
          },
          {
            "sourceTag": "type:ui",
            "onlyDependOnLibsWithTags": ["type:util"]
          }
        ]
      }
    ]
  }
}
```

## Summary & Key Takeaways

- Monorepos unite multiple applications and shared libraries in a single repository.
- Nx provides computation caching, slashing CI/CD test and build times by up to 80%.
- `nx affected` runs tests and builds exclusively on modified code paths.
- Module boundary linting guarantees architectural separation across enterprise engineering teams.

## Best Practices & Senior Guidance

1. **Tag Every Project in `project.json`**: Assign tags like `scope:billing` and `type:data-access` to enable automated architectural boundary enforcement.
2. **Enable Nx Cloud for Distributed Remote Caching**: Share build caches across all team members and CI runners to prevent duplicate builds.
