---
title: 'Data Fetching Architecture: Streaming, Suspense & Deduplication'
description: 'Master enterprise data fetching architecture in Next.js: React.cache() per-request deduplication, React Suspense streaming, granular loading skeletons, and eliminating nested component waterfalls.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/nextjs/07-data-fetching
---

# Data Fetching Architecture: Streaming, Suspense & Deduplication

In modern enterprise applications, data requirements are rarely centralized in a single query. Multiple independent components across the layout and page tree (e.g. Header profile, Sidebar notification badge, Main feed) often require access to the same current user or team record. 

Next.js and React provide **`React.cache()`** for per-request function memoization and **Streaming SSR with Suspense** to stream critical above-the-fold UI immediately while slow database queries resolve asynchronously in the background.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Request Deduplication Engine                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Incoming Request                                                           │
│         │                                                                   │
│         ├──> Header Component     ───> getUser(id) [Executes DB query]      │
│         ├──> Sidebar Component    ───> getUser(id) [Returns MEMOIZED result]│
│         └──> Main Content Section ───> getUser(id) [Returns MEMOIZED result]│
│                                                                             │
│  Result: Exactly 1 database query executed across the entire request tree!  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Per-Request Deduplication with `React.cache()`

When querying databases directly with Prisma, Drizzle, or ORMs (which bypass `fetch()`), wrap the query in `React.cache()` to automatically deduplicate calls within the same render pass:

```typescript
// lib/data/user.ts
import { cache } from 'react';
import { db } from '@/lib/db';

export const getCurrentUser = cache(async (userId: string) => {
  console.log(`Executing database lookup for user: ${userId}`);
  return await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
});
```

### Component Usage:
Both the Navbar and Dashboard page can call `getCurrentUser(id)` simultaneously without creating duplicate database queries!

```tsx
// components/Navbar.tsx (Server Component)
import { getCurrentUser } from '@/lib/data/user';

export async function Navbar({ userId }: { userId: string }) {
  const user = await getCurrentUser(userId); // Re-uses cached result!
  return <header>Signed in as: {user?.name}</header>;
}
```

---

## 2. Streaming SSR with React Suspense

Streaming divides the page's HTML into smaller chunks and progressively streams them from the server to the client over an open HTTP connection:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { MetricCards, MetricCardsSkeleton } from '@/components/MetricCards';
import { HeavyChart, HeavyChartSkeleton } from '@/components/HeavyChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Executive Overview</h1>

      {/* Fast Data Section */}
      <Suspense fallback={<MetricCardsSkeleton />}>
        <MetricCards />
      </Suspense>

      {/* Heavy Analytic Computation Section */}
      <Suspense fallback={<HeavyChartSkeleton />}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- `React.cache()` memoizes database queries across the component tree for the lifetime of a single request.
- Next.js automatically deduplicates standard `fetch()` requests with identical URLs and options.
- Streaming SSR with `<Suspense>` streams fast components immediately, eliminating blank loading screens.

## Best Practices & Senior Guidance

1. **Wrap Non-Critical Heavy Components in Suspense**: Never let slow analytical queries block the initial First Contentful Paint (FCP) of the primary layout.
2. **Use `React.cache()` on All Direct Database Helpers**: Guarantees zero duplicate database roundtrips across layouts, pages, and subcomponents.
