---
title: 'Type Guards & Narrowing'
description: 'Master control flow analysis and type narrowing using typeof, instanceof, equality, truthiness, and the in operator.'
order: 14
difficulty: 'intermediate'
category: 'Level 4 - Type Narrowing & Type Guards'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/satisfies-operator
---

## What is Type Narrowing?

In TypeScript, a variable can begin with a broad type (like `string | number` or `unknown`). As your code executes conditional branches, TypeScript's **Control Flow Analysis** tracks the logic and refines the variable to a more specific type. This refinement process is called **Type Narrowing**.

A construct that triggers narrowing is called a **Type Guard**.

---

## 1. `typeof` Type Guards

TypeScript recognizes JavaScript's `typeof` expressions (`"string"`, `"number"`, `"boolean"`, `"symbol"`, `"bigint"`, `"undefined"`, `"object"`, `"function"`):

```ts
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === 'number') {
    // Inside this branch, padding is narrowed strictly to 'number'
    return ' '.repeat(padding) + input
  }
  // Here, padding is narrowed strictly to 'string'
  return padding + input
}
```

*Note:* `typeof null === 'object'` in JavaScript, so checking `typeof x === 'object'` does not eliminate `null`. Check `x !== null` as well.

---

## 2. Truthiness Narrowing

Conditional expressions (`if (value)`, `&&`, `||`, `!`, `Boolean(value)`) narrow away falsy values (`false`, `0`, `""`, `null`, `undefined`, `NaN`, `0n`):

```ts
function printAll(strings: string | string[] | null) {
  if (strings && typeof strings === 'object') {
    // 'strings' is narrowed to string[] (null is removed by truthiness check)
    for (const s of strings) {
      console.log(s)
    }
  } else if (typeof strings === 'string') {
    console.log(strings)
  }
}
```

---

## 3. Equality Narrowing

Using equality checks (`===`, `!==`, `==`, `!=`) allows TypeScript to narrow types based on exact matches or elimination:

```ts
function compareValues(x: string | number, y: string | boolean) {
  if (x === y) {
    // In this branch, x and y must both be 'string'!
    console.log(x.toUpperCase())
    console.log(y.toLowerCase())
  } else {
    console.log(x, y)
  }
}
```

---

## 4. The `in` Operator Narrowing

JavaScript's `in` operator tests if a property exists on an object. TypeScript uses this to narrow union types with different properties:

```ts
type Admin = {
  name: string
  privileges: string[]
}

type Employee = {
  name: string
  startDate: Date
}

function printDetails(entity: Admin | Employee) {
  console.log(`Name: ${entity.name}`)

  if ('privileges' in entity) {
    // Narrowed to Admin
    console.log(`Privileges: ${entity.privileges.join(', ')}`)
  } else {
    // Narrowed to Employee
    console.log(`Start date: ${entity.startDate.toISOString()}`)
  }
}
```

---

## 5. `instanceof` Narrowing

As covered in type operators, `instanceof` checks prototypes and narrows class instances:

```ts
function logDateOrString(value: Date | string) {
  if (value instanceof Date) {
    console.log(value.toUTCString())
  } else {
    console.log(value.trim())
  }
}
```

---

## Exhaustiveness Checking with `never`

When narrowing unions, you can verify that you handled every possible case by assigning the remaining variable to `never`:

```ts
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.side * shape.side
    default: {
      // If a new shape is added to Shape and not handled, this triggers a compile error!
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
    }
  }
}
```

---

## Summary

- Type narrowing refines broad types into specific types via control flow analysis.
- Use `typeof` for primitive types.
- Use truthiness checks to filter out `null` and `undefined`.
- Use the `in` operator to distinguish objects by distinct properties.
- Use `instanceof` to distinguish class instances.
- Use the `never` type in `default` branches for exhaustiveness checking.

## Practice

1. Write a function `formatInput(value: string | number | Date): string`.
2. Use `typeof` and `instanceof` guards to format each possibility properly.
3. Add a fallback default branch that assigns the unhandled case to `never`.
