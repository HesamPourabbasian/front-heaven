---
title: 'Advanced Frontend Architecture & Design Systems'
description: 'Master enterprise frontend architecture: Feature-Driven Vertical Slices, Domain-Driven Design, Design Systems, Composable hierarchy, Monorepos with pnpm, and Micro-Frontends.'
order: 25
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/vue/11-component-communication
  - /learn/vue/15-typescript-with-vue
  - /learn/vue/21-advanced-state-architecture
---

# Advanced Frontend Architecture & Design Systems

As engineering organizations scale to dozens of developers and hundreds of thousands of lines of code, technical architecture becomes the deciding factor between development velocity and crippling technical debt. Poor architectural choices lead to "spaghetti code," merge conflicts, brittle cross-feature coupling, and duplicate implementations.

In this lesson, we will explore enterprise frontend software engineering paradigms in Vue 3: Feature-Driven Vertical Slice Architecture, Domain-Driven Design (DDD) principles, the Repository and Service patterns, Composable hierarchy design, Monorepos using `pnpm` workspaces, and Micro-Frontend integration strategies.

## Feature-Driven Architecture (Vertical Slice vs Horizontal Layers)

Traditional frontend projects organize files by technical type (**Horizontal Layering**):
```text
src/
├── components/   # 200 mixed components
├── composables/  # 50 mixed composables
├── stores/       # 30 mixed stores
└── views/        # 40 views
```

In a horizontally layered codebase, implementing a change to "User Billing" requires touching files scattered across four distant directories, creating high cognitive load and merge conflicts between teams.

### Feature-Driven (Vertical Slice) Architecture
Feature-driven architecture groups all code related to a single business capability together in a dedicated directory:

```text
src/
├── features/
│   ├── auth/              # Login, register, token refresh
│   │   ├── components/    # LoginForm.vue, ResetPasswordModal.vue
│   │   ├── composables/   # useAuth.ts, usePasswordStrength.ts
│   │   ├── stores/        # authStore.ts
│   │   ├── types/         # auth.types.ts
│   │   └── index.ts       # Public API barrel export for other features
│   ├── billing/           # Invoices, subscriptions, Stripe checkout
│   │   ├── components/
│   │   ├── services/
│   │   └── index.ts
│   └── lessons/           # Lesson curriculum and progress tracking
└── shared/                # True global cross-cutting primitives
    ├── components/        # BaseButton.vue, BaseModal.vue, BaseInput.vue
    ├── utils/             # formatting.ts, dateUtils.ts
    └── types/             # common.types.ts
```

### The Golden Rule of Feature Encapsulation
Each feature directory exports its public contract through an `index.ts` barrel file. Features may import from `src/shared/`, but **must never import private internal sub-files of sibling features directly**. If Feature A needs functionality from Feature B, it must import exclusively from Feature B's public `index.ts` interface.

## Domain-Driven Design (DDD) in the Frontend

Applying Domain-Driven Design concepts to frontend architecture keeps business logic decoupled from UI framework details:

1. **Entities**: Core business objects with unique identifiers and validation logic (e.g. `User`, `Course`, `Invoice`).
2. **Value Objects**: Immutable attributes defined by their value rather than an identity (e.g. `EmailAddress`, `Money`, `DateRange`).
3. **Services**: Stateless classes or functions orchestrating domain operations across multiple entities.
4. **Repositories**: Interfaces abstracting data access and persistence, allowing you to swap mock APIs, REST endpoints, or GraphQL seamlessly.

```typescript
// src/features/billing/domain/Money.ts
export class Money {
  constructor(public readonly amountInCents: number, public readonly currency: string = 'USD') {
    if (amountInCents < 0) throw new Error('Money amount cannot be negative')
  }

  public format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amountInCents / 100)
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error('Currency mismatch')
    return new Money(this.amountInCents + other.amountInCents, this.currency)
  }
}
```

## The Composable Hierarchy Pattern

