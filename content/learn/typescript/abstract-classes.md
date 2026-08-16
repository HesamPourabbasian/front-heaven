---
title: 'Abstract Classes'
description: 'Learn how to define abstract classes and methods to create foundational blueprint templates for subclasses in TypeScript.'
order: 22
difficulty: 'intermediate'
category: 'Level 6 - Classes & OOP'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/inheritance-and-polymorphism
---

## What is an Abstract Class?

An **Abstract Class** is a base class that serves as a blueprint for other classes. Unlike regular classes, an abstract class **cannot be instantiated directly** with the `new` keyword.

Abstract classes are declared with the `abstract` keyword:

```ts
abstract class BaseRepository<T> {
  // Concrete method with shared implementation:
  logOperation(op: string) {
    console.log(`[DB OPERATION]: ${op}`)
  }

  // Abstract methods must be implemented by non-abstract subclasses:
  abstract findById(id: string): Promise<T | null>
  abstract save(item: T): Promise<void>
}

// Error: Cannot create an instance of an abstract class.
// const repo = new BaseRepository()
```

---

## Implementing Abstract Methods

When a non-abstract subclass extends an abstract class, it **must implement all abstract methods and properties** defined by the parent:

```ts
interface User {
  id: string
  name: string
}

class UserRepository extends BaseRepository<User> {
  private users: Map<string, User> = new Map()

  async findById(id: string): Promise<User | null> {
    this.logOperation(`Finding user ${id}`)
    return this.users.get(id) ?? null
  }

  async save(item: User): Promise<void> {
    this.logOperation(`Saving user ${item.id}`)
    this.users.set(item.id, item)
  }
}

const userRepo = new UserRepository()
userRepo.save({ id: 'u_1', name: 'Grace' })
```

---

## Abstract Classes vs Interfaces

| Feature | `abstract class` | `interface` |
| :--- | :--- | :--- |
| **Runtime Output** | Emits JavaScript class code | Zero runtime JS (stripped completely) |
| **Method Implementations** | Can provide concrete implementation code | Method signatures only |
| **Constructor / State** | Can hold state & constructor logic | No state or constructors |
| **Multiple Inheritance** | A class can extend only **one** class | A class can implement **multiple** interfaces |

### When to Use Which
- Use an **Interface** when you want a pure type-level contract without sharing runtime code or state.
- Use an **Abstract Class** when you want to provide shared boilerplate logic (e.g., logging, template method patterns, shared caching) while requiring subclasses to fill in domain-specific details.

---

## Summary

- Prefix classes and methods with `abstract` to create blueprints.
- Abstract classes cannot be directly instantiated with `new`.
- Concrete subclasses must implement all abstract members.
- Use abstract classes to mix shared implementation code with required abstract hooks.

## Practice

1. Define an abstract class `PaymentProcessor` with an abstract method `processPayment(amount: number): Promise<boolean>` and a concrete method `generateReceipt(amount: number): string`.
2. Create concrete subclasses `StripeProcessor` and `PayPalProcessor` implementing the abstract method.
3. Instantiate `StripeProcessor` and call both methods.
