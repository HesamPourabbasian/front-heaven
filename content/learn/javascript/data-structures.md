---
title: Data Structures
description: Choose between indexed collections, arrays and typed arrays for ordered data.
order: 14
difficulty: intermediate
category: Level 5 - Data Structures
estimatedMinutes: 30
prerequisites:
  - learn/javascript/objects-and-prototypes
---

## Indexed collections

Arrays are ordered, zero-indexed collections with methods such as `push`, `slice`, `map`, `filter`, `find` and `reduce`. Prefer non-mutating methods when state is shared. Typed arrays represent numeric data in fixed-width binary formats and are useful for audio, graphics and network protocols.

```js
const doubled = [1, 2, 3].map(value => value * 2)
const bytes = new Uint8Array([0, 255, 12])
```

Choose arrays for general application data and typed arrays when memory layout and numeric width matter.

## Summary

Data structure choice affects clarity, performance and mutation. Keep collection transformations explicit.

## Practice

Transform an array into filtered and mapped results, then inspect the byte values and memory behavior of a `Uint8Array`.
