---
title: Functions
description: Build reusable logic with declarations, parameters, returns, defaults, rest parameters, arrow functions and IIFEs.
order: 10
difficulty: beginner
category: Level 3 - Control Flow and Functions
estimatedMinutes: 35
prerequisites:
  - learn/javascript/loops-and-iterations
---

## Function building blocks

Functions accept parameters and return values. Declarations are hoisted; expressions and arrows are values assigned at runtime. Default parameters handle missing values, rest parameters collect remaining arguments, and `arguments` is the legacy array-like object available to ordinary functions.

```js
function sum(first, second = 0) { return first + second }
const multiply = (a, b) => a * b
const total = (...values) => values.reduce((a, b) => a + b, 0)
```

An IIFE executes immediately: `(() => { /* isolated setup */ })()`. Use it sparingly; modules provide better isolation. Keep functions focused and return data rather than mixing calculation with rendering.

## Built-in functions

JavaScript runtimes provide global functions such as `parseInt`, `parseFloat`, `isFinite`, `encodeURIComponent` and timer functions in browsers. Prefer the more precise static forms where available (`Number.isNaN`, `Number.parseInt`) and use built-in object methods such as `Object.keys`, `Array.isArray` and `Math.round` rather than recreating them.

## Summary

Functions are values and boundaries. Name them by their result, validate parameters, and return predictable values.

## Practice

Write a function using defaults and rest parameters, then rewrite it as an arrow. Add an IIFE and identify why its local variable is inaccessible afterward.
