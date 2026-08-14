---
title: Operators and Conditionals
description: Make your programs decide. Master arithmetic, comparison and logical operators, and the if/else structures that branch your code.
order: 3
difficulty: beginner
category: Fundamentals
estimatedMinutes: 25
prerequisites:
  - learn/javascript/variables-and-data-types
---

## Introduction

A program that only stores values is a filing cabinet. A program that *decides* — "if the user is logged in, show the dashboard; otherwise show the login form" — is a program. Decisions run on two cooperating systems: **operators**, which compute and compare values, and **conditionals**, the structures that branch execution based on those comparisons. Together they are the nervous system of every application.

This lesson covers the operator families you will use daily — arithmetic, comparison, logical and the modern nullish operators — and then the conditional structures: `if`/`else`, `else if` chains, the ternary expression, and the `switch` statement. By the end, "if this, then that" will be as natural to you as breathing.

## Arithmetic operators

The arithmetic family extends the four basic operations with the tools of real computation: `%` (remainder or modulo), `**` (exponent), and the increment/decrement shorthand `++` and `--`.

```js
const total = 10 + 5          // 15
const half = 20 / 2           // 10
const area = 3 ** 2           // 9 — exponent
const odd = 7 % 2             // 1 — remainder: 7 is odd

let count = 0
count++                        // count is now 1
count += 5                     // count is now 6 — shorthand for count = count + 5
```

The modulo operator is everywhere once you see it: `x % 2` tells you whether a number is even (0) or odd (1); `minutes % 60` extracts the minutes from a total; `index % 3` cycles through three options. The compound assignment operators — `+=`, `-=`, `*=` — are the idiomatic way to update a value: `count += 5` reads as "count becomes count plus five". The `++` and `--` operators appear in loops constantly — which you will meet in the next lesson.

## Comparison operators

Comparisons produce booleans. The strict equality `===` (and its negation `!==`) is the operator you will use a thousand times a day: it compares *both value and type*, and it is the only equality operator modern code uses. The loose `==` and `!=` coerce types before comparing — `'5' == 5` is true — a legacy behaviour that produces precisely the bugs you do not want in a language. The relational operators complete the family: `>`, `>=`, `<`, `<=`.

```js
const age = 25
console.log(age === 25)       // true — same value, same type
console.log(age === '25')     // false — different types
console.log('5' == 5)         // true — but never write this
console.log(age >= 18)        // true
console.log(age !== 30)       // true
```

The rule is absolute: use `===` and `!==`, always. When you see `==` in code you are reading, ask what the author actually meant — the answer is usually "the strict version".

## Logical operators

Logical operators combine booleans. `&&` (AND) is true only when both sides are true; `||` (OR) is true when either side is true; `!` (NOT) flips a boolean. The logical operators have a superpower called *short-circuiting*: they evaluate the right side only when the left side does not already decide the result.

```js
const isLoggedIn = true
const isAdmin = false

console.log(isLoggedIn && isAdmin)   // false — both must be true
console.log(isLoggedIn || isAdmin)   // true — one is enough
console.log(!isLoggedIn)             // false

const user = null
const displayName = user?.name ?? 'Guest'   // 'Guest' — nullish fallback
```

Two modern relatives complete the family. The **optional chaining** operator `?.` reads a property safely: `user?.name` returns `undefined` instead of crashing if `user` is null. The **nullish coalescing** operator `??` provides a fallback: `value ?? 'Guest'` uses `'Guest'` when `value` is `null` or `undefined` — but *not* when it is `false`, `0` or `''` (those are legitimate values `||` would wrongly replace). The pair `?.` and `??` are the modern replacement for the old `&&`-chains of defensive checks.

## The if statement

With comparisons in hand, decision-making begins. The `if` statement runs a block when its condition is truthy; `else` runs the alternative; `else if` chains more conditions. *Truthiness* matters: in JavaScript, every value is either truthy or falsy, and only a small set is falsy — `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`. Everything else — including `'0'`, `[]` and `{}` — is truthy.

