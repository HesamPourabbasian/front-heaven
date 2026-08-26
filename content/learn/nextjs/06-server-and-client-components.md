---
title: 'Server & Client Components: Boundaries & Interoperability'
description: 'Master React Server Components (RSC) vs Client Components: the "use client" directive, boundary separation, passing serializable props, the children composition pattern, and 0KB bundle benefits.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/03-app-router
---

# Server & Client Components: Boundaries & Interoperability

The defining paradigm of the Next.js App Router is **React Server Components (RSC)**. In this architecture, components are **Server Components by default**. They execute exclusively on the Node.js or Edge server, render into a lightweight virtual DOM payload (RSC Payload), and send pre-rendered HTML to the browser with **0KB of client-side JavaScript bundle overhead**.

When interactive features (state, event listeners, or browser APIs) are needed, you explicitly declare **Client Components** using the `'use client'` directive.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 Server Components vs Client Components                      │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Server Components (Default)          │ Client Components ('use client')     │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Runs ONLY on the server            │ • Pre-rendered on server, hydrates   │
│ • Direct database & backend access   │   and runs in browser                │
│ • Zero JavaScript sent to client     │ • Interactive: onClick, onChange     │
│ • Can use async/await directly       │ • Can use hooks (useState, useEffect)│
│ • Cannot use hooks or browser APIs   │ • Can use browser APIs (window, etc.)│
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. When to Use Server vs Client Components

| Feature | Server Component | Client Component |
| :--- | :---: | :---: |
| Fetch data from databases / internal microservices | ✅ | ❌ |
| Keep sensitive keys, tokens & API secrets private | ✅ | ❌ |
| Large dependencies (e.g. Markdown parsers, date-fns) with 0KB client JS | ✅ | ❌ |
| Add interactivity & event listeners (`onClick`, `onSubmit`) | ❌ | ✅ |
| Use state & lifecycle hooks (`useState`, `useReducer`, `useEffect`) | ❌ | ✅ |
| Access browser-only APIs (`window`, `localStorage`, `navigator`) | ❌ | ✅ |

---

## 2. Defining a Client Component (`'use client'`)

The `'use client'` directive marks a boundary between server-only and client code. Place it at the very top of the file before imports:

```tsx
// components/LikeButton.tsx
'use client';

import { useState } from 'react';

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <button
      onClick={() => setLikes(l => l + 1)}
      className="flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-1.5 text-sm font-semibold text-pink-600 hover:bg-pink-100"
    >
      ❤️ <span>{likes} Likes</span>
    </button>
  );
}
```

---

## 3. Passing Props Across the Boundary (Serialization Rules)

Props passed from a Server Component to a Client Component must be **serializable** by React (strings, numbers, booleans, plain objects, arrays, and promises). You **cannot** pass functions or class instances directly across the boundary:

```tsx
// app/posts/[id]/page.tsx (Server Component)
import { db } from '@/lib/db';
import { LikeButton } from '@/components/LikeButton';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } }); // Direct DB query!

  if (!post) return <div>Post not found</div>;

  return (
    <article className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="mt-4 text-slate-700">{post.content}</p>
      
      {/* Passing serializable primitive to Client Component */}
      <div className="mt-6">
        <LikeButton initialLikes={post.likesCount} />
      </div>
    </article>
  );
}
```

---

## 4. The `children` Composition Pattern

To render a Server Component *inside* a Client Component without converting the Server Component into a Client Component, pass it as a `children` prop:

```tsx
// components/Modal.tsx (Client Component)
'use client';

import { useState } from 'react';

export function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            {children} {/* Server Component renders here with 0KB client JS! */}
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Components are Server Components by default; they execute on the server and ship 0KB client JavaScript.
- Add `'use client'` at the top of a file only when interactive event listeners, state, or browser APIs are required.
- Props passed across server-to-client boundaries must be serializable.
- Use the `children` prop pattern to compose Server Components inside Client Component shells.

## Best Practices & Senior Guidance

1. **Push Client Boundaries Down the Component Tree**: Keep page roots and layouts as Server Components; create small, isolated Client Components for individual interactive widgets (e.g. `<SearchBar />`, `<LikeButton />`).
2. **Never Mark an Entire Page with `'use client'` Unless Necessary**: Doing so forces all child components into the client JavaScript bundle, losing the performance benefits of RSC.
