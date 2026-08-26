---
title: 'Routing, Dynamic Segments & Navigation APIs'
description: 'Master Next.js App Router routing mechanics: static routes, nested routes, dynamic parameters ([id]), catch-all ([...slug]), optional catch-all, route groups ((group)), Link component, useRouter, usePathname, and useSearchParams.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/03-app-router
---

# Routing, Dynamic Segments & Navigation APIs

Routing in the Next.js App Router is determined strictly by the folder hierarchy inside `app/`. By nesting folders, adding bracketed dynamic tokens (`[id]`, `[...slug]`), and applying organizational parentheses (`(marketing)`), you can construct sophisticated URL schemes without writing custom route configuration tables.

In this lesson, you will master static and nested routing, dynamic parameter extraction, catch-all segments, route groups, and client-side navigation APIs (`Link`, `useRouter`, `usePathname`, `useSearchParams`).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Next.js App Router Routing Patterns                    │
├─────────────────────────┬───────────────────────────┬───────────────────────┤
│ Pattern                 │ Directory Path            │ Matching URL Example  │
├─────────────────────────┼───────────────────────────┼───────────────────────┤
│ Static Route            │ app/about/page.tsx        │ /about                │
│ Nested Route            │ app/blog/news/page.tsx    │ /blog/news            │
│ Dynamic Segment         │ app/posts/[id]/page.tsx   │ /posts/123            │
│ Catch-All Segment       │ app/docs/[...slug]/page.ts│ /docs/api/v1/users    │
│ Optional Catch-All      │ app/shop/[[...slug]]/page │ /shop OR /shop/shoes  │
│ Route Group (Omit URL)  │ app/(auth)/login/page.tsx │ /login (No /auth URL!)│
└─────────────────────────┴───────────────────────────┴───────────────────────┘
```

---

## 1. Dynamic Route Segments (`[id]` & `[slug]`)

When a route segment is wrapped in brackets, the segment value is passed as a promise to `params` in Next.js 15+:

```tsx
// app/blog/[slug]/page.tsx
interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <article className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold">Article: {slug}</h1>
      <p className="text-slate-600 mt-4">Loaded dynamic article content for {slug}.</p>
    </article>
  );
}
```

---

## 2. Catch-All & Optional Catch-All Routes

- **Catch-All (`[...slug]`)**: Matches one or more segments (e.g. `/docs/guides/installation` produces `slug = ['guides', 'installation']`).
- **Optional Catch-All (`[[...slug]]`)**: Matches zero or more segments (matches `/docs` as well as `/docs/a/b`).

```tsx
// app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const path = slug.join(' / ');

  return <div>Documentation Breadcrumb: {path}</div>;
}
```

---

## 3. Route Groups (`(groupName)`)

Route groups organize routes without affecting the public URL path. They allow creating distinct layouts for different sections of the app (e.g. `(marketing)` vs `(dashboard)`):

```text
app/
├── (marketing)/
│   ├── layout.tsx         # Marketing Header & Footer
│   ├── page.tsx           # /
│   └── about/page.tsx     # /about
└── (app)/
    ├── layout.tsx         # Dashboard Sidebar Shell
    └── dashboard/page.tsx # /dashboard
```

---

## 4. Client-Side Navigation APIs

### A. `<Link>` Component (Pre-fetching & Fast Transitions)
`<Link>` performs client-side transitions and automatically pre-fetches viewport links in production:

```tsx
import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="flex gap-4">
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        Dashboard
      </Link>
      <Link href="/posts/42" prefetch={true} className="text-blue-600 hover:underline">
        Post #42
      </Link>
    </nav>
  );
}
```

### B. Client Navigation Hooks (`useRouter`, `usePathname`, `useSearchParams`)

```tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function SearchFilter() {
  const router = useRouter();
  const pathname = usePathname(); // e.g. "/products"
  const searchParams = useSearchParams(); // e.g. "?category=electronics"

  const currentCategory = searchParams.get('category');

  function handleFilter(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleFilter('tech')}
        className={`px-3 py-1 rounded ${currentCategory === 'tech' ? 'bg-black text-white' : 'bg-slate-200'}`}
      >
        Technology
      </button>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Folders with bracketed names (`[id]`) create dynamic routes whose values are extracted via `params`.
- Catch-all routes (`[...slug]`) map multi-level paths into string arrays.
- Route groups `(group)` organize directories and allow distinct layouts without polluting public URL paths.
- Always use `next/link` for internal navigations to benefit from automated prefetching and client-side transitions.

## Best Practices & Senior Guidance

1. **Await `params` and `searchParams` in Next.js 15+**: In modern Next.js, `params` and `searchParams` are asynchronous promises; always `await` them before reading properties.
2. **Use URL Search Params for Shareable Filters**: Storing search filters and pagination in URL query params enables users to bookmark and share filtered views.
