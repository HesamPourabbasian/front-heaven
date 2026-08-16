---
title: Variables
description: Declare, reassign and scope values with var, let and const.
order: 2
difficulty: beginner
category: Level 1 - Fundamentals
estimatedMinutes: 25
prerequisites:
  - learn/javascript/introduction-to-javascript
---

## Declarations

Use `const` for bindings that do not change and `let` for bindings that do. Avoid new `var`; it is function-scoped and has confusing hoisting behavior.

```js
const name = 'Ada'
let score = 0
score += 10
```

Names may contain letters, digits, `_` and `$`, but cannot begin with a digit or use reserved words. Prefer descriptive camelCase names.

## Scope and hoisting

Global scope is visible broadly, function scope belongs to a function, and block scope belongs to braces. `let` and `const` are block-scoped. Their temporal dead zone makes reading before declaration an error; `var` instead produces `undefined`.

## Summary

`const` communicates stability, `let` communicates reassignment, and block scope keeps state local. Keep globals rare and declarations near their use.

## Practice

Write one example of global, function and block scope. Move each declaration across its boundary and record the resulting value or error.
