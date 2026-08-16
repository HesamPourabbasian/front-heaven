---
title: Operators
description: Use JavaScript's conditional, comma, unary, assignment, arithmetic, bitwise, logical, BigInt and string operators.
order: 6
difficulty: beginner
category: Level 2 - Operators and Expressions
estimatedMinutes: 30
prerequisites:
  - learn/javascript/equality-and-comparison
---

## Operator families

**Arithmetic operators** (`+`, `-`, `*`, `/`, `%`, `**`) calculate. **Assignment operators** (`=`, `+=`, `&&=`, `??=`) update bindings. **Comparison operators** (`<`, `>=`, `===`) produce booleans. **Logical operators** (`&&`, `||`, `??`) combine or select values and short-circuit; `??` only falls back for nullish values. The **conditional operator** (`condition ? a : b`) selects one expression. The **comma operator** evaluates left to right and returns the final value; it is uncommon outside compact loop expressions.

```js
const label = user.name ?? 'Anonymous'
const total = price * quantity
score += bonus
```

**Unary operators** include `!`, `typeof`, `delete`, `void`, unary `+` and `-`, `++` and `--`. **Bitwise operators** (`&`, `|`, `^`, `~`, shifts) convert Number operands to 32-bit integers. **BigInt operators** largely mirror numeric operators, but BigInts cannot mix with Numbers and do not support unsigned right shift. The principal **string operator** is `+`, which concatenates when either operand becomes a string, so normalize types first.

## Summary

Operators are small language rules with large consequences. Use parentheses for clarity and avoid clever expressions that hide coercion.

## Practice

Rewrite a calculation using explicit parentheses and conversions. Test the differences between `||` and `??` for `0`, `''`, `false`, `null` and `undefined`.
