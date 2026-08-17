---
title: 'Intermediate SvelteKit Architecture Projects'
description: 'Build 8 production-grade intermediate SvelteKit applications: Full E-Commerce, Blog CMS, Admin Dashboard, Auth System, Expense Tracker, Movie Explorer, Social Feed, and SaaS Dashboard.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites:
  - /learn/svelte/10-sveltekit
  - /learn/svelte/11-data-fetching
  - /learn/svelte/12-form-actions
  - /learn/svelte/14-typescript
---

# Intermediate SvelteKit Architecture Projects

Building full-featured, multi-page applications transforms theoretical framework knowledge into professional frontend engineering mastery. Intermediate applications require careful planning around modular folder structures, Svelte 5 Rune state classes, server-side data loading pipelines, SvelteKit form actions with progressive enhancement, and error boundaries.

In this lesson, we examine the system architecture, state models, routing definitions, and implementation blueprints for 8 comprehensive intermediate SvelteKit applications.

## Project 1: Full E-Commerce Application

### Architecture Blueprint:
- **Routes**: Home (`/`), Products Catalog (`/products`), Product Detail (`/products/[id]`), Shopping Cart (`/cart`), Checkout (`/checkout`).
- **State**: Universal `CartStore` in `src/lib/stores/cart.svelte.ts` with local storage synchronization, quantity adjustments, tax calculations, and coupon codes.
- **Server Loaders**: `src/routes/products/+page.server.ts` fetching cached catalog data with category and price filters.

```typescript
// src/lib/stores/cart.svelte.ts
export interface CartProduct {
  id: string
  title: string
  price: number
  imageUrl: string
  quantity: number
}

class CartStore {
  items = $state<CartProduct[]>([])
  discountCode = $state<string | null>(null)

  subtotal = $derived(
    this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  discount = $derived(this.discountCode === 'HEAVEN20' ? this.subtotal * 0.2 : 0)
  tax = $derived((this.subtotal - this.discount) * 0.08)
  total = $derived(this.subtotal - this.discount + this.tax)

  addItem(product: Omit<CartProduct, 'quantity'>) {
    const existing = this.items.find(i => i.id === product.id)
    if (existing) existing.quantity++
    else this.items.push({ ...product, quantity: 1 })
  }

  updateQuantity(id: string, delta: number) {
    const item = this.items.find(i => i.id === id)
    if (!item) return
    item.quantity += delta
    if (item.quantity <= 0) this.items = this.items.filter(i => i.id !== id)
  }
}

export const cart = new CartStore()
```

## Project 2: Markdown Blog CMS with Reading Time

### Architecture Blueprint:
- **Routes**: Blog Index (`/blog`), Article Reader (`/blog/[slug]`), Category Filter (`/blog/category/[cat]`).
- **Features**: Server-side markdown frontmatter parsing, automatic reading time calculation composable, syntax-highlighted code blocks, and RSS feed generator in `src/routes/rss.xml/+server.ts`.

```typescript
// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params
  // Load markdown file content and metadata
  const post = await fetchPostBySlug(slug)

  if (!post) {
    throw error(404, `Article "${slug}" was not found.`)
  }

  const wordCount = post.content.split(/\s+/).length
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return { post, readingTimeMinutes }
}
```

## Project 3: Enterprise Admin Dashboard with Data Tables

### Architecture Blueprint:
- **Features**: Multi-column sorting, debounced search filters, server-side pagination, batch row selection, modal edit drawers using Svelte 5 Snippets.
- **Server Actions**: `src/routes/admin/users/+page.server.ts` managing user deletion, role updates, and password resets with `fail()` validation.

