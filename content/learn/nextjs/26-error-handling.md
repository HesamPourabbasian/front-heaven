---
title: 'Error Handling, Not-Found Boundaries & Logging'
description: 'Master error handling in Next.js App Router: nested error boundaries (error.tsx), global-error.tsx, notFound() triggers, expected vs unexpected errors, and production logging integration.'
order: 26
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/03-app-router
---

# Error Handling, Not-Found Boundaries & Logging

Resilient applications gracefully handle database timeouts, missing records, unauthorized access attempts, and client-side runtime exceptions without crashing the entire website. Next.js provides a hierarchical error handling architecture using **`error.tsx`**, **`global-error.tsx`**, and the **`notFound()`** API.

In this lesson, you will master nested error boundaries, expected vs unexpected error modeling, 404 views, and production error logging.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Hierarchical Error Handling Architecture                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  app/global-error.tsx (Catches fatal crashes in root layout)                │
│    └── app/dashboard/error.tsx (Catches crashes in /dashboard subtree)      │
│          └── app/dashboard/billing/error.tsx (Isolates billing crash only!) │
│                                                                             │
│  Benefit: A crash in the Billing tab does NOT break the Dashboard shell!    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Triggering 404 States with `notFound()`

When a requested database record does not exist, invoke `notFound()` to immediately render the closest `not-found.tsx`:

```tsx
// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) {
    // Immediately halts execution and renders app/products/[slug]/not-found.tsx
    notFound();
  }

  return <div>{product.title}</div>;
}
```

```tsx
// app/products/[slug]/not-found.tsx
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-3xl font-bold text-slate-900">Product Not Found</h2>
      <p className="mt-2 text-slate-600">The product you are looking for has been retired or moved.</p>
      <Link href="/products" className="btn-primary mt-4 inline-block">
        Browse Catalog
      </Link>
    </div>
  );
}
```

---

## 2. Granular Error Isolation with `error.tsx`

`error.tsx` catches exceptions thrown inside child components and Server Actions, providing a retry button via `reset()`:

```tsx
// app/dashboard/analytics/error.tsx
'use client';

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 border border-amber-200 bg-amber-50 rounded-xl">
      <h3 className="font-bold text-amber-900">Analytics Service Temporarily Unavailable</h3>
      <p className="text-sm text-amber-700 mt-1">Error ID: {error.digest}</p>
      <button
        onClick={() => reset()}
        className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700"
      >
        Retry Analytics
      </button>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Use `notFound()` to immediately transition to `not-found.tsx` for missing database records.
- Nested `error.tsx` boundaries isolate failures to specific sections without crashing the parent layout.
- `error.tsx` files must always be Client Components (`'use client'`).
- `error.digest` provides a sanitized hash to correlate server logs without leaking database passwords to users.

## Best Practices & Senior Guidance

1. **Never Leak Raw Server Stack Traces to Client Users**: Next.js automatically masks server errors in production, showing only a `digest` hash; log the full stack trace securely to Sentry or Datadog on the server.
2. **Implement `reset()` on Error Boundaries**: Allows users to recover from transient network drops without requiring a full page refresh.
