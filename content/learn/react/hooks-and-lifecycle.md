---
title: 'React Hooks & useEffect'
description: 'Master useEffect for side effects, dependency arrays, cleanup functions, and custom reusable hooks.'
order: 4
difficulty: 'intermediate'
category: 'Hooks & Lifecycle'
estimatedMinutes: 25
prerequisites:
  - /learn/react/props-and-state
---

## The `useEffect` Hook

`useEffect` synchronizes components with external systems (APIs, timers, event listeners):

```jsx
import { useState, useEffect } from 'react';

function WindowResizeWatcher() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup function runs when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array = runs once on mount

  return <p>Window width: {width}px</p>;
}
```

---

## Summary & Key Takeaways

- Dependency array controls when effects re-run.
- Always return a cleanup function for timers and event listeners.