```js
const score = 42

if (score >= 90) {
  console.log('Outstanding!')
} else if (score >= 60) {
  console.log('Solid work.')
} else {
  console.log('Keep practising.')
}
```

Read the flow: test the first condition; if true, run its block and *skip the rest*; if false, test the next; if nothing matched, run `else`. Ordering matters — conditions are tested top-down, so the most specific should come first. The example tests 90 first, then 60; if it tested 60 first, every score above 60 would stop there and "Outstanding" would be unreachable.

## The ternary and switch

Two compact alternatives round out the toolkit. The **ternary operator** is an expression — it *produces a value* — that picks between two options in one line: `condition ? valueIfTrue : valueIfFalse`. Use it for simple assignments; if the logic needs more branches or longer bodies, use `if`.

```js
const status = score >= 60 ? 'passed' : 'failed'
console.log(status)
```

The **switch statement** compares one value against many cases — a readable alternative to long `else if` chains when comparing a single value. Each `case` needs a `break` (or `return`); forgetting it makes execution *fall through* into the next case — the language's most famous footgun.

```js
const day = 'monday'

switch (day) {
  case 'monday':
    console.log('Start the week strong')
    break
  case 'friday':
    console.log('Ship it!')
    break
  default:
    console.log('Keep going')
}
```

The `default` case handles everything unmatched, like `else`. In modern code, `switch` is used sparingly — a map of values (an object of handlers) is often cleaner — but you will read `switch` in plenty of codebases, so it earns its place here.

## Real-world usage

Conditionals are the fabric of applications. Every login flow is an `if (isAuthenticated)`; every form validation is a chain of conditionals; every render in a framework — "show this when loading, that when loaded, this when errored" — is a conditional on state. The ternary appears in templates and assignments everywhere; `??` and `?.` appear in every data-fetching code path, guarding against missing API fields; and logical short-circuiting powers the pattern `isLoading && <Spinner/>` you will see constantly in React and Vue code. Learning to read these operators fluently now means every framework tutorial you open later reads like plain English.

## Common mistakes

Using `=` in a condition — `if (score = 10)` *assigns* 10 to score and is always truthy; the comparison needs `===`. Mixing `==` and `===` unknowingly. Testing `if (value)` when the legitimate `0` or `''` must pass — check explicit comparisons against the falsy trap. Ordering `else if` conditions wrong so earlier branches swallow later ones. Over-nesting — an `if` inside an `if` inside an `if` — when a combined condition (`a && b`) or an early `return` would be clearer. Using `||` for fallbacks when `0`/`''` are valid — that is what `??` is for. And the eternal one: forgetting the `break` in a `switch` case and watching every subsequent case run.

## Best practices

- Always use `===`/`!==` for equality; never `==` in new code.
- Use `&&`/`||` for logic and `??` for nullish fallbacks; pair `?.` with both.
- Test the most specific conditions first in `else if` chains.
- Prefer early returns (`if (!valid) return`) over deeper nesting.
- Use the ternary only for short either/or values; use `if` for anything branching.
- Handle the falsy set deliberately — know that `0`, `''` and `false` are all falsy.
- Add a `default` to every `switch` and a `break` to every case.
- Read conditions aloud ("if score is at least 90") — if the code does not say that, fix it.

## Summary

Operators compute: arithmetic (`+ - * / % **`), comparison (`===`, `>`, `<`, and friends — strict only), and logic (`&&`, `||`, `!`) with short-circuiting and the modern `?.` and `??`. Conditionals branch: `if`/`else if`/`else` with truthiness semantics, the value-producing ternary, and the case-matching `switch`. Together they turn data-holders into decision-makers — the step where JavaScript stops being a filing cabinet and becomes a program.

## Practice

Write a "grade calculator": a `const score` of your choice; compute and log the letter grade with an `if`/`else if` chain (A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, else F); log a passing message using a ternary; and use `%` to decide whether the score is even or odd. Then build a small "user status" check using `?.` and `??`: start with `const user = null` and log a greeting that safely falls back to `'Guest'`; switch `user` to `{ name: 'Ada' }` and watch the same line now print her name — without any changes to the code path.