---
title: "Global State Management: Zustand vs Context vs Redux"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 21
description: "Comparing global state management solutions: React Context API, Zustand lightweight store, and Redux Toolkit."
---

# Global State Management: Zustand vs Context vs Redux

Not all state belongs in a single component. Global state—such as user authentication sessions, active shopping carts, notification queues, and application preferences—needs to be accessed and modified across completely unrelated component subtrees.

In this lesson, you will evaluate when global state is truly necessary and compare the three leading solutions in the React ecosystem: the built-in **Context API**, lightweight **Zustand**, and enterprise **Redux Toolkit**.

## When Do You Need Global State?

Before reaching for an external global state library, ask these questions:
1. **Can this state live in a parent component and be passed down?** (Local state)
2. **Is this state actually data fetched from an API?** (Use TanStack Query instead)
3. **Does this state need to be shared across completely decoupled routes or components?** (Use Global State)

```text
                 STATE CATEGORIES
 ┌──────────────────────┬──────────────────────┐
 │ CLIENT UI STATE      │ SERVER CACHE STATE   │
 │ (Cart, Theme, Auth)  │ (Users, Products)    │
 ├──────────────────────┼──────────────────────┤
 │ Zustand / Redux /    │ TanStack Query /     │
 │ Context API          │ SWR / RTK Query      │
 └──────────────────────┴──────────────────────┘
```

## 1. React Context API (Built-in)

The Context API is built directly into React. It is ideal for low-frequency global state that rarely changes (e.g. theme toggle, current language, active user profile).

**Drawback**: When a Context value updates, *every single component that consumes that context re-renders*, even if it only uses an unchanged slice of the data.

## 2. Zustand: Lightweight & High Performance (Recommended)

**Zustand** is a modern, minimalist state management library built on React hooks. It has zero boilerplate, requires no context providers, and features fine-grained selector subscriptions to eliminate unnecessary re-renders.

### Creating a Zustand Store:
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find(i => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    { name: 'shopping-cart-storage' } // Persists automatically to localStorage!
  )
);
```

### Consuming the Store with Selectors:
```jsx
function CartBadge() {
  // Re-renders ONLY when items.length changes!
  const count = useCartStore(state => state.items.length);
  return <span className="badge">{count}</span>;
}
```

## 3. Redux Toolkit (RTK): Enterprise Standard

**Redux Toolkit (RTK)** is the official, opinionated toolset for standard Redux development. It provides predictable, unidirectional state mutations using slices, actions, and reducers.

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; }, // Immer allows mutable syntax!
    decrement: state => { state.value -= 1; },
    incrementByAmount: (state, action) => { state.value += action.payload; },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const store = configureStore({ reducer: { counter: counterSlice.reducer } });
```

## Comparison Matrix

| Feature | Context API | Zustand | Redux Toolkit |
| :--- | :--- | :--- | :--- |
| **Setup Boilerplate** | Low | Ultra Low | Moderate |
| **Bundle Size** | 0 kB (Built-in) | ~1.2 kB | ~11 kB |
| **Selectors & Perf** | Poor (Renders all consumers) | Excellent | Excellent |
| **DevTools Support** | Basic React DevTools | Redux DevTools supported | First-Class Redux DevTools |
| **Best For** | Theme, Auth info | Modern Apps, SPAs | Large Enterprise Teams |

## Best Practices

- **Choose Zustand for New Projects**: Zustand delivers the cleanest developer experience and performance with minimal code.
- **Separate Server State from UI State**: Do not store API responses in global stores—use TanStack Query for server state.
- **Always Use Selectors**: When consuming stores, pick only the specific properties needed (`useCartStore(s => s.items)`) to avoid wasted re-renders.

## Summary

Global state management centralizes cross-cutting client data. While Context API suffices for simple static values and Redux Toolkit powers large enterprise codebases, Zustand represents the modern sweet spot for performance, simplicity, and developer velocity.
