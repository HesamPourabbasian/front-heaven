---
title: 'Server Actions & Mutations Architecture'
description: 'Master Server Actions in Next.js: the "use server" directive, form mutations, progressive enhancement, server-side authorization checks, database transactions, and cache revalidation.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/nextjs/06-server-and-client-components
  - /learn/nextjs/17-caching
---

# Server Actions & Mutations Architecture

**Server Actions** are asynchronous functions that execute securely on the server. They can be invoked directly from HTML forms or client components without requiring manual REST API endpoints or `fetch()` wrappers. Server Actions support **Progressive Enhancement** (forms function even before JavaScript loads) and automatically integrate with Next.js caching and revalidation systems.

In this lesson, you will master the `"use server"` directive, form actions, input validation, authentication guards, database mutations, and cache invalidation.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Server Actions Execution Architecture                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Client Form (HTML / React)                                                 │
│         │                                                                   │
│         ▼ (POST /form-action with FormData payload)                         │
│  Server Action ("use server")                                               │
│         ├── 1. Check User Session & Authorization                           │
│         ├── 2. Validate input schema with Zod                               │
│         ├── 3. Execute Database Mutation (SQL / Prisma)                     │
│         ├── 4. Invalidate relevant caches (revalidatePath / revalidateTag)  │
│         └── 5. Return serializable result or redirect                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Defining a Server Action (`"use server"`)

Server Actions can be declared inside separate dedicated action files:

```typescript
// app/actions/todos.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function createTodo(formData: FormData) {
  // 1. Authorization Guard
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // 2. Extract and Validate Input
  const title = formData.get('title') as string;
  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' };
  }

  // 3. Database Mutation
  await db.todo.create({
    data: {
      title,
      userId: user.id,
    },
  });

  // 4. Revalidate cache to update UI instantly
  revalidatePath('/todos');
  return { success: true };
}
```

---

## 2. Invoking Server Actions in Forms (Progressive Enhancement)

Because Server Actions hook directly into native HTML `<form action="...">`, forms work even on slow 3G networks before JavaScript finishes hydrating:

```tsx
// app/todos/page.tsx (Server Component)
import { createTodo } from '@/app/actions/todos';
import { db } from '@/lib/db';

export default async function TodosPage() {
  const todos = await db.todo.findMany();

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>

      {/* Progressive Enhancement Form */}
      <form action={createTodo} className="flex gap-2 mb-6">
        <input
          name="title"
          type="text"
          placeholder="New task..."
          required
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-slate-200">
        {todos.map(t => (
          <li key={t.id} className="py-2 text-slate-800">{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Server Actions are declared with `"use server"` and execute exclusively on the server.
- They can be passed directly to `<form action={myAction}>`, enabling progressive enhancement.
- Always perform server-side authorization and schema validation inside actions.
- Call `revalidatePath()` or `revalidateTag()` inside the action to refresh UI automatically.

## Best Practices & Senior Guidance

1. **Never Trust Client Input in Server Actions**: Treat Server Actions like public POST endpoints; always verify user permissions and validate payload formats with Zod.
2. **Colocate Actions in `app/actions/`**: Keeping server actions in modular files prevents circular dependencies between Server and Client Components.
