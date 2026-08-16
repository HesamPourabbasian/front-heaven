---
title: 'Props & useState Hook'
description: 'Learn one-way data flow, passing props, component state with useState, and immutable state updates.'
order: 3
difficulty: 'intermediate'
category: 'State Management'
estimatedMinutes: 25
prerequisites:
  - /learn/react/jsx-and-components
---

## Props: Unidirectional Data Flow

Props are read-only properties passed from parent components down to child components:

```jsx
function PrimaryButton({ label, onClick }) {
  return <button onClick={onClick} className="btn-primary">{label}</button>;
}
```

---

## State with `useState`

State holds dynamic data that triggers re-renders when updated:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Count is {count}
    </button>
  );
}
```

---

## Summary & Key Takeaways

- Props flow strictly down; state is local to the component.
- Never mutate state directly—always use setter functions (`setCount`).
