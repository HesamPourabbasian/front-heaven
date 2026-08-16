---
title: 'Type Inference'
description: 'Understand how the TypeScript compiler automatically deduces types without explicit annotations and master contextual typing.'
order: 5
difficulty: 'beginner'
category: 'Level 2 - TypeScript Types'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/typescript-types
---

## What is Type Inference?

In TypeScript, you do not need to explicitly annotate every single variable, function return, or expression. If you omit an explicit type annotation, the TypeScript compiler analyzes the value and assigns the best-fitting type automatically. This process is called **Type Inference**.

```ts
// You don't need: let age: number = 25;
let age = 25 // Inferred as: number

// Inferred as: string
let message = 'Hello, TypeScript'

// Inferred as: boolean[]
let flags = [true, false, true]
```

If you later try to assign an incompatible type, TypeScript emits a compile error:
```ts
age = 'twenty five' // Error: Type 'string' is not assignable to type 'number'.
```

---

## Best Common Type Inference

When inferring types from multiple expressions (such as array elements), TypeScript looks at each candidate type and calculates the **Best Common Type**:

```ts
// Inferred as (number | null)[]
let measurements = [10, 20, null, 30]

// Inferred as (Circle | Square)[]
class Shape {}
class Circle extends Shape {}
class Square extends Shape {}

let shapes = [new Circle(), new Square()] // Inferred as (Circle | Square)[]
```

---

## Return Type Inference

TypeScript automatically infers function return types by analyzing all `return` statements in the function body:

```ts
function multiply(x: number, y: number) {
  return x * y // Return type automatically inferred as 'number'
}

function parseScore(score: string) {
  if (score === 'N/A') {
    return null
  }
  return parseInt(score, 10)
}
// Inferred return type: number | null
```

---

## Contextual Typing

TypeScript also infers types in the reverse direction: using the **location or context** of an expression to deduce its type. This is known as **Contextual Typing**.

### Example 1: Array Callback Arguments
```ts
const names = ['Ada', 'Alan', 'Grace']

// The parameter 'name' is contextually typed as 'string'
// because 'names' is string[]
names.forEach((name) => {
  console.log(name.toUpperCase()) // Full autocompletion for string methods!
})
```

### Example 2: Event Listeners in the Browser
```ts
// The 'event' parameter is contextually typed as 'MouseEvent'
window.addEventListener('click', (event) => {
  console.log(event.clientX, event.clientY)
})

// The 'event' parameter is contextually typed as 'KeyboardEvent'
window.addEventListener('keydown', (event) => {
  console.log(event.key)
})
```

---

## When to Annotate vs When to Infer

A common question among beginners is: *When should I write explicit type annotations?*

### Prefer Inference For:
- Simple variable declarations initialized immediately: `const count = 0`
- Short arrow functions or local array callbacks: `items.map(x => x.id)`
- Obvious return types in internal helper functions

### Prefer Explicit Annotations For:
- Function parameters (parameters are not inferred unless provided by contextual callbacks):
  ```ts
  function greet(user: string): string { ... }
  ```
- Public API boundaries and exported function return signatures (serves as documentation and catches unintentional signature changes)
- Variables declared before initialization:
  ```ts
  let timeoutId: number | undefined
  ```
- Complex types where inference widens too much:
  ```ts
  type Status = 'idle' | 'loading' | 'success'
  const state: Status = 'idle' // Without ': Status', inferred as string
  ```

---

## Summary

- Type inference allows TypeScript to provide static safety with minimal boilerplate.
- TypeScript determines the Best Common Type for heterogenous arrays.
- Return types are automatically inferred from function `return` statements.
- Contextual typing infers parameter types based on where an expression appears (e.g., event handlers, callbacks).
- Annotate function parameters and exported boundaries; let local variable assignments infer naturally.

## Practice

1. Declare a variable `mixed` with numbers and strings: `[1, 'two', 3, 'four']`. Hover over it in your editor and note the inferred type.
2. Write a function `createStatus(code: number)` returning `"ok"` when code is 200 and `"error"` otherwise. Check the inferred return type.
