---
title: 'Introduction to React'
description: 'Understand what React is, declarative programming, component-driven architecture, and the Virtual DOM.'
order: 1
difficulty: 'intermediate'
category: 'React Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/javascript/functions-and-parameters
---

## What is React?

**React** is an open-source JavaScript library developed by Meta for building declarative, efficient, and flexible user interfaces based on reusable UI components.

---

## Declarative vs. Imperative UI

- **Imperative (Vanilla DOM)**: You manually step through DOM manipulations (`document.createElement`, `appendChild`, `classList.add`).
- **Declarative (React)**: You describe *what* the UI should look like for a given state, and React handles DOM updates automatically.

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

---

## The Virtual DOM & Reconciliation

When state changes:
1. React creates a new lightweight Virtual DOM snapshot in memory.
2. React runs the **Diffing Algorithm** (Reconciliation) to compute minimal changes.
3. React applies only the changed DOM nodes to the real browser DOM.

---

## Summary & Key Takeaways

- React uses declarative components to describe UI state.
- Components are composable, testable, and reusable building blocks.
- The Virtual DOM ensures optimal browser DOM mutations.