```svelte
<!-- src/routes/admin/users/+page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types'
  import { enhance } from '$app/forms'

  let { data, form }: PageProps = $props()
  let selectedUserIds = $state<string[]>([])
</script>

<div class="admin-panel">
  <div class="header-actions">
    <h2>User Administration ({data.totalUsers})</h2>
    <form method="POST" action="?/bulkDelete" use:enhance>
      <input type="hidden" name="ids" value={JSON.stringify(selectedUserIds)} />
      <button type="submit" disabled={selectedUserIds.length === 0} class="btn-danger">
        Delete Selected ({selectedUserIds.length})
      </button>
    </form>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th>Select</th>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each data.users as user (user.id)}
        <tr>
          <td><input type="checkbox" value={user.id} bind:group={selectedUserIds} /></td>
          <td><strong>{user.username}</strong></td>
          <td>{user.email}</td>
          <td><span class="role-chip">{user.role}</span></td>
          <td>{user.isActive ? 'Active' : 'Disabled'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
```

## Project 4: Full Authentication System with Server Hooks

### Architecture Blueprint:
- **Server Hooks**: `src/hooks.server.ts` intercepts all incoming requests, validates session cookies, and populates `event.locals.user`.
- **Route Guards**: Protected routes (`src/routes/(app)/*`) automatically redirect unauthenticated guests to `/login`.
- **Actions**: `login`, `register`, and `logout` actions with `httpOnly` secure cookies.

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get('session_token')

  if (sessionToken) {
    // Validate session in database and attach user to locals
    event.locals.user = await validateSession(sessionToken)
  } else {
    event.locals.user = null
  }

  // Guard protected routes
  if (event.url.pathname.startsWith('/dashboard') && !event.locals.user) {
    throw redirect(303, `/login?redirect=${event.url.pathname}`)
  }

  return resolve(event)
}
```

## Project 5: Personal Expense Tracker with Budget Alerts

### Architecture Blueprint:
- **Features**: Category budget threshold bars, monthly spending breakdown, CSV data export, transaction ledger.
- **State**: Reactive budget calculations deriving remaining balances and warning when expenses exceed 85% of monthly income.

```typescript
// src/lib/stores/expenseLedger.svelte.ts
export interface ExpenseRecord {
  id: string
  title: string
  amount: number
  category: 'Housing' | 'Food' | 'Tech' | 'Transport'
  date: string
}

class ExpenseStore {
  records = $state<ExpenseRecord[]>([])
  monthlyBudget = $state(3200)

  totalSpent = $derived(this.records.reduce((sum, r) => sum + r.amount, 0))
  remainingBudget = $derived(this.monthlyBudget - this.totalSpent)
  isNearBudgetLimit = $derived(this.totalSpent / this.monthlyBudget >= 0.85)

  addExpense(expense: Omit<ExpenseRecord, 'id'>) {
    this.records.unshift({ id: crypto.randomUUID(), ...expense })
  }
}

export const expenseLedger = new ExpenseStore()
```

## Project 6: Movie Explorer with Trailer Modal

### Architecture Blueprint:
- **Features**: Search input with debounced API queries, watchlist toggle saved in Svelte 5 state, movie detail view, dynamic video trailer modal inside `<svelte:window>`.

```svelte
<!-- src/lib/components/MovieCard.svelte -->
<script lang="ts">
  interface Movie {
    id: number
    title: string
    poster: string
    rating: number
    releaseYear: string
  }

  let { movie, isWatchlisted, onToggleWatchlist }: {
    movie: Movie
    isWatchlisted: boolean
    onToggleWatchlist: (id: number) => void
  } = $props()
</script>

<div class="movie-card">
  <img src={movie.poster} alt={movie.title} />
  <button class="favorite-star" onclick={() => onToggleWatchlist(movie.id)}>
    {isWatchlisted ? '★' : '☆'}
  </button>
  <div class="p-3">
    <h4>{movie.title} ({movie.releaseYear})</h4>
    <span class="rating">★ {movie.rating.toFixed(1)}</span>
  </div>
