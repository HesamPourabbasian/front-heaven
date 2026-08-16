---
title: Using this Keyword
description: Apply this deliberately in constructors, methods, callbacks and browser code.
order: 19
difficulty: intermediate
category: Level 6 - Scope and Execution
estimatedMinutes: 25
prerequisites:
  - learn/javascript/this-keyword
  - learn/javascript/strict-mode
---

## Practical this

Use `this` when behavior belongs to an object or class instance. In callbacks, choose an arrow to inherit the surrounding receiver or bind a traditional function explicitly.

```js
class Timer {
  seconds = 0
  tick = () => { this.seconds += 1 }
}
```

Class fields with arrow functions keep the instance receiver when passed as callbacks. For simpler code, pass the needed value as an argument instead; explicit data dependencies are often clearer than ambient `this`.

## Summary

`this` is a call-context tool, not a general variable. Use it where object identity is central and avoid it where ordinary parameters are clearer.

## Practice

Create a class method, pass it to `setTimeout` once unbound and once bound, then replace it with an arrow field and compare the results.
