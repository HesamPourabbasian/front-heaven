---
title: 'Inheritance & Polymorphism'
description: 'Explore class inheritance, the super keyword, method overriding, the override keyword, and polymorphism in TypeScript.'
order: 21
difficulty: 'intermediate'
category: 'Level 6 - Classes & OOP'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/access-modifiers
---

## Class Inheritance (`extends`)

Inheritance allows a subclass (derived class) to absorb properties and methods from a superclass (base class), promoting code reuse:

```ts
class Animal {
  constructor(public name: string) {}

  makeSound(): string {
    return 'Generic animal sound'
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name) // Must call super() before accessing 'this'
  }

  // Method overriding:
  override makeSound(): string {
    return 'Woof! Woof!'
  }

  fetch(): string {
    return `${this.name} is fetching the ball!`
  }
}

const dog = new Dog('Buddy', 'Golden Retriever')
console.log(dog.makeSound()) // 'Woof! Woof!'
console.log(dog.fetch())
```

---

## Method Overriding & The `override` Keyword

When a subclass replaces a method from its parent class, it is **overriding** that method.

TypeScript 4.3 introduced the `override` keyword (and the `--noImplicitOverride` compiler flag). Adding `override` ensures you do not accidentally mistype a method name or override a method that no longer exists in the parent class:

```ts
class BaseLogger {
  log(message: string): void {
    console.log(message)
  }
}

class PrefixedLogger extends BaseLogger {
  constructor(private prefix: string) {
    super()
  }

  // If BaseLogger renames 'log' to 'write', TypeScript flags this immediately!
  override log(message: string): void {
    super.log(`[${this.prefix}] ${message}`)
  }
}
```

---

## What is Polymorphism?

**Polymorphism** ("many forms") is the ability to treat objects of different subclasses through the unified interface of their common base class, while preserving each subclass's unique behavior:

```ts
class NotificationChannel {
  send(recipient: string, message: string): void {
    console.log(`Sending generic notification to ${recipient}: ${message}`)
  }
}

class EmailChannel extends NotificationChannel {
  override send(recipient: string, message: string): void {
    console.log(`📧 Sending Email to ${recipient}: ${message}`)
  }
}

class SMSChannel extends NotificationChannel {
  override send(recipient: string, message: string): void {
    console.log(`📱 Sending SMS to ${recipient}: ${message}`)
  }
}

class PushChannel extends NotificationChannel {
  override send(recipient: string, message: string): void {
    console.log(`🔔 Sending Push notification to ${recipient}: ${message}`)
  }
}

// Polymorphic function:
function broadcastAlert(channels: NotificationChannel[], recipient: string, alert: string) {
  for (const channel of channels) {
    channel.send(recipient, alert) // Each subclass executes its own specialized 'send' method!
  }
}

broadcastAlert([new EmailChannel(), new SMSChannel(), new PushChannel()], 'user@example.com', 'System update at 10 PM')
```

---

## Inheritance vs Polymorphism

- **Inheritance** is about *structure* — sharing and reusing code between parent and child classes (`Dog extends Animal`).
- **Polymorphism** is about *behavior* — treating different objects through a common base type, allowing runtime dispatch to execute the correct specialized method.

---

## Summary

- Use `extends` to create subclasses and `super()` to invoke parent constructors and methods.
- Use the `override` keyword to safeguard against accidental typos and brittle refactors.
- Polymorphism lets you operate on collections of base-class instances while dynamic dispatch executes subclass-specific logic.

## Practice

1. Create a base class `Shape` with a method `getArea(): number`.
2. Create subclasses `Rectangle` (with `width`, `height`) and `Circle` (with `radius`), overriding `getArea()`.
3. Write a polymorphic function `calculateTotalArea(shapes: Shape[]): number` that sums up areas of any combination of shapes.
