---
title: 'Advanced Rendering Architecture & Partial Prerendering (PPR)'
description: 'Master enterprise rendering architecture in Next.js: Partial Prerendering (PPR), combining static CDN shells with dynamic streaming holes, streaming SSR, and rendering waterfall elimination.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/nextjs/08-rendering
  - /learn/nextjs/31-react-server-components-deep-dive
---

# Advanced Rendering Architecture & Partial Prerendering (PPR)

For years, web development forced architects to choose between two extremes: **Static Site Generation (SSG)** (fastest global CDN delivery, but cannot serve personalized dynamic data) or **Server-Side Rendering (SSR)** (personalized real-time data, but slower initial server response times).

Next.js introduces **Partial Prerendering (PPR)**—a groundbreaking rendering model that combines static shell pre-rendering with dynamic server streaming within the exact same route.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Partial Prerendering (PPR) Architecture                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Browser navigates to /ecommerce/product-123                                │
│         │                                                                   │
│         ├── 1. Static Outer Shell (Navbar, Hero, Product Specs)             │
│         │      • Served INSTANTLY from Edge CDN (sub-30ms TTFB!)            │
│         │                                                                   │
│         └── 2. Dynamic Hole (<Suspense fallback={<CartSkeleton />}>)        │
│                • Streams user-specific Cart & Personalized Price over the   │
│                  same open HTTP connection without client-side waterfalls!  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Enabling Partial Prerendering (PPR)

Enable the experimental PPR compiler flag in `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental', // Enable incremental route-by-route PPR
  },
};

export default nextConfig;
```

---

## 2. Implementing PPR in Route Pages

To opt a specific route into Partial Prerendering, export `experimental_ppr = true` and wrap dynamic server components in `<Suspense>`:

```tsx
// app/products/[id]/page.tsx
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { UserCartWidget, CartSkeleton } from '@/components/UserCartWidget';

export const experimental_ppr = true; // Opt-in to PPR for this route

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 🚀 STATIC SHELL: Prerendered at build time & cached on CDN */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product?.title}</h1>
        <p className="text-slate-600">{product?.description}</p>
        <div className="text-2xl font-bold text-indigo-600">${product?.price}</div>
      </div>

      {/* ⚡ DYNAMIC HOLE: Streams live user-specific cart state at request time */}
      <div className="mt-8 border-t pt-6">
        <Suspense fallback={<CartSkeleton />}>
          <UserCartWidget productId={id} />
        </Suspense>
      </div>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Partial Prerendering (PPR) eliminates the tradeoff between static performance and dynamic personalization.
- The static shell of a route is served instantly from the CDN edge, while `<Suspense>` holes stream dynamic server data over the same HTTP stream.
- PPR improves Core Web Vitals by providing sub-50ms Time to First Byte (TTFB) alongside real-time user-specific rendering.

## Best Practices & Senior Guidance

1. **Keep Suspense Boundaries Close to Dynamic Leaves**: Wrapping the entire page in `<Suspense>` prevents PPR from extracting a static shell; isolate Suspense to the specific dynamic widgets.
2. **Avoid Top-Level `cookies()` Calls in Page Roots**: Reading cookies outside of a `<Suspense>` boundary forces the entire page into dynamic rendering.
