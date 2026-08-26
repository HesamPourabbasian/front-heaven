---
title: 'The App Router & Special File Conventions'
description: 'Master the Next.js App Router architecture and special file conventions: page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, global-error.tsx, template.tsx, and default.tsx.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/02-nextjs-fundamentals
---

# The App Router & Special File Conventions

The **App Router** is Next.js's modern routing architecture built from the ground up to support React Server Components, Streaming, and nested UI hierarchies. Unlike the legacy Pages Router (`pages/`), the App Router uses folder-based routing where folders define URL path segments, and a standardized set of **Special File Conventions** defines the UI, error boundaries, loading skeletons, and layout wrappers.

In this lesson, you will master the 8 core special files of the App Router and understand how React wraps them automatically into a nested component tree.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    App Router Component Hierarchy Wrapping                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  <Layout>                                                                   │
│    <Template>                                                               │
│      <ErrorBoundary fallback={<Error />}>                                  │
│        <Suspense fallback={<Loading />}>                                    │
│          <NotFoundBoundary fallback={<NotFound />}>                         │
│            <Page />                                                         │
│          </NotFoundBoundary>                                                │
│        </Suspense>                                                          │
│      </ErrorBoundary>                                                       │
│    </Template>                                                              │
│  </Layout>                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The 8 Special File Conventions

| File Name | Purpose | Execution Environment |
| :--- | :--- | :--- |
| `page.tsx` | Unique UI for a URL path segment. Makes route publicly accessible. | Server Component (default) |
| `layout.tsx` | Shared UI shell across subroutes. Preserves state & avoids re-renders. | Server Component (default) |
| `loading.tsx` | Instant loading skeleton powered automatically by React Suspense. | Server Component (default) |
| `error.tsx` | Error boundary catching unexpected client runtime errors in subtrees. | **Must be Client Component** (`'use client'`) |
| `not-found.tsx` | Rendered when `notFound()` is invoked or a route does not exist (404). | Server Component (default) |
| `global-error.tsx`| Top-level error boundary catching fatal errors inside root `app/layout.tsx`. | **Must be Client Component** (`'use client'`) |
| `template.tsx` | Similar to `layout.tsx`, but creates a new instance on every navigation. | Server Component (default) |
| `default.tsx` | Fallback view for un-matched slots in Parallel Routes. | Server Component (default) |

---

## 2. `page.tsx` & `layout.tsx` in Action

A `page.tsx` file defines the visible UI of a route. A `layout.tsx` wraps child pages:

```tsx
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-600 mt-2">Welcome to your enterprise metrics.</p>
    </div>
  );
}
```

---

## 3. Instant Loading States with `loading.tsx`

Next.js automatically wraps `page.tsx` inside a React `<Suspense fallback={<Loading />}>`:

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-slate-200 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
}
```

---

## 4. Resilient Error Boundaries with `error.tsx`

`error.tsx` must always be marked with `'use client'` and receives the `error` object and a `reset()` retry function:

```tsx
// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to telemetry service (e.g. Sentry)
    console.error('Dashboard error occurred:', error);
  }, [error]);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-lg font-bold text-red-900">Failed to load dashboard data</h2>
      <p className="text-sm text-red-700 mt-1">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Folders define URL paths; special files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) define functionality.
- `layout.tsx` persists across page navigations without re-rendering, preserving state.
- `loading.tsx` leverages React Suspense streaming out-of-the-box for instant page transitions.
- `error.tsx` and `global-error.tsx` MUST be Client Components (`'use client'`).

## Best Practices & Senior Guidance

1. **Always Provide `loading.tsx` Skeletons**: Prevents blank screen delays during server-side data fetching and improves Core Web Vitals (LCP/CLS).
2. **Use `global-error.tsx` Only for Root Layout Crashes**: Root `app/layout.tsx` errors bypass standard `app/error.tsx`; `global-error.tsx` must define its own `<html>` and `<body>` tags.
