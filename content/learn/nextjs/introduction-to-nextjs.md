---
title: 'Introduction to Next.js & App Router'
description: 'Master Next.js App Router, file-based routing (page.tsx, layout.tsx), React Server Components (RSC), and hybrid rendering.'
order: 1
difficulty: 'advanced'
category: 'Next.js Fundamentals (React)'
estimatedMinutes: 25
prerequisites:
  - /learn/react/introduction-to-react
---

## What is Next.js?

**Next.js** is the premier meta-framework built on top of **React**. It enables server-side rendering (SSR), static site generation (SSG), and React Server Components (RSC).

---

## App Router File Conventions

In the Next.js `app/` directory:
- `app/page.tsx`: The unique UI for a route.
- `app/layout.tsx`: Shared layout wrapping pages (preserves state across navigations).
- `app/loading.tsx`: Instant loading skeletons with React Suspense.
- `app/error.tsx`: Error boundaries catching unexpected errors.

---

## Server vs. Client Components

- **Server Components (Default)**: Render on the server, zero client bundle weight, direct database/API access.
- **Client Components (`'use client'`)**: Needed for interactive event listeners (`onClick`), hooks (`useState`), and browser APIs.

```tsx
// app/dashboard/page.tsx (Server Component)
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const stats = await db.getStats(); // Direct DB query on server!
  return <div>Active Users: {stats.activeUsers}</div>;
}
```

---

## Summary & Key Takeaways

- Next.js sits on top of React, adding server-side rendering, routing, and data fetching.
- Components are Server Components by default; add `'use client'` only when interactivity is required.
