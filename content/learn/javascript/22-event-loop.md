---
title: 'The Event Loop'
description: 'Master the JavaScript Event Loop architecture: Call Stack, Memory Heap, Task Queue (Macrotasks), Microtask Queue, rendering cycles, setTimeout, setInterval, queueMicrotask, and requestAnimationFrame.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/21-asynchronous-javascript
---

# The Event Loop

JavaScript's runtime model is based on an **Event Loop**, which is responsible for executing code, collecting and processing events, and executing queued sub-tasks. Because JavaScript is single-threaded, it cannot execute two blocks of JavaScript simultaneously on the main thread. To remain responsive while handling asynchronous operations, the engine coordinates the **Call Stack**, the **Memory Heap**, the **Microtask Queue**, the **Macrotask (Task) Queue**, and the browser's **Rendering Pipeline**.

Understanding the exact priority and execution ordering of microtasks versus macrotasks is essential for building fluid 60fps/120fps user interfaces, preventing UI thread freezing, and diagnosing asynchronous race conditions.

In this lesson, we will dissect the anatomy of the Event Loop, examine Call Stack execution, contrast the Microtask Queue (Promises, `queueMicrotask`) against the Task Queue (`setTimeout`, `setInterval`, I/O), analyze browser rendering steps, and explore animation scheduling with `requestAnimationFrame()`.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        The Event Loop Mechanism                        │
├────────────────────────────────────────────────────────────────────────┤
│  1. Execute synchronous script until Call Stack is EMPTY               │
│                                                                        │
│  2. Drain ENTIRE Microtask Queue (Promises, queueMicrotask, MutationObs)│
│     (Any microtasks scheduled DURING this drain execute immediately)   │
│                                                                        │
│  3. Check if Browser Rendering Cycle is Due                            │
│     (Execute requestAnimationFrame callbacks, Style, Layout, Paint)    │
│                                                                        │
│  4. Dequeue and execute ONE Macrotask (setTimeout, I/O, UI event)      │
│                                                                        │
│  5. Loop back to Step 2                                                │
└────────────────────────────────────────────────────────────────────────┘
```

## The Call Stack and Memory Heap

- **Memory Heap**: An unstructured region of memory where objects, arrays, closures, and functions are allocated dynamically.
- **Call Stack**: A Last-In, First-Out (LIFO) data structure that tracks active execution context stack frames. When a function is called, a frame is pushed onto the stack. When the function returns, its frame is popped off. If code executes a synchronous calculation that takes 5 seconds, the Call Stack is blocked for 5 seconds—freezing the browser tab entirely.

## Macrotasks (Task Queue) vs Microtasks (Microtask Queue)

Asynchronous callbacks do not enter the Call Stack directly; they wait inside two distinct priority queues:

1. **Microtask Queue (High Priority)**:
   - Sources: `Promise` callbacks (`.then`, `.catch`, `.finally`), `await` continuations, `queueMicrotask()`, and `MutationObserver`.
   - Rule: **The engine drains the entire microtask queue completely** before yielding control or executing any macrotask.
2. **Macrotask / Task Queue (Standard Priority)**:
   - Sources: `setTimeout`, `setInterval`, `setImmediate` (Node.js), I/O events, and user interaction events (`click`, `keydown`).
   - Rule: The event loop picks and executes **only one single macrotask** per cycle before re-checking the microtask queue.

```javascript
console.log("1. Synchronous Start");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise)");
});

console.log("2. Synchronous End");

// Execution Output Order:
// 1. Synchronous Start
// 2. Synchronous End
// 3. Microtask (Promise)
// 4. Macrotask (setTimeout)
```

## `queueMicrotask()`

The `queueMicrotask()` API allows developers to explicitly schedule a function to run in the microtask queue without needing to construct a dummy `Promise.resolve().then()`:

```javascript
function logAnalyticsEvent(eventName, payload) {
  console.log("Buffering event:", eventName);

  // Schedules immediate execution right after current synchronous code finishes
  queueMicrotask(() => {
    console.log("Flushing buffered event to telemetry socket:", eventName);
  });
}
```

## The Browser Rendering Cycle and `requestAnimationFrame()`

Browsers aim to refresh the screen 60 times per second (every ~16.6 milliseconds) or 120 times per second on high-refresh displays. Before drawing a new frame, the browser executes:
1. `requestAnimationFrame` (rAF) callbacks.
2. Style recalculations (Recalculate Style).
3. Layout calculations (Reflow).
4. Painting (Rasterization and Compositing).

**`requestAnimationFrame(callback)`** schedules a callback to execute **immediately prior to the browser's next screen repaint**. It is the only reliable API for buttery-smooth JavaScript-driven animations, automatically pausing when the user switches tabs to save CPU and battery power.

```javascript
const box = document.querySelector("#animated-box");
let position = 0;

function animate() {
  position += 2;
  box.style.transform = `translateX(${position}px)`;

  if (position < 400) {
    // Request next frame synchronization
    requestAnimationFrame(animate);
  }
}

// Start animation
requestAnimationFrame(animate);
```

## Timers: `setTimeout` and `setInterval`

- **`setTimeout(fn, delayMs)`**: Schedules a macrotask callback to run after **at least** `delayMs` milliseconds have elapsed. (The actual execution may be delayed further if the Call Stack or Microtask queue is busy).
- **`setInterval(fn, intervalMs)`**: Repeatedly schedules a macrotask callback every `intervalMs` milliseconds.

**The `setInterval` Drift Pitfall**: If the task inside `setInterval` takes longer to execute than the interval duration, calls can queue up back-to-back without spacing. Prefer recursive `setTimeout` to guarantee consistent spacing between asynchronous tasks.

```javascript
// Reliable recurring polling with recursive setTimeout
function pollServerStatus() {
  setTimeout(async () => {
    try {
      await checkServerHealth();
    } catch (err) {
      console.warn("Health check failed:", err);
    } finally {
      // Schedules next poll ONLY after previous poll has finished
      pollServerStatus();
    }
  }, 5000);
}
```

## Summary

The JavaScript Event Loop balances synchronous execution on the Call Stack with asynchronous task queues. The engine always executes synchronous script first, followed by draining the entire Microtask Queue (`Promise`, `queueMicrotask`), checking the browser Rendering Pipeline (`requestAnimationFrame`), and finally processing one Macrotask (`setTimeout`). Never block the Call Stack with heavy synchronous calculations, and use `requestAnimationFrame` for visual animations.

## Best Practices

1. **Never Starve the Event Loop with Infinite Microtasks**: Recursively queuing microtasks (`queueMicrotask`) will block the Event Loop indefinitely, freezing the UI and starving macrotasks.
2. **Use `requestAnimationFrame` for DOM Animations**: Never use `setTimeout` or `setInterval` for visual animations.
3. **Prefer Recursive `setTimeout` Over `setInterval`**: Recursive `setTimeout` guarantees that the next execution begins only after the previous asynchronous task has completed.
4. **Offload Heavy Computation to Web Workers**: Heavy CPU calculations (image processing, data crunching) should run in background Web Workers to prevent blocking the main thread.
5. **Always Clear Timers on Teardown**: Store timer IDs from `setTimeout`/`setInterval` and invoke `clearTimeout`/`clearInterval` when components unmount.
