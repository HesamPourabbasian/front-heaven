---
title: 'Type Predicates'
description: 'Build custom user-defined type guards with type predicates (parameterName is Type) and assertion functions.'
order: 15
difficulty: 'intermediate'
category: 'Level 4 - Type Narrowing & Type Guards'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/type-guards-and-narrowing
---

## What is a User-Defined Type Guard?

Built-in type guards like `typeof` and `instanceof` work well for simple cases. However, when working with complex objects, API payloads, or validating unknown JSON structures, you need custom validation logic.

A **User-Defined Type Guard** is a regular JavaScript function whose return type is annotated with a **Type Predicate**.

A type predicate takes the form:
```ts
parameterName is Type
```

---

## Defining a Type Predicate

When a function returning `parameterName is Type` evaluates to `true` at runtime, TypeScript automatically narrows the variable passed to that parameter inside the calling scope:

```ts
interface Cat {
  name: string
  meow(): void
}

interface Dog {
  name: string
  bark(): void
}

type Pet = Cat | Dog

// Type Predicate function:
function isCat(pet: Pet): pet is Cat {
  return (pet as Cat).meow !== undefined
}

function handlePetSound(pet: Pet) {
  if (isCat(pet)) {
    // Inside this block, 'pet' is narrowed strictly to Cat!
    pet.meow()
  } else {
    // Inside this block, 'pet' is narrowed strictly to Dog!
    pet.bark()
  }
}
```

---

## Filtering Arrays with Type Predicates

One of the most practical uses of type predicates is filtering `null` or `undefined` elements from arrays:

```ts
const rawItems: (string | null | undefined)[] = ['alpha', null, 'beta', undefined, 'gamma']

// Standard filter without predicate: type remains (string | null | undefined)[]
const badFilter = rawItems.filter(x => x !== null && x !== undefined)

// Custom predicate to filter non-nullables:
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

// Resulting type is correctly inferred as: string[]
const cleanItems = rawItems.filter(isNonNullable)
```

---

## Assertion Functions (`asserts condition`)

TypeScript 3.7 introduced **Assertion Functions**. Instead of returning a boolean, an assertion function throws an error if a condition is not met, and narrows the type for the remainder of the containing scope:

```ts
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new AssertionError(`Expected string, received ${typeof val}`)
  }
}

function processUserData(input: unknown) {
  // input is 'unknown'
  assertIsString(input)
  // From here onward, input is guaranteed to be 'string'!
  console.log(input.toUpperCase())
}
```

### Generic Non-Null Assertion Function
```ts
function assertDefined<T>(val: T, msg = 'Value is null or undefined'): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(msg)
  }
}
```

---

## Summary

- Type predicates (`param is TargetType`) create custom reusable type guards.
- Returning `true` from a type predicate informs TypeScript to narrow the parameter in conditional branches.
- Type predicates solve array filtering type loss with `Array.prototype.filter`.
- Assertion functions (`asserts val is TargetType`) throw on invalid input and narrow types for all subsequent lines in that scope.

## Practice

1. Define an interface `User { id: string; email: string }`.
2. Write a type guard `function isUser(obj: unknown): obj is User` that validates `typeof obj === 'object'`, `obj !== null`, and checks that `id` and `email` are strings.
3. Test `isUser` on an untyped object parsed from `JSON.parse`.
