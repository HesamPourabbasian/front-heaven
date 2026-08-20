---
title: 'Variables'
description: 'Master variable declaration, initialization, scope differences between var, let, and const, hoisting mechanisms, the Temporal Dead Zone (TDZ), and production naming conventions.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/javascript/01-javascript-fundamentals
---

# Variables

Variables serve as symbolic identifiers representing allocated memory locations that store data values during program execution. In JavaScript, the mechanics of variable declaration, initialization, scope boundaries, and lifetime management have undergone profound architectural evolutions—transitioning from the legacy, function-scoped `var` keyword of ES5 to the block-scoped `let` and immutable-binding `const` keywords introduced in ECMAScript 2015 (ES6).

Understanding the precise behavior of variables is essential for preventing subtle runtime bugs, memory leaks, and scope pollution. A solid mental model of how the JavaScript engine allocates memory during compilation and execution phases empowers developers to write predictable, resilient software.

In this lesson, we examine the differences between `var`, `let`, and `const`, explore the two distinct phases of variable lifecycle (declaration vs initialization), dissect global, function, and block scope boundaries, demystify engine hoisting and the Temporal Dead Zone (TDZ), and review industry naming conventions.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     Variable Lifecycle & Scope                         │
├──────────────┬──────────────────┬─────────────────┬────────────────────┤
│ Keyword      │ Scope            │ Hoisting        │ Re-assignable      │
├──────────────┼──────────────────┼─────────────────┼────────────────────┤
│ var (Legacy) │ Function/Global  │ Yes (undefined) │ Yes                │
│ let (Modern) │ Block Scope      │ Yes (TDZ Error) │ Yes                │
│ const(Modern)│ Block Scope      │ Yes (TDZ Error) │ No (Binding Fixed) │
└──────────────┴──────────────────┴─────────────────┴────────────────────┘
```

## Variable Declaration vs Initialization

In JavaScript's execution model, creating a variable involves two distinct stages: declaration and initialization. Declaration registers the identifier name within the current lexical environment during the engine's parsing phase, reserving space for the variable before any runtime instructions execute.

Initialization occurs when the variable is bound to an initial value in memory. If a variable is declared using `let` or `var` without an explicit value, JavaScript automatically initializes it with the primitive value `undefined`. However, `const` declarations mandate simultaneous declaration and initialization; attempting to declare a `const` variable without an immediate value throws a compile-time `SyntaxError`.

```javascript
// Declaration without initialization (evaluates to undefined)
let accountBalance;
console.log(accountBalance); // undefined

// Assignment / Initialization
accountBalance = 5400.50;
console.log(accountBalance); // 5400.5

// const requires immediate initialization
// const API_SECRET; // SyntaxError: Missing initializer in const declaration
const API_SECRET = "sk_live_99283401";
```

## `var` vs `let` vs `const`

The `var` keyword, standard since the creation of JavaScript, possesses several design flaws that modern ECMAScript resolved with `let` and `const`. The primary vulnerability of `var` is its lack of block scoping: variables declared with `var` inside `if` statements, `for` loops, or arbitrary curly braces `{}` leak directly into the enclosing function or global scope.

Furthermore, `var` permits accidental duplicate declarations within the same scope without throwing an error, silently overwriting earlier values. In contrast, `let` and `const` enforce strict block scoping and reject duplicate identifiers within the same lexical scope.

`const` declares a read-only reference (immutable binding). It is important to emphasize that `const` does not make the underlying value immutable, but rather prevents the variable identifier from being rebound to a different memory address. If a `const` variable holds an object or array, the internal properties or elements of that object can still be mutated freely.

```javascript
// var leaks out of block statements
if (true) {
  var legacyToken = "secret_123";
}
console.log(legacyToken); // "secret_123" (leaked into outer scope!)

// let respects block boundaries
if (true) {
  let modernToken = "secret_456";
}
// console.log(modernToken); // ReferenceError: modernToken is not defined

// const immutability vs mutation
const userConfig = { theme: "dark", notifications: true };
userConfig.theme = "light"; // Valid: mutating an existing property
console.log(userConfig.theme); // "light"

// userConfig = { theme: "light" }; // TypeError: Assignment to constant variable.
```

## Scope: Global, Function, and Block

Scope determines the visibility and accessibility of variables throughout different regions of your code. JavaScript implements lexical scoping (also known as static scoping), meaning that variable accessibility is determined by the physical placement of code blocks within the source file.

1. **Global Scope**: Variables declared outside any function or block reside in the global scope. In browsers, global `var` declarations attach directly as properties of the `window` object, increasing the risk of naming collisions. Modern `let` and `const` declared globally do not attach to `window`.
2. **Function Scope**: Variables declared inside a `function` body are isolated to that function and inaccessible to outer scopes.
3. **Block Scope**: Any pair of curly brackets `{ ... }` creates a block scope for `let` and `const`. This includes conditional blocks (`if`, `switch`), iterative blocks (`for`, `while`), and standalone blocks.

```javascript
const globalAppId = "APP_001"; // Global scope

