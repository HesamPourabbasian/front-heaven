---
title: Type Casting
description: Distinguish conversion from coercion and convert values explicitly and predictably.
order: 4
difficulty: beginner
category: Level 1 - Fundamentals
estimatedMinutes: 25
prerequisites:
  - learn/javascript/data-types
---

## Conversion and coercion

**Conversion** is an intentional change such as `Number('42')`. **Coercion** is JavaScript converting values implicitly during an operation. Prefer explicit conversion because it makes intent visible.

```js
const quantity = Number(input.value)
const label = String(quantity)
const enabled = Boolean(value)
```

Know the falsy values: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined` and `NaN`. `Boolean()` exposes the rule. `Number('')` becomes `0`, while `Number('hello')` becomes `NaN`; validate after conversion.

## Summary

Convert at boundaries, validate the result, and avoid relying on surprising implicit rules.

## Practice

Build a conversion table for `''`, `'0'`, `'42'`, `'hello'`, `null` and `undefined` using `Number`, `String` and `Boolean`.
