---
title: 'Objects'
description: 'Master JavaScript objects: object literals, properties, methods, nested objects, property access, computed property keys, object destructuring, spread operations, Object.keys, Object.values, Object.entries, and Object.assign.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/javascript/09-array-methods
---

# Objects

Objects are the foundational compound data structure in JavaScript. Almost all entities in JavaScript—from arrays and functions to browser windows and DOM nodes—are objects or inherit from `Object.prototype`. At its core, a JavaScript object is an unordered collection of related data and functionality stored as key-value pairs (properties and methods).

Property keys can be strings or `Symbol` primitives, while property values can be any data type, including nested objects, arrays, and functions. Modern ECMAScript has introduced powerful syntactic features such as computed properties, destructuring, object spread, and static reflection utilities that make working with objects expressive and clean.

In this lesson, we will explore object literals, property access (dot vs bracket notation), method declarations, nested structures, computed property names, object destructuring, spread operations, and reflection methods (`Object.keys`, `Object.values`, `Object.entries`, `Object.assign`).

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        JavaScript Object Architecture                  │
├───────────────────────────────────┬────────────────────────────────────┤
│ Property Access                   │ Object Reflection Utilities        │
├───────────────────────────────────┼────────────────────────────────────┤
│ • obj.propertyName                │ • Object.keys(obj)    -> string[]  │
│ • obj["computed-key"]             │ • Object.values(obj)  -> any[]     │
│ • const { id, name } = obj        │ • Object.entries(obj) -> [k, v][]  │
│ • const cloned = { ...obj, role } │ • Object.assign(target, ...sources)│
└───────────────────────────────────┴────────────────────────────────────┘
```

## Object Literals, Properties, and Methods

The object literal syntax (`{ ... }`) is the standard way to instantiate objects. Properties represent the state of an object, while methods represent functions attached to the object that execute behavior:

```javascript
const userAccount = {
  id: "usr_1092",
  username: "helen_dev",
  isActive: true,
  // ES6 Method shorthand
  getDisplayName() {
    return `@${this.username}`;
  }
};

console.log(userAccount.id);             // "usr_1092"
console.log(userAccount.getDisplayName());// "@helen_dev"
```

## Property Access: Dot vs Bracket Notation

JavaScript supports two notations for accessing and setting object properties:
1. **Dot Notation (`obj.property`)**: The standard, concise syntax. It requires property names to be valid JavaScript identifiers (no spaces, hyphens, or starting numbers).
2. **Bracket Notation (`obj["property"]`)**: Evaluates the expression inside the brackets to a string/symbol key. It is mandatory when accessing properties with spaces, dashes, dynamic variables, or computed values.

```javascript
const systemMetrics = {
  "cpu-usage": 45.2,
  "memory-free-mb": 1024,
  uptimeHours: 72
};

// Dot notation
console.log(systemMetrics.uptimeHours); // 72

// Bracket notation (required for hyphenated keys and dynamic variables)
console.log(systemMetrics["cpu-usage"]); // 45.2

const dynamicKey = "memory-free-mb";
console.log(systemMetrics[dynamicKey]);  // 1024
```

## Computed Properties and Object Shorthand

ES6 introduced **Computed Property Names**, allowing property keys inside object literals to be calculated dynamically using square bracket expressions `[expression]`.

Additionally, if a variable identifier matches the intended object property key name, the **Property Shorthand** syntax allows omitting the duplicate value identifier:

```javascript
const fieldName = "emailAddress";
const fieldValue = "alex@enterprise.com";
const role = "Admin";

// Computed properties + shorthand
const userProfile = {
  id: 101,
  role, // Property shorthand for role: role
  [fieldName]: fieldValue, // Computed key: emailAddress: "alex@enterprise.com"
  [`audit_${Date.now()}`]: "INIT"
};
```

## Object Destructuring

**Destructuring assignment** allows unpacking properties from objects into distinct variables with a clean syntax. Destructuring supports default values, renaming/aliasing, and rest parameters:

```javascript
const configuration = {
  host: "db.internal.net",
  port: 5432,
  maxConnections: 100
};

// Destructuring with renaming (alias) and default fallback
const { host, port, timeoutMs = 3000, maxConnections: poolSize } = configuration;

console.log(host);     // "db.internal.net"
console.log(poolSize); // 100 (renamed from maxConnections)
console.log(timeoutMs);// 3000 (used default fallback)

// Nested destructuring
const client = {
  id: 99,
  address: { city: "San Francisco", state: "CA" }
};
const { address: { city } } = client;
console.log(city); // "San Francisco"
```

## Object Spread (`...`) and `Object.assign()`

The object spread operator (`...`) creates a shallow copy of an object's enumerable own properties. It is widely used to clone objects and merge multiple objects while overriding specific fields:

`Object.assign(target, ...sources)` performs the same shallow property copying by mutating the `target` object.

```javascript
const defaultSettings = { theme: "light", fontSize: 14, sound: true };
const userCustomizations = { theme: "dark", fontSize: 16 };

// Spread merging (last defined key wins)
const finalSettings = {
  ...defaultSettings,
  ...userCustomizations,
  lastUpdated: new Date()
};

console.log(finalSettings.theme);    // "dark"
console.log(finalSettings.sound);    // true (retained from defaults)
console.log(finalSettings.fontSize); // 16
```

## Static Reflection Utilities: `Object.keys`, `values`, and `entries`

The static methods on `Object` provide reflection capabilities over object properties:
- **`Object.keys(obj)`**: Returns an array of strings representing all enumerable own property keys.
- **`Object.values(obj)`**: Returns an array of values corresponding to the enumerable own properties.
- **`Object.entries(obj)`**: Returns an array of `[key, value]` pairs, making objects easily iterable with `for...of` or array transformation methods.
- **`Object.fromEntries(entries)`**: Transforms a list of key-value pairs back into an object.

```javascript
const inventoryCounts = { apples: 25, oranges: 18, bananas: 40 };

console.log(Object.keys(inventoryCounts));   // ["apples", "oranges", "bananas"]
console.log(Object.values(inventoryCounts)); // [25, 18, 40]
console.log(Object.entries(inventoryCounts));// [["apples", 25], ["oranges", 18], ["bananas", 40]]

// Transforming object values using entries + map + fromEntries
const discountedInventory = Object.fromEntries(
  Object.entries(inventoryCounts).map(([fruit, count]) => [fruit, count * 2])
);
console.log(discountedInventory); // { apples: 50, oranges: 36, bananas: 80 }
```

## Summary

JavaScript objects store structured data as key-value pairs. Access properties via dot notation for standard identifiers or bracket notation for dynamic expressions. Computed property names and object destructuring streamline data extraction and assignment. The spread operator (`...`) provides shallow cloning and merging capabilities. `Object.keys()`, `Object.values()`, and `Object.entries()` enable object reflection, transformation, and iteration.

## Best Practices

1. **Use Destructuring for Clean Function Signatures**: Destructure option objects directly in function parameter lists: `function init({ host, port = 80 })`.
2. **Be Aware of Shallow Copying**: Object spread (`{ ...obj }`) copies nested objects by reference. Use `structuredClone(obj)` for deep copies.
3. **Use Property Shorthand**: Keep object instantiation concise by naming local variables to match property keys.
4. **Prefer Spread Over `Object.assign()`**: Object spread syntax is cleaner and avoids mutating the target object unintentionally.
5. **Use Optional Chaining with Objects**: Prevent crashes when navigating nested properties that might be absent: `user.preferences?.theme`.
