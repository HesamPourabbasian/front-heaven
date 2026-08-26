---
title: 'Modern Forms, Validation & React 19 Action Hooks'
description: 'Master modern form handling in Next.js: useActionState, useFormStatus pending states, Zod schema validation, server-side error mapping, and optimistic UI updates with useOptimistic.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/nextjs/19-server-actions
---

# Modern Forms, Validation & React 19 Action Hooks

Handling forms in modern Next.js combines Server Actions with modern React hooks (**`useActionState`**, **`useFormStatus`**, and **`useOptimistic`**). This architecture eliminates client-side form boilerplate, provides type-safe server validation with **Zod**, and displays instant pending feedback and optimistic mutations.

In this lesson, you will master form state lifecycle management, pending button states, server-side validation error mapping, and optimistic UI updates.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Modern React Form State Architecture                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ Client Form Component ]                                                  │
│         │                                                                   │
│         ├──> useActionState(serverAction, initialState)                     │
│         │      └── Manages { state, formAction, isPending }                 │
│         │                                                                   │
│         └──> SubmitButton (Child Component)                                 │
│                └── useFormStatus() -> { pending: true/false }               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Pending States with `useFormStatus`

`useFormStatus` provides the pending status of the parent `<form>`. It must be placed inside a child component within the form:

```tsx
// components/SubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50 flex items-center gap-2"
    >
      {pending && <span className="animate-spin">⏳</span>}
      <span>{pending ? 'Saving...' : label}</span>
    </button>
  );
}
```

---

## 2. Managing Form State & Validation with `useActionState`

`useActionState` manages form submission responses, field-level error validation messages, and server results:

### A. Server Action with Zod Validation:
```typescript
// app/actions/auth.ts
'use server';

import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function registerUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Create user in database
  return { message: 'Registration successful!' };
}
```

### B. Client Form Component:
```tsx
// components/RegisterForm.tsx
'use client';

import { useActionState } from 'react';
import { registerUser, FormState } from '@/app/actions/auth';
import { SubmitButton } from '@/components/SubmitButton';

const initialState: FormState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded-xl shadow">
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input name="email" type="email" className="mt-1 block w-full rounded border px-3 py-2" />
        {state.errors?.email && (
          <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input name="password" type="password" className="mt-1 block w-full rounded border px-3 py-2" />
        {state.errors?.password && (
          <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>
        )}
      </div>

      {state.message && <p className="text-green-600 text-sm">{state.message}</p>}

      <SubmitButton label="Create Account" />
    </form>
  );
}
```

---

## Summary & Key Takeaways

- `useActionState` manages form state returned from Server Actions without manual `fetch` handling.
- `useFormStatus` tracks submission pending state in submit buttons.
- Zod `safeParse()` validates inputs on the server and returns structured field errors.
- Forms degrade gracefully and work with or without client JavaScript.

## Best Practices & Senior Guidance

1. **Always Return Structured Errors from Actions**: Return `{ errors: { field: ['message'] } }` so client forms can highlight specific input fields with error messages.
2. **Reset Form on Success**: In client components, listen to `state.message` or key the form component to reset inputs after successful submissions.
