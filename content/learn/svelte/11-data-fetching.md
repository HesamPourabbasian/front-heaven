---
title: 'SvelteKit Data Fetching & Load Functions'
description: 'Master data loading in SvelteKit: +page.server.ts, +page.ts load functions, layout data inheritance, event.fetch, URLSearchParams filtering, and loading state UX.'
order: 11
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/10-sveltekit
---

# SvelteKit Data Fetching & Load Functions

Data loading is a fundamental responsibility of any full-stack web framework. In traditional Single Page Applications (SPAs), components mount empty shells and trigger client-side `fetch()` requests inside lifecycle hooks, causing visible layout shifts, flashing loading spinners, and poor search engine crawlability.

SvelteKit solves this by providing a unified **`load()` function pipeline**. SvelteKit fetches all required data *before* rendering the target page, executing securely on the server during initial page requests and hydrating seamlessly on the client during client-side navigation.

In this lesson, we will explore universal `+page.ts` versus server-only `+page.server.ts` load functions, layout data inheritance, the special `event.fetch` wrapper, handling errors and redirects, URL search parameters for pagination and filtering, and displaying navigation loading indicators.

## The Architecture of SvelteKit `load()` Functions

SvelteKit provides two distinct types of `load` files:

1. **Server Load Functions (`+page.server.ts` / `+layout.server.ts`)**:
   - Executes **exclusively on the server** (Node.js, edge worker, or serverless function).
   - Safe to query databases directly (PostgreSQL, SQLite, Prisma, Drizzle) and read private environment secrets.
   - Code written here is **never bundled into client JavaScript**.
2. **Universal Load Functions (`+page.ts` / `+layout.ts`)**:
   - Executes on the server during the initial Server-Side Render (SSR).
   - Executes on the browser client during subsequent client-side page navigations.
   - Ideal for calling public REST APIs or when data can be fetched directly from the browser.

## Server-Only Data Fetching (`+page.server.ts`)

Let's load a list of articles directly from a database or secure backend service:

```typescript
// src/routes/articles/+page.server.ts
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export interface Article {
  id: string
  title: string
  snippet: string
  publishedAt: string
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  const sessionId = cookies.get('session_id')

  try {
    // Direct database query or private API call
    const articles: Article[] = [
      { id: '1', title: 'Svelte 5 Runes In Depth', snippet: 'A guide to universal signals.', publishedAt: '2026-08-15' },
      { id: '2', title: 'SvelteKit Full-Stack Mastery', snippet: 'Building scalable architectures.', publishedAt: '2026-08-16' },
    ]

    return {
      articles,
      isLoggedIn: Boolean(sessionId),
    }
  } catch (err) {
    throw error(500, 'Could not retrieve articles from database.')
  }
}
```

In the corresponding `+page.svelte`, the returned payload is automatically available as the `data` prop:

```svelte
<!-- src/routes/articles/+page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<div class="articles-view">
  <h1>Published Articles</h1>
  <p>User Session Active: {data.isLoggedIn ? 'Yes' : 'Guest'}</p>

  <div class="grid gap-4 mt-6">
    {#each data.articles as article (article.id)}
      <article class="p-4 border rounded-xl bg-surface">
        <h3>{article.title}</h3>
        <p class="text-muted">{article.snippet}</p>
        <span class="text-xs text-muted">{article.publishedAt}</span>
      </article>
    {/each}
  </div>
</div>
```

## Layout Data Inheritance

Data returned from a `+layout.server.ts` or `+layout.ts` file is automatically passed down and merged into **all child pages and nested layouts**:

```typescript
// src/routes/+layout.server.ts (Root Layout Loader)
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    currentUser: locals.user ?? null,
    siteTheme: 'dark',
  }
}
```

Any child page (e.g. `src/routes/dashboard/+page.svelte`) receives `data.currentUser` alongside its own page-specific data without re-fetching it!

## SvelteKit's Special `event.fetch`

When executing `fetch` inside a SvelteKit `load` function, **always use the `fetch` provided by the load event** (`({ fetch }) => ...`) rather than the native global `window.fetch`:

```typescript
// src/routes/products/+page.ts
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params }) => {
  // 1. Works seamlessly during SSR and on client
  // 2. Automatically forwards cookies and authorization headers
  // 3. Resolves internal relative paths (/api/products) without hardcoding domain names
  const response = await fetch('/api/products')
  
  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  const products = await response.json()
  return { products }
}
```

## Error Handling & Redirects

SvelteKit provides helper functions to handle control flow inside `load()`:

- **`error(status, message)`**: Halts page execution and renders the nearest `+error.svelte` boundary.
- **`redirect(status, location)`**: Immediately redirects the user (HTTP 303 or 307).

```typescript
// src/routes/dashboard/+page.server.ts
import { redirect, error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  // Redirect unauthenticated visitors to login
  if (!locals.user) {
    throw redirect(303, '/login?redirect=/dashboard')
  }

  // Check role authorization
  if (locals.user.role !== 'admin') {
    throw error(403, 'You do not have administrative permissions to view this dashboard.')
  }

  return { metrics: { activeUsers: 4500, mrr: 28000 } }
}
```

## URL Search Parameters for Pagination and Filtering

To implement search queries, category filters, and pagination that preserve state in the browser URL and support bookmarking, extract query parameters from `url.searchParams`:

```typescript
// src/routes/catalog/+page.server.ts
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q') || ''
  const category = url.searchParams.get('category') || 'all'
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const pageSize = 12

  // Query database using parsed URL parameters
  const { items, total } = await fetchCatalogFromDB({ query, category, page, pageSize })

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
    },
    activeFilters: { query, category },
  }
}
```

## Displaying Global Navigation Loading Indicators

When users navigate between routes that fetch data via `load()`, you can display a top progress bar or spinner using the `$app/state` `navigating` rune:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { navigating } from '$app/state'
  import type { Snippet } from 'svelte'

  let { children }: { children?: Snippet } = $props()
</script>

<!-- If a navigation is currently in-flight, display a high-visibility loading bar -->
{#if navigating.current}
  <div class="fixed top-0 left-0 right-0 h-1 bg-primary animate-pulse z-50"></div>
{/if}

{@render children?.()}
```

## Best Practices

- **Fetch Data in `load()` Rather Than `onMount()`**: Pre-fetching data in `load()` guarantees fast Server-Side Rendering and eliminates client-side layout shifts.
- **Use `+page.server.ts` for Sensitive Database Access**: Keep database credentials, private API keys, and SQL queries strictly inside `.server.ts` files.
- **Always Use `event.fetch`**: Benefit from cookie forwarding, internal relative routing, and server-side request deduplication by using the injected `fetch` argument.
- **Synchronize Filter State with URL Query Parameters**: Keep search filters and page numbers in `url.searchParams` so users can share, reload, and bookmark filtered views.

## Summary

Data loading in SvelteKit unifies server-side database access and client-side page transitions into a seamless, type-safe pipeline. By mastering `+page.server.ts`, layout inheritance, `event.fetch`, `error()`/`redirect()` helpers, and URL search parameters, you can build responsive, full-stack applications with exceptional user and developer ergonomics.
