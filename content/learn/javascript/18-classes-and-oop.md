---
title: 'Classes & OOP'
description: 'Master Object-Oriented Programming in modern JavaScript: ES6 classes, constructors, instance vs static methods, private fields (#), getters, setters, inheritance (extends, super), polymorphism, and composition vs inheritance.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/17-prototypes-and-objects
---

# Classes & Object-Oriented Programming

Introduced in ECMAScript 2015 (ES6) and significantly expanded in recent ECMAScript editions, the `class` syntax provides a clear, declarative object-oriented programming (OOP) model for JavaScript. While built directly upon JavaScript's prototypal delegation system, classes offer formal syntactic constructs for encapsulation, inheritance, polymorphism, and static encapsulation.

Modern JavaScript classes support private fields (`#field`), private methods, static initialization blocks, and inheritance hierarchies via `extends` and `super`. Understanding how to leverage these constructs—while adhering to core software engineering principles such as **Composition over Inheritance**—is crucial for architecting scalable applications.

In this lesson, we will explore class syntax, constructor lifecycle, instance and static methods, true private fields, accessor methods, subclassing with `extends` and `super`, polymorphic method overrides, and composition design patterns.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Modern ES Class Structure                       │
├────────────────────────────────────────────────────────────────────────┤
│ class DatabaseConnection extends BaseService {                         │
│   #apiKey;                    // Private Instance Field (Encapsulated) │
│   static #instanceCount = 0;  // Private Static Counter                │
│                                                                        │
│   constructor(url, apiKey) {                                           │
│     super(url);               // Invokes BaseService Constructor       │
│     this.#apiKey = apiKey;                                             │
│   }                                                                    │
│                                                                        │
│   connect() { ... }           // Public Instance Method (Prototype)    │
│   static getStats() { ... }   // Public Static Method (Class-Level)    │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

## Class Declarations and Constructors

A class is declared using the `class` keyword. The `constructor` method is a special lifecycle method invoked automatically when instantiating a new instance with the `new` operator. Classes are **not hoisted** (they exist in the TDZ until evaluated) and always execute in **strict mode**.

```javascript
class PaymentGateway {
  constructor(merchantId, environment = "sandbox") {
    this.merchantId = merchantId;
    this.environment = environment;
    this.createdAt = new Date();
  }

  // Instance method (attached to PaymentGateway.prototype)
  processTransaction(amount) {
    console.log(`Processing $${amount} for merchant: ${this.merchantId}`);
    return { transactionId: `tx_${Date.now()}`, status: "COMPLETED" };
  }
}

const gateway = new PaymentGateway("merch_9981");
console.log(gateway.processTransaction(150));
```

## Static Methods and Static Properties

Static methods and properties are bound directly to the **class constructor itself**, rather than to individual object instances. Static members are commonly used for utility functions, factory methods, and caching singletons.

```javascript
class CurrencyConverter {
  static exchangeRates = { USD: 1.0, EUR: 0.92, GBP: 0.78 };

  // Static Factory Method
  static convert(amount, fromCurrency, toCurrency) {
    const baseAmount = amount / this.exchangeRates[fromCurrency];
    return baseAmount * this.exchangeRates[toCurrency];
  }
}

console.log(CurrencyConverter.convert(100, "USD", "EUR")); // 92
```

## True Encapsulation: Private Fields and Methods (`#`)

Historically, JavaScript developers used leading underscore naming conventions (e.g. `_privateSecret`) to signal private properties, but these remained completely public and mutable at runtime.

Modern JavaScript provides **true hard encapsulation** via the hash `#` prefix. Private fields and methods can **only** be accessed from within the class body; attempting to read or write `#field` from outside the class throws a compile-time `SyntaxError`.

```javascript
class BankAccount {
  // Private field declarations
  #balance;
  #accountPin;

  constructor(accountHolder, initialDeposit, pin) {
    this.accountHolder = accountHolder;
    this.#balance = initialDeposit;
    this.#accountPin = pin;
  }

  // Public method accessing private field
  getBalance(enteredPin) {
    if (this.#validatePin(enteredPin)) {
      return this.#balance;
    }
    throw new Error("Invalid PIN verification");
  }

  deposit(amount) {
    if (amount <= 0) throw new RangeError("Deposit must be positive");
    this.#balance += amount;
  }

  // Private helper method
  #validatePin(pin) {
    return this.#accountPin === pin;
  }
}

const account = new BankAccount("Sarah", 5000, "1234");
account.deposit(500);
console.log(account.getBalance("1234")); // 5500
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

## Inheritance with `extends` and `super`

JavaScript classes establish inheritance chains using the `extends` keyword. When a child class defines a constructor, it **must** call `super()` before accessing `this`. The `super` keyword invokes the parent class constructor and provides access to parent methods.

```javascript
class NotificationService {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  send(recipient, message) {
    console.log(`[${this.serviceName}] To: ${recipient} -> "${message}"`);
  }
}

class EmailNotificationService extends NotificationService {
  constructor(smtpHost) {
    super("EmailService"); // Call parent constructor
    this.smtpHost = smtpHost;
  }

  // Polymorphism: overriding parent method
  send(recipient, message) {
    // Optionally invoke parent logic with super.send()
    console.log(`Connecting to SMTP server at ${this.smtpHost}...`);
    super.send(recipient, message);
  }
}

const emailer = new EmailNotificationService("smtp.mail.com");
emailer.send("dev@frontend.dev", "Deployment Completed");
```

## Polymorphism in JavaScript

Polymorphism is the ability for different classes to provide different implementations of the same interface or method signature. In JavaScript's dynamic environment, polymorphic functions accept any object that implements the required method contract (Duck Typing).

```javascript
class Square {
  constructor(size) { this.size = size; }
  getArea() { return this.size ** 2; }
}

class Circle {
  constructor(radius) { this.radius = radius; }
  getArea() { return Math.PI * (this.radius ** 2); }
}

function printAreaSummary(shapes) {
  for (const shape of shapes) {
    // Polymorphic invocation: getArea() works regardless of class
    console.log(`Area: ${shape.getArea().toFixed(2)}`);
  }
}

printAreaSummary([new Square(10), new Circle(5)]);
```

## Composition vs Inheritance

While class inheritance creates rigid "is-a" hierarchies, excessive subclassing can lead to fragile base class problems. The **Composition over Inheritance** principle advocates assembling objects using flexible "has-a" relationships by combining independent functional behaviors.

```javascript
// Compositional behaviors (Mixins / Traits)
const canFly = (state) => ({
  fly: () => console.log(`${state.name} is flying through the air!`)
});

const canSwim = (state) => ({
  swim: () => console.log(`${state.name} is swimming in the water.`)
});

// Factory assembling composed objects
function createDuck(name) {
  const state = { name };
  return {
    ...state,
    ...canFly(state),
    ...canSwim(state)
  };
}

const donald = createDuck("Donald");
donald.fly();
donald.swim();
```

## Summary

ES6 classes provide a clean, modern OOP syntax over prototypal inheritance. Constructors initialize instances, instance methods reside on prototypes, and static members reside on the class constructor. True private fields (`#`) guarantee hard encapsulation. Subclassing uses `extends` with `super()` initialization, enabling polymorphic method overrides. Always consider object composition to build flexible, decoupled architectures.

## Best Practices

1. **Use `#private` Fields for Internal State**: Replace legacy underscore naming with true `#` private fields to enforce data integrity.
2. **Favor Composition Over Deep Inheritance Trees**: Avoid creating inheritance hierarchies deeper than 2 levels; compose objects with mixins or factory functions instead.
3. **Always Call `super()` First in Derived Constructors**: In child classes, `this` cannot be accessed before `super()` execution.
4. **Use Static Methods for Factory Initializers**: Provide expressive creation utilities like `User.fromJSON(rawString)`.
5. **Keep Methods Focused**: Follow SOLID principles—classes should have a single responsibility and well-defined contracts.
