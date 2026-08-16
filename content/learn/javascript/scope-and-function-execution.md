---
title: Scope and Function Execution
description: Understand lexical scoping, the function stack, closures and recursion.
order: 17
difficulty: intermediate
category: Level 6 - Scope and Execution
estimatedMinutes: 35
prerequisites:
  - learn/javascript/functions-and-parameters
---

## Lexical scope and the stack

JavaScript resolves names through nested lexical environments. A function can read outward, never inward. Calls create execution contexts on the call stack; returning removes them.

Closures preserve references to variables from their creation scope:

```js
function makeCounter() { let count = 0; return () => ++count }
const next = makeCounter()
```

Recursion is a function calling itself. Give it a base case and make each call approach it, or the stack will overflow.

## Summary

Lexical scope explains visibility, the stack explains calls, closures explain retained state, and recursion explains repeated self-similar work.

## Practice

Write a recursive factorial with a base case, then build a closure-based counter and draw the environments each call creates.
