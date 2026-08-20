---
title: 'Data Types'
description: 'Master JavaScript data types: the 7 primitive types (String, Number, BigInt, Boolean, Undefined, Null, Symbol) vs Reference Objects, memory allocation, typeof operator, and instanceof checks.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/02-variables
---

# Data Types

In JavaScript, data types define the characteristics, memory representation, and allowable operations for any given piece of data. JavaScript is a dynamically and weakly typed language: variables are not statically bound to a specific data type at compile time; instead, types are associated directly with values at runtime. A variable holding a numerical value can later be assigned a string or an object.

The ECMAScript specification categorizes data into two fundamental categories: **Primitive Data Types** and **Reference Types (Objects)**. Understanding how the JavaScript engine allocates, stores, and compares these two categories in system memory is crucial for avoiding unexpected data mutation and performance bottlenecks.

In this lesson, we will explore each of the 7 primitive data types (`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`), dissect the composite `object` reference type, analyze stack versus heap memory allocation, examine type inspection with the `typeof` operator, and perform prototype hierarchy checks using `instanceof`.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        JavaScript Type Taxonomy                        │
├───────────────────────────────────┬────────────────────────────────────┤
│ Primitive Types (Value / Stack)   │ Reference Types (Heap Reference)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • String    ('hello')             │ • Object    ({ id: 1 })            │
│ • Number    (42, 3.14, NaN)       │ • Array     ([1, 2, 3])            │
│ • BigInt    (9007199254740991n)   │ • Function  (function() {})        │
│ • Boolean   (true / false)        │ • Map, Set, WeakMap, WeakSet       │
│ • Undefined (undefined)           │ • Date, RegExp, Error              │
│ • Null      (null)                │                                    │
│ • Symbol    (Symbol('id'))        │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

## Primitive Types vs Reference Types

Primitive data types represent a single, immutable value stored directly in the execution stack memory frame of the execution context. When you copy a primitive value from one variable to another, JavaScript creates a complete, independent bitwise duplicate of that value in a new memory address. Mutating one variable has zero impact on the other.

Reference types (Objects, Arrays, Functions) represent complex, mutable collections of key-value pairs or executable logic. The object body itself is allocated on the dynamic memory heap, while the variable on the stack stores only a memory pointer (reference address) pointing to that heap location. When an object is copied or passed into a function, JavaScript copies only the memory reference pointer, not the underlying object data. As a result, modifications through one reference immediately mutate the shared object in the heap.

```javascript
// Primitive copying: independent values
let originalScore = 100;
let clonedScore = originalScore;
clonedScore = 150;
console.log(originalScore); // 100 (unaffected)

// Reference copying: shared heap reference
const originalUser = { username: "alex", role: "admin" };
const secondaryRef = originalUser;
secondaryRef.role = "editor";
console.log(originalUser.role); // "editor" (mutated via shared reference!)
```

## The 7 Primitive Types

