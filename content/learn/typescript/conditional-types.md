---
title: 'Conditional Types'
description: 'Master conditional types in TypeScript (T extends U ? X : Y), distributive conditional logic, and type extraction with the infer keyword.'
order: 27
difficulty: 'advanced'
category: 'Level 8 - Advanced Types'
estimatedMinutes: 25
prerequisites:
  - /learn/typescript/mapped-types
---

## What is a Conditional Type?

A **Conditional Type** selects one of two possible types based on a condition expressed as a type relationship. The syntax matches JavaScript's ternary operator:

```ts
SomeType extends OtherType ? TrueType : FalseType
```

When `SomeType` is assignable to `OtherType`, the first branch (`TrueType`) is selected; otherwise, the second branch (`FalseType`) is selected.

```ts
type IsString<T> = T extends string ? 'yes' : 'no'

type A = IsString<string>  // 'yes'
type B = IsString<number>  // 'no'
type C = IsString<'hello'> // 'yes'
```

---

## Practical Example: Overload-Free Return Types

Conditional types can simplify APIs where return types depend strictly on input options:

```ts
interface IdLabel {
  id: number
}

interface NameLabel {
  name: string
}

type IdOrName<T extends number | string> = T extends number ? IdLabel : NameLabel

function createLabel<T extends number | string>(idOrName: T): IdOrName<T> {
  if (typeof idOrName === 'number') {
    return { id: idOrName } as IdOrName<T>
  }
  return { name: idOrName } as IdOrName<T>
}

const a = createLabel(101)      // Type is IdLabel
const b = createLabel('Grace')  // Type is NameLabel
```

---

## Distributive Conditional Types

When conditional types act on a generic type parameter that is a **naked union**, they automatically **distribute** over each member of the union:

```ts
// Built-in Exclude<T, U> is implemented as:
type MyExclude<T, U> = T extends U ? never : T

type Cleaned = MyExclude<'a' | 'b' | 'c', 'a'>
// Expands to:
// ('a' extends 'a' ? never : 'a') |
// ('b' extends 'a' ? never : 'b') |
// ('c' extends 'a' ? never : 'c')
// Result: never | 'b' | 'c' -> 'b' | 'c'
```

### Preventing Distribution
To prevent a conditional type from distributing over unions, wrap both sides of the `extends` keyword in square brackets `[T] extends [U]`:

```ts
type NonDistributive<T> = [T] extends [string | number] ? true : false

type Test1 = NonDistributive<string | boolean> // false (union as a whole does not extend string | number)
```

---

## Type Inference in Conditional Types with infer

The **`infer`** keyword allows you to deduce and capture a type from inside another complex type within the true branch of a conditional expression:

### 1. Extracting Array Element Types
```ts
type ElementOf<T> = T extends (infer Item)[] ? Item : T

type StringItem = ElementOf<string[]> // string
type NumberItem = ElementOf<number[]> // number
type Direct = ElementOf<boolean>      // boolean
```

### 2. Extracting Return Types
```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: 'Ada' }
}

type UserType = MyReturnType<typeof getUser> // { id: number; name: string }
```

### 3. Extracting Promise Payloads
```ts
type MyAwaited<T> = T extends Promise<infer Value> ? MyAwaited<Value> : T

type AsyncData = MyAwaited<Promise<Promise<number>>> // number
```

---

## Summary

- Conditional types follow the syntax `T extends U ? X : Y`.
- When applied to naked union type parameters, conditional types distribute over each member automatically.
- Use the `infer` keyword inside the `extends` clause to extract inner types (return types, array elements, Promise resolutions).

## Practice

1. Implement a utility type `UnwrapArray<T>` using `infer` that returns the item type of an array or `T` if it is not an array.
2. Implement a utility type `FirstParameter<T>` that extracts the first parameter of a function or `never`.
