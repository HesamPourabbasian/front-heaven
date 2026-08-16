---
title: "Advanced State Architecture"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 25
order: 36
description: "Deconstructing UI state, Server state, URL state, Form state, and Global state across large enterprise architectures."
---

# Advanced State Architecture

In large-scale React engineering, the most common source of bugs and performance degradation is miscategorizing state. Trying to force all application state into a single global Redux or Zustand store leads to synchronization headaches, cache invalidation bugs, and slow rendering.

In this lesson, you will master the **5 Fundamental State Categories** and learn the precise architectural boundaries for each.

## The 5 State Categories

```text
1. SERVER STATE   ──► Cached remote API data (TanStack Query, SWR)
2. URL STATE      ──► Deep-linkable search filters, tabs, page IDs (React Router)
3. FORM STATE     ──► Ephemeral input values and validation errors (React Hook Form)
4. UI STATE       ──► Transient local toggles, accordion expansion (useState, useReducer)
5. GLOBAL STATE   ──► Cross-cutting client session data, shopping carts (Zustand)
```

## 1. URL State (The Most Underutilized State)
Whenever a state variable represents something a user might want to bookmark, share with a teammate, or preserve across page refreshes (such as search queries, sorting orders, pagination offsets, and active tabs), store it in the **URL query string** using `useSearchParams`:

```jsx
import { useSearchParams } from 'react-router-dom';

export function SearchFilters() {
  const [params, setParams] = useSearchParams();
  const currentQuery = params.get('q') || '';

  function handleFilterChange(newFilter) {
    params.set('filter', newFilter);
    params.set('page', '1'); // Reset pagination on filter change
    setParams(params);
  }

  return (
    <div>
      <input
        value={currentQuery}
        onChange={e => {
          params.set('q', e.target.value);
          setParams(params);
        }}
      />
    </div>
  );
}
```

## Best Practices

- **Never Duplicate Server State into Redux**: Keep API responses inside TanStack Query to leverage automatic caching and background invalidation.
- **Store Filter State in the URL**: Use search query parameters so users can share exact page states.
- **Keep UI State Local**: Do not elevate local accordion toggles into global stores.

## Summary

Clean state architecture separates server cache from URL parameters, form inputs, and global UI state. Choosing the right tool for each category produces maintainable, high-performance applications.
