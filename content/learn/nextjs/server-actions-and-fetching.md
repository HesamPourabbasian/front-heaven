---
title: 'Server Actions & Data Mutations in Next.js'
description: 'Learn Server Actions ("use server"), form handling, revalidatePath, and optimistic UI updates.'
order: 2
difficulty: 'advanced'
category: 'Next.js Data & Mutations'
estimatedMinutes: 25
prerequisites:
  - /learn/nextjs/introduction-to-nextjs
---

## Server Actions

Server Actions are asynchronous functions executed on the server, callable directly from forms and buttons:

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache';

export async function createItem(formData: FormData) {
  const title = formData.get('title');
  await db.items.create({ title });
  revalidatePath('/items'); // Purges cache and refreshes UI
}
```

---

## Summary & Key Takeaways

- Server Actions eliminate the need to write separate API route endpoints for form submissions.
