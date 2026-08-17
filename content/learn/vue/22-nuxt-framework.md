---
title: 'The Nuxt Full-Stack Framework'
description: 'Complete guide to Nuxt 3 / 4: file-based routing, Nitro server engine, useFetch and useAsyncData data fetching, layouts, middleware, hybrid rendering, SEO meta, and deployment.'
order: 22
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/vue/12-vue-router
  - /learn/vue/14-api-and-backend-integration
  - /learn/vue/15-typescript-with-vue
---

# The Nuxt Full-Stack Framework

While Vue 3 excels as a client-side library and Single Page Application (SPA) foundation, building production-grade web applications often requires full-stack capabilities: Server-Side Rendering (SSR) for search engine optimization (SEO), Static Site Generation (SSG), automatic file-based routing, zero-config code splitting, edge computing, and unified backend API routes.

**Nuxt** is the official, intuitive full-stack framework for Vue.js. Powered by the high-performance **Nitro** server engine and Vite, Nuxt provides a batteries-included ecosystem that streamlines frontend and full-stack development.

In this lesson, we will explore Nuxt architecture, master file-based routing, build server routes and API endpoints, perform server-side data fetching with `useFetch` and `useAsyncData`, configure hybrid rendering with `routeRules`, and deploy to production edge environments.

## What is Nuxt? The Full-Stack Vue Framework

Nuxt enhances Vue 3 by introducing structured conventions and automated features:
1. **Zero-Boilerplate File-Based Routing**: Pages placed in the `pages/` directory automatically generate Vue Router route records.
2. **Hybrid Rendering Engine**: Choose SSR, SSG, SPA, or ISR (Incremental Static Regeneration) on a per-route basis.
3. **Automated Auto-Imports**: Vue reactivity primitives (`ref`, `computed`, `watch`), Nuxt composables (`useFetch`, `useRoute`), and your custom `composables/` and `components/` are automatically imported without manual `import { ... }` statements.
4. **Unified Full-Stack Nitro Engine**: Write backend API endpoints and server middleware directly in `server/api/` running on Node.js, Vercel, or Cloudflare Workers.
5. **Universal SEO Engine**: First-class `useSeoMeta` and `useHead` for dynamic Open Graph tags, canonical URLs, and structured data.

## Anatomy of a Nuxt Project Structure

A modern Nuxt application organizes features by convention:

```text
my-nuxt-app/
├── nuxt.config.ts        # Global Nuxt configuration and modules
├── app.vue               # Main application shell (contains <NuxtPage />)
├── pages/                # File-based routes
│   ├── index.vue         # Route: /
│   ├── about.vue         # Route: /about
│   └── users/
│       └── [id].vue      # Dynamic Route: /users/:id
├── layouts/              # Reusable page layouts
│   ├── default.vue       # Default layout (<slot />)
│   └── admin.vue         # Admin dashboard layout
├── components/           # Auto-imported Vue components
├── composables/          # Auto-imported Composition API functions
├── server/               # Nitro backend engine
│   ├── api/              # API endpoints (e.g. /api/users)
│   ├── middleware/       # Server request interceptors
│   └── routes/           # Raw server routes
└── public/               # Static assets served at root /
```

## File-Based Routing and Dynamic Parameters

Nuxt translates your `pages/` directory into Vue Router configurations automatically:

- **Static Pages**: `pages/contact.vue` → `/contact`
- **Dynamic Parameters**: `pages/lessons/[slug].vue` → `/lessons/:slug`
- **Nested Directory Routes**: `pages/admin/settings.vue` → `/admin/settings`
- **Catch-All 404 Pages**: `pages/[...all].vue` → matches all unresolved routes

Access dynamic route parameters in `<script setup>` with `useRoute()`:

```vue
<!-- pages/lessons/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const lessonSlug = computed(() => route.params.slug as string)
</script>

<template>
  <div class="lesson-page">
    <h1>Lesson: {{ lessonSlug }}</h1>
  </div>
</template>
```

## Layouts and Route Middleware

### 1. Reusable Layouts (`layouts/`)
Layouts wrap pages with persistent navigation, sidebars, and footers:

```vue
<!-- layouts/default.vue -->
<template>
  <div class="site-shell min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot /> <!-- Page content renders here -->
    </main>
    <AppFooter />
  </div>
</template>
```

