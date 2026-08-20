---
title: 'Introduction to SolidJS'
description: 'Discover SolidJS: JSX syntax with fine-grained reactivity, zero virtual DOM, and compile-to-DOM efficiency.'
order: 1
difficulty: 'intermediate'
category: 'SolidJS Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/javascript/06-functions
---

## What is SolidJS?

**SolidJS** is a declarative JavaScript library for creating user interfaces. It uses JSX, but unlike React, components run **only once**. Only the specific text nodes and attributes bound to Signals update!

---

## Fine-Grained Reactive Signals

```jsx
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count is: {count()}
    </button>
  );
}
```

---

## Summary & Key Takeaways

- Solid components do not re-render repeatedly—reactivity binds directly to DOM nodes.
