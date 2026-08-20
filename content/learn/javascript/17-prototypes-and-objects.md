---
title: 'Prototypes & Objects'
description: 'Master JavaScript prototypes: prototype chain, Object.create, constructor functions, prototype methods, property descriptors, getters/setters, defineProperty, Object.freeze, and Object.seal.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/javascript/16-this-keyword
---

# Prototypes & Objects

JavaScript is fundamentally a **prototype-based language**. While modern ECMAScript introduced the `class` keyword in ES6, it is essential to realize that JavaScript classes are primarily syntactic sugar built on top of prototype delegation. Underneath every class, array, and object literal lies the **Prototype Chain** (`[[Prototype]]`).

Understanding prototypal inheritance, property attribute descriptors (enumerable, writable, configurable), accessor properties (getters and setters), and object immutability controls (`Object.freeze`, `Object.seal`) unlocks the ability to design high-performance architectures, build robust libraries, and debug runtime anomalies.

In this lesson, we will explore the Prototype Chain, object creation with `Object.create()`, constructor functions and `.prototype`, Property Descriptors, custom getters and setters with `Object.defineProperty()`, and integrity seals.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          The Prototype Chain                           │
├────────────────────────────────────────────────────────────────────────┤
│  Instance Object: dog                                                  │
│   ├── name: "Rex"                                                      │
│   └── [[Prototype]] ──> Dog.prototype                                  │
│                          ├── bark(): function                          │
│                          └── [[Prototype]] ──> Animal.prototype        │
│                                                 ├── eat(): function    │
│                                                 └── [[Prototype]] ────> Object.prototype
│                                                                          └── null
└────────────────────────────────────────────────────────────────────────┘
```

## The Prototype Chain and Property Delegation

Every JavaScript object has an internal hidden property called `[[Prototype]]` (accessible in browsers via the historical `__proto__` property or standard `Object.getPrototypeOf()`).

When you attempt to access a property or method on an object, the JavaScript engine first checks if that property exists on the object itself (an **own property**). If it is not found, the engine traverses up the **Prototype Chain** to the object's `[[Prototype]]`, continuing up until the property is found or `null` is reached (the end of the chain on `Object.prototype`). If not found, it evaluates to `undefined`.

```javascript
const vehicle = {
  wheels: 4,
  drive() {
    return "Moving forward";
  }
};

// Object.create() creates a new object with 'vehicle' as its [[Prototype]]
const car = Object.create(vehicle);
car.make = "Tesla";

console.log(car.make);   // "Tesla" (Own property)
console.log(car.wheels); // 4 (Delegated to vehicle prototype!)
console.log(car.drive());// "Moving forward" (Delegated)
```

## Constructor Functions and `.prototype`

Before ES6 classes, constructor functions were the primary mechanism for instantiating multiple objects sharing shared prototype methods:
- Every function in JavaScript automatically has a `.prototype` object property.
- When invoked with `new FunctionName()`, the newly created object's internal `[[Prototype]]` is linked directly to `FunctionName.prototype`.

Attaching methods to `.prototype` ensures that all instances share a single function reference in memory, rather than recreating duplicate function instances for every object.

```javascript
function Account(accountNumber, balance) {
  this.accountNumber = accountNumber;
  this.balance = balance;
}

// Shared prototype method (allocated once in memory)
Account.prototype.deposit = function(amount) {
  this.balance += amount;
  return this.balance;
};

const acc1 = new Account("ACC-101", 1000);
const acc2 = new Account("ACC-102", 5000);

