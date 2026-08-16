---
title: "Building Custom React Hooks"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 17
description: "Extracting and reusing stateful logic across components: useFetch, useLocalStorage, useDebounce, and useAuth."
---

# Building Custom React Hooks

One of the greatest strengths of the React Hook model is the ability to create **Custom Hooks**. A custom hook is a standard JavaScript function whose name begins with `use` and that calls other React hooks (`useState`, `useEffect`, `useRef`, etc.).

In this lesson, you will learn how to extract reusable stateful logic into custom hooks, follow hook composition patterns, and build essential real-world hooks including `useFetch`, `useLocalStorage`, and `useDebounce`.

## Why Build Custom Hooks?

When building web applications, you frequently encounter scenarios where different components require the same stateful logic—such as fetching data from an endpoint, syncing with localStorage, listening to window resize events, or debouncing user search input.

Before hooks, sharing this logic required complex patterns like Higher-Order Components (HOCs) or Render Props. Custom hooks allow you to package stateful logic into clean, testable, and reusable functions with zero JSX boilerplate.

## 1. `useLocalStorage`: Persistent State Hook

This custom hook behaves exactly like `useState`, but automatically synchronizes value changes with the browser's `localStorage`:

```javascript
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  }, [key, value]);

  return [value, setValue];
}
```

### Consuming `useLocalStorage`:
```jsx
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'dark');

  return (
    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
      Current Theme: {theme}
    </button>
  );
}
```

## 2. `useDebounce`: Rate-Limiting Rapid Value Changes

When a user types into a live search input, you don't want to execute an API request on every single keystroke. `useDebounce` delays updating a value until the user pauses typing:

```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
```

## 3. `useFetch`: Declarative Data Fetching Hook

```javascript
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(result => {
        if (!isCancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

## Rules for Custom Hooks

1. **Name Must Start with `use`**: React linters use the `use` prefix to ensure hook rules (like unconditional calls) are applied to your custom function.
2. **Each Call Has Isolated State**: Custom hooks share *stateful logic*, not actual state. Calling `useLocalStorage` in two different components creates two completely independent state instances.

## Best Practices

- **Keep Hooks Focused**: A custom hook should handle one distinct responsibility (e.g. data fetching, media queries, keybindings).
- **Return Objects for 3+ Values**: If your hook returns multiple values, returning an object (`{ data, loading, error }`) is cleaner than long positional arrays.
- **Always Include Cleanup**: Clean up timers, event listeners, and subscriptions inside the hook's `useEffect`.

## Summary

Custom hooks allow you to extract complex stateful logic and side effects into clean, reusable functions. By composing built-in React hooks into domain-specific utilities like `useFetch`, `useDebounce`, and `useLocalStorage`, you dramatically reduce component complexity across your codebase.
