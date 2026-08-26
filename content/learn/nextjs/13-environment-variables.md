---
title: 'Environment Variables, Secrets & Security Configuration'
description: 'Master environment variables in Next.js: .env.local hierarchy, server-only secret isolation, client-exposed NEXT_PUBLIC_* variables, type-safe schema validation, and preventing client bundle leakage.'
order: 13
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/nextjs/02-nextjs-fundamentals
---

# Environment Variables, Secrets & Security Configuration

Managing API keys, database connection strings, payment gateway secrets, and public configuration flags requires a robust environment variable architecture. Next.js includes built-in support for environment files (`.env`, `.env.local`, `.env.production`) and enforces strict security boundaries between **server-only private secrets** and **browser-exposed public variables**.

In this lesson, you will master the environment loading hierarchy, understand the `NEXT_PUBLIC_` prefix, and build type-safe environment schemas.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Environment Security Boundary                    │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Server-Only Variables (Default)      │ Client-Exposed (NEXT_PUBLIC_*)       │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ DATABASE_URL=postgresql://...        │ NEXT_PUBLIC_SITE_URL=https://...     │
│ STRIPE_SECRET_KEY=sk_live_...        │ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY   │
│ • Accessible ONLY on Server (RSC/API)│ • Inlined into client JS at BUILD time│
│ • SAFE from browser inspection       │ • VISIBLE to anyone inspecting DevTools│
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Environment Loading Priority Hierarchy

Next.js evaluates environment files in strict priority order (highest to lowest):

1. `process.env` (System environment variables injected by host / Docker / Vercel)
2. `.env.production.local` / `.env.development.local`
3. `.env.local` (Local overrides, always `.gitignore`d)
4. `.env.production` / `.env.development`
5. `.env` (Base defaults)

---

## 2. Server-Only Secrets vs `NEXT_PUBLIC_`

Any variable declared **without** the `NEXT_PUBLIC_` prefix is strictly confined to the server environment:

```bash
# .env.local

# 🔒 PRIVATE SECRETS (Accessible ONLY in Server Components, Route Handlers, and Server Actions)
DATABASE_URL="postgresql://postgres:secret@localhost:5432/enterprise_db"
JWT_SECRET_KEY="super-secret-cryptographic-key-12345"
RESEND_API_KEY="re_123456789"

# 🌐 PUBLIC VARIABLES (Inlined into the browser JavaScript bundle)
NEXT_PUBLIC_API_URL="https://api.myenterprise.dev"
NEXT_PUBLIC_GA_ID="G-XYZ12345"
```

### Accessing in Server Code:
```typescript
// app/api/send-email/route.ts
export async function POST() {
  // Safe: process.env.RESEND_API_KEY is available on server
  const apiKey = process.env.RESEND_API_KEY;
  return Response.json({ success: true });
}
```

> **Security Warning**: If you attempt to access `process.env.DATABASE_URL` inside a Client Component (`'use client'`), Next.js automatically returns `undefined` to prevent exposing your database password in the browser!

---

## 3. Type-Safe Environment Validation with Zod

Prevent production runtime crashes due to missing environment variables by validating them at startup:

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

// Throws an immediate descriptive error during build if variables are missing
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
```

---

## Summary & Key Takeaways

- Variables without `NEXT_PUBLIC_` are private and only accessible on the server.
- Variables starting with `NEXT_PUBLIC_` are inlined into client JavaScript bundles at build time.
- `.env.local` is loaded locally and must be added to `.gitignore`.
- Validating environment variables with Zod guarantees fail-fast builds when secrets are missing.

## Best Practices & Senior Guidance

1. **Never Prefix Sensitive API Keys with `NEXT_PUBLIC_`**: If a secret key (Stripe secret, AWS secret, OpenAI key) is prefixed with `NEXT_PUBLIC_`, it is permanently leaked to anyone viewing page source.
2. **Use `server-only` Package**: Add `import 'server-only'` to database client files to trigger a build error if client components accidentally import them.
