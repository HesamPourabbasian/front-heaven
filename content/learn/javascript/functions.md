---
title: Functions
description: The building blocks of logic. Master declarations, expressions, arrow functions, parameters, returns and scope.
order: 5
difficulty: beginner
category: Fundamentals
estimatedMinutes: 30
prerequisites:
  - learn/javascript/loops
---

## Introduction

A **function** is a named, reusable block of code. It takes inputs (parameters), does work, and optionally produces an output (a return value). Every program of any size is built from functions: they let you write a piece of logic once and use it a hundred times, they give names to operations ("calculateTax" is clearer than twenty lines of arithmetic), and they divide large problems into testable pieces.

This lesson teaches the full function model: why functions exist, the three ways to write them (declarations, expressions, arrow functions), how parameters and arguments work, return values, and the default parameters and scope rules that make modern JavaScript functions precise. By the end, functions will be your primary building material — because everything else in this stage (and every framework afterwards) is functions all the way down.

## Why functions exist

Imagine calculating sales tax inline every time you need it: `price * 0.08` appears in a dozen places, and when the tax rate changes, you must find and edit a dozen copies — missing one creates an inconsistency bug that is nearly impossible to track down. The function solves this by defining the logic once and referencing it everywhere:

```js
function withTax(price) {
  return price * 1.08
}

console.log(withTax(100))    // 108
console.log(withTax(250))    // 270
```

One definition, unlimited uses, one place to change. This is the core reason functions exist: *don't repeat yourself* (DRY). But the benefits go deeper: the function name *documents* the operation; the function isolates its logic so it can be tested in isolation; and functions compose — a `withTax` inside a `checkoutTotal` inside a `renderReceipt` — which is how programs scale from scripts to applications.

## Function declarations

The **function declaration** is the classic form: the `function` keyword, a name, parameters in parentheses, a body in braces.

```js
function greet(name) {
  return `Hello, ${name}!`
}

console.log(greet('Ada'))    // Hello, Ada!
```

The declaration is *hoisted*: JavaScript moves function declarations to the top of their scope, so you can call `greet` before its line — a convenience that matters when functions reference each other. The structure is identical across the language: name, parameter list, body, and an optional `return`. A function without a `return` still returns something — `undefined` — which is the source of the classic bug `const total = calculateTotal()` returning nothing when the function forgot its `return`.

## Parameters and arguments

**Parameters** are the names in the declaration; **arguments** are the values you pass when calling. Parameters act like local `const` variables inside the function. Modern JavaScript adds two refinements: **default parameters** (used when an argument is missing or `undefined`) and **rest parameters** (`...rest` gathers extra arguments into an array):

```js
function buildMessage(name, emoji = '👋') {
  return `${name} ${emoji}`
}

function sumAll(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}

console.log(buildMessage('Ada'))              // Ada 👋 (default used)
console.log(sumAll(1, 2, 3, 4))               // 10
```

`sumAll` accepts any number of arguments because `...numbers` collects them all into one array — then `reduce` sums them (the pattern from the loops lesson, applied). Default parameters make functions self-sufficient: callers can omit optional inputs, and the function defines its own sensible defaults. The final argument rule: rest parameters must come last in the list.

## Return values

The `return` statement hands a value back to the caller — and immediately exits the function. Every line after a `return` in the same block is dead code. This early-exit property powers the professional style of *guard clauses*: validate at the top and return early, keeping the main path un-nested:

```js
function divide(a, b) {
  if (b === 0) return 'Cannot divide by zero'
  return a / b
}

console.log(divide(10, 2))    // 5
console.log(divide(10, 0))    // Cannot divide by zero
```

The return value is a *value*: it can be stored, passed on, or used inline — `console.log(withTax(100))` prints the returned value directly. Functions that only do work and return nothing (like `console.log` itself) return `undefined`; functions that compute are *pure-ish* when they only depend on their inputs, which makes them predictable and testable — a goal worth aiming for.

## Function expressions

A function is also a *value* — it can be stored in a variable. That form is the **function expression**: a function with no name (anonymous) assigned to a `const`. Unlike declarations, expressions are not hoisted — the variable must exist before you call it:

```js
const square = function (x) {
  return x * x
}

console.log(square(4))    // 16
```

