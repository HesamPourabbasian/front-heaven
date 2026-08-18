---
title: 'Classes & OOP'
description: 'Master advanced Object-Oriented Programming in TypeScript: abstract classes, abstract methods, interface implementation, inheritance, method overriding, and generic classes.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/15-functions
---

# Classes & OOP

Modern enterprise architectures—such as backend microservices, game engines, UI frameworks, and ORM entity systems—rely heavily on Object-Oriented Programming (OOP) principles. While standard JavaScript classes provide basic inheritance, TypeScript adds compile-time type enforcement, interface contracts (`implements`), class inheritance (`extends`), **Abstract Classes**, **Abstract Methods**, and **Generic Classes**.

In this lesson, we explore how to build scalable, maintainable OOP architectures using TypeScript's type-safe class mechanisms.

```text
┌────────────────────────────────────────────────────────────┐
│                    OOP Architecture in TS                  │
│                                                            │
│       interface Identifiable ──┐                           │
│       interface Serializable ──┼──> implements             │
│                                │                           │
│                 ┌──────────────▼──────────────┐            │
│                 │   abstract class BaseEntity  │            │
│                 │   abstract validate(): void │            │
│                 └──────────────┬──────────────┘            │
│                                │                           │
│                                └───> extends               │
│                 ┌──────────────▼──────────────┐            │
│                 │   class User extends Base   │            │
│                 │   validate() { ... }        │            │
│                 └─────────────────────────────┘            │
└────────────────────────────────────────────────────────────┘
```

## Implementing Interfaces (`implements`)

An `interface` in TypeScript defines a behavioral contract. When a class declares that it `implements` an interface, TypeScript verifies at compile time that the class satisfies every property and method declared in that interface:

```typescript
interface Serializable {
  serialize(): string;
  deserialize(raw: string): void;
}

interface Auditable {
  readonly createdAt: Date;
  updatedAt: Date;
}

// Class implementing multiple interfaces
class DocumentModel implements Serializable, Auditable {
  public readonly createdAt: Date = new Date();
  public updatedAt: Date = new Date();

  constructor(public title: string, public content: string) {}

  public serialize(): string {
    return JSON.stringify({
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  public deserialize(raw: string): void {
    const parsed = JSON.parse(raw);
    this.title = parsed.title;
    this.content = parsed.content;
    this.updatedAt = new Date();
  }
}
```

*Note*: The `implements` clause only checks the public instance side of a class. It does not enforce private or static members.

## Class Inheritance (`extends`) and `super()`

A class can inherit properties and methods from a parent class using the `extends` keyword. When a child class defines its own constructor, it must call `super()` before accessing `this`:

```typescript
class BaseRepository {
  constructor(protected readonly connectionString: string) {}

  protected logQuery(query: string): void {
    console.log(`[DB QUERY @ ${new Date().toISOString()}]: ${query}`);
  }
}

class UserRepository extends BaseRepository {
  constructor(connectionString: string, private readonly cacheTimeout: number = 3600) {
    // Invoke parent constructor
    super(connectionString);
  }

  public findUserById(id: string) {
    this.logQuery(`SELECT * FROM users WHERE id = '${id}'`);
    // Query execution...
  }
}
```

## Method Overriding and the `override` Keyword

A child class can override a method inherited from its parent class to provide a specialized implementation. Starting in TypeScript 4.3, you can enable `"noImplicitOverride": true` and use the explicit `override` keyword to guarantee that the method being overridden actually exists on the parent class:

```typescript
class NotificationSender {
  public send(recipient: string, message: string): boolean {
    console.log(`Standard notification to ${recipient}: ${message}`);
    return true;
  }
}

class EmailNotificationSender extends NotificationSender {
  // Explicit 'override' keyword ensures compile-time safety against parent method renames
  public override send(recipient: string, message: string): boolean {
    console.log(`Sending SMTP Email to ${recipient} with body: ${message}`);
    return true;
  }
}
```

If the parent class renames `send()` to `sendNotification()`, TypeScript will immediately flag an error on `EmailNotificationSender` because `send` is marked with `override`.

## Abstract Classes and Abstract Methods

An **Abstract Class** is a base class that cannot be instantiated directly with `new`. It serves as a blueprint for subclasses.

An **Abstract Method** is a method declared without an implementation body inside an abstract class; every non-abstract subclass *must* implement all inherited abstract methods:

```typescript
abstract class PaymentProcessor {
  constructor(protected readonly apiKey: string) {}

  // Abstract method: Subclasses MUST implement this
  public abstract processPayment(amount: number, currency: string): Promise<boolean>;

  // Concrete method: Shared implementation available to all subclasses
  public generateTransactionReceipt(transactionId: string, amount: number): string {
    return `Receipt #${transactionId}: Amount Paid = $${amount.toFixed(2)}`;
  }
}

class StripePaymentProcessor extends PaymentProcessor {
  public override async processPayment(amount: number, currency: string): Promise<boolean> {
    console.log(`Processing $${amount} ${currency} charge via Stripe API with key: ${this.apiKey.slice(0, 4)}***`);
    return true;
  }
}

// Compile Error: Cannot create an instance of an abstract class.
// const processor = new PaymentProcessor("secret_key");

const stripe = new StripePaymentProcessor("sk_live_98124");
stripe.processPayment(150, "USD");
```

## Generic Classes in OOP

Classes can accept generic type parameters to manage strongly typed collections, caches, repositories, or state containers:

```typescript
interface Entity {
  id: string;
}

abstract class Repository<T extends Entity> {
  protected entities: Map<string, T> = new Map();

  public save(entity: T): void {
    this.entities.set(entity.id, entity);
  }

  public findById(id: string): T | undefined {
    return this.entities.get(id);
  }

  public delete(id: string): boolean {
    return this.entities.delete(id);
  }

  public abstract validate(entity: T): boolean;
}

interface Customer extends Entity {
  id: string;
  name: string;
  email: string;
}

class CustomerRepository extends Repository<Customer> {
  public override validate(customer: Customer): boolean {
    return customer.email.includes("@");
  }
}
```

## Static Members and Inheritance

Static members are inherited by subclasses in TypeScript. A child class inherits static methods and properties from its parent class and can invoke them directly:

```typescript
class ConfigFactory {
  public static readonly DEFAULT_TIMEOUT: number = 5000;
  public static createDefaultHeaders(): Record<string, string> {
    return { "Content-Type": "application/json" };
  }
}

class ApiConfigFactory extends ConfigFactory {
  // Inherits DEFAULT_TIMEOUT and createDefaultHeaders()
}

console.log(ApiConfigFactory.DEFAULT_TIMEOUT); // 5000
```

## Summary

- The `implements` clause guarantees that a class satisfies public interface contracts.
- The `extends` keyword enables single-class inheritance with `super()` constructor invocation.
- The `override` keyword prevents subtle bugs when modifying or overriding parent class methods.
- Abstract classes provide shared implementation logic alongside mandatory abstract method contracts.
- Generic classes parameterize internal data structures and maintain strict type safety across CRUD operations.
- Static members belong to the class constructor and are inherited by subclasses.

## Best Practices

1. **Use Abstract Classes for Template Method Patterns**: Use abstract classes when base classes contain shared concrete helper methods; use interfaces when describing pure shape contracts.
2. **Enable `"noImplicitOverride": true`**: Always use the `override` keyword when overriding parent class methods.
3. **Prefer Composition Over Deep Inheritance**: Limit inheritance trees to 1-2 levels. Favor composing independent service interfaces over monolithic base classes.
4. **Constrain Generic Classes**: Always constrain repository generic entities with `T extends { id: string }` or similar base interfaces.
