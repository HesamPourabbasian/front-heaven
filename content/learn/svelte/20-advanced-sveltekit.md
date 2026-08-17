---
title: 'Advanced SvelteKit: Hooks, SSR & Hybrid Rendering'
description: 'Master advanced SvelteKit architecture: Server Hooks (hooks.server.ts), sequence middleware, App.Locals, server-only modules ($lib/server), and hybrid SSR/SSG rendering.'
order: 20
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/svelte/10-sveltekit
  - /learn/svelte/11-data-fetching
  - /learn/svelte/13-api-and-backend
---

# Advanced SvelteKit: Hooks, SSR & Hybrid Rendering

Building enterprise full-stack web platforms requires sophisticated request lifecycle interception, server-side authentication middleware, strict isolation between server secrets and client bundles, and granular control over rendering strategies per route. SvelteKit provides a comprehensive suite of advanced full-stack features centered around **Server Hooks**, **Request Locals (`App.Locals`)**, and **Hybrid Rendering configurations**.

In this lesson, we will explore SvelteKit's rendering paradigms (SSR, SSG, CSR, Prerendering), safeguard server secrets using `$lib/server`, master the `handle` server hook lifecycle, compose middleware using `sequence()`, manage authenticated user contexts via `event.locals`, and implement global server error trackers.

## Hybrid Rendering Strategies in SvelteKit

SvelteKit allows you to configure the rendering strategy for each page individually by exporting route configuration constants from `+page.ts` or `+page.server.ts`:

### 1. Static Site Generation (SSG / Prerendering)
For marketing pages, documentation, and blog posts that change only when code or content is published, enable prerendering to output static HTML at build time:

```typescript
// src/routes/docs/+page.ts
export const prerender = true // Built into static HTML files served via CDN
```

### 2. Client-Side Only (SPA Mode)
For heavy interactive dashboards behind an authentication wall that do not require SEO indexing, disable SSR to run as a pure Single Page Application:

```typescript
// src/routes/(app)/editor/+page.ts
export const ssr = false // Disables SSR, rendering exclusively on the client
```

### 3. Server-Side Rendering (SSR / Universal - Default)
By default, SvelteKit renders pages on the server during initial load and hydrates on the client for subsequent navigations, delivering optimal First Contentful Paint and full SEO crawler support.

## Server-Only Modules: Preventing Secret Leaks with `$lib/server`

A critical security danger in full-stack frameworks is accidentally importing private database connection pools, private API keys, or password hashing libraries into client-side component files.

SvelteKit prevents this with the **`$lib/server`** convention:
- Any file placed in `src/lib/server/` is strictly designated as **server-only**.
- If any client-facing file (`+page.svelte`, `+page.ts`, or client composables) attempts to import from `$lib/server`, the SvelteKit compiler will fail the build with a compile-time security error!

```typescript
// src/lib/server/database.ts
import { Pool } from 'pg'
import { env } from '$env/dynamic/private'

// Safe: database pool and private credentials can NEVER leak to client bundles
export const db = new Pool({
  connectionString: env.DATABASE_URL,
})
```

## SvelteKit Server Hooks (`src/hooks.server.ts`)

Server Hooks act as global middleware for your SvelteKit backend, executing on every incoming HTTP request before it reaches any `load()` function or `+server.ts` route.

The primary hook is **`handle`**:

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const start = performance.now()

  // 1. Process request (e.g. read cookies, authenticate user)
  const sessionToken = event.cookies.get('session_id')
  if (sessionToken) {
    event.locals.user = await validateSessionInDB(sessionToken)
  } else {
    event.locals.user = null
  }

  // 2. Pass request downstream to target page load function or API route
  const response = await resolve(event, {
    // Optionally transform rendered HTML (e.g. inject dynamic theme class)
    transformPageChunk: ({ html }) => html.replace('%APP_THEME%', 'dark')
  })

  // 3. Post-processing (e.g. logging response latency)
  const elapsed = Math.round(performance.now() - start)
  response.headers.set('X-Response-Time', `${elapsed}ms`)

  return response
}
```

## Typing Request Locals with `App.Locals`

To pass authenticated user data or request context from `hooks.server.ts` into page load functions with 100% TypeScript type safety, define the shape of `App.Locals` in `src/app.d.ts`:

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface UserSession {
      id: string
      email: string
      role: 'admin' | 'editor' | 'member'
    }

    interface Locals {
      user: UserSession | null
      requestId: string
    }
  }
}

export {}
```

Now, inside any `+page.server.ts`, accessing `event.locals.user` provides complete autocompletion and type checking:

```typescript
// src/routes/admin/+page.server.ts
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== 'admin') {
    throw error(403, 'Forbidden: Admin access required.')
  }

  return { adminEmail: locals.user.email }
}
```

## Composing Multiple Middleware with `sequence()`

When managing authentication, logging, internationalization, and CORS in large applications, monolithic `handle` functions quickly become difficult to maintain.

Use the **`sequence()`** helper from `@sveltejs/kit/hooks` to chain modular middleware functions:

```typescript
// src/hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle } from '@sveltejs/kit'

const loggingHandle: Handle = async ({ event, resolve }) => {
  console.log(`[${new Date().toISOString()}] ${event.request.method} ${event.url.pathname}`)
  return resolve(event)
}

const authHandle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_id')
  event.locals.user = token ? await fetchUserFromToken(token) : null
  return resolve(event)
}

const securityHeadersHandle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}

// Chain middleware in sequential order
export const handle = sequence(loggingHandle, authHandle, securityHeadersHandle)
```

## Global Error Tracking with `handleError`

To catch and log unhandled exceptions occurring during Server-Side Rendering or server route execution (e.g. sending stack traces to Sentry), export the `handleError` hook:

```typescript
// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit'

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
  const errorId = crypto.randomUUID()

  // Log error to telemetry or Sentry
  console.error(`[Server Error ID: ${errorId}] at ${event.url.pathname}:`, error)

  // Return sanitized error object to client (never expose raw internal database stack traces!)
  return {
    message: status === 404 ? 'Page not found' : 'An internal server error occurred.',
    errorId,
  }
}
```

## Best Practices

- **Place All Database Code in `$lib/server`**: Ensure database drivers, private tokens, and internal server helpers are located in `src/lib/server/` to trigger compiler protection against client bundling.
- **Centralize Authentication in Server Hooks**: Validate user sessions once in `hooks.server.ts` and attach the result to `event.locals.user`.
- **Use `sequence()` for Modular Middleware**: Separate distinct concerns (auth, telemetry, headers) into independent handle functions.
- **Sanitize Production Errors in `handleError`**: Never expose raw database error messages or internal server paths to users.

## Summary

Advanced SvelteKit architecture gives you total control over the full-stack request lifecycle. By mastering Server Hooks (`handle`, `handleError`), chaining middleware with `sequence()`, typing `App.Locals`, strictly isolating server code with `$lib/server`, and tailoring route rendering modes (SSR, SSG, CSR), you can engineer secure, enterprise-ready full-stack applications.
