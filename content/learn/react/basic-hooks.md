---
title: "Basic Hooks: useState, useEffect, useRef"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 25
order: 12
description: "Deep dive into essential React hooks: useState for state, useEffect for side effects, and useRef for DOM refs."
---

# Basic Hooks: useState, useEffect, useRef

Hooks were introduced in React 16.8 to allow functional components to use state, lifecycle methods, and other React features without writing class components. Hooks make it easy to extract and share reusable stateful logic across components.

In this lesson, we examine the three fundamental React hooks that you will use in almost every application: `useState` for state management, `useEffect` for side effects and synchronization, and `useRef` for mutable references and DOM access.

## The Rules of Hooks

Before diving into individual hooks, you must follow two strict rules enforced by the React ESLint plugin:
1. **Only call hooks at the top level**: Do not call hooks inside loops, conditions, or nested functions. Always call hooks at the top level of your React function before any early returns.
2. **Only call hooks from React functions**: Call hooks only from React functional components or custom hooks (functions starting with `use`).

## 1. `useState`: Managing Component State

As learned in earlier lessons, `useState` allows a component to remember data between renders and triggers a re-render whenever the state is updated:

```jsx
const [isOpen, setIsOpen] = useState(false);
```

## 2. `useEffect`: Managing Side Effects & Synchronization

React components should be pure during rendering—they should calculate JSX without modifying the outside world. Any operation that interacts with the outside world (fetching data from APIs, setting timers, manually manipulating DOM elements, or subscribing to WebSockets) is called a **side effect**.

`useEffect` lets you run side effects after React has rendered the component:

```jsx
import { useState, useEffect } from 'react';

function DocumentTitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Side effect: Synchronize document title with React state:
    document.title = `You clicked ${count} times`;
  }, [count]); // Dependency array: Re-run only when 'count' changes

  return <button onClick={() => setCount(count + 1)}>Click Me</button>;
}
```

### Understanding the Dependency Array
The second argument to `useEffect` is the **dependency array**:
- **No array passed**: Runs after *every single render*.
- **Empty array `[]`**: Runs *only once* after the initial mount (similar to componentDidMount).
- **Array with values `[propA, stateB]`**: Runs after mount and whenever `propA` or `stateB` changes.

### Effect Cleanup Functions
If your effect creates an ongoing subscription, event listener, or timer, it must return a **cleanup function** to prevent memory leaks:

```jsx
function WindowResizeListener() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup function: Executed when component unmounts or before effect re-runs:
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <p>Window width: {windowWidth}px</p>;
}
```

## 3. `useRef`: Referencing Values Without Re-Rendering

`useRef` returns a mutable object with a single `.current` property. It serves two primary use cases:

### A. Accessing and Manipulating Real DOM Elements
When you need to focus an input, measure DOM node dimensions, or control video playback:
```jsx
import { useRef } from 'react';

function SearchBox() {
  const inputRef = useRef(null);

  function handleFocus() {
    inputRef.current?.focus(); // Directly focus the DOM element
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}
```

### B. Storing Mutable Values That Don't Trigger Re-Renders
Unlike state variables, mutating `ref.current` **does not trigger a re-render**. This makes refs perfect for storing timer IDs, previous state values, and request abort controllers:
```jsx
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const timerIdRef = useRef(null);

  function start() {
    if (timerIdRef.current) return;
    timerIdRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(timerIdRef.current);
    timerIdRef.current = null;
  }

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

## Best Practices

- **Always Clean Up Subscriptions in `useEffect`**: Return cleanup functions for event listeners, timers, and WebSockets.
- **Include All Used Variables in Dependency Arrays**: Omitting dependencies leads to stale closure bugs.
- **Don't Overuse `useRef` for UI Logic**: Use state if changes should update the screen; use refs only for imperative DOM access or non-rendering values.

## Summary

`useState`, `useEffect`, and `useRef` form the foundational hook toolkit in React. Together, they allow you to maintain reactive state, synchronize side effects with external systems, and interact with the DOM without leaving the functional paradigm.