</div>
```

## Project 7: Real-Time Social Media Feed

### Architecture Blueprint:
- **Features**: Virtualized infinite scroll feed using `IntersectionObserver`, optimistic post likes with automatic rollback on network failure, comment slide-over drawer with FLIP animations.

```svelte
<!-- src/lib/components/FeedPost.svelte -->
<script lang="ts">
  interface Post {
    id: string
    author: string
    content: string
    likesCount: number
    hasLiked: boolean
  }

  let { post }: { post: Post } = $props()

  async function toggleLike() {
    // 1. Optimistic UI update
    const prevCount = post.likesCount
    const prevLiked = post.hasLiked

    post.hasLiked = !prevLiked
    post.likesCount += post.hasLiked ? 1 : -1

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
      if (!res.ok) throw new Error()
    } catch {
      // 2. Rollback on failure
      post.likesCount = prevCount
      post.hasLiked = prevLiked
      alert('Network error: like action rolled back.')
    }
  }
</script>

<article class="feed-post border rounded-2xl p-4 bg-surface">
  <header class="flex justify-between font-bold text-sm">
    <span>@{post.author}</span>
  </header>
  <p class="mt-2 text-ink">{post.content}</p>
  <footer class="mt-4 flex gap-4 text-xs text-muted">
    <button onclick={toggleLike} class:text-rose-500={post.hasLiked}>
      ♥ {post.likesCount}
    </button>
  </footer>
</article>
```

## Project 8: Multi-Tenant SaaS Analytics Dashboard

### Architecture Blueprint:
- **Features**: Four core metric KPI summary cards with percentage comparisons, date range filter selector, notification bell dropdown with real-time badge count, dark mode theming.
- **Layout**: Collapsible sidebar navigation, persistent header shell, and breadcrumbs navigation.

```svelte
<!-- src/routes/(app)/dashboard/+page.svelte -->
<script lang="ts">
  let selectedRange = $state('30d')
</script>

<div class="dashboard-overview space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold">Analytics Overview</h1>
      <p class="text-xs text-muted">Subscription performance and revenue metrics.</p>
    </div>
    <select bind:value={selectedRange} class="p-2 border rounded-xl bg-surface">
      <option value="7d">Last 7 Days</option>
      <option value="30d">Last 30 Days</option>
      <option value="90d">Last 90 Days</option>
    </select>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="metric-card p-4 border rounded-2xl bg-surface">
      <span class="text-xs text-muted font-bold uppercase">Monthly Recurring Revenue</span>
      <div class="text-2xl font-black text-ink mt-1">$36,400</div>
      <span class="text-xs text-emerald-600 font-bold">↑ +14.2%</span>
    </div>
    <div class="metric-card p-4 border rounded-2xl bg-surface">
      <span class="text-xs text-muted font-bold uppercase">Active Subscribers</span>
      <div class="text-2xl font-black text-ink mt-1">1,240</div>
      <span class="text-xs text-emerald-600 font-bold">↑ +6.8%</span>
    </div>
    <div class="metric-card p-4 border rounded-2xl bg-surface">
      <span class="text-xs text-muted font-bold uppercase">Churn Rate</span>
      <div class="text-2xl font-black text-ink mt-1">1.6%</div>
      <span class="text-xs text-emerald-600 font-bold">↓ -0.3%</span>
    </div>
    <div class="metric-card p-4 border rounded-2xl bg-surface">
      <span class="text-xs text-muted font-bold uppercase">Lifetime Value</span>
      <div class="text-2xl font-black text-ink mt-1">$940</div>
      <span class="text-xs text-emerald-600 font-bold">↑ +8.5%</span>
    </div>
  </div>
</div>
```

## Best Practices

- **Adopt Universal State Classes**: Use `.svelte.ts` state classes with `$state` and `$derived` for clear, scalable domain state management.
- **Implement Optimistic UI with Rollbacks**: Give users instant feedback while guarding against network failures with clean try/catch rollbacks.
- **Enforce Authentication in `hooks.server.ts`**: Centralize session verification in server hooks rather than duplicating checks in every page loader.
- **Decompose Large Screens into Reusable Primitives**: Break large views into subcomponents and Snippets to keep code maintainable.

## Summary

These 8 intermediate SvelteKit projects cover the core architectural pillars of modern full-stack web engineering: e-commerce workflows, server-side data loading, progressive form actions, authentication hooks, and analytics dashboards. With Level 2 mastered, you are prepared to advance to Level 3: Advanced Svelte Internals, Full-Stack Databases, and Enterprise Production Architecture.
