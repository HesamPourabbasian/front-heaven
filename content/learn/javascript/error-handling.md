---
title: 'Error Handling'
description: 'Create, throw, catch and recover from errors with Error objects and try/catch/finally.'
order: 22
difficulty: 'beginner'
category: 'Level 8 - Error Handling'
estimatedMinutes: 25
prerequisites:
  - learn/javascript/browser-javascript
---

## Errors as control flow

Use `Error` objects with meaningful messages and throw when a function cannot fulfill its contract. Catch errors at a boundary where you can recover, show feedback or log context.

```js
try {
  parseConfiguration(text)
} catch (error) {
  console.error('Configuration failed', error)
} finally {
  cleanup()
}
```

Do not catch and silently ignore. Preserve the original error, distinguish expected validation failures from programmer bugs, and remember that async functions require `try/catch` around `await`.

## Summary

Errors should be specific, observable and handled at the right boundary. Recovery is a product decision, not merely a syntax feature.

## Practice

Write a parser that throws a custom error, catch it in a form handler, and always run cleanup in `finally`.
