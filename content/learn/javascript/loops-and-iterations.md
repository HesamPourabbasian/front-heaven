---
title: Loops and Iterations
description: Repeat work with for, while, do...while, for...of, for...in, break and continue.
order: 9
difficulty: beginner
category: Level 3 - Control Flow and Functions
estimatedMinutes: 30
prerequisites:
  - learn/javascript/control-flow
---

## Loop forms

Use `for` when you need an index or precise control, `while` when the stopping condition is external, and `do...while` when one execution is guaranteed. `for...of` iterates values; `for...in` iterates enumerable keys and is for objects, not arrays.

```js
for (const item of items) {
  if (item.disabled) continue
  if (item.id === target) break
  console.log(item)
}
```

Keep loop bodies small. Array methods such as `map`, `filter` and `reduce` express transformations well, but ordinary loops remain useful when early exit or side effects matter.

## Summary

Choose the loop that states your intent. Always ensure a `while` condition can eventually become false.

## Practice

Process an array once with `for...of`, once with `for`, and once with `map`/`filter`. Add a `continue` and a `break` deliberately.
