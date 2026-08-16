---
title: "Server State & TanStack Query"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 19
description: "Mastering TanStack Query (React Query): Queries, mutations, caching, query keys, invalidation, and optimistic updates."
---

# Server State & TanStack Query

In modern web development, managing data that originates from a remote server is fundamentally different from managing client UI state (like an open modal or theme toggle). Server state is asynchronous, shared across multiple users, requires caching, and quickly becomes stale.

**TanStack Query** (formerly React Query) is the industry standard server-state management library for React. It completely replaces manual `useEffect` data fetching with declarative queries, automatic background refetching, intelligent caching, and optimistic updates.

## Setting Up TanStack Query

First, wrap your application tree with a `QueryClientProvider`:

```jsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      retry: 2,                 // Automatically retry failed requests twice
    },
  },
});

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
```

## Fetching Data with `useQuery`

The `useQuery` hook accepts a **query key** (an array uniquely identifying the data) and a **query function** that returns a Promise:

```jsx
import { useQuery } from '@tanstack/react-query';

async function fetchProducts() {
  const res = await fetch('https://api.example.com/products');
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

function ProductCatalog() {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading products catalog...</div>;
  if (isError) return <div>Failed to load: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh Data</button>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.title} — ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Mutating Data with `useMutation` and Cache Invalidation

When creating, updating, or deleting data on the server, use `useMutation`. Upon success, invalidate related query keys to trigger an automatic background refetch across the entire app:

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createTodo(newTodo) {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });
  return res.json();
}

function AddTodoForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch todos query automatically:
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate({ title, completed: false });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}
```

## Optimistic Updates

For instant user feedback, TanStack Query allows **optimistic updates**—updating the local cache immediately before the server request completes, and rolling back automatically if the request fails:

```javascript
const mutation = useMutation({
  mutationFn: updateTodoStatus,
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches so they don't overwrite optimistic update:
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update cache:
    queryClient.setQueryData(['todos'], old =>
      old.map(t => (t.id === newTodo.id ? { ...t, ...newTodo } : t))
    );

    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // Rollback to previous state on error:
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

## Best Practices

- **Use Structured Query Keys**: Structure query keys hierarchically (e.g. `['users', userId, 'profile']`).
- **Configure Meaningful `staleTime`**: Set a reasonable `staleTime` (e.g. 1 to 5 minutes) to prevent redundant network requests when switching tabs.
- **Never Store Server Data in Redux/Zustand**: Let TanStack Query manage server cache while keeping client state stores strictly for UI data.

## Summary

TanStack Query revolutionizes server-state management in React. By automating caching, deduplication, background refetching, and optimistic updates, it eliminates thousands of lines of boilerplate `useEffect` code.
