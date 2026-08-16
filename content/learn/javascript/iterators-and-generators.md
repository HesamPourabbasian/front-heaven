---
title: 'Iterators and Generators'
description: 'Produce values on demand with the iterator protocol and generator functions.'
order: 32
difficulty: 'advanced'
category: 'Level 11 - Modules and Advanced JavaScript'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/modules
  - learn/javascript/functions-and-parameters
---

## The iterator protocol

An iterator has a `next()` method returning `{ value, done }`. Objects implementing `Symbol.iterator` work with `for...of`, spread and destructuring.

```js
function* ids() {
  let id = 1
  while (true) yield id++
}
const sequence = ids()
sequence.next().value // 1
```

Generators pause at `yield`, making lazy sequences possible without allocating every value. Keep generators for streams, traversals and lazy computation; arrays are clearer for small finite data.

## Summary

Iterators define consumption; generators define lazy production. The protocol powers many language features beyond loops.

## Practice

Implement a custom iterable for a range, then rewrite it as a generator and consume both with `for...of`.
