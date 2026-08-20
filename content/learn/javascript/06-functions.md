---
title: 'Functions'
description: 'Master JavaScript functions: declarations vs expressions, arrow functions, parameters, arguments, return values, default and rest parameters, spread syntax, callbacks, higher-order functions, and pure functions.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/javascript/05-control-flow
---

# Functions

Functions are the primary modular building blocks of JavaScript applications. In JavaScript, functions are **first-class citizens** (first-class objects): they can be assigned to variables, stored inside object properties, passed as arguments into other functions, returned dynamically from functions, and endowed with arbitrary properties.

Modern JavaScript provides multiple ways to define and invoke functions, each with distinct semantic rules regarding hoisting, `this` context binding, and constructor capabilities. Understanding these differences is essential for architecting clean, reusable, and predictable software.

In this lesson, we will compare function declarations and function expressions, examine ES6 arrow functions, understand parameter binding and default values, master rest parameters and spread syntax, explore callback patterns, analyze higher-order functions, and embrace functional programming with pure functions.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        JavaScript Function Types                       │
├───────────────────┬───────────────────┬───────────────┬────────────────┤
│ Syntax            │ Hoisted?          │ Own 'this'?   │ Constructor?   │
├───────────────────┼───────────────────┼───────────────┼────────────────┤
│ Function Decl     │ Yes (Full body)   │ Yes (Dynamic) │ Yes (new Fn()) │
│ Function Expr     │ Variable hoisted  │ Yes (Dynamic) │ Yes (new Fn()) │
│ Arrow Function    │ Variable hoisted  │ Lexical this  │ No             │
└───────────────────┴───────────────────┴───────────────┴────────────────┘
```

## Function Declarations vs Function Expressions

A **Function Declaration** defines a named function using the `function` keyword as a standalone statement. Function declarations are hoisted completely during the engine's compilation phase, meaning they can be invoked before their physical declaration line in the source file:

```javascript
// Invoked before declaration due to full hoisting
console.log(calculateArea(5, 10)); // 50

function calculateArea(width, height) {
  return width * height;
}
```

A **Function Expression** creates a function inside an expression assignment, storing the resulting function reference in a variable. Function expressions are governed by standard variable hoisting rules: if declared with `let` or `const`, calling them before their assignment line throws a TDZ `ReferenceError`.

```javascript
// Function Expression
const calculatePerimeter = function(width, height) {
  return 2 * (width + height);
};
console.log(calculatePerimeter(5, 10)); // 30
```

## Arrow Functions

Introduced in ES6, **Arrow Functions** provide a concise syntax for defining functions using the fat arrow (`=>`) notation. Arrow functions have two transformative semantic differences compared to standard functions:
1. **Lexical `this` Binding**: Arrow functions do not bind their own `this`, `arguments`, `super`, or `new.target`. They lexically capture the `this` value of their enclosing scope at definition time.
2. **Non-Constructible**: Arrow functions cannot be used as constructor functions and will throw a `TypeError` if invoked with the `new` operator.

Arrow functions support implicit return when written without curly braces for single-expression bodies:

```javascript
// Concise single-expression arrow function with implicit return
const square = x => x * x;

// Multi-statement arrow function with explicit return
const formatUser = (name, role) => {
  const cleanName = name.trim();
  const cleanRole = role.toUpperCase();
  return `${cleanName} [${cleanRole}]`;
};
```

## Parameters, Arguments, and Default Parameters

Parameters are the named identifiers specified in a function definition, whereas arguments are the concrete values passed to the function when it is invoked. If an argument is omitted during invocation, its parameter evaluates to `undefined`.

ES6 introduced **Default Parameters**, allowing developers to specify fallback values for parameters if no argument or `undefined` is provided. Default parameter expressions are evaluated at call time from left to right:

```javascript
function createHttpRequest(url, method = "GET", timeoutMs = 5000) {
  return {
    url,
    method,
    timeoutMs,
    timestamp: Date.now()
  };
}

