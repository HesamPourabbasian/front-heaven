---
title: 'Signals, Memos & Effects in Solid'
description: 'Master createSignal, createMemo, createEffect, and reactive lifecycle in SolidJS.'
order: 2
difficulty: 'intermediate'
category: 'Reactivity'
estimatedMinutes: 20
prerequisites:
  - /learn/solidjs/introduction-to-solidjs
---

## Reactive Primitives

```jsx
import { createSignal, createMemo, createEffect } from 'solid-js';

const [count, setCount] = createSignal(1);
const double = createMemo(() => count() * 2);

createEffect(() => {
  console.log('Double count updated:', double());
});
```

---

## Summary & Key Takeaways

- `createMemo` caches computed values.
- Effects run automatically whenever read signals change.
