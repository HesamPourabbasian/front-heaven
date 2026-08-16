---
title: 'Data Types'
description: 'Master JavaScript primitives, objects, typeof, built-in objects, JSON and the values programs manipulate.'
order: 3
difficulty: 'beginner'
category: 'Level 1 - Fundamentals'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/variables
---

## Primitive values

JavaScript has strings, numbers, booleans, `undefined`, `null`, BigInts and Symbols. Objects include arrays, functions, dates, maps and regular expressions. `typeof` is useful but imperfect: `typeof null` is the historical string `"object"`, and arrays need `Array.isArray()`.

```js
console.log(typeof 'text')       // string
console.log(typeof 42n)          // bigint
console.log(Array.isArray([]))   // true
```

JSON is text with objects, arrays, strings, numbers, booleans and null. It has no functions, undefined, comments or dates. Built-in objects such as `Date`, `Math`, `RegExp`, `Map` and `Set` provide behavior around values.

## Summary

Types determine which operations are safe. Inspect unknown values before using them and remember that JSON is a restricted text format, not a complete JavaScript value system.

## Practice

Create a table of one example for every primitive type. Test it with `typeof`, then compare `typeof null`, `Array.isArray([])` and `typeof function () {}`.