Pages declare their layout using `definePageMeta`:
```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>
```

### 2. Route Middleware (`middleware/`)
Route middleware runs before navigating to a page:

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
```

Attach middleware to pages in `definePageMeta`:
```typescript
definePageMeta({
  middleware: ['auth']
})
```

## Server Engine (Nitro): API Routes & Handlers

Nuxt includes **Nitro**, an ultra-fast full-stack server engine. Any file in `server/api/` becomes an instant backend HTTP endpoint:

```typescript
// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  // Extract dynamic route param
  const id = getRouterParam(event, 'id')
  
  // Extract query params
  const query = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  // Fetch from database or remote service
  return {
    id,
    name: 'Hesam Pourabbasian',
    role: 'Architect',
    fetchedAt: new Date().toISOString()
  }
})
```

POST endpoint with request body parsing:
```typescript
// server/api/orders.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate and process order
  return { success: true, orderId: 'ord_' + Math.random().toString(36).substring(2) }
})
```

## Universal Data Fetching: `useFetch` and `useAsyncData`

In SSR applications, data fetching must execute on the server during the initial HTML render, serialize into the HTML payload, and **hydrate on the client without duplicate network requests**.

Nuxt provides `useFetch` and `useAsyncData` to solve this seamlessly:

```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
interface UserStats {
  views: number
  completions: number
}

// Automatically runs on server during SSR, transfers payload to client!
const { data: stats, status, error, refresh } = await useFetch<UserStats>('/api/analytics', {
  lazy: false, // await resolution before rendering page
  server: true, // execute on server
  headers: {
    'X-Client-Platform': 'Nuxt-Web'
  }
})
</script>

<template>
  <div class="analytics-view">
    <div v-if="status === 'pending'">Loading metrics...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="stats" class="grid grid-cols-2 gap-4">
      <div class="metric-card">Views: {{ stats.views }}</div>
      <div class="metric-card">Completions: {{ stats.completions }}</div>
      <button @click="() => refresh()">Refresh Data</button>
    </div>
  </div>
</template>
```

## Hybrid Rendering & `routeRules`

In `nuxt.config.ts`, you can configure different rendering strategies per route path using `routeRules`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/content'],
  
  routeRules: {
    // 1. Homepage pre-rendered at build time (SSG)
    '/': { prerender: true },

    // 2. Documentation cached with SWR for 1 hour on edge CDN
    '/docs/**': { swr: 3600 },

    // 3. Admin dashboard rendered as pure Client-Side SPA (no SSR)
    '/admin/**': { ssr: false },

    // 4. API routes with CORS enabled
    '/api/**': { cors: true },

    // 5. Old URL redirect
    '/old-curriculum': { redirect: { to: '/roadmap', statusCode: 301 } },
  },
})
```

## SEO Optimization with `useSeoMeta`

Nuxt provides full search engine optimization and social sharing tag management:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Front-End Learning Roadmap — Front-Heaven',
  description: 'Master modern frontend development from beginner to architect.',
  ogTitle: 'Front-End Learning Roadmap',
  ogDescription: 'Interactive step-by-step curriculum for modern software engineers.',
  ogImage: 'https://front-heaven.dev/og-cover.png',
  ogUrl: 'https://front-heaven.dev',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://front-heaven.dev/roadmap' }],
  htmlAttrs: { lang: 'en' },
})
</script>
```

## Best Practices

- **Always Use `useFetch` for Universal Data Fetching**: Never use raw `axios` or `window.fetch` inside component setup roots during SSR, as this causes duplicate requests and hydration mismatch warnings.
- **Isolate Sensitive Secrets in `runtimeConfig`**: Place private API keys in `runtimeConfig.apiSecretKey` (server-only) and only expose public tokens in `runtimeConfig.public`.
- **Leverage Route Rules for Blazing Edge Performance**: Prerender static marketing pages (`prerender: true`) and apply SWR caching to dynamic content (`swr: 3600`).
- **Structure API Handlers with Nitro**: Co-locate server routes in `server/api/` with strict TypeScript types for end-to-end type safety between client and server.

## Summary

Nuxt transforms Vue 3 into a complete, enterprise-grade full-stack framework. With automated file-based routing, Nitro backend handlers, universal `useFetch` data caching, hybrid rendering strategies, and built-in SEO tools, Nuxt provides the ultimate architecture for high-performance web applications.
