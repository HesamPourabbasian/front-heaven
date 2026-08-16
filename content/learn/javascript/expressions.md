---
title: Expressions
description: Understand expressions, statements, values and evaluation so complex JavaScript reads predictably.
order: 7
difficulty: beginner
category: Level 2 - Operators and Expressions
estimatedMinutes: 20
prerequisites:
  - learn/javascript/operators
---

## Expressions and statements

An expression produces a value: `2 + 2`, a function call, an object literal or a conditional expression. A statement performs an action or controls execution: a declaration, `if`, loop or `return`. Many statements contain expressions.

```js
const message = enabled ? 'On' : 'Off'
```

Use expressions for values and statements for flow. Operator precedence controls evaluation, but parentheses communicate intent better than memorizing every precedence level. JavaScript's comma operator evaluates expressions left to right and returns the last value; avoid it outside narrow, intentional cases.

## Summary

Reading code as nested expressions inside control statements makes evaluation order visible and debugging easier.

## Practice

Take five lines of JavaScript and label each part as an expression or statement. Add parentheses to make the evaluation order explicit.
