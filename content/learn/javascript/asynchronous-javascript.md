---
title: Asynchronous JavaScript
description: Schedule delayed and repeated work with setTimeout and setInterval without blocking the page.
order: 24
difficulty: beginner
category: Level 9 - Asynchronous JavaScript
estimatedMinutes: 25
prerequisites:
  - learn/javascript/event-loop
---

## Timers

`setTimeout` schedules one callback after a minimum delay; it does not interrupt current code. `setInterval` repeats until cleared.

```js
const id = setInterval(() => updateClock(), 1000)
setTimeout(() => clearInterval(id), 10000)
```

Timers are not exact clocks: blocked work delays them. Always clear timers when a component or page feature is removed. For animation, use `requestAnimationFrame`; for debouncing, reset one timeout whenever input changes.

## Summary

Timers schedule work, they do not guarantee an execution time. Keep handles, cancel them, and choose the browser scheduler that matches the work.

## Practice

Implement a debounced search timer and a countdown that clears itself at zero. Test both when the tab is backgrounded.
