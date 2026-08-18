---
title: 'Basic Classes'
description: 'Master Object-Oriented Programming in TypeScript: class properties, constructors, access modifiers (public, private, protected), readonly, getters, setters, and static members.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/05-objects
---

# Basic Classes

JavaScript introduced standard class syntax in ECMAScript 2015 (ES6) as syntactic sugar over JavaScript's existing prototype-based inheritance model. However, native JavaScript classes provide limited static encapsulation mechanisms.

TypeScript elevates JavaScript classes into a full-fledged Object-Oriented Programming (OOP) foundation. With TypeScript, classes gain static property type checking, explicit access modifiers (`public`, `private`, `protected`), compile-time `readonly` fields, concise parameter properties, and static members.

```text
┌────────────────────────────────────────────────────────────┐
│                    TypeScript Class Model                  │
│                                                            │
│  class BankAccount {                                       │
│    public readonly accountNumber: string;                  │
│    private balance: number;                                │
│    protected ownerId: string;                              │
│    static bankCode: string = 'SWIFT-9910';                 │
│                                                            │
│    constructor(accountNumber: string, initialDeposit = 0)  │
│    get currentBalance(): number { ... }                    │
│    public deposit(amount: number): void { ... }            │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
```

## Class Declarations and Property Annotations

In TypeScript, all class fields must be declared with their static types before they can be assigned inside the constructor or referenced within methods. If a property is not initialized in the declaration or the constructor body, TypeScript raises a strict property initialization error when `"strictPropertyInitialization": true` is enabled:

```typescript
class UserAccount {
  // Class property declarations
  id: string;
  name: string;
  loginCount: number = 0; // Property with default initial value

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const user = new UserAccount("usr_101", "Ada Lovelace");
```

## Methods and Methods Typing

Class methods behave like regular functions: parameter types and return types should be explicitly annotated to ensure callers invoke them correctly:

```typescript
class ShoppingCart {
  private items: { name: string; price: number; quantity: number }[] = [];

  public addItem(name: string, price: number, quantity: number = 1): void {
    this.items.push({ name, price, quantity });
  }

  public calculateTotal(discountRate: number = 0): number {
    const rawTotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return rawTotal * (1 - discountRate);
  }
}
```

## Access Modifiers: `public`, `private`, and `protected`

TypeScript provides three visibility access modifiers to control where class members can be accessed from:

1. **`public` (Default)**: Public members can be accessed from anywhere—inside the class, subclasses, and from external caller code.
2. **`private`**: Private members can only be accessed from within the class that declared them. They are not visible to subclasses or external instances.
3. **`protected`**: Protected members can be accessed from within the declaring class and any child class (subclass) that extends it, but cannot be accessed from outside instances.

```typescript
class Employee {
  public name: string;             // Accessible everywhere
  protected department: string;    // Accessible in Employee and Subclasses
  private salary: number;          // Accessible ONLY inside Employee

  constructor(name: string, department: string, salary: number) {
    this.name = name;
    this.department = department;
    this.salary = salary;
  }

  public getSalaryStatement(): string {
    return `${this.name} earns confidential salary in ${this.department}`;
  }
}

class Manager extends Employee {
  public reportDepartment(): string {
    // Valid: 'department' is protected
    return `Manager ${this.name} leads ${this.department}`;
    // Error: Property 'salary' is private and only accessible within class 'Employee'.
    // return this.salary;
  }
}
```

*Note on TypeScript `private` vs JavaScript `#private`*: TypeScript's `private` keyword is a compile-time check that is erased at runtime. Modern JavaScript also supports `#propertyName` (hard private fields), which enforces runtime privacy at the browser engine level.

## Readonly Properties in Classes

The `readonly` modifier prevents a class property from being reassigned outside of the constructor. Once assigned during class instantiation, it remains immutable:

```typescript
class CryptoTransaction {
  public readonly transactionHash: string;
  public readonly timestamp: Date;
  public status: "pending" | "confirmed" | "failed";

  constructor(hash: string) {
    this.transactionHash = hash;
    this.timestamp = new Date();
    this.status = "pending";
  }

  public completeTransaction() {
    this.status = "confirmed";
    // Error: Cannot assign to 'transactionHash' because it is a read-only property.
    // this.transactionHash = "new_hash";
  }
}
```

## Parameter Properties (Constructor Shorthand)

Declaring properties at the top of a class and manually reassigning them in the constructor (`this.x = x;`) can create repetitive boilerplate. TypeScript introduces **Parameter Properties**, allowing you to declare and initialize class fields directly inside the constructor parameter list using an access modifier:

```typescript
// Concise Parameter Property Syntax
class DatabaseConnection {
  constructor(
    public readonly host: string,
    private port: number,
    protected databaseName: string,
    public sslEnabled: boolean = true
  ) {
    // TypeScript automatically creates and assigns this.host, this.port, etc.
  }
}

const db = new DatabaseConnection("db.internal.net", 5432, "production_db");
console.log(db.host); // "db.internal.net"
```

## Getters and Setters (Accessors)

TypeScript supports ECMAScript getters and setters to intercept property access and mutation, adding custom validation, computed values, or side effects:

```typescript
class Thermometer {
  private _celsius: number = 0;

  // Getter: Read temperature in Celsius
  get celsius(): number {
    return this._celsius;
  }

  // Setter: Validate and update temperature
  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature cannot be below absolute zero (-273.15°C).");
    }
    this._celsius = value;
  }

  // Getter: Computed property in Fahrenheit
  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }
}

const gauge = new Thermometer();
gauge.celsius = 25;
console.log(gauge.fahrenheit); // 77°F
```

If a getter exists without a setter, TypeScript automatically marks the property as `readonly`.

## Static Members (`static`)

Static properties and methods belong to the class constructor itself rather than to individual object instances. They are invoked directly on the class name:

```typescript
class MathUtility {
  public static readonly PI: number = 3.14159265359;
  private static calculationCount: number = 0;

  public static calculateCircleArea(radius: number): number {
    this.calculationCount++;
    return this.PI * radius * radius;
  }

  public static getUsageStats(): string {
    return `Executed ${this.calculationCount} calculations.`;
  }
}

console.log(MathUtility.calculateCircleArea(10)); // 314.159...
console.log(MathUtility.getUsageStats());        // "Executed 1 calculations."
```

## Summary

- TypeScript classes provide static typing, OOP access control, and strict initialization checks.
- Access modifiers (`public`, `protected`, `private`) control member visibility across classes, subclasses, and consumer code.
- Parameter properties offer a concise shorthand to declare and assign fields directly in constructors.
- `readonly` prevents field reassignment after constructor execution.
- Getters and setters encapsulate state access and provide computed properties.
- `static` members belong to the class constructor and provide shared utility methods and constants.

## Best Practices

1. **Use Parameter Properties**: Eliminate constructor boilerplate by using `constructor(public readonly id: string, private apiKey: string)`.
2. **Encapsulate Internal State with `private` or `#`**: Keep class internal state private and expose controlled methods or getters.
3. **Use `readonly` for Immutable Identifiers**: Mark database IDs, creation dates, and injected service instances as `readonly`.
4. **Enable `"strictPropertyInitialization": true`**: Ensure all declared class properties are initialized either directly or in the constructor to avoid `undefined` bugs.
