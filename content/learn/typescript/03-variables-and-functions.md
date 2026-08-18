---
title: 'Variables & Functions'
description: 'Master typed variables, explicit type annotations, function parameters, return types, optional and default parameters, rest parameters, and arrow functions.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/typescript/02-basic-types
---

# Variables & Functions

Variables and functions form the core execution logic of any application. In JavaScript, function parameters and return values are unrestricted, which frequently leads to silent bugs when caller code passes unexpected arguments or misinterprets return values. TypeScript introduces rigorous type annotations for variables, parameter lists, and return signatures, transforming functions into strict, verifiable contracts.

In this lesson, we will explore explicit type annotations, function return type inference, optional and default parameters, rest parameters, arrow function typing, and reusable function type signatures.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Function Type Contract                          │
│                                                                        │
│   function calculateTax( amount: number, rate: number = 0.05 ): number │
│                          └────────────┘  └─────────────────┘   └─────┘ │
│                            Parameter       Default Parameter   Return  │
│                              Type                & Type         Type   │
└────────────────────────────────────────────────────────────────────────┘
```

## Typed Variables and Type Annotations

A **type annotation** in TypeScript uses a colon (`:`) followed by the desired type immediately after the variable identifier. This explicitly instructs the compiler what type of data the variable is permitted to hold:

```typescript
let userAge: number = 28;
let userEmail: string = "developer@example.com";
let isSubscriber: boolean = false;
```

While type annotations are powerful, TypeScript's type inference engine can often deduce the type automatically from the assigned value. It is best practice to omit type annotations on simple variable assignments where the initial value makes the type self-evident (`let count = 0;`), reserving annotations for uninitialized variables or complex union types:

```typescript
// Explicit annotation needed when variable is declared before assignment:
let pendingOrderId: string | null;
pendingOrderId = null;
pendingOrderId = "ORD-98214";
```

## Function Parameter Types and Return Types

In TypeScript, every function parameter should have an explicit type annotation. Without annotations and when `"noImplicitAny": true` is enabled, unannotated parameters will trigger a compiler error because TypeScript defaults them to `any`.

The return type of a function is placed after the parameter closing parenthesis:

```typescript
function multiply(x: number, y: number): number {
  return x * y;
}

const result = multiply(10, 5); // inferred as number
```

Even though TypeScript can infer the return type of simple functions automatically from the `return` expression, explicitly annotating return types on exported functions prevents accidental signature changes during refactoring and provides immediate feedback if a branch fails to return a value.

## Optional Parameters

In JavaScript, all function arguments are inherently optional; omitted parameters simply evaluate to `undefined`. In TypeScript, the compiler requires callers to provide all declared arguments unless a parameter is explicitly marked as optional using the question mark (`?`) operator:

```typescript
function greetUser(name: string, greetingPrefix?: string): string {
  if (greetingPrefix) {
    return `${greetingPrefix}, ${name}!`;
  }
  return `Hello, ${name}!`;
}

console.log(greetUser("Sarah"));           // "Hello, Sarah!"
console.log(greetUser("Sarah", "Welcome")); // "Welcome, Sarah!"
```

**Rule for Optional Parameters**: In a function parameter list, optional parameters must always appear *after* all required parameters. Placing a required parameter after an optional parameter results in a syntax compilation error.

## Default Parameters

TypeScript allows parameters to define default values using the standard ECMAScript assignment syntax (`= value`). When a parameter has a default value, TypeScript automatically infers its type from the default value, and callers can omit the argument or pass `undefined`:

```typescript
function createServerConnection(host: string, port: number = 8080, secure: boolean = true): string {
  const protocol = secure ? "https" : "http";
  return `${protocol}://${host}:${port}`;
}

const localApi = createServerConnection("localhost"); // "https://localhost:8080"
const customApi = createServerConnection("api.dev", 3000, false); // "http://api.dev:3000"
```

Unlike optional parameters (`?`), parameters with default values do not strictly need to be at the end of the parameter list, though placing them at the end makes function invocation cleaner because callers do not need to pass `undefined` to trigger defaults.

## Rest Parameters

When a function accepts an indeterminate number of arguments, JavaScript uses the rest operator (`...args`). In TypeScript, rest parameters must be typed as an array or tuple:

```typescript
function calculateSum(...numbers: number[]): number {
  return numbers.reduce((accumulator, current) => accumulator + current, 0);
}

const sumTotal = calculateSum(10, 20, 30, 40, 50); // 150
```

Rest parameters give you full type safety across variable-length argument lists, ensuring that every passed argument conforms to the expected element type.

## Arrow Functions and Anonymous Functions

Arrow functions follow the same typing rules as standard function declarations. Parameter types are annotated within parentheses, and return types follow after the parameter list:

```typescript
const formatCurrency = (amount: number, currencyCode: string = "USD"): string => {
  return `${currencyCode} ${amount.toFixed(2)}`;
};

const priceTag = formatCurrency(49.99); // "USD 49.99"
```

When passing arrow functions as callbacks (for example, to array methods like `.map()`, `.filter()`, or `.reduce()`), TypeScript uses **contextual typing** to infer parameter and return types automatically without requiring manual annotations:

```typescript
const scores = [88, 92, 79, 95, 100];

// 'score' is contextually inferred as 'number' based on 'scores: number[]'
const passingScores = scores.filter(score => score >= 80);
```

## Function Type Aliases and Signatures

When passing callbacks, high-order functions, or event handlers across your application, repeating full inline function signatures creates visual noise. TypeScript allows you to define reusable function type aliases:

```typescript
// Defining a reusable function type alias
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (x, y) => x + y;
const subtract: MathOperation = (x, y) => x - y;
const power: MathOperation = (base, exponent) => Math.pow(base, exponent);

function executeCalculation(x: number, y: number, operation: MathOperation): number {
  return operation(x, y);
}

console.log(executeCalculation(5, 3, power)); // 125
```

Function type aliases establish clean contracts for event listeners, middleware, and dependency-injected services.

## Summary

- Type annotations (`: type`) explicitly declare variable and parameter constraints.
- Function parameters must be typed explicitly to maintain strict type safety under `"noImplicitAny"`.
- Return types can be inferred but should be explicitly annotated on public interfaces and exported APIs.
- Optional parameters are declared with `?` and must follow all required parameters.
- Default parameters (`param = defaultValue`) automatically infer their type and allow callers to omit arguments.
- Rest parameters (`...args: type[]`) safely type variable-length argument lists.
- Function type aliases (`type Fn = (...) => Return`) create reusable signatures for callbacks and higher-order functions.

## Best Practices

1. **Explicitly Annotate Function Signatures**: Always annotate parameter types and return types on all exported functions.
2. **Leverage Contextual Typing for Callbacks**: Avoid redundant parameter annotations inside inline array callbacks (`array.map(item => ...)`).
3. **Use Default Parameters instead of Optional + Null Checks**: Prefer `(timeout = 3000)` over `(timeout?: number)` followed by `timeout ?? 3000`.
4. **Order Parameters Logically**: Always place required parameters first, followed by default parameters, optional parameters, and rest parameters.
