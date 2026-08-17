---
title: 'SvelteKit Backend & API Routes'
description: 'Build backend REST APIs with SvelteKit +server.ts endpoints: GET/POST/PUT/DELETE handlers, json() responses, secure cookie management, session auth, and error handling.'
order: 13
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/10-sveltekit
  - /learn/svelte/11-data-fetching
---

# SvelteKit Backend & API Routes

In addition to serving HTML pages, modern web applications frequently need to act as backend API servers: exposing RESTful JSON endpoints for mobile apps, handling webhook callbacks from third-party services (like Stripe or GitHub), processing authenticated AJAX requests, and managing secure HTTP-only session cookies.

SvelteKit provides native backend API routing through **`+server.ts`** files. Any folder in `src/routes/` containing a `+server.ts` file becomes an instant backend HTTP endpoint, capable of handling standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with complete TypeScript type safety and zero external server boilerplate.

In this lesson, we will explore SvelteKit API routing, dissect HTTP handler functions, parse request bodies and query parameters, manage secure cookies, and implement an authenticated CRUD API.

## Anatomy of a `+server.ts` Endpoint

An API route in SvelteKit exports functions named after the HTTP methods they handle: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`.

Each handler receives a `RequestEvent` object containing the standard web `Request`, URL, dynamic route parameters, cookies, and server locals, and must return a standard web `Response` (or SvelteKit's `json()` helper):

```typescript
// src/routes/api/health/+server.ts
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  return json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  })
}
```

When a client makes a GET request to `/api/health`, SvelteKit executes the `GET` handler and responds with `Content-Type: application/json`.

## Handling GET, POST, and Dynamic Parameters

Let's build an API endpoint that handles fetching and creating user records at `/api/users`:

```typescript
// src/routes/api/users/+server.ts
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

interface UserRecord {
  id: string
  username: string
  email: string
  role: 'admin' | 'developer'
}

const mockDatabase: UserRecord[] = [
  { id: '1', username: 'hesam', email: 'hesam@dev.com', role: 'admin' },
  { id: '2', username: 'alex', email: 'alex@dev.com', role: 'developer' },
]

// GET /api/users?role=admin
export const GET: RequestHandler = async ({ url }) => {
  const roleFilter = url.searchParams.get('role')

  if (roleFilter) {
    const filtered = mockDatabase.filter(u => u.role === roleFilter)
    return json({ users: filtered, total: filtered.length })
  }

  return json({ users: mockDatabase, total: mockDatabase.length })
}

// POST /api/users (JSON payload)
export const POST: RequestHandler = async ({ request }) => {
  let body: Partial<UserRecord>
  
  try {
    body = await request.json()
  } catch {
    throw error(400, 'Invalid JSON payload in request body.')
  }

  if (!body.username || !body.email) {
    throw error(422, 'Username and email are required fields.')
  }

  const newUser: UserRecord = {
    id: crypto.randomUUID(),
    username: body.username,
    email: body.email,
    role: body.role ?? 'developer',
  }

  mockDatabase.push(newUser)

  return json(newUser, { status: 201 })
}
```

### Dynamic Item Endpoints (`/api/users/[id]`)
For individual resource mutations (`PUT`, `DELETE`), create dynamic route folders:

```typescript
// src/routes/api/users/[id]/+server.ts
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// DELETE /api/users/:id
export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params
  const index = mockDatabase.findIndex(u => u.id === id)

  if (index === -1) {
    throw error(404, `User with ID ${id} not found.`)
  }

  mockDatabase.splice(index, 1)
  return json({ success: true, message: `User ${id} deleted.` })
}
```

## Cookie Management & Session Security

SvelteKit provides a secure `cookies` API on the `RequestEvent` for setting, reading, and deleting HTTP cookies:

```typescript
// src/routes/api/auth/login/+server.ts
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { email, password } = await request.json()

  // Validate credentials...
  if (email !== 'admin@front-heaven.dev' || password !== 'Secret123!') {
    throw error(401, 'Invalid email or password.')
  }

  const sessionToken = crypto.randomUUID()

  // Set secure HTTP-only cookie
  cookies.set('session_token', sessionToken, {
    path: '/',
    httpOnly: true, // Prevents XSS scripts from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Transmit only over HTTPS
    sameSite: 'lax', // Protects against CSRF
    maxAge: 60 * 60 * 24 * 7, // 1 week duration in seconds
  })

  return json({ message: 'Authentication successful', user: { email, role: 'admin' } })
}
```

To log a user out:
```typescript
// src/routes/api/auth/logout/+server.ts
export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('session_token', { path: '/' })
  return json({ success: true })
}
```

## Parsing Headers and Authorization Tokens

If your API receives Bearer tokens from external mobile clients or webhook providers:

```typescript
// src/routes/api/webhook/stripe/+server.ts
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  const signature = request.headers.get('stripe-signature')
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw error(401, 'Missing or malformed Authorization header.')
  }

  const rawBody = await request.text()
  // Verify cryptographic signature...

  return json({ received: true })
}
```

## Best Practices

- **Use the `json()` Helper**: Always return JSON payloads using SvelteKit's `json(data, { status })` rather than manually calling `new Response(JSON.stringify(data))`.
- **Set `httpOnly` on Authentication Cookies**: Prevent token theft via Cross-Site Scripting (XSS) by always enabling `httpOnly: true`.
- **Validate Content-Type and Payloads**: Wrap `await request.json()` in a `try...catch` block to handle malformed JSON requests gracefully.
- **Throw Semantic SvelteKit Errors**: Use `throw error(status, message)` to ensure clean JSON error payloads with standard HTTP status codes.

## Summary

Backend API routing in SvelteKit combines the power of full-stack Node.js and edge computing with web-standard `Request` and `Response` interfaces. By mastering `+server.ts` endpoints, HTTP verb handlers, secure cookie sessions, and JSON responses, you can construct complete full-stack web applications and microservices within a single unified codebase.
