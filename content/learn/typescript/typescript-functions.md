---
title: 'TypeScript Functions'
description: 'Master function typing in TypeScript, parameter annotations, return types, optional/default parameters, and rest parameters.'
order: 16
difficulty: 'intermediate'
category: 'Level 5 - Functions & Generics'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/type-predicates
---

## Typing Functions

In TypeScript, functions can have explicit type annotations for each parameter and their return value:

```ts
function add(x: number, y: number): number {
  return x + y
}

// Arrow function syntax:
const multiply = (x: number, y: number): number => x * y
```

---

## Function Type Signatures

You can define standalone function type signatures using type aliases or interfaces:

```ts
type MathOperation = (a: number, b: number) => number

const divide: MathOperation = (a, b) => {
  if (b === 0) throw new Error('Division by zero')
  return a / b
}
```

---

## Parameter Types

### 1. Optional Parameters (`?`)
Parameters can be marked as optional by appending a question mark (`?`). Optional parameters must always appear **after** all required parameters:

```ts
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`
  }
  return `Hello, ${name}!`
}

greet('Ada') // Valid
greet('Ada', 'Dr.') // Valid
```

### 2. Default Parameters
Default parameters provide a fallback value when `undefined` or omitted. TypeScript automatically infers the parameter's type from its default value:

```ts
function createButton(text: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  return `<button class="btn-${size}">${text}</button>`
}

createButton('Submit') // size defaults to 'md'
createButton('Cancel', 'sm')
```

### 3. Rest Parameters (`...args`)
Rest parameters capture remaining arguments into an array. Annotate them with array or tuple types:

```ts
function sumAll(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sumAll(10, 20, 30, 40) // 100
```

---

## The `this` Parameter

In JavaScript, `this` is dynamically bound based on how a function is called. You can declare the expected type of `this` as the **first parameter** in a TypeScript function signature (TypeScript strips this fake parameter during compilation):

```ts
interface ButtonElement {
  id: string
  disabled: boolean
}

function onClick(this: ButtonElement, event: MouseEvent) {
  console.log(`Button clicked: ${this.id}, disabled: ${this.disabled}`)
}
```

If you call `onClick()` in a context where `this` does not match `ButtonElement`, TypeScript reports an error.

---

## Async Functions and Return Types

Async functions in TypeScript always return a `Promise<T>`:

```ts
async function fetchUser(userId: string): Promise<{ id: string; name: string }> {
  const res = await fetch(`/api/users/${userId}`)
  return await res.json()
}
```

---

## Summary

- Annotate parameter types explicitly; return types can be inferred or explicitly declared.
- Optional parameters (`?`) must follow required parameters.
- Default parameters automatically infer their type.
- Rest parameters are typed as arrays (`...args: T[]`).
- Async functions always return a `Promise<T>`.

## Practice

1. Write a function type `Transformer<T, U> = (input: T) => U`.
2. Implement a function `mapArray` that takes an array `T[]` and a `Transformer<T, U>` callback, returning `U[]`.
3. Test your function by transforming an array of numbers into an array of formatted strings.
