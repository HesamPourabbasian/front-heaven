---
title: "Component Lifecycle Concepts"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 20
order: 13
description: "Understanding mounting, updating, unmounting, re-rendering triggers, and reconciliation."
---

# Component Lifecycle Concepts

Every React component goes through a lifecycle: it is born (**Mounting**), changes over time (**Updating**), and eventually disappears from the screen (**Unmounting**). Understanding this lifecycle is critical for writing performant components, managing asynchronous operations, and avoiding memory leaks.

In this lesson, you will learn how modern functional components navigate the lifecycle, what triggers re-renders, and how React reconciles changes.

## The Three Lifecycle Phases

```text
1. MOUNTING  ──►  Component is created and inserted into the real DOM
      │
2. UPDATING  ──►  Props or State change; component re-renders
      │
3. UNMOUNTING ──►  Component is removed from the real DOM
```

### 1. Mounting
Mounting occurs when a component is rendered onto the screen for the first time. During mounting:
- React runs the component function to calculate initial JSX.
- React inserts the resulting nodes into the real browser DOM.
- `useEffect` hooks with empty dependency arrays `[]` execute after the initial paint.

### 2. Updating
Updating occurs whenever a component's state or props change. During updating:
- The component function re-executes to compute the new Virtual DOM tree.
- React compares (diffs) the new Virtual DOM with the old Virtual DOM.
- React updates only the specific real DOM nodes that actually changed.
- `useEffect` hooks with dependencies execute if their watched variables changed.

### 3. Unmounting
Unmounting occurs when a component is removed from the DOM (e.g. user navigates away, closes a modal, or an item is deleted). During unmounting:
- React executes the **cleanup functions** returned from `useEffect` hooks to remove event listeners, cancel active timers, and abort pending network requests.
- The component DOM nodes are garbage collected.

## What Triggers a Component Re-Render?

A React component re-renders when:
1. **Its internal state changes** via `useState` or `useReducer`.
2. **Its parent component re-renders** (by default, all children re-render when a parent re-renders).
3. **A Context value it consumes changes** via `useContext`.
4. **Its props change**.

## Why Components Re-Render & The Pure Render Mindset

Re-rendering is not a bug; it is how React updates the view to reflect new state. However, understanding that rendering simply means *calling the component function* is crucial:

```jsx
function Profile({ username }) {
  console.log('Profile component is rendering...'); // Runs on every render!

  return <div>Hello, {username}!</div>;
}
```

When a component re-renders:
- All local variables inside the function are re-created.
- The return statement calculates new JSX objects.
- React runs diffing to apply minimal updates to the browser.

## Visualizing Lifecycle with `useEffect`

```jsx
import { useState, useEffect } from 'react';

function LifecycleDemo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('1. MOUNT: Component has appeared on screen.');

    return () => {
      console.log('3. UNMOUNT: Component is being removed from screen.');
    };
  }, []); // Runs on mount, cleans up on unmount

  useEffect(() => {
    console.log('2. UPDATE: Count has changed to:', count);
  }, [count]); // Runs whenever 'count' updates

  return <button onClick={() => setCount(c => c + 1)}>Increment ({count})</button>;
}
```

## Best Practices

- **Always Clean Up on Unmount**: Cancel pending timeouts and remove global event listeners in cleanup functions.
- **Keep Render Functions Free of Side Effects**: Never trigger network calls, timers, or state updates directly inside the component body—use `useEffect` or event handlers.
- **Do Not Fear Re-Renders**: React's Virtual DOM diffing is fast. Optimize with `React.memo` only when profiling reveals actual performance bottlenecks.

## Summary

The component lifecycle describes how components appear (mount), update (re-render), and disappear (unmount). In modern functional React, `useEffect` and its cleanup return function provide complete control over synchronization across all lifecycle phases.
