---
title: "Modern React APIs: use, Actions, and Form Hooks"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 25
order: 32
description: "Mastering modern React APIs: The use() hook, Server Actions, useActionState, useOptimistic, and useFormStatus."
---

# Modern React APIs: use, Actions, and Form Hooks

React 19 introduces game-changing APIs that streamline data fetching, form handling, and optimistic mutations. By elevating asynchronous **Actions** and introducing the flexible **`use()`** API, React reduces boilerplate and integrates deeply with asynchronous promises and contexts.

In this lesson, you will explore the modern React API suite: `use()`, `useActionState`, `useOptimistic`, and `useFormStatus`.

## 1. The `use()` API

The `use()` API is a versatile new React function that can read the value of a Promise or a Context. Unlike traditional hooks, `use()` can be called conditionally and inside loops:

```jsx
import { use, Suspense } from 'react';

function UserDetails({ userPromise }) {
  // Resolves promise directly, suspending if pending:
  const user = use(userPromise);

  return <div>Welcome, {user.name} ({user.email})</div>;
}

export function ProfilePage() {
  const userPromise = fetchUserData();

  return (
    <Suspense fallback={<p>Loading user profile...</p>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
}
```

## 2. Managing Form Actions with `useActionState`

Modern React formalizes async operations that mutate data as **Actions**. `useActionState` manages pending state, returned action results, and form submissions automatically:

```jsx
import { useActionState } from 'react';

async function updateUsernameAction(previousState, formData) {
  const newName = formData.get('username');
  try {
    const updated = await apiUpdateName(newName);
    return { success: true, name: updated.name, error: null };
  } catch (err) {
    return { success: false, name: previousState.name, error: err.message };
  }
}

export function UsernameEditor({ currentName }) {
  const [state, formAction, isPending] = useActionState(updateUsernameAction, {
    success: false,
    name: currentName,
    error: null,
  });

  return (
    <form action={formAction}>
      <input name="username" defaultValue={state.name} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update Name'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Updated successfully!</p>}
    </form>
  );
}
```

## 3. Immediate UI Feedback with `useOptimistic`

`useOptimistic` allows you to display optimistic state during an active asynchronous action, automatically rolling back if the action fails:

```jsx
import { useOptimistic } from 'react';

export function MessageThread({ messages, onSendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function handleSend(formData) {
    const text = formData.get('message');
    addOptimisticMessage(text); // Appears instantly!
    await onSendMessage(text);  // Background async mutation
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <p key={i} className={m.sending ? 'opacity-50' : ''}>
          {m.text} {m.sending && '(Sending...)'}
        </p>
      ))}
      <form action={handleSend}>
        <input name="message" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## 4. Reading Parent Form State with `useFormStatus`

Child submit buttons can read the pending status of their parent `<form>` without prop drilling using `useFormStatus`:

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? 'Processing...' : label}
    </button>
  );
}
```

## Best Practices

- **Use Native Form Actions**: Leverage React 19 form actions to handle mutations without writing manual `preventDefault()` code.
- **Combine Suspense with `use()`**: Use `use()` to resolve promises cleanly within Suspense boundaries.
- **Enhance UX with `useOptimistic`**: Use optimistic updates on interactive social feeds, likes, and chat messaging.

## Summary

Modern React APIs in React 19 streamline asynchronous operations, form submissions, and UI optimism. By utilizing `use()`, `useActionState`, `useOptimistic`, and `useFormStatus`, you build responsive, full-stack reactive applications with minimal boilerplate.
