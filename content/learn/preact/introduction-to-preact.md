---
title: 'Introduction to Preact'
description: 'Learn the lightweight 3kB React alternative with identical modern APIs, Signals, and preact/compat.'
order: 1
difficulty: 'intermediate'
category: 'Preact Fundamentals'
estimatedMinutes: 15
prerequisites:
  - /learn/javascript/functions-and-parameters
---

## Why Preact?

**Preact** is a fast 3kB alternative to React with the same modern API. It provides the thinnest possible Virtual DOM abstraction on top of the DOM.

---

## Preact Signals

```jsx
import { signal } from '@preact/signals';

const count = signal(0);

function Counter() {
  return <button onClick={() => count.value++}>Count: {count}</button>;
}
```

---

## Summary & Key Takeaways

- Preact offers 100% React compatibility via `preact/compat` at a fraction of bundle size.
