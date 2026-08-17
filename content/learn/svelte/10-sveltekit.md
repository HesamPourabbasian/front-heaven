---
title: 'SvelteKit: The Full-Stack Svelte Framework'
description: 'Complete guide to SvelteKit: file-based routing, +page.svelte, +layout.svelte, dynamic route parameters, route groups, error handling with +error.svelte, and link preloading.'
order: 10
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/02-svelte-fundamentals
  - /learn/svelte/05-components
---

# SvelteKit: The Full-Stack Svelte Framework

While Svelte is a powerful component compiler for client-side user interfaces, building production-grade web applications requires a comprehensive application framework that handles routing, server-side rendering (SSR), static site generation (SSG), data loading pipelines, server form actions, API endpoints, and edge deployment.

**SvelteKit** is the official, full-stack application framework for Svelte. Maintained by the Svelte core team, SvelteKit delivers a cohesive developer experience with zero-configuration file-based routing, instant serverless/edge adapter support, and seamless progressive enhancement.

In this lesson, we will explore SvelteKit's project structure, file-based routing conventions, layout hierarchies, dynamic route parameters, route grouping, error boundaries, programmatic navigation, and intelligent link preloading.

## What is SvelteKit?

SvelteKit is to Svelte what Next.js is to React and Nuxt is to Vue. It provides the full-stack infrastructure necessary to build modern, production-ready web platforms:
1. **File-Based Routing**: Folders in `src/routes/` automatically define the application's URL paths.
2. **Universal Rendering Engine**: Seamlessly switch between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Single Page Application (SPA) modes per route.
3. **Data Loading Architecture**: Clean separation between server-only data fetching (`+page.server.ts`) and universal data loading (`+page.ts`).
4. **Form Actions with Progressive Enhancement**: Handle forms natively using HTTP POST actions with zero client-side JavaScript required, enhancing smoothly when JavaScript is active.
5. **Adapter Ecosystem**: Deploy anywhere—Vercel, Netlify, Cloudflare Workers, Node.js Docker containers, or static storage buckets—using official `@sveltejs/adapter-*` plugins.

## Anatomy of a SvelteKit Project Structure

A standard SvelteKit project organizes source code inside `src/`:

```text
my-sveltekit-app/
├── svelte.config.js      # Svelte compiler & SvelteKit adapter configuration
├── vite.config.ts        # Vite build tool plugins
├── package.json
├── static/               # Public static assets (favicon, robots.txt)
└── src/
    ├── app.html          # HTML page shell template (%sveltekit.head%, %sveltekit.body%)
    ├── app.d.ts          # Global TypeScript declarations (App.Locals, App.PageData)
    ├── lib/              # Reusable components & utilities (alias: $lib)
    └── routes/           # File-based routing directory
        ├── +layout.svelte       # Root application layout
        ├── +page.svelte         # Root page: /
        ├── about/
        │   └── +page.svelte     # Route: /about
        └── blog/
            ├── +page.svelte     # Route: /blog
            └── [slug]/
                ├── +page.server.ts # Server data loader
                └── +page.svelte # Dynamic Route: /blog/:slug
```

## SvelteKit Special File Conventions

In SvelteKit, routing is strictly directory-based, and special files starting with a plus sign `+` declare routing behaviors:

- **`+page.svelte`**: The visual UI component rendered for that route.
- **`+page.ts` / `+page.server.ts`**: Data loading functions and server actions for that page.
- **`+layout.svelte`**: UI shell that wraps the current page and all nested child routes.
- **`+layout.ts` / `+layout.server.ts`**: Shared data loader for the layout and its descendants.
- **`+error.svelte`**: Custom error UI rendered when a route fails or throws an HTTP error.
- **`+server.ts`**: Backend API endpoints handling raw HTTP verbs (`GET`, `POST`, `DELETE`).

## File-Based Routing & Dynamic Parameters

Directories nested inside `src/routes/` map directly to URL paths:

- `src/routes/contact/+page.svelte` $\rightarrow$ `/contact`
- `src/routes/settings/profile/+page.svelte` $\rightarrow$ `/settings/profile`

### Dynamic Route Parameters (`[param]`)
To match dynamic URL segments (e.g. `/users/42` or `/courses/svelte-5`), create a folder enclosed in square brackets `[slug]`:

```text
src/routes/courses/[courseId]/+page.svelte
```