acc1.deposit(200);
console.log(acc1.balance); // 1200
console.log(acc1.deposit === acc2.deposit); // true (Shared prototype reference)
```

## Property Descriptors: Enumerable, Writable, Configurable

Properties in JavaScript are not just values; they possess hidden configuration attributes known as **Property Descriptors**:
- **`value`**: The actual data value stored.
- **`writable`**: If `true`, the property value can be modified using an assignment operator.
- **`enumerable`**: If `true`, the property appears in `for...in` loops and `Object.keys()`.
- **`configurable`**: If `true`, the property descriptor can be modified, and the property can be deleted with `delete`.

Use `Object.getOwnPropertyDescriptor(obj, prop)` to inspect descriptors, and `Object.defineProperty(obj, prop, descriptor)` to configure them explicitly:

```javascript
const product = { id: 101, title: "Phone" };

// Inspect property descriptor
console.log(Object.getOwnPropertyDescriptor(product, "title"));
// { value: 'Phone', writable: true, enumerable: true, configurable: true }

// Define a read-only, non-enumerable, non-deletable property
Object.defineProperty(product, "serialNumber", {
  value: "SN-998822",
  writable: false,
  enumerable: false,
  configurable: false
});

console.log(Object.keys(product)); // ["id", "title"] (serialNumber is hidden!)
// product.serialNumber = "NEW_SN"; // TypeError in strict mode
```

## Accessor Properties: Getters and Setters

Accessor properties are methods that intercept getting and setting a property value. They allow data validation, encapsulation, and derived values without changing public property access syntax:

```javascript
const temperatureSensor = {
  _celsius: 25,

  get celsius() {
    return this._celsius;
  },

  set celsius(value) {
    if (value < -273.15) {
      throw new RangeError("Temperature below absolute zero is impossible");
    }
    this._celsius = value;
  },

  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }
};

console.log(temperatureSensor.fahrenheit); // 77
temperatureSensor.celsius = 30;
console.log(temperatureSensor.fahrenheit); // 86
```

## Object Integrity: `Object.freeze()` and `Object.seal()`

JavaScript provides three levels of object locking:
1. **`Object.preventExtensions(obj)`**: Prevents adding new properties. Existing properties can still be modified or deleted.
2. **`Object.seal(obj)`**: Prevents adding new properties and marks all existing properties as `configurable: false` (cannot be deleted). Existing writable properties can still be modified.
3. **`Object.freeze(obj)`**: The highest level of immutability. Prevents adding, deleting, or modifying any existing properties (`writable: false`, `configurable: false`). Note: `Object.freeze` is **shallow**; nested objects remain mutable unless deeply frozen.

```javascript
const immutableConfig = Object.freeze({
  environment: "production",
  port: 8080,
  nested: { debug: false }
});

// immutableConfig.port = 9000; // TypeError in strict mode
// delete immutableConfig.environment; // TypeError in strict mode

// Shallow freeze pitfall: nested objects are still mutable!
immutableConfig.nested.debug = true;
console.log(immutableConfig.nested.debug); // true
```

## Summary

JavaScript utilizes prototypal inheritance where objects delegate property lookups through the `[[Prototype]]` chain. Constructor functions instantiate objects linked to their `.prototype` objects. Property Descriptors configure `writable`, `enumerable`, and `configurable` flags via `Object.defineProperty()`. Accessor getters and setters control access to private state. `Object.seal()` prevents property addition/deletion, while `Object.freeze()` locks properties into a shallow read-only state.

## Best Practices

1. **Attach Shared Methods to Prototypes**: Always place instance methods on constructor prototypes or class declarations to conserve heap memory.
2. **Use `Object.create(null)` for Dictionary Maps**: Creating objects with `null` prototype eliminates prototype pollution and avoids collisions with `toString` or `hasOwnProperty`.
3. **Implement Deep Freeze for Configuration Objects**: Write a recursive helper function to deeply freeze nested configuration trees.
4. **Use Getters/Setters for Input Validation**: Encapsulate internal object invariants with getters and setters instead of exposing raw mutable properties.
5. **Use `Object.hasOwn()` Over `hasOwnProperty()`**: Use ES2022 `Object.hasOwn(obj, 'prop')` to test own properties safely, avoiding prototype shadowing issues.
