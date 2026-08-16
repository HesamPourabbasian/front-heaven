---
title: 'Advanced Types'
description: 'Master the TypeScript type lattice, top types (any, unknown), bottom types (never), and foundational type theory concepts.'
order: 25
difficulty: 'advanced'
category: 'Level 8 - Advanced Types'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/utility-types
---

## The Type Lattice (Type Hierarchy)

In type theory, types exist in a hierarchical **lattice**. At the top sits the Universal/Top type (the supertype of all types), and at the bottom sits the Empty/Bottom type (the subtype of all types).

```text
               ┌────────────────────────┐
               │    unknown / any       │  <-- Top Types
               └───────────┬────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
  ┌─────────┐         ┌─────────┐         ┌─────────┐
  │ string  │         │ number  │         │ object  │ ...
  └────┬────┘         └────┬────┘         └────┬────┘
       │                   │                   │
       ▼                   ▼                   ▼
 ┌───────────┐       ┌───────────┐       ┌───────────┐
 │  "hello"  │       │    42     │       │ { id: 1 } │
 └─────┬─────┘       └─────┬─────┘       └─────┬─────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
               ┌────────────────────────┐
               │         never          │  <-- Bottom Type
               └────────────────────────┘
```

---

## 1. Top Types: `unknown` vs `any`

A **Top Type** is a type that encompasses every possible value.

### `any` (The Escape Hatch)
- Every type is assignable to `any`.
- `any` is assignable to every type.
- Disables all static type checks:

```ts
let x: any = 'hello'
x = 100
x.nonExistentMethod() // No compiler error!
```

### `unknown` (The Safe Top Type)
- Every type is assignable to `unknown`.
- `unknown` is **NOT** assignable to any other type (except `unknown` and `any`) without explicit narrowing:

```ts
let u: unknown = 'hello'
// u.toUpperCase() // Error: Object is of type 'unknown'.

if (typeof u === 'string') {
  console.log(u.toUpperCase()) // Safe and allowed!
}
```

---

## 2. The Bottom Type: `never`

A **Bottom Type** represents the empty set — a type that has **no possible values**.

- `never` is assignable to every type.
- No type (except `never` itself) is assignable to `never`.
- Represents unreachable code paths, exhaustive checking failures, and functions that never return:

```ts
function fail(message: string): never {
  throw new Error(message)
}

// In unions: 'never' vanishes (A | never === A)
type PureNumber = number | never // Inferred as: number

// In intersections: 'never' dominates (A & never === never)
type Impossible = string & number // Inferred as: never
```

---

## Type Widening and Literal Types

When constructing complex types, TypeScript balances exact literal preservation against practical ergonomics:

```ts
// Inferred as { x: number } (widened)
const obj1 = { x: 10 }

// Inferred as { readonly x: 10 } (narrowed)
const obj2 = { x: 10 } as const
```

---

## Summary

- The TypeScript type system forms a hierarchy from top (`unknown`) to bottom (`never`).
- Use `unknown` for safe untrusted inputs from APIs, user inputs, or deserialization.
- Avoid `any` to prevent type pollution and silent runtime failures.
- `never` models impossibilities, unreachable code, and simplifies away in unions (`T | never = T`).

## Practice

1. Write a function `safeJsonParse(jsonString: string): unknown`.
2. Write a type guard that validates whether the output of `safeJsonParse` has a property `{ count: number }`.
3. Try assigning a `string` to a variable of type `never` and observe the compiler error.
