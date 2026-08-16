---
title: Function Borrowing and Binding
description: Reuse methods and control their receiver with call, apply and bind.
order: 13
difficulty: intermediate
category: Level 4 - Objects, Prototypes and this
estimatedMinutes: 25
prerequisites:
  - learn/javascript/this-keyword
---

## Explicit binding

`call` invokes a function with a chosen `this` and individual arguments. `apply` does the same with an argument array. `bind` returns a new function with `this` and optional leading arguments fixed.

```js
function describe(prefix) { return `${prefix}: ${this.name}` }
describe.call({ name: 'Ada' }, 'User')
describe.apply({ name: 'Ada' }, ['User'])
const bound = describe.bind({ name: 'Ada' }, 'User')
```

This enables function borrowing: use a method with a compatible object. Avoid using it to hide an unclear design; ordinary functions and explicit arguments are often easier to test.

## Summary

Use `call` and `apply` for immediate invocation and `bind` for a reusable bound callback.

## Practice

Borrow an array-like object's method with `call`, then create a bound event handler and explain why its receiver remains stable.
