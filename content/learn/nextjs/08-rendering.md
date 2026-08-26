---
title: 'Rendering Paradigms: Static, Dynamic & Hybrid Execution'
description: 'Master rendering strategies in Next.js App Router: Static Rendering (SSG), Dynamic Rendering (SSR), Client-Side Rendering (CSR), hybrid execution, and understanding Dynamic Functions (cookies, headers).'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/07-data-fetching
---

# Rendering Paradigms: Static, Dynamic & Hybrid Execution

Next.js provides a **hybrid rendering engine** that automatically determines the optimal rendering strategy for every route in your application. Instead of forcing an entire application to be purely static (SSG) or purely dynamic (SSR), Next.js decides whether a route can be statically generated at build time or must be dynamically computed upon each incoming HTTP request.

In this lesson, you will master Static Rendering, Dynamic Rendering, Dynamic Functions (`cookies()`, `headers()`), and route segment config options.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Static vs Dynamic Route Rendering                     │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Static Rendering (Default / SSG)     │ Dynamic Rendering (On-Demand / SSR)  │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Rendered at BUILD TIME             │ • Rendered at REQUEST TIME           │
│ • Result cached globally on CDN      │ • Executes on server for each user   │
│ • Instant sub-50ms TTFB worldwide    │ • Accesses live cookies/auth/headers │
│ • Best for: Blogs, Docs, Marketing   │ • Best for: Dashboards, Cart, Feed   │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Static Rendering (Build-Time Generation)

By default, routes in the App Router are **Statically Rendered**. If a route does not use dynamic user-specific information (like cookies or URL query parameters), Next.js executes the component during `next build`, generates static HTML and JSON payloads, and serves them from a global CDN:

```tsx
// app/about/page.tsx (Statically Pre-Rendered at Build Time)
export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">About Our Company</h1>
      <p className="mt-2 text-slate-600">Static content cached permanently on the edge.</p>
    </div>
  );
}
```

---

## 2. Dynamic Rendering (Request-Time Generation)

A route automatically switches from Static to **Dynamic Rendering** when it uses **Dynamic Functions**:
1. `cookies()` from `next/headers`: Reading incoming user session cookies.
2. `headers()` from `next/headers`: Reading incoming request HTTP headers.
3. `searchParams` prop in `page.tsx`: Accessing URL query parameters (`?q=shoes`).

```tsx
// app/account/page.tsx (Dynamically Rendered for Each Request)
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export default async function AccountPage() {
  const cookieStore = await cookies(); // Triggers dynamic request-time rendering!
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    return <div>Please log in</div>;
  }

  const user = await db.user.findBySession(sessionToken);

  return <div>Welcome back, {user.name}!</div>;
}
```

---

## 3. Explicit Route Segment Configuration Options

You can explicitly control route rendering behavior using exported route segment constants:

```tsx
// app/reports/page.tsx

// Options: 'auto' | 'force-dynamic' | 'error' | 'force-static'
export const dynamic = 'force-dynamic'; // Forces SSR on every request

// Options: 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'default-no-store' | 'only-no-store' | 'force-no-store'
export const fetchCache = 'default-no-store';

export default async function ReportsPage() {
  const report = await fetchLiveReport();
  return <div>Live Report: {report.title}</div>;
}
```

---

## Summary & Key Takeaways

- Next.js automatically defaults to Static Rendering whenever possible for maximum performance.
- Using `cookies()`, `headers()`, or `searchParams` automatically promotes a route to Dynamic Rendering.
- Statically rendered pages are served from the CDN with minimal Time to First Byte (TTFB).
- You can override automatic behavior using `export const dynamic = 'force-dynamic'`.

## Best Practices & Senior Guidance

1. **Keep Public Pages Static**: Avoid reading cookies in global headers on marketing and documentation pages so those routes remain statically cached on the CDN edge.
2. **Use React Suspense for Partial Prerendering**: Wrap user-specific components in `<Suspense>` so the outer shell remains static while only the dynamic user widget streams in.
