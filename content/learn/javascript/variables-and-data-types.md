---
title: Variables and Data Types
description: Where JavaScript keeps its information. Master let, const and var, and the seven data types that describe every value.
order: 2
difficulty: beginner
category: Fundamentals
estimatedMinutes: 25
prerequisites:
  - learn/javascript/what-is-javascript
---

## Introduction

Programs are machines for processing information, and **variables** are the named boxes where that information lives. Everything you will ever do in JavaScript — reading a form field, counting a score, storing a user, fetching data from a server — involves declaring a variable and putting a value in it. And every value in JavaScript has a **type**: text, numbers, truth values, collections. Types decide what you can do with a value — you can add numbers but not subtract text — which is why the type system is the language's hidden grammar.

This lesson teaches the three variable keywords — the modern `let` and `const`, and the legacy `var` you must understand to read old code — and then the data types themselves: the primitives (string, number, boolean, undefined, null) and the big two (object, array), with a first look at the operations that reveal them.

## let and const: the modern way

Modern JavaScript declares variables with `let` and `const`. `let` creates a variable that can be *reassigned* — its value can change later. `const` creates a variable whose binding is *constant* — once assigned, it cannot be reassigned to a different value. The profession's rule of thumb: **use `const` by default**; reach for `let` only when you genuinely need to reassign.

```js
const userName = 'Ada'
let score = 0

score = score + 10        // fine: let allows reassignment
userName = 'Grace'        // TypeError: assignment to constant variable
```

The first line binds the name `userName` to the string `'Ada'` forever. The second declares `score`, initially 0, and the third reassigns it — legal, because `score` was declared with `let`. The fourth line crashes: `userName` is `const`. The discipline of `const`-by-default matters because it *communicates intent*: a constant is a promise that the name means one thing, and accidental reassignment — one of the classic sources of "why is my variable different from what I set?" — becomes a loud error instead of a silent bug.

## var: the legacy keyword

The third keyword, `var`, is the original — and modern code should not use it. `var` is *function-scoped*, not block-scoped (a distinction you will fully understand in the scope lesson), which means variables declared with `var` inside an `if` or a loop leak outside it. It is also hoisted in a way that lets you read a variable before its declaration, returning `undefined` instead of an error. Both behaviours cause exactly the class of bugs beginners find baffling.

```js
if (true) {
  var leaked = 'I escape the block'
}
console.log(leaked)     // 'I escape the block' — var ignores blocks

if (true) {
  let contained = 'I stay inside'
}
console.log(contained)  // ReferenceError: contained is not defined
```

You will encounter `var` constantly in older tutorials and legacy codebases, which is why you must recognise it — but you will *write* `let` and `const`. If you find yourself reaching for `var`, treat it as a sign to reconsider the approach.

## Strings

Strings are text: words, sentences, entire documents. They are written with quotes — single or double, whichever you keep consistent — or with backticks, which enable **template literals**, the modern way to embed values in text:

```js
const city = 'Paris'
const population = 2.1

// Template literal with an embedded expression
const message = `The city of ${city} has ${population} million people.`
console.log(message)
```

The `${...}` syntax inside backticks inserts the value of any expression into the string — no more string concatenation with `+`. The example builds the sentence by injecting `city` and `population`; read it as "the string is a template, and the dollar-brace sections are filled in at runtime". Strings support an enormous toolbox of methods — `toUpperCase()`, `split(',')`, `includes('ris')`, `.length` — which you will use constantly, and comparing strings compares them character by character (`'a' < 'b'` is true).

## Numbers

Numbers are numbers: integers and decimals share one type in JavaScript (`Number`), and arithmetic uses the operators you expect — `+`, `-`, `*`, `/`, `%` (remainder). Two Number quirks matter from day one. First, floating-point precision: `0.1 + 0.2` is `0.30000000000000004`, not `0.3` — binary fractions cannot represent some decimals exactly, so never compare money with `===`. Second, `NaN` ("Not a Number") is the result of invalid maths — `'hello' * 3` is `NaN` — and it is the *only* value not equal to itself, so checking with `value === NaN` never works; use `Number.isNaN(value)`.

```js
const price = 19.99
const quantity = 3
const total = price * quantity        // 59.97
const rounded = total.toFixed(2)      // "59.97" — note: returns a string
```

The example multiplies two numbers and formats the result. One lesson in a single line: `toFixed` returns a *string* (`"59.97"`), because formatting is presentation. Mixing numbers and strings — `"5" + 3` is `"53"` (the `+` concatenates when either side is a string) — is the source of the most famous JavaScript bug of all time. Know it, laugh at it, and always check your types.

## Booleans, undefined and null