Because functions are values, they can be passed as arguments to other functions — *callbacks* — and returned from functions. This is the property that makes `map` and `filter` work (they receive a function and call it per item), and it is the seed of the functional style that dominates modern JavaScript. A function that takes or returns functions is a *higher-order function* — you have been using them since the loops lesson without the name.

## Arrow functions

The **arrow function** is the modern compact syntax: parameters, `=>`, and an expression body. When the body is a single expression, it is returned implicitly — no `return` keyword, no braces:

```js
const square = (x) => x * x
const add = (a, b) => a + b
const greet = name => `Hello, ${name}!`
const noArgs = () => Date.now()
```

Single parameter: parentheses optional. Single expression body: `return` implicit. Multi-line bodies need braces and an explicit return. Arrows are the default choice for callbacks — `prices.map(price => price * 1.2)` — because they are the least code that says the most. The one crucial difference from regular functions: arrows have no `this` of their own (they inherit the surrounding `this`), which matters the moment you work with objects and classes; you will feel it in the DOM lesson.

## Scope

**Scope** is where a variable lives and who can see it. JavaScript's rules are simple: `let` and `const` are **block-scoped** (visible inside the braces where they are declared, including function bodies), and functions can *see outward* — a function inside another can read the outer function's variables, but not vice versa. Variables visible at the top level are *globals*.

```js
const globalName = 'Front-Heaven'

function outer() {
  const hidden = 'secret'
  function inner() {
    const local = 'tiny'
    console.log(globalName)    // visible: global
    console.log(hidden)        // visible: parent scope
  }
  inner()
  // console.log(local)        // ReferenceError: not in this scope
}
```

This nested visibility — *lexical scoping* — is the reason a function can use a variable from its surroundings, and it is the foundation of closures, which you will meet in a later lesson. The practical rules: declare variables in the smallest scope that needs them; avoid creating globals (they collide); and remember that parameters and `const` inside a function are private to it.

## Real-world usage

Functions are the atomic unit of every codebase. A form validation script is `validateEmail`, `validatePassword`, `isStrong` — functions composed in a chain. A UI component in a framework is a function that receives props and returns markup. An API call is a function returning a promise; a utility module exports a dozen small functions; a reducer in a state library is a pure function of (state, action). Interviews, code reviews and architecture discussions all revolve around functions: their names, their sizes, their purity. The habit of writing small, named, single-purpose functions — rather than long blocks of inline logic — is the habit that makes you a professional.

## Common mistakes

Forgetting `return` (functions silently return `undefined`). Calling instead of referencing: `square(4)` calls the function; passing `square` to `map` passes the function itself — mixing them up ("callback is not a function" errors). Mutating inputs instead of returning new values. Default parameters placed before required ones. Arrow functions with braces that forget the explicit `return`. Using arrow functions in places where `this` is needed (a surprise for later — note it now). Declaring variables inside a function that should be parameters. And functions so long they become unreadable — the fix is always more, smaller functions.

## Best practices

- Write small functions that do one thing, named for what they do (`calculateTax`, not `doStuff`).
- Default to arrow functions for callbacks; use declarations for named top-level functions.
- Use default parameters instead of checking `if (arg === undefined)`.
- Prefer returning values over mutating inputs.
- Keep functions pure when possible: same inputs → same output, no side effects.
- Add guard clauses at the top with early returns.
- Avoid global variables; keep everything scoped and explicit.
- Use rest parameters to gather variadic arguments; put them last.

## Summary

Functions are named, reusable blocks of logic with parameters, a body and an optional return value. They exist to avoid repetition, document operations and compose programs. Declarations hoist; expressions are values; arrows are the compact modern form with implicit returns and inherited `this`. Default parameters, rest parameters, guard clauses and lexical scope complete the model. Every framework, every library and every large program you will ever read is functions building on functions.

## Practice

Write a small utility module of functions: `formatPrice(amount, currency = '$')` returning a formatted string; `average(...numbers)` using a rest parameter and `reduce`; `isPassing(score)` with a guard clause and ternary return; and a `makeGreeter(name)` that *returns* a function which greets someone using the captured name (your first whiff of closures). Call each function with different arguments and confirm the outputs. Then deliberately break one: comment out its `return` and observe how the caller silently receives `undefined` — the most common function bug in existence, now permanently on your radar.