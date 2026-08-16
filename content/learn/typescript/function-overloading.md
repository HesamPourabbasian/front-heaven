---
title: 'Function Overloading'
description: 'Learn how to write function overload signatures in TypeScript to provide distinct return types based on argument shapes and types.'
order: 17
difficulty: 'intermediate'
category: 'Level 5 - Functions & Generics'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/typescript-functions
---

## What is Function Overloading?

In JavaScript, functions often accept different combinations of arguments and return different types based on what was passed.

In TypeScript, you express this versatility using **Function Overloading**. Function overloading consists of:
1. One or more **Overload Signatures** (visible to the caller).
2. Exactly one **Implementation Signature** (internal to the function body).

---

## Writing Function Overloads

Overload signatures declare all valid calling patterns. The implementation signature must be broad enough to accommodate all overloads, but callers will **only** see the overload signatures:

```ts
// Overload signature 1: string in, string out
function formatValue(value: string): string

// Overload signature 2: number in, string out with precision
function formatValue(value: number, decimals: number): string

// Overload signature 3: Date in, timestamp number out
function formatValue(value: Date): number

// Implementation signature (NOT directly callable from outside):
function formatValue(value: string | number | Date, decimals?: number): string | number {
  if (typeof value === 'string') {
    return value.trim().toUpperCase()
  }
  if (typeof value === 'number') {
    return value.toFixed(decimals ?? 2)
  }
  return value.getTime()
}
```

### Type-Safe Results at Call Sites
```ts
const str = formatValue('  hello  ')       // Return type is string
const numStr = formatValue(123.456, 2)      // Return type is string
const timestamp = formatValue(new Date())   // Return type is number

// Error: No overload matches this call (e.g. string with decimals):
// formatValue('hello', 2)
```

---

## Overloads vs Union Types

Before reaching for function overloads, ask whether a **union type** or **generics** would be simpler:

### When Union Types are Better:
If parameters and return types don't depend on each other, prefer union types:
```ts
// Prefer this:
function logId(id: string | number): void {
  console.log(`ID: ${id}`)
}

// Instead of verbose overloads:
// function logId(id: string): void
// function logId(id: number): void
```

### When Overloads are Necessary:
When the **return type varies based on the argument type or count**, overloads provide precise safety:
```ts
function makeDate(timestamp: number): Date
function makeDate(m: number, d: number, y: number): Date
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d)
  }
  return new Date(mOrTimestamp)
}
```

---

## Method and Constructor Overloading

Overloading also works on class methods and class constructors:

```ts
class Point {
  x: number
  y: number

  // Constructor Overloads
  constructor(coord: [number, number])
  constructor(x: number, y: number)
  constructor(xOrCoord: number | [number, number], y?: number) {
    if (Array.isArray(xOrCoord)) {
      this.x = xOrCoord[0]
      this.y = xOrCoord[1]
    } else {
      this.x = xOrCoord
      this.y = y ?? 0
    }
  }
}

const p1 = new Point(10, 20)
const p2 = new Point([30, 40])
```

---

## Summary

- Function overloads allow multiple distinct call signatures for a single function.
- Write overload signatures first; follow with a single broad implementation signature.
- Only the overload signatures are visible to external consumers.
- Use overloads when the return type or parameter combination depends tightly on argument inputs.

## Practice

1. Write a function `getItem` with two overloads:
   - When passed `id: number`, returns `{ id: number; name: string }`.
   - When passed `all: true`, returns `{ id: number; name: string }[]`.
2. Implement the single combined function body.
3. Call both overloads and inspect their return types in your editor.
