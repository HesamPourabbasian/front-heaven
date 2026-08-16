---
title: "React 18+ & 19: Concurrent Rendering & Transitions"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 25
order: 31
description: "Concurrent mode, automatic batching, startTransition, useTransition, useDeferredValue, and React 19 compiler paradigms."
---

# React 18+ & 19: Concurrent Rendering & Transitions

React 18 and 19 represent a generational shift in how React manages time and priority. With **Concurrent Rendering**, React can prepare multiple versions of the UI simultaneously in the background without blocking the main thread.

In this lesson, you will learn how to prioritize urgent user interactions over heavy background updates using `useTransition`, defer expensive computations with `useDeferredValue`, and leverage modern React 19 features.

## Urgent vs Non-Urgent (Transition) Updates

User interactions fall into two categories:
1. **Urgent Updates**: Direct physical interactions (typing in an input, clicking a button, pressing enter). Users expect instantaneous 60fps feedback.
2. **Transition (Non-Urgent) Updates**: Transitioning from one view to another, filtering large search lists, or rendering complex data charts. A slight delay is acceptable.

Before React 18, all state updates were urgent, meaning heavy chart filtering would freeze the text input during typing.

## Prioritizing UI with `useTransition`

The `useTransition` hook lets you mark state updates as non-urgent transitions:

```jsx
import { useState, useTransition } from 'react';

export function FilterableCatalog({ allProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState(allProducts);
  const [isPending, startTransition] = useTransition();

  function handleSearchChange(e) {
    const value = e.target.value;
    // 1. URGENT: Update input text immediately:
    setSearchTerm(value);

    // 2. NON-URGENT: Filter 10,000 items in background transition:
    startTransition(() => {
      const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(results);
    });
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Type to filter..."
      />
      {isPending && <span className="spinner">Updating results...</span>}
      <ProductList items={filteredList} />
    </div>
  );
}
```

## Deferring Values with `useDeferredValue`

When you receive a value via props and want to defer rendering heavy child components until urgent updates finish, use `useDeferredValue`:

```jsx
import { useDeferredValue } from 'react';

export function SearchResultsPage({ query }) {
  // Deferred query lags behind urgent typing:
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      <HeavyChart query={deferredQuery} />
    </div>
  );
}
```

## Automatic Batching Across All Asynchronous Handlers

In React 18 and 19, state updates are automatically batched regardless of where they occur—inside promises, `setTimeout`, or native event listeners:

```javascript
// In React 18/19: Triggers exactly ONE re-render!
fetchData().then(() => {
  setIsLoading(false);
  setData(result);
  setError(null);
});
```

## Best Practices

- **Wrap Heavy Filtering in `startTransition`**: Keep text inputs snappy by delegating expensive filtering and graph re-renders to background transitions.
- **Use `isPending` for Visual Cues**: Give users subtle feedback (opacity changes or spinners) while transitions compute in the background.
- **Do Not Wrap Controlled Inputs in Transitions**: State that controls input text values must remain urgent to prevent input lag.

## Summary

Concurrent rendering in React 18 and 19 enables non-blocking, interruptible UI updates. By utilizing `useTransition` and `useDeferredValue`, you keep user interfaces responsive even under demanding computational loads.
