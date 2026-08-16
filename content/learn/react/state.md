---
title: "State & useState Hook"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 25
order: 10
description: "Understanding component state, useState hook, state immutability, batching, and functional state updates."
---

# State & useState Hook

While **props** allow components to receive data from their parents, **state** allows a component to remember and manage its own private, dynamic data over time. When state changes, React automatically re-renders the component to update the user interface.

In this lesson, you will learn how to declare and update state using the `useState` hook, why state immutability is mandatory, how React batches state updates, and how to use functional state updates safely.

## What is State?

State represents the memory of a component. Examples of state include:
- The current count of a counter.
- The text typed into an input field.
- An expanded/collapsed accordion toggle.
- Data fetched from a backend API.

Unlike regular local variables (which reset on every render), state variables persist across re-renders.

## The `useState` Hook

To add state to a functional component, import `useState` from React:

```jsx
import { useState } from 'react';

function Counter() {
  // Declare a state variable named 'count' with initial value 0:
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Current Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

`useState` returns an array with exactly two elements:
1. **The current state value** (`count`).
2. **The state updater function** (`setCount`), which updates the value and schedules a re-render.

## State Immutability (Never Mutate State Directly!)

In React, you must **never modify state objects or arrays directly**. Always treat state as read-only and create a new copy when updating:

```jsx
// ❌ WRONG: Direct mutation does NOT trigger a re-render!
user.age = 25;
setUser(user);

// ✅ CORRECT: Create a new object using object spread:
setUser({ ...user, age: 25 });

// ❌ WRONG: Array push mutates original memory reference!
todos.push('New item');
setTodos(todos);

// ✅ CORRECT: Create a new array using array spread:
setTodos([...todos, 'New item']);
```

React checks whether state has changed by comparing object references (`Object.is(prev, next)`). If you mutate an existing object in place, the reference remains identical, and React will skip the re-render.

## Functional State Updates

When your next state depends on the previous state value, pass an updater function to `setState` instead of a raw value. The updater function receives the guaranteed latest state as its argument:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleAddThree() {
    // Functional updates guarantee each increment uses the latest value:
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }

  return <button onClick={handleAddThree}>Add 3 (Current: {count})</button>;
}
```

## Automatic State Batching

React optimizes performance by **batching** multiple state updates that happen inside the same event handler into a single re-render.

For example, if you update three different state variables inside a single button click, React does not re-render the component three times. Instead, it combines them and re-renders the component once after the event handler completes.

## Initializing State with a Function (Lazy Initial State)

If computing your initial state requires expensive calculations (such as parsing large localStorage items), pass a function to `useState`. React will only execute the function on the initial mount:

```jsx
const [todos, setTodos] = useState(() => {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [];
});
```

## Best Practices

- **Group Related State**: If multiple state variables always change together, combine them into a single state object.
- **Avoid Redundant State**: Do not store values in state if they can be calculated directly from existing props or state during render.
- **Always Use Functional Updates for Previous State**: Use `setCount(c => c + 1)` whenever the new value depends on the previous one.

## Summary

State enables React components to remember information and respond dynamically to user interactions. By using `useState`, respecting state immutability, using functional updates, and leveraging automatic batching, you ensure reliable, high-performance UI state management.