**Booleans** are the truth values: `true` and `false`. They are the output of comparisons (`age >= 18`) and the fuel of every `if` statement. Alongside them sit two "nothing" values that beginners constantly confuse. `undefined` means "no value was ever assigned": a declared-but-unset variable, a missing object property, a function's absent return. `null` means "there is a value, and it is *intentionally* nothing": a developer or API explicitly says "empty". The practical difference: `undefined` is JavaScript's default nothing; `null` is *your* nothing. Choose `null` when you mean "deliberately empty" and let `undefined` mean "never set".

```js
let draft                          // undefined — nothing assigned yet
const empty = null                 // null — deliberately empty

console.log(draft)                 // undefined
console.log(typeof empty)          // "object" — a famous historical quirk
```

The `typeof` operator reveals a value's type — and its famous wart: `typeof null` returns `"object"`, a bug from the language's early days that is too embedded to fix. Memorise it so it never surprises you in a debugging session.

## Objects: the boxes of named values

**Objects** group values under named keys. They are the shape of structured data in JavaScript — a user, a product, a lesson — and you will live in them:

```js
const user = {
  name: 'Ada Lovelace',
  role: 'Programmer',
  completedLessons: 12,
}

console.log(user.name)              // dot notation
console.log(user['role'])           // bracket notation
user.completedLessons += 1          // objects are mutable
```

The object literal `{ key: value, ... }` declares the shape. Dot notation (`user.name`) reads a property; bracket notation (`user['role']`) does the same and is required when the key is dynamic or contains special characters. Properties are *mutable* — the last line modifies the object even though `user` is `const`, because `const` freezes the *binding*, not the object. This distinction — const does not mean immutable — is one of the most important in the language.

## Arrays: ordered lists

**Arrays** are ordered lists of values, written with square brackets, indexed from zero. They are the type behind lists of anything: lessons in a course, items in a cart, results in a search:

```js
const technologies = ['HTML', 'CSS', 'JavaScript']

console.log(technologies.length)     // 3
console.log(technologies[0])         // 'HTML' — zero-indexed!
technologies.push('TypeScript')      // add to the end
console.log(technologies.at(-1))     // 'TypeScript' — negative indexes from the end
```

The zero-indexing — the first item lives at index 0 — is the first thing beginners misremember. Arrays and objects together are the *collection* layer of JavaScript: arrays for ordered lists, objects for named records, and arrays of objects for almost all real data. You will spend the next several lessons and your whole career inside these two structures.

## Real-world usage

Variables and types are the grammar of every program you will ever write or read. A form handler reads the input value (a string), converts it (`Number(...)`), compares it (`>= 18`), and stores the result in a `const` — that sequence is variables and types in action. An API response is an object; its list of items is an array; each item's fields are strings and numbers. When a bug says "undefined is not a function", the root cause is almost always a type mismatch — something you expected to be a function was `undefined`. Senior developers debug by asking "what *type* is this value right now?" — and `console.log(typeof value)` is the answer's oracle.

## Common mistakes

Reassigning a `const` and expecting it to work; using `var` from old tutorials and inheriting its scope leaks; confusing `undefined` and `null` (check with `value === null` when "nothing" is legitimate); comparing with `===` when types differ — `'5' === 5` is false, `'5' == 5` is true, and the double equals' type-coercing behaviour is a legacy trap; concatenating `"5" + 3` and getting `"53"`; forgetting that arrays and objects are zero-indexed; declaring a variable and never using it; and relying on `typeof` for `null`. The master habit: when a value misbehaves, log it — `console.log(value, typeof value)` shows you exactly what you are holding.

## Best practices

- Default to `const`; use `let` only for genuine reassignment; never write new `var`.
- Use template literals (backticks) for any string containing values.
- Use `null` for deliberate emptiness; let `undefined` mean "never set".
- Compare types deliberately: coerce explicitly (`Number(value)`, `String(value)`) instead of relying on `==`.
- Use `Number.isNaN()` rather than `=== NaN` — it never works.
- Name variables for their meaning: `userName`, not `u`; `totalPrice`, not `t`.
- Inspect values and types in the console before writing logic around them.
- Prefer arrays for ordered lists and objects for named records — and objects with `const` are mutable by design.

## Summary

Variables are named, typed containers: `const` for fixed bindings, `let` for reassignable ones, `var` for legacy code you should not write. Values carry types — strings for text with template-literal interpolation, numbers with floating-point caveats, booleans for truth, `undefined` and `null` for the two flavours of nothing, and objects and arrays for structured data. Reading a value's type, and choosing the right container, is the grammar you will speak fluently for the rest of your career.

## Practice

In the console, declare a `const` for your name, a `let` for a score you increment three times, and an object `profile` with your name, favourite technology and a boolean `isLearning`. Log the object's properties with both dot and bracket notation, then reassign the score and confirm `const` throws when you try the same on `profile.name`... it will *not* throw — mutating the object is legal. Then discover two quirks by experiment: what `typeof null` returns, what `0.1 + 0.2` equals, and what `'3' + 2` and `'3' * 2` produce — and explain each result before you type it.