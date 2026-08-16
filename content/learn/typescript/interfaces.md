---
title: 'Interfaces'
description: 'Master TypeScript interfaces, inheritance with extends, declaration merging, hybrid types, and understand the difference between Types and Interfaces.'
order: 8
difficulty: 'beginner'
category: 'Level 2 - TypeScript Types'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/type-aliases
---

## What is an Interface?

An **Interface** in TypeScript is a fundamental way to define the shape and contract of an object. Unlike a class, an interface is purely a compile-time construct — it produces zero JavaScript code at runtime.

```ts
interface User {
  id: number
  name: string
  email: string
  readonly createdAt: Date
  bio?: string // Optional property
}

const developer: User = {
  id: 101,
  name: 'Grace Hopper',
  email: 'grace@example.com',
  createdAt: new Date(),
}
```

---

## Extending Interfaces (`extends`)

Interfaces can inherit members from one or more other interfaces using the `extends` keyword. This encourages modularity and reuse:

```ts
interface Person {
  name: string
  age: number
}

interface Employee extends Person {
  employeeId: string
  department: string
}

interface Manager extends Employee {
  directReports: Employee[]
}

const techLead: Manager = {
  name: 'Ada',
  age: 36,
  employeeId: 'EMP_001',
  department: 'Engineering',
  directReports: [],
}
```

An interface can also extend multiple interfaces simultaneously:
```ts
interface CanFly {
  fly(): void
}

interface CanSwim {
  swim(): void
}

interface Duck extends CanFly, CanSwim {
  quack(): void
}
```

---

## Declaration Merging

A unique superpower of interfaces is **Declaration Merging**. If you declare two interfaces with the same name in the same scope, TypeScript automatically combines their definitions into a single interface:

```ts
interface WindowCustomProps {
  analyticsId: string
}

interface WindowCustomProps {
  appVersion: string
}

// Resulting merged interface has both properties!
const config: WindowCustomProps = {
  analyticsId: 'UA-123456',
  appVersion: '2.4.0',
}
```

This feature is frequently used in library development and ambient declarations (`.d.ts`) to extend global objects (like `window` or Express `Request`).

---

## Hybrid Types

In JavaScript, objects can sometimes act as both functions and property containers. TypeScript models this with **Hybrid Types**:

```ts
interface Counter {
  (start: number): string // Callable signature
  interval: number        // Property
  reset(): void           // Method
}

function getCounter(): Counter {
  const counter = function (start: number) {
    return `Counter started at ${start}`
  } as Counter

  counter.interval = 1000
  counter.reset = () => {
    console.log('Counter reset')
  }

  return counter
}

const c = getCounter()
c(10)
c.reset()
```

---

## Types vs Interfaces: Key Differences

| Feature | `interface` | `type` Alias |
| :--- | :--- | :--- |
| **Object Shape Definition** | Yes (`interface User { ... }`) | Yes (`type User = { ... }`) |
| **Primitives, Unions & Tuples** | No | Yes (`type ID = string \| number`) |
| **Extending / Inheritance** | `extends` syntax | `&` intersection operator |
| **Declaration Merging** | Yes (merges same-name interfaces) | No (duplicate identifier error) |
| **Performance in Compiler** | Optimized for flat object graphs | Slightly heavier when deeply nested |
| **Classes Implementation** | `class Foo implements User` | `class Foo implements User` |

### Practical Recommendation
- Default to **`interface`** for object contracts, public APIs, and object-oriented class hierarchies.
- Use **`type`** when you need unions, primitives, tuples, utility type manipulations, or mapped types.

---

## Summary

- Interfaces define object contracts and method signatures.
- Interfaces can extend single or multiple interfaces using `extends`.
- Declaration merging allows multiple interface definitions with the same name to combine automatically.
- Use interfaces for object shapes and class contracts; use type aliases for unions, primitives, and complex type arithmetic.

## Practice

1. Declare an interface `Vehicle` with `make: string`, `model: string`, and `year: number`.
2. Extend `Vehicle` to create `ElectricCar` with an additional `batteryCapacityKwh: number` and `charge(): void` method.
3. Instantiate an object matching `ElectricCar` and call its `charge()` method.
