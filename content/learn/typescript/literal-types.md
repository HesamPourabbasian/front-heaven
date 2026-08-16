---
title: 'Literal Types'
description: 'Master exact value types in TypeScript including string, number, boolean, and template literal types for bulletproof API designs.'
order: 11
difficulty: 'intermediate'
category: 'Level 3 - Type Manipulation'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/union-and-intersection-types
---

## What is a Literal Type?

In JavaScript, variables declared with `const` can never be reassigned. TypeScript represents this immutability in the type system through **Literal Types**. Instead of representing *any* string or *any* number, a literal type represents an **exact, specific value**.

```ts
let generalString: string = 'hello' // Can be reassigned to any string
const exactString = 'hello'         // Inferred as the literal type "hello"
```

---

## 1. String Literal Types

String literal types allow you to specify exact allowed strings, often combined in unions:

```ts
type Alignment = 'left' | 'center' | 'right' | 'justify'

function setTextAlign(alignment: Alignment) {
  document.body.style.textAlign = alignment
}

setTextAlign('center') // Valid
// setTextAlign('top') // Error: Argument of type '"top"' is not assignable to parameter of type 'Alignment'.
```

---

## 2. Number Literal Types

Number literal types restrict numbers to a set of fixed exact values:

```ts
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6

function roll(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll
}

type HttpSuccessCode = 200 | 201 | 204
```

---

## 3. Boolean Literal Types

Even booleans can be split into their literal components:

```ts
type TrueOnly = true
type FalseOnly = false

interface ToggleSwitch {
  checked: boolean
  defaultState: false
}
```

---

## 4. Template Literal Types

Building on ECMAScript template literal syntax, TypeScript supports **Template Literal Types** to build new string types by combining literal types:

```ts
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type APIVersion = 'v1' | 'v2'

// Creates all combinations:
// "v1/GET" | "v1/POST" | "v1/PUT" | "v1/DELETE" | "v2/GET" | ...
type RouteEndpoint = `${APIVersion}/${HTTPMethod}`

type Direction = 'top' | 'right' | 'bottom' | 'left'
type MarginClass = `m-${Direction}-${1 | 2 | 3 | 4}`

const cardMargin: MarginClass = 'm-top-2' // Valid
// const badMargin: MarginClass = 'm-diagonal-2' // Error!
```

---

## Literal Narrowing and Widening

When you initialize a variable with `let`, TypeScript widens the type to its general primitive:
```ts
let mode = 'dark' // Type is 'string'
```

When you initialize with `const` or use `as const`, TypeScript preserves the exact literal:
```ts
const fixedMode = 'dark' // Type is '"dark"'
```

---

## Summary

- Literal types specify exact values rather than general primitives (`"dark"` vs `string`, `200` vs `number`).
- Combine literal types with unions (`|`) to model finite choices, configuration options, and UI props.
- Template literal types allow string manipulation and combinatoric generation directly in the type system.

## Practice

1. Create a union of string literal types `ButtonVariant` with `'primary' | 'secondary' | 'danger' | 'ghost'`.
2. Create a template literal type `EventName` that combines `'user' | 'order'` with `'created' | 'updated' | 'deleted'` into formats like `'user:created'`.
