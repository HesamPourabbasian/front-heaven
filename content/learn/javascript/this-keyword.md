---
title: 'The this Keyword'
description: 'Predict this in methods, functions, standalone calls, event handlers and arrow functions.'
order: 12
difficulty: 'intermediate'
category: 'Level 4 - Objects, Prototypes and this'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/objects-and-prototypes
---

## Call-site binding

`this` is usually determined by how a function is called, not where it is written. In `object.method()`, it is the object. In a plain function under strict mode it is `undefined`. In a browser event handler, a traditional function receives the element as `this`.

```js
const counter = { value: 0, increment() { this.value += 1 } }
```

Arrow functions do not create their own `this`; they close over the surrounding value. That makes them useful for callbacks and dangerous as object methods when a method needs the object.

## Summary

Find the call site first. Do not assume `this` follows the function's visual location.

## Practice

Call one method normally, detach it into a variable, bind it, and call it as an arrow callback. Record each `this` value.
