---
title: 'Authentication, Authorization & Session Management'
description: 'Master authentication architecture in Next.js: secure HTTP-only cookies, JWT vs database sessions, Auth.js (NextAuth v5), middleware route protection, and Role-Based Access Control (RBAC).'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites:
  - /learn/nextjs/12-api-routes
  - /learn/nextjs/19-server-actions
---

# Authentication, Authorization & Session Management

Authentication in modern Next.js requires securing both Server Components, Server Actions, Route Handlers, and client views. Modern Next.js applications rely on **HTTP-Only Secure Cookies** for session transmission, preventing cross-site scripting (XSS) token theft.

In this lesson, you will master session encryption, HTTP-only cookie management, Auth.js (NextAuth v5), middleware session verification, and Role-Based Access Control (RBAC).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Authentication Architecture                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser Request (Includes HTTP-Only Cookie)                                │
│         │                                                                   │
│         ▼                                                                   │
│  1. Next.js Middleware (`middleware.ts`)                                    │
│       ├── Validates JWT / Session Signature                                 │
│       └── Redirects to /login if unauthenticated                            │
│         │                                                                   │
│         ▼                                                                   │
│  2. Server Component (`app/dashboard/page.tsx`)                             │
│       └── Reads session via auth() & verifies RBAC role ('admin' / 'user') │
│         │                                                                   │
│         ▼                                                                   │
│  3. Server Actions (`app/actions/*.ts`)                                     │
│       └── Re-verifies user session before executing any database mutation   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Auth.js (NextAuth.js v5) Setup

Auth.js v5 is built specifically for the Next.js App Router and React Server Components:

```bash
npm install next-auth@beta
```

### Configuration (`auth.ts`):
```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
```

### Route Handler Mounting:
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

---

## 2. Reading Session in Server Components

Retrieve the authenticated user session directly in any Server Component with `auth()`:

```tsx
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      <p className="text-slate-600">Email: {session.user.email}</p>
    </div>
  );
}
```

---

## 3. Role-Based Access Control (RBAC) in Actions

Always protect backend mutations against unauthorized role tampering:

```typescript
// app/actions/admin.ts
'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function deleteOrganization(orgId: string) {
  const session = await auth();

  // Strict RBAC Verification
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Forbidden: Requires Admin privileges.');
  }

  await db.organization.delete({ where: { id: orgId } });
  return { success: true };
}
```

---

## Summary & Key Takeaways

- Authentication in Next.js is anchored around secure HTTP-only cookies.
- Auth.js v5 exports a universal `auth()` helper usable in Server Components, Server Actions, and Route Handlers.
- Middleware provides top-level path guards, but critical Server Actions must always re-verify user permissions.

## Best Practices & Senior Guidance

1. **Never Store Auth Tokens in `localStorage`**: Tokens in `localStorage` are vulnerable to Cross-Site Scripting (XSS); always use HTTP-only secure cookies.
2. **Always Re-Verify Sessions Inside Server Actions**: Client-side visibility checks are purely cosmetic; the backend action must execute its own authorization guard.
