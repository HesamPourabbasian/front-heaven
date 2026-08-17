---
title: 'TypeScript with Svelte 5 & SvelteKit'
description: 'Master strict TypeScript development in Svelte 5: typing $props and $state, generic Svelte components, SvelteKit generated ./$types, typed API contracts, and svelte-check CLI.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/04-reactivity-and-runes
  - /learn/svelte/10-sveltekit
---

# TypeScript with Svelte 5 & SvelteKit

TypeScript is an indispensable tool in modern frontend and full-stack software development. It transforms dynamic JavaScript into a statically verified, self-documenting language, catching bugs during development and providing intelligent code autocompletion and refactoring in your IDE.

Svelte 5 was designed with first-class TypeScript integration from the ground up. In this lesson, we will master typing Svelte 5 Runes (`$state`, `$derived`, `$props`, `$bindable`), building generic components with the `generics` attribute, utilizing SvelteKit's automatically generated `./$types`, and validating codebases using the `svelte-check` CLI compiler.

## Configuring TypeScript in Svelte

When initializing a Svelte or SvelteKit project with TypeScript support, Svelte generates a `tsconfig.json` extending `@sveltejs/kit/tsconfig.json` or `@tsconfig/svelte`.

Components opt into TypeScript simply by adding `lang="ts"` to the `<script>` block:

```svelte
<script lang="ts">
  let message: string = $state('Type-safe Svelte 5')
</script>
```

### The `svelte-check` Type Checker
To typecheck `.svelte` components and TypeScript files in your CI/CD pipeline or terminal, use **`svelte-check`**:

```bash
npx svelte-check --tsconfig ./tsconfig.json
```

`svelte-check` parses both the `<script>` blocks and the HTML template expressions across all `.svelte` files, ensuring props, events, and bindings are 100% type-sound.

## Typing Svelte 5 Component Props: `$props()`

In Svelte 5, declare prop contracts using clean TypeScript interfaces passed directly to the `$props()` rune:

```svelte
<!-- src/lib/CourseCard.svelte -->
<script lang="ts">
  export interface CourseCardProps {
    id: string
    title: string
    level: 'beginner' | 'intermediate' | 'advanced'
    rating?: number
    tags?: string[]
    onEnroll?: (courseId: string) => Promise<void>
  }

  // Strictly typed props with fallback defaults
  let {
    id,
    title,
    level,
    rating = 5.0,
    tags = [],
    onEnroll
  }: CourseCardProps = $props()
</script>

<div class="course-card">
  <h3>{title}</h3>
  <span class="badge badge-{level}">{level.toUpperCase()}</span>
  <span class="rating">★ {rating.toFixed(1)}</span>
  {#if onEnroll}
    <button onclick={() => onEnroll(id)}>Enroll Now</button>
  {/if}
</div>
```

When parent components consume `<CourseCard />`, IDEs enforce required properties (`id`, `title`, `level`) and provide autocomplete for the union type `'beginner' | 'intermediate' | 'advanced'`.

## Typing Reactive State: `$state()` and `$derived()`

TypeScript automatically infers primitive types in `$state()`, but explicit generic annotations should be supplied for nullable values, complex union types, or empty arrays:

```typescript
import type { UserProfile } from '$lib/types'

// Explicit generic for nullable state: UserProfile | null
let currentUser = $state<UserProfile | null>(null)

// Explicit array type: string[]
let activeFilters = $state<string[]>([])

// Union literal state
type Step = 'cart' | 'shipping' | 'payment' | 'confirmation'
let activeStep = $state<Step>('cart')

// Typed derived computation
let isCheckoutReady = $derived<boolean>(activeStep === 'payment' && currentUser !== null)
```

## Generic Components in Svelte 5

Svelte 5 introduces native generic component support via the **`generics`** attribute on the `<script lang="ts">` tag. This is ideal for reusable list views, dropdown selectors, and data tables:

```svelte
<!-- src/lib/Combobox.svelte -->
<script lang="ts" generics="T extends { id: string | number; label: string }">
  interface Props {
    items: T[]
    selectedItem: T | null
    onSelect: (item: T) => void
  }

  let { items, selectedItem, onSelect }: Props = $props()
</script>

<div class="combobox">
  {#each items as item (item.id)}
    <button
      class:selected={selectedItem?.id === item.id}
      onclick={() => onSelect(item)}
    >
      {item.label}
    </button>
  {/each}
</div>
```

When a parent component passes an array of `Project` records to `<Combobox :items={projects} />`, Svelte automatically infers `T` as `Project` with zero manual casting!

## SvelteKit Generated `./$types`

One of SvelteKit's greatest engineering achievements is its **automatic type generation system**. SvelteKit reads your route directory structure, `load` functions, actions, and server routes, and automatically generates a hidden `./$types` module for each specific route folder.

### 1. Typing Page Load Functions (`+page.server.ts`)
```typescript
// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  return {
    analytics: { pageViews: 12000, revenueUSD: 8500 },
    serverTimestamp: Date.now()
  }
}
```

### 2. Consuming Typed Data in Page Components (`+page.svelte`)
In Svelte 5, importing `PageProps` from `./$types` gives your component 100% type-safe access to everything returned by the server `load()` function:

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types'

  let { data, form }: PageProps = $props()
  // data.analytics.pageViews and data.analytics.revenueUSD are strictly typed!
</script>

<div class="dashboard">
  <h2>Revenue: ${data.analytics.revenueUSD.toLocaleString()}</h2>
  <p>Views: {data.analytics.pageViews}</p>
</div>
```

If you add a new property in `+page.server.ts`, SvelteKit updates `./$types` instantaneously in the background, updating your IDE autocompletion in real time.

## Typed API Contracts & Services

Centralize shared domain contracts in `src/lib/types/` so that frontend components, SvelteKit load functions, and backend API endpoints share the exact same entity definitions:

```typescript
// src/lib/types/invoice.ts
export interface InvoiceItem {
  description: string
  quantity: number
  unitPriceCents: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  items: InvoiceItem[]
  issuedDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
}
```

## Best Practices

- **Run `svelte-check` in CI/CD**: Ensure `npx svelte-check --tsconfig ./tsconfig.json` is executed on every Pull Request to prevent type regressions.
- **Always Use SvelteKit `./$types`**: Never manually define `PageData` interfaces when SvelteKit automatically generates precise types for each route.
- **Leverage Generic Components for UI Primitives**: Use `<script lang="ts" generics="T">` when building Selects, Dropdowns, and Table grids.
- **Avoid `any` Type Casts**: Use `unknown` with type guards or discriminated union types rather than casting with `any`.

## Summary

TypeScript elevates Svelte 5 and SvelteKit development into a robust, enterprise-ready engineering environment. By combining strictly typed `$props()` interfaces, generic components, automatic SvelteKit `./$types` inference, and `svelte-check` verification, you can build large-scale applications with absolute reliability and refactoring confidence.