Just like components form a tree of abstraction, composables should follow a structured three-tier hierarchy:

1. **Atomic Composables (Low-Level Primitives)**: Focus on a single browser API or low-level utility with zero business logic (e.g. `useLocalStorage`, `useWindowSize`, `useEventListener`, `useDebounce`).
2. **Domain Composables (Business Logic)**: Coordinate business entities, validation rules, and API communications (e.g. `useInvoiceCalculator`, `useUserPermissions`).
3. **Feature / Page Composables (Orchestration)**: Tie UI components to stores, routing parameters, and API lifecycle hooks for a specific screen (e.g. `useBillingDashboardPage`).

```typescript
// Tier 2: Domain Composable leveraging Tier 1 Primitive
import { useLocalStorage } from '@/shared/composables/useLocalStorage'

export function useCartPersistence() {
  const storedItems = useLocalStorage<CartItem[]>('fh_cart_items', [])
  // Business logic...
  return { storedItems }
}
```

## Monorepos with `pnpm` Workspaces

For enterprise organizations maintaining multiple web applications (e.g. User App, Admin Portal, Documentation Site, Mobile Web), building within a **Monorepo** enables code reuse across projects with zero package publishing latency.

Using `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```text
monorepo/
├── apps/
│   ├── web-app/          # Main Vue 3 / Nuxt customer application
│   ├── admin-portal/     # Internal Vue 3 Admin Dashboard
│   └── docs-site/        # Nuxt Content Documentation
└── packages/
    ├── ui/               # Shared Vue 3 Design System component library
    ├── tsconfig/         # Shared TypeScript base configs
    ├── eslint-config/    # Shared linting standards
    └── api-client/       # Generated typed API SDK
```

Applications import from `@my-org/ui` locally, with Vite recompiling shared packages instantaneously via workspace symlinks.

## Packaging a Shared Vue 3 Component Library with Vite

To build a standalone Vue 3 component library for distribution across teams or open source, configure Vite in **Library Mode**:

```typescript
// packages/ui/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyOrgUI',
      fileName: (format) => `my-org-ui.${format}.js`,
    },
    rollupOptions: {
      // Externalize Vue so consuming apps don't bundle duplicate Vue runtimes
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

## Micro-Frontends with Module Federation

For massive enterprise organizations where independent cross-functional teams manage different sections of a single unified web platform, **Micro-Frontends** allow teams to deploy frontend modules independently.

Using Vite Module Federation (`@originjs/vite-plugin-federation`), a host shell application dynamically loads remote component bundles over the network at runtime:

```typescript
// vite.config.ts (Host Shell)
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'host-app',
      remotes: {
        billingRemote: 'https://billing.my-app.com/assets/remoteEntry.js',
        checkoutRemote: 'https://checkout.my-app.com/assets/remoteEntry.js',
      },
      shared: ['vue', 'pinia'],
    }),
  ],
})
```

## Best Practices

- **Enforce Vertical Slice Boundaries**: Never allow cross-feature imports into private directories; communicate exclusively through public `index.ts` barrels.
- **Isolate Framework-Agnostic Domain Logic**: Write core business calculations, pricing formulas, and validations as pure TypeScript classes or functions that do not depend on Vue reactivity.
- **Externalize Vue in Shared Libraries**: Always mark `'vue'`, `'pinia'`, and `'vue-router'` as external dependencies in library builds to prevent duplicate runtime singletons.
- **Adopt Strict Workspace Monorepo Rules**: Use `pnpm` workspaces with Turborepo or Nx for parallel caching, testing, and building across multi-app architectures.

## Summary

Advanced frontend architecture elevates software development from writing UI scripts to engineering resilient software systems. By structuring code into feature-driven vertical slices, embracing Domain-Driven Design, standardizing composable tiers, and leveraging monorepo workspaces, you can scale codebases across hundreds of engineers with maximum velocity and stability.
