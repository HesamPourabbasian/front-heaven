---
title: Event Loop
description: Understand the call stack, task queue and microtask queue that keep JavaScript responsive.
order: 23
difficulty: intermediate
category: Level 9 - Asynchronous JavaScript
estimatedMinutes: 30
prerequisites:
  - learn/javascript/scope-and-function-execution
  - learn/javascript/error-handling
---

## Scheduling

JavaScript runs synchronous code on a call stack. Browser APIs finish work later and queue callbacks. Microtasks from promises run after the current stack and before the next task such as a timer.

```js
console.log('A')
setTimeout(() => console.log('timer'))
Promise.resolve().then(() => console.log('microtask'))
console.log('B')
// A, B, microtask, timer
```

Long synchronous work blocks rendering and input. Split expensive work, use workers for CPU-heavy tasks, and avoid recursively flooding the microtask queue.

## Summary

The event loop explains ordering and responsiveness: finish the stack, drain microtasks, then process the next task.

## Practice

Predict the output of three examples combining `console.log`, `queueMicrotask`, promises and timers before running them.
