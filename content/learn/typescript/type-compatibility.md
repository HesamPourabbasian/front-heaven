---
title: 'Type Compatibility'
description: 'Learn how TypeScript evaluates type assignability using structural typing (duck typing) and understand excess property checks.'
order: 6
difficulty: 'beginner'
category: 'Level 2 - TypeScript Types'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/type-inference
---

## Structural Typing ("Duck Typing")

Type compatibility in TypeScript is based on **structural subtyping** (often called *duck typing*), rather than **nominal typing** used in languages like Java, C#, or C++.

> *"If it walks like a duck and quacks like a duck, it's a duck."*

In a structural type system, two types are compatible if they have the same shape or structure, regardless of whether they share a named class or interface declaration.

```ts
interface Point2D {
  x: number
  y: number
}

interface Coordinate {
  x: number
  y: number
}

let p: Point2D = { x: 10, y: 20 }
let c: Coordinate = p // Valid! Shapes are identical
```

---

## Assignability Rules

TypeScript allows an assignment `Target = Source` if `Source` contains **at least all required members** of `Target`.

```ts
interface Named {
  name: string
}

let person = {
  name: 'Ada Lovelace',
  age: 36,
  location: 'London',
}

// Valid! 'person' has a 'name' property of type string.
let item: Named = person
```

Here, `person` has *extra* properties (`age`, `location`), but it satisfies the minimum structural requirement of `Named` (`name: string`).

---

## Excess Property Checking

There is one important exception to the rule above: **object literals assigned directly**.

When an object literal is assigned directly to a variable with a defined type, TypeScript applies **Excess Property Checks** to prevent typos and accidental unused keys:

```ts
interface UserOptions {
  theme: 'light' | 'dark'
  notifications?: boolean
}

// Error: Object literal may only specify known properties, and 'colour' does not exist in type 'UserOptions'.
// Did you mean to write 'theme'?
const options: UserOptions = {
  theme: 'dark',
  colour: 'blue', // Typos are caught immediately!
}
```

### Bypassing Excess Property Checks
If you store the object in an intermediate variable first, excess property checks do not trigger (pure structural compatibility applies):

```ts
const rawConfig = { theme: 'dark' as const, colour: 'blue' }
const options: UserOptions = rawConfig // Valid under structural subtyping
```

---

## Function Compatibility

TypeScript also applies structural rules to functions:

### 1. Number of Parameters
A function with *fewer* parameters can be assigned to a function type expecting *more* parameters. This is essential for JavaScript idioms like `array.forEach((val) => ...)` where you can ignore the `index` and `array` arguments:

```ts
let handler: (a: number, b: string) => void
let simpleHandler = (a: number) => console.log(a)

handler = simpleHandler // Valid! Ignoring extra parameters is safe
```

### 2. Return Types
The return type of the source function must be a subtype of the target return type:

```ts
let getDetails: () => { name: string }
let getFullDetails = () => ({ name: 'Alan', age: 41 })

getDetails = getFullDetails // Valid! Returned object has a 'name' property
```

---

## Summary

- TypeScript uses structural typing: type compatibility depends on the shape and members of a type, not its explicit name.
- Assignability requires the source to have at least all required properties of the target.
- Excess property checks prevent typos when assigning fresh object literals directly.
- Functions are compatible if parameter types are compatible and the destination ignores or matches parameters safely.

## Practice

1. Define an interface `Car { brand: string; year: number }`.
2. Create an object `myVehicle = { brand: 'Tesla', year: 2024, electric: true }`.
3. Assign `myVehicle` to a variable of type `Car` and verify that TypeScript permits it due to structural typing.
