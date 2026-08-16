---
title: "Advanced Hooks: useContext, useReducer, useMemo, useCallback"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 16
description: "Mastering advanced React hooks: useContext for context, useReducer for complex state, useMemo and useCallback for optimization."
---

# Advanced Hooks: useContext, useReducer, useMemo, useCallback

As React applications grow, managing state with simple `useState` and `useEffect` hooks can become cumbersome. When multiple components share global data, state transitions involve complex logic, or expensive calculations impact frame rates, advanced hooks provide the solution.

In this lesson, you will master `useContext` for eliminating prop drilling, `useReducer` for managing complex state transitions, and `useMemo` / `useCallback` for optimizing performance.

## 1. `useContext`: Eliminating Prop Drilling

When deeply nested components need access to global state (such as the authenticated user, theme settings, or language locale), passing props through dozens of intermediate components is called **prop drilling**.

The **Context API** solves this by providing a direct communication pipeline from a provider down to any consuming child in the tree:

```jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Create Context:
const ThemeContext = createContext('light');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 2. Custom consumption hook:
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## 2. `useReducer`: Managing Complex State Transitions

When component state involves multiple sub-values or the next state depends on complex conditional logic, `useReducer` is superior to `useState`. It follows the Redux-style reducer pattern:

```jsx
import { useReducer } from 'react';

const initialState = { count: 0, step: 1 };

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step };
    case 'DECREMENT':
      return { ...state, count: state.count - state.step };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function CounterWithReducer() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <h3>Count: {state.count}</h3>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

## 3. `useMemo`: Memoizing Expensive Calculations

Every time a component re-renders, all code inside the function body runs again. If you have an expensive calculation (such as filtering or sorting 10,000 items), `useMemo` caches the calculated result between renders:

```jsx
import { useState, useMemo } from 'react';

function ProductList({ products }) {
  const [search, setSearch] = useState('');

  // Re-calculates ONLY when 'products' or 'search' changes:
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <ul>
        {filteredProducts.map(p => <li key={p.id}>{p.title}</li>)}
      </ul>
    </div>
  );
}
```

## 4. `useCallback`: Memoizing Function References

In JavaScript, functions created inside components get a new memory reference on every render. When passing callback functions to memoized child components (`React.memo`), changing function references forces the child to re-render unnecessarily.

`useCallback` memoizes the function definition across renders:

```jsx
import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // Maintains the identical function reference between renders:
  const handleDelete = useCallback((id) => {
    console.log('Deleting item:', id);
  }, []); // Empty dependencies = same reference forever

  return <MemoizedChildList onDelete={handleDelete} />;
}
```

## 5. `useLayoutEffect` vs `useEffect`

While `useEffect` runs asynchronously **after** the browser paints the screen to avoid blocking visual updates, `useLayoutEffect` runs synchronously **before** the browser paints.

Use `useLayoutEffect` only when measuring DOM element dimensions (like tooltips or popover positioning) to prevent visual flicker before the user sees the screen.

## Best Practices

- **Do Not Over-Optimize**: `useMemo` and `useCallback` carry memory overhead. Use them when profiling shows measurable performance benefits or when passing props to `React.memo` children.
- **Always Validate Context**: Wrap context consumption in custom hooks that throw descriptive errors if consumed outside their provider.
- **Prefer `useReducer` for Complex State**: When multiple state variables depend on each other, `useReducer` makes state transitions predictable.

## Summary

Advanced React hooks give you granular control over state flow, architecture, and performance. `useContext` shares state across trees, `useReducer` manages complex state transitions, and `useMemo` / `useCallback` ensure smooth rendering performance.
