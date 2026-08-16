---
title: 'Equality and Comparison'
description: 'Compare values deliberately with strict equality, relational operators and JavaScript equality algorithms.'
order: 5
difficulty: 'intermediate'
category: 'Level 2 - Operators and Expressions'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/type-casting
---

## Equality algorithms

JavaScript's specification names four equality algorithms. **IsLooselyEqual** powers `==` and may coerce operands. **IsStrictlyEqual** powers `===` and never coerces. **SameValue** powers `Object.is()`, treating `NaN` as equal to itself and distinguishing `0` from `-0`. **SameValueZero** powers `Array.prototype.includes`, `Map` and `Set`; it treats `NaN` as equal to itself and treats signed zeroes as equal.

```js
5 === '5'                 // false
Object.is(NaN, NaN)       // true
[NaN].includes(NaN)       // true
Object.is(0, -0)           // false
```

Relational operators compare numbers after conversion, or strings lexicographically when both operands are strings. Normalize values before comparing them.

## Summary

Choose an equality algorithm intentionally. Strict equality is the default; use `Object.is` or SameValueZero behavior when their edge-case semantics are what you need.

## Practice

Compare `0`, `-0`, `NaN`, `'0'` and `false` with `==`, `===`, `Object.is` and `includes`. Explain each result before running it.
