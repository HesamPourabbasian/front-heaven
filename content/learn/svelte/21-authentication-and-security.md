---
title: 'Authentication & Security in SvelteKit'
description: 'Master enterprise web application security: session authentication, OAuth PKCE, XSS prevention, CSRF mitigation, Zod input validation, secure cookies, and environment secret protection.'
order: 21
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/svelte/12-form-actions
  - /learn/svelte/20-advanced-sveltekit
---

# Authentication & Security in SvelteKit

Security is an essential quality standard in modern web applications. Because frontend code executes directly within the user's browser, vulnerable web applications expose sensitive user credentials, session tokens, personal identifiable information (PII), and proprietary business data to malicious attackers.

In this lesson, we will explore full-stack security in SvelteKit: session authentication architectures, OAuth 2.0 with PKCE, Cross-Site Scripting (XSS) prevention with `@html` sanitization, Cross-Site Request Forgery (CSRF) mitigation, Zod schema validation, secure cookie configuration, and environment variable secret protection.

## Session-Based vs JWT Cookie Authentication

When designing authentication systems in SvelteKit:

### 1. Database-Backed Session Cookies (Recommended)
- The server generates a cryptographically random session ID upon login, stores it in a database table (e.g. Redis, PostgreSQL), and sets the ID in an `httpOnly`, `Secure`, `SameSite=Lax` cookie.
- On every request, `hooks.server.ts` validates the session ID against the database.
- **Advantage**: Sessions can be revoked instantly (e.g. "Log out of all devices", password reset) simply by deleting the session row from the database.

### 2. JSON Web Tokens (JWTs)
- Self-contained, signed tokens containing user claims.
- If stored in `localStorage`, JWTs are vulnerable to theft via Cross-Site Scripting (XSS).
- If stored in `httpOnly` cookies, JWTs cannot be revoked until they expire without implementing a token blocklist.

**Architecture Standard**: Store opaque, high-entropy session identifiers in `httpOnly` secure cookies.

## Cross-Site Scripting (XSS) Prevention & The `@html` Directive

Cross-Site Scripting (XSS) occurs when malicious JavaScript is injected into a web page and executed in the victim's browser context.

### Automatic Escaping in Mustaches `{ }`
By default, Svelte protects you against XSS when rendering dynamic expressions inside `{...}`. Svelte renders values as plain text nodes, automatically escaping characters like `<`, `>`, `&`, `"`, and `'`.

```svelte
<!-- 100% SECURE: Svelte renders this safely as literal text, escaping all tags -->
<p>{untrustedUserComment}</p>
```

### The Danger of `{@html}`
The **`{@html}`** tag renders raw, unescaped HTML directly into the DOM. Never pass un-sanitized user input directly to `{@html}`:

```svelte
<!-- EXTREMELY DANGEROUS: Never pass raw user input to @html! -->
<div>{@html rawUserContent}</div>
```

### Sanitizing Rich HTML with DOMPurify
If your application must render user-generated rich text (such as Markdown previews or WYSIWYG editor content), **always sanitize the HTML string using DOMPurify** before rendering with `{@html}`:

```typescript
// src/lib/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
  })
}
```

```svelte
<script lang="ts">
  import { sanitizeHtml } from '$lib/utils/sanitize'
  let { content }: { content: string } = $props()
  let safeContent = $derived(sanitizeHtml(content))
</script>

<div class="rich-text">
  {@html safeContent}
</div>
```

## Cross-Site Request Forgery (CSRF) Protection

Cross-Site Request Forgery (CSRF) occurs when an unauthorized website tricks a victim's browser into submitting malicious HTTP requests to an application where the victim is currently authenticated.

SvelteKit provides built-in CSRF protection:
1. **Origin Header Verification**: SvelteKit automatically inspects the incoming `Origin` header on all Form Action POST requests. If the request originates from a foreign domain, SvelteKit rejects the request with `403 Forbidden`.
2. **`SameSite=Lax` Cookies**: Setting `sameSite: 'lax'` on session cookies ensures browsers do not attach credentials to cross-site POST requests.

## Schema Validation with Zod

Never trust data received from incoming HTTP requests or form submissions. Use **Zod** to validate types, string lengths, regex patterns, and numeric ranges on the server:

```typescript
// src/lib/schemas/authSchema.ts
import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Alphanumeric characters only'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
```

Validating in a SvelteKit Form Action:
```typescript
// src/routes/register/+page.server.ts
import { RegisterSchema } from '$lib/schemas/authSchema'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData()
    const rawData = Object.fromEntries(formData)

    const result = RegisterSchema.safeParse(rawData)
    if (!result.success) {
      // Return structured validation errors mapped by field name
      const errors = result.error.flatten().fieldErrors
      return fail(400, { errors, values: { email: rawData.email, username: rawData.username } })
    }

    const { email, password, username } = result.data
    // Create user securely in database...

    throw redirect(303, '/dashboard')
  }
}
```

## Secure Cookie Configuration

Always configure session and token cookies with maximum security attributes:

```typescript
cookies.set('session_id', sessionToken, {
  path: '/',
  httpOnly: true, // Prevents JavaScript document.cookie access (XSS defense)
  secure: process.env.NODE_ENV === 'production', // Only transmitted over HTTPS
  sameSite: 'lax', // Protects against cross-site request forgery
  maxAge: 60 * 60 * 24 * 14, // 14 days in seconds
})
```

## Environment Variable Secrets vs Public Variables

SvelteKit provides four specialized environment variable import modules:

- **`$env/static/private`**: Built-in compile-time secrets (e.g. `DATABASE_URL`, `STRIPE_SECRET_KEY`). **Only accessible in server-side files**; importing into client files throws a compile-time build error.
- **`$env/static/public`**: Public variables prefixed with `PUBLIC_` (e.g. `PUBLIC_STRIPE_KEY`). Safe to bundle into client JavaScript.
- **`$env/dynamic/private`**: Runtime server environment variables (evaluated dynamically at request time).
- **`$env/dynamic/public`**: Runtime public environment variables.

```typescript
// src/lib/server/payment.ts (Server-only file)
import { STRIPE_SECRET_KEY } from '$env/static/private'
import Stripe from 'stripe'

export const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
```

## Best Practices

- **Sanitize Every `@html` Binding with DOMPurify**: Never render raw HTML from users or third-party APIs without sanitization.
- **Set `httpOnly` and `Secure` on All Authentication Cookies**: Prevent token theft by ensuring client JavaScript cannot read sensitive session cookies.
- **Validate Form Payloads with Zod on the Server**: Combine client-side UX checks with strict server-side schema parsing.
- **Import Secrets Strictly from `$env/static/private`**: Leverage SvelteKit's compile-time guard rails to ensure private API keys never leak to browser bundles.

## Summary

Full-stack application security in SvelteKit requires defense in depth: relying on Svelte's automatic template escaping, sanitizing rich HTML with DOMPurify, storing sessions in `httpOnly` secure cookies, parsing request payloads with Zod, and isolating private environment secrets using `$env/static/private`. By following these standards, you protect your users and infrastructure from sophisticated modern web attacks.
