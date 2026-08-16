---
title: 'Async/Await'
description: 'Write promise-based code in readable sequential syntax with async functions and await.'
order: 27
difficulty: 'intermediate'
category: 'Level 9 - Asynchronous JavaScript'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/promises
---

## Async functions

An `async` function always returns a promise. `await` pauses that function until a promise settles; it does not block the JavaScript thread. Handle failures with `try/catch`.

```js
async function loadUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Loading user failed', error)
    throw error
  }
}
```

Do not await independent requests sequentially; start them first and use `Promise.all`. Cancellation still requires an `AbortSignal`.

## Summary

Async/await improves readability while preserving promise semantics. Always define error, cancellation and concurrency behavior.

## Practice

Convert a promise chain to async/await, add an error boundary, then parallelize two independent awaits.
