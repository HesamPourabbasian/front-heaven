---
title: "Next.js & The React Framework Ecosystem"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 30
order: 35
description: "Next.js App Router, React Server Components (RSC), Server Actions, routing conventions, and full-stack architecture."
---

# Next.js & The React Framework Ecosystem

While React provides the foundational UI library, production applications require routing, server engines, bundlers, image optimization, and data caching. **Next.js** (by Vercel) is the premier production framework for React, pioneering **React Server Components (RSC)** and full-stack web architecture.

In this lesson, you will explore the Next.js App Router, understand the boundary between Server Components and Client Components, and learn Server Actions.

## React Server Components (RSC) vs Client Components

In the Next.js App Router, all components inside the `app/` directory are **Server Components** by default:

### 1. Server Components (Default)
- Execute **exclusively on the server**.
- Zero JavaScript sent to the client bundle (tiny bundle footprint).
- Can directly access databases, internal microservices, and file systems.
- Cannot use browser hooks (`useState`, `useEffect`) or event listeners (`onClick`).

### 2. Client Components (`'use client'`)
- Opted-in by placing the `'use client'` directive at the very top of the file.
- Execute on both server (for SSR) and client (for interactivity).
- Full access to React state, effects, event listeners, and browser APIs.

```tsx
// app/products/page.tsx (Server Component)
import db from '@/lib/db';
import { AddToCartButton } from './AddToCartButton';

export default async function ProductsPage() {
  // Direct DB access with zero client bundle overhead:
  const products = await db.products.findMany();

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id} className="card">
          <h3>{p.title}</h3>
          <p>${p.price}</p>
          {/* Interactive Client Component embedded inside Server Component: */}
          <AddToCartButton productId={p.id} />
        </div>
      ))}
    </div>
  );
}
```

```tsx
// app/products/AddToCartButton.tsx (Client Component)
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        setAdded(true);
        console.log('Added product:', productId);
      }}
      className="btn-primary"
    >
      {added ? '✓ In Cart' : 'Add to Cart'}
    </button>
  );
}
```

## Server Actions in Next.js

Server Actions allow client components to invoke server-side mutations directly without creating manual API route handlers:

```tsx
// app/actions/createPost.ts
'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  // Automatically revalidate and refresh cached page:
  revalidatePath('/posts');
}
```

## Best Practices

- **Keep Components on the Server by Default**: Only add `'use client'` when you require event handlers or state hooks.
- **Push `'use client'` to the Leaves**: Keep client components small and nested at the bottom of the component tree.
- **Leverage `revalidatePath`**: Revalidate cached server routes automatically after executing Server Actions.

## Summary

Next.js transforms React into a complete full-stack framework. Through React Server Components, Server Actions, and file-based routing, it provides exceptional performance with zero client bundle bloat.
