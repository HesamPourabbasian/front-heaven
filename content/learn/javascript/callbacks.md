---
title: 'Callbacks'
description: 'Pass functions as values, compose asynchronous work and recognize callback hell.'
order: 25
difficulty: 'beginner'
category: 'Level 9 - Asynchronous JavaScript'
estimatedMinutes: 25
prerequisites:
  - learn/javascript/functions-and-parameters
  - learn/javascript/asynchronous-javascript
---

## Functions as values

A callback is a function passed to another function to run later or for each item. This powers event handlers, array methods and older asynchronous APIs.

```js
button.addEventListener('click', () => saveDraft())
items.filter(item => item.active).map(item => item.name)
```

Nested callbacks become difficult to read, handle errors and cancel. This is callback hell. Name callbacks, keep them small, and use promises for sequences that have multiple asynchronous steps.

## Summary

Callbacks are fundamental composition tools, but deeply nested async callbacks hide control flow and error paths.

## Practice

Refactor a three-level nested callback example into named functions, then identify where a promise would make the sequence clearer.