function processPayment(amount) {
  const transactionFee = 2.50; // Function scope
  
  if (amount > 100) {
    const discountRate = 0.05; // Block scope
    const discountedAmount = amount * (1 - discountRate) + transactionFee;
    return discountedAmount;
  }
  
  // discountRate is inaccessible here: ReferenceError
  return amount + transactionFee;
}
```

## Hoisting and the Temporal Dead Zone (TDZ)

During the compilation phase, the JavaScript engine scans the code and records all variable and function declarations before executing a single line of runtime instructions. This behavior is conceptually referred to as "hoisting"—as if declarations were lifted to the top of their enclosing scope.

However, `var`, `let`, and `const` handle hoisting differently:
- **`var` hoisting**: The identifier is hoisted and initialized immediately with `undefined`. Accessing a `var` variable before its declaration line returns `undefined` without throwing an error.
- **`let` and `const` hoisting**: The identifier is hoisted into the lexical scope during compilation, but it remains uninitialized. The region of code between the start of the block scope and the line where the variable is initialized is known as the **Temporal Dead Zone (TDZ)**. Accessing a variable while it is in the TDZ throws an immediate `ReferenceError`.

```text
┌────────────────────────────────────────────────────────────┐
│                  Temporal Dead Zone (TDZ)                  │
├────────────────────────────────────────────────────────────┤
│ {                                                          │
│   // START OF BLOCK SCOPE                                  │
│   // === TDZ ACTIVE FOR 'price' ===                        │
│   // console.log(price); // ReferenceError (Inside TDZ!)   │
│   // === TDZ ACTIVE ===                                    │
│   let price = 49.99; // TDZ ENDS: Variable Initialized     │
│   console.log(price); // 49.99 (Safe access)               │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
```

```javascript
// var hoisting behavior
console.log(legacyCount); // undefined (no error!)
var legacyCount = 10;

// let / const TDZ behavior
// console.log(activeSessions); // ReferenceError: Cannot access 'activeSessions' before initialization
let activeSessions = 42;
```

## Naming Conventions and Standards

Adhering to consistent, descriptive naming conventions ensures clarity across teams and automated code analysis tooling. In modern JavaScript development:

- **camelCase**: Standard for variables, function names, and object properties (`userProfile`, `totalInvoiceAmount`, `isModalOpen`).
- **UPPER_SNAKE_CASE**: Reserved for compile-time immutable configuration constants and environment values (`MAX_RETRY_ATTEMPTS`, `BASE_API_URL`, `DEFAULT_TIMEOUT_MS`).
- **PascalCase**: Reserved exclusively for ES6 classes, constructor functions, and TypeScript types/interfaces (`UserSession`, `PaymentProcessor`).
- **Boolean Prefixes**: Boolean identifiers should begin with helper prefixes such as `is`, `has`, `can`, or `should` (`isActive`, `hasPermission`, `canSubmit`).
- **Avoid Single-Letter Names**: Except for standard iteration indices (`i`, `j` in simple numerical loops), avoid ambiguous single-letter identifiers.

## Summary

JavaScript provides three variable declaration keywords: legacy `var`, and modern `let` and `const`. `var` is function-scoped and hoists with an initial value of `undefined`, creating potential bugs and namespace collisions. `let` and `const` introduce block scoping and guard against early access through the Temporal Dead Zone (TDZ), throwing a `ReferenceError` when accessed prior to declaration. `const` should be your default declaration keyword for all values that do not require reassignment, while `let` should be reserved for counters, accumulators, and reassignable state.

## Best Practices

1. **Default to `const`**: Declare every variable with `const` by default. Only change the declaration to `let` when you explicitly need reassignment.
2. **Never Use `var`**: Disallow `var` across all modern projects. Enforce this using ESLint rules (`no-var`).
3. **Minimize Scope Footprint**: Declare variables in the innermost block possible where they are needed rather than at the top of functions.
4. **Use Semantic Boolean Names**: Always prefix booleans with `is`, `has`, or `should` (`isLoading`, `hasAccess`, `shouldRedirect`).
5. **Freeze Immutable Objects**: Remember that `const` only locks the binding reference. Use `Object.freeze()` when you require true deep immutability for object values.