### 1. String
Strings represent sequences of 16-bit UTF-16 code units used to represent textual data. Strings are immutable: once created, individual character indices cannot be modified. String literals can be delimited with single quotes (`'`), double quotes (`"`), or backticks (`` ` ``) for template literals.

### 2. Number
JavaScript numbers conform to the IEEE 754 standard for 64-bit double-precision floating-point values. This single type handles both integers and decimal fractions. It also includes three symbolic numerical values: `+Infinity`, `-Infinity`, and `NaN` ("Not-a-Number", representing an invalid numerical computation like `0 / 0` or `parseInt("abc")`).

### 3. BigInt
Because standard Numbers safely represent integers only up to `2^53 - 1` (`Number.MAX_SAFE_INTEGER` = 9,007,199,254,740,991), ECMAScript 2020 introduced `BigInt` for arbitrary-precision integers. BigInts are created by appending an `n` suffix to an integer literal or calling `BigInt()`. BigInts cannot be directly mixed with standard Numbers in arithmetic operations without explicit conversion.

### 4. Boolean
Booleans represent a logical entity that can have only two values: `true` or `false`. They are the foundation of all control flow conditionals and comparison expressions.

### 5. Undefined
`undefined` is a primitive type possessing exactly one value: `undefined`. It signifies the unintentional absence of a value—a variable that has been declared but not yet assigned, a function parameter that was omitted, or an object property that does not exist.

### 6. Null
`null` is a primitive type possessing exactly one value: `null`. Unlike `undefined`, `null` represents the intentional absence of any object or value. It is explicitly assigned by developers to indicate that an identifier is purposefully empty or cleared.

### 7. Symbol
Introduced in ES6, a `Symbol` is a unique and immutable primitive value commonly used to create anonymous, collision-free object property keys and define internal engine behaviors (well-known symbols like `Symbol.iterator`). Every invocation of `Symbol()` produces a distinct value, even when given identical description strings.

```javascript
// Demonstrating the primitives
const greeting = "Hello, World!";        // String
const price = 49.99;                     // Number
const largeId = 9007199254740995n;       // BigInt
const isVerified = true;                 // Boolean
let unassignedField;                     // Undefined
const emptySlot = null;                  // Null
const uniqueKey = Symbol("transaction"); // Symbol
```

## The Object Reference Type

In JavaScript, anything that is not one of the seven primitive types is an `Object`. This includes plain object literals (`{}`), Arrays (`[]`), Functions (`function() {}`), Dates (`new Date()`), Regular Expressions (`/abc/`), Maps, and Sets.

Objects are composite data structures that map string or Symbol keys to arbitrary values. Because functions are first-class objects, they can be stored in variables, passed as arguments, assigned as object methods, and decorated with custom properties.

```javascript
// Complex composite object structure
const applicationState = {
  version: "2.4.0",
  modules: ["auth", "billing", "dashboard"],
  activeUser: {
    id: 1042,
    preferences: { theme: "dark" }
  },
  logStatus: function() {
    console.log(`Running version ${this.version}`);
  }
};
```

## Inspecting Types: `typeof` Operator

The `typeof` operator returns a lowercase string indicating the data type of an unevaluated operand. While `typeof` works predictably for most primitives, it exhibits well-known historical quirks that every JavaScript developer must recognize:

1. `typeof null` returns `"object"` (a legendary bug in the original 1995 JavaScript engine implementation that cannot be fixed without breaking existing websites).
2. `typeof []` and `typeof {}` both return `"object"`. To check for an array, use `Array.isArray()`.
3. `typeof function() {}` returns `"function"`.
4. `typeof NaN` returns `"number"`.

```javascript
console.log(typeof "hello");       // "string"
console.log(typeof 42);            // "number"
console.log(typeof 100n);          // "bigint"
console.log(typeof true);          // "boolean"
console.log(typeof undefined);     // "undefined"
console.log(typeof Symbol("id"));  // "symbol"
console.log(typeof function() {}); // "function"

// Quirks to remember:
console.log(typeof null);          // "object" (Legacy bug!)
console.log(typeof [1, 2, 3]);     // "object" (Use Array.isArray)
console.log(typeof NaN);           // "number" (Use Number.isNaN)
```

## Type Verification: `instanceof` Operator

The `instanceof` operator tests whether the prototype property of a constructor function or class appears anywhere within the prototype chain of an object. It is used to verify the specific class or constructor instantiation of reference types.

`instanceof` returns `true` if the object inherits from the target constructor, and `false` otherwise. Note that `instanceof` returns `false` when testing primitive values, because primitives are not object instances unless explicitly wrapped with wrapper constructors (e.g., `new String()`, which is generally an anti-pattern).

```javascript
class CustomEventEmitter {}
const emitter = new CustomEventEmitter();

console.log(emitter instanceof CustomEventEmitter); // true
console.log(emitter instanceof Object);             // true (inherits from Object.prototype)
console.log([1, 2, 3] instanceof Array);           // true
console.log([1, 2, 3] instanceof Object);          // true
console.log("plain string" instanceof String);     // false (primitive is not an instance)
```

## Summary

JavaScript features seven primitive types (`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`) and one composite reference type (`object`). Primitives are immutable and stored by value directly on the stack, while objects are mutable and allocated on the heap, referenced via memory pointers. The `typeof` operator inspects primitive types with notable legacy quirks (`typeof null === 'object'`), while `Array.isArray()` and `instanceof` inspect reference prototypes accurately.

## Best Practices

1. **Distinguish `null` from `undefined`**: Use `undefined` to denote uninitialized or missing values; reserve `null` for intentional, explicit resets of object references.
2. **Use `Array.isArray()` for Arrays**: Never rely on `typeof` when checking for arrays, as it yields `"object"`. Always use `Array.isArray(value)`.
3. **Use `Number.isNaN()` Instead of `isNaN()`**: Global `isNaN()` performs implicit coercion (e.g., `isNaN("foo")` is `true`), whereas `Number.isNaN()` strictly checks if the value is numerically `NaN`.
4. **Leverage `BigInt` for Large Identifiers**: Use `BigInt` when dealing with 64-bit database keys, cryptography, or microsecond timestamps exceeding `Number.MAX_SAFE_INTEGER`.
5. **Beware of Object Reference Mutation**: When passing objects or arrays across function boundaries, clone them using shallow spread (`{ ...obj }`) or `structuredClone()` to prevent unintended mutations.