console.log(createHttpRequest("/api/users")); // Uses "GET" and 5000
```

## Rest Parameters and Spread Syntax

The **Rest Parameter** syntax (`...rest`) allows a function to collect an indefinite number of arguments into a true JavaScript `Array`. It replaces the legacy, array-like `arguments` object with a clean, fully-typed array supporting all array methods (`map`, `filter`, `reduce`). A function may have only one rest parameter, and it must always be the final parameter in the signature.

Conversely, the **Spread Syntax** (`...`) expands an iterable array or object into individual arguments or elements:

```javascript
// Rest Parameters: Collects incoming arguments into an Array
function sumAll(multiplier, ...numbers) {
  return numbers.reduce((acc, curr) => acc + (curr * multiplier), 0);
}
console.log(sumAll(2, 10, 20, 30)); // (10+20+30)*2 = 120

// Spread Syntax: Expands array elements into arguments
const scores = [85, 92, 78, 99];
const maxScore = Math.max(...scores); // Math.max(85, 92, 78, 99) -> 99
```

## Callback Functions and Higher-Order Functions

A **Callback Function** is a function passed into another function as an argument, intended to be executed at a later time (either synchronously during iteration, or asynchronously upon event completion).

A **Higher-Order Function (HOF)** is any function that accepts one or more functions as arguments, returns a function, or both. Higher-order functions form the backbone of modern JavaScript state transformations and reactive programming.

```javascript
// Higher-Order Function accepting a callback
function filterData(records, predicateCallback) {
  const matches = [];
  for (const record of records) {
    if (predicateCallback(record)) {
      matches.push(record);
    }
  }
  return matches;
}

const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true }
];

const activeUsers = filterData(users, user => user.active);
console.log(activeUsers.length); // 2
```

## Pure Functions and Functional Principles

A **Pure Function** is a function that satisfies two mathematical properties:
1. **Deterministic**: Given the same input arguments, it will always return the exact same output.
2. **Zero Side Effects**: It does not modify external state, alter variables outside its scope, mutate its arguments, or execute observable I/O operations (network requests, console logs, DOM mutations).

Pure functions are trivial to unit test, refactor, memoize (cache), and parallelize because they depend strictly on their inputs and communicate solely through their return values.

```javascript
// Impure Function (mutates external state & non-deterministic)
let globalTaxRate = 0.08;
function calculateTotalImpure(items) {
  // Side effect: modifies input array directly!
  items.push({ name: "Service Fee", price: 5 });
  const subtotal = items.reduce((acc, i) => acc + i.price, 0);
  return subtotal * (1 + globalTaxRate); // Depends on external mutable state
}

// Pure Function (zero side effects, deterministic)
function calculateTotalPure(items, taxRate) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

## Summary

Functions in JavaScript are first-class citizens. Function declarations are hoisted completely, while function expressions and arrow functions follow variable hoisting rules. Arrow functions provide concise syntax and inherit their `this` context lexically. Default parameters provide reliable fallbacks, rest parameters aggregate arguments into true arrays, and spread syntax unpacks collections. Higher-order functions accept and return callbacks, enabling pure, side-effect-free functional programming architectures.

## Best Practices

1. **Prefer Arrow Functions for Callbacks**: Use arrow functions for inline callbacks (`map`, `filter`, event listeners where lexical `this` is desired).
2. **Use Rest Parameters Over `arguments`**: Never use the legacy `arguments` object; always use `...rest` parameters for variadic functions.
3. **Strive for Pure Functions**: Keep business logic in deterministic pure functions, isolating side effects (DOM, network) to boundary layers.
4. **Avoid Mutating Function Arguments**: Treat all function arguments as immutable. If modifications are needed, clone the object or array first.
5. **Keep Functions Focused and Small**: Follow the Single Responsibility Principle; each function should perform one cohesive task.