In Svelte 5, the page component receives route parameters and loaded data via the `$props()` rune:

```svelte
<!-- src/routes/courses/[courseId]/+page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types'

  let { data, params }: PageProps = $props()
</script>

<div class="course-view">
  <h1>Viewing Course ID: {params.courseId}</h1>
</div>
```

## Layouts & Nested Layout Hierarchies

Layouts wrap pages with persistent navigation headers, sidebars, and footers. In Svelte 5, layouts render the active child page using the `children` snippet:

```svelte
<!-- src/routes/+layout.svelte (Root Layout) -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import '../app.css'
  import NavigationHeader from '$lib/components/NavigationHeader.svelte'

  let { children }: { children?: Snippet } = $props()
</script>

<div class="site-layout min-h-screen flex flex-col">
  <NavigationHeader />
  
  <main class="flex-1 max-w-7xl mx-auto w-full p-6">
    <!-- Active page content renders here -->
    {@render children?.()}
  </main>

  <footer class="border-t p-6 text-center text-xs text-muted">
    Front-Heaven SvelteKit Roadmap
  </footer>
</div>
```

Layouts can be nested indefinitely. For instance, `src/routes/admin/+layout.svelte` adds an admin sidebar that only applies to `/admin/*` sub-routes, inheriting the parent root layout automatically.

## Route Groups: `(groupName)`

Route groups allow you to organize routes into directories without altering the public URL structure. Folder names wrapped in parentheses—like `(app)` or `(marketing)`—are ignored by the URL router:

```text
src/routes/
├── (marketing)/
│   ├── +layout.svelte    # Marketing layout (Hero header, landing footer)
│   ├── +page.svelte      # Route: /
│   └── pricing/
│       └── +page.svelte  # Route: /pricing
└── (app)/
    ├── +layout.svelte    # Dashboard layout (Authenticated sidebar)
    ├── dashboard/
    │   └── +page.svelte  # Route: /dashboard
    └── settings/
        └── +page.svelte  # Route: /settings
```

This pattern allows distinct sections of your application to have completely different layout shells while keeping clean URL paths.

## Error Handling with `+error.svelte`

When a page throws an unhandled exception or when a data loader invokes `error(404, 'Not Found')`, SvelteKit stops rendering the broken page and displays the nearest `+error.svelte` component boundary:

```svelte
<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/state'
</script>

<div class="error-page text-center py-16">
  <h1 class="text-6xl font-black text-rose-500">{page.status}</h1>
  <p class="text-xl text-ink font-semibold mt-2">{page.error?.message}</p>
  <a href="/" class="btn-primary mt-6 inline-block">Return to Homepage</a>
</div>
```

## Programmatic Navigation and Link Preloading

### 1. Programmatic Navigation with `goto()`
To navigate programmatically after a button click or timer:

```typescript
import { goto, invalidate } from '$app/navigation'

async function handleCheckoutComplete() {
  await goto('/checkout/success', { replaceState: true })
}
```

### 2. Instant Preloading with `data-sveltekit-preload-data`
SvelteKit can fetch the JavaScript bundle and data for a target page the instant a user hovers their mouse over a link, reducing perceived navigation latency to $0\text{ ms}$:

```svelte
<!-- Preloads route code and data as soon as user hovers or taps the link -->
<a href="/roadmap" data-sveltekit-preload-data="hover">
  View Interactive Roadmap
</a>
```

You can also enable preloading globally on the `<body>` in `src/app.html`:
```html
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
```

## Best Practices

- **Use Route Groups for Layout Isolation**: Segment marketing pages `(marketing)` and internal applications `(app)` into separate route groups.
- **Enable Preloading on Critical Navigation Links**: Add `data-sveltekit-preload-data="hover"` to main navigation menus for instantaneous page transitions.
- **Provide Custom `+error.svelte` Boundaries**: Create informative error pages to handle 404s and 500s gracefully without crashing the application shell.
- **Use `$lib` Alias for Internal Imports**: Always import shared components using `$lib/components/...` rather than relative paths (`../../lib/...`).

## Summary

SvelteKit transforms Svelte into a complete, enterprise-grade full-stack platform. By mastering file-based routing conventions, layout hierarchies, route groups, error boundaries, programmatic navigation, and link preloading, you possess the full capability to build fast, scalable web applications.
