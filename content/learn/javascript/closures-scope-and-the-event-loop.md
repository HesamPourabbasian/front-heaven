---
title: Closures, Scope and the Event Loop
description: The deep mental model. Understand closures, lexical scope, hoisting, and how the event loop keeps JavaScript responsive.
order: 10
difficulty: intermediate
category: Language Core
estimatedMinutes: 35
prerequisites:
  - learn/javascript/functions
  - learn/javascript/promises-async-await-and-fetch
---

## Introduction

The concepts that separate "writes working code" from "understands the language" are the three titles of this lesson. **Closures** — a function that remembers the variables of the scope where it was created — explain why functions are so powerful in JavaScript. **Scope and hoisting** explain where variables live, when they exist, and the exact rules for `var` versus `let` versus `const`. And the **event loop** — the engine that makes async work — explains *how* JavaScript, single-threaded by definition, can run an interactive page while network requests are in flight.

These ideas have a reputation for being hard. They are not — they are just invisible. This lesson makes them visible, one concrete mechanism at a time, and ties them together into the mental model that interview questions and architecture decisions are both built on.

## Scope: where variables live

**Scope** is the region of a program where a variable is visible. JavaScript has three main scopes: the **global scope** (everywhere), **function scope** (inside a function body), and **block scope** (inside braces — `if` blocks, loops, anything `{}`). The rule since ES2015 is simple: `let` and `const` are **block-scoped** — they exist only inside the braces where they are declared — while `var` is function-scoped and ignores blocks:

```js
let global = 'visible everywhere'

function example() {
  var functionScoped = 'visible in this function'
  if (true) {
    let blockScoped = 'visible only in this block'
    var leaked = 'var ignores blocks!'
  }
  // console.log(blockScoped)   // ReferenceError — out of scope
  console.log(leaked)           // works — var leaked out of the block
}
```

Scopes nest, and inner scopes see outer ones — but not vice versa. This "look outward, never inward" rule is *lexical scoping*: a variable's visibility is determined by where it is written in the code, not by when or how the function is called. That one sentence is the foundation of closures.

## Hoisting: when variables exist

JavaScript processes declarations before running the code: `var` declarations and function declarations are **hoisted** to the top of their scope. The subtlety is what gets hoisted *with* them. Function declarations hoist whole (you can call them before their line — which is why `greet()` works anywhere in its scope). `var` hoists the *declaration* but not the value — reading it before assignment yields `undefined`. `let` and `const` are hoisted into a "temporal dead zone": referencing them before the declaration throws a `ReferenceError`, which is the language's way of saying "you are too early".

```js
console.log(hoisted)    // undefined — var's declaration exists, value doesn't
var hoisted = 'later'

console.log(tdz)        // ReferenceError — let exists but is in the dead zone
let tdz = 'nope'
```

The practical takeaway: prefer `const`, then `let` — never `var`. `var`'s hoisting and block-ignoring behaviour created a generation of bugs (the classic `var` inside a `for` loop being one shared variable across iterations). Modern JavaScript has no reason for `var`, and lint rules enforce that everywhere.

## Closures: functions that remember

A **closure** is a function bundled with its lexical environment — the variables that were in scope where it was created. When an inner function is returned from an outer function, it carries the outer function's variables with it, alive, even after the outer function has finished running. This is not magic — it is the lexical scoping rule doing exactly what it says:

```js
function createCounter() {
  let count = 0
  return function () {
    count += 1
    return count
  }
}

const counter = createCounter()
console.log(counter())    // 1
console.log(counter())    // 2
console.log(counter())    // 3
```

`createCounter` returns an anonymous function. That function closes over `count` — it keeps the *variable*, not its value — so each call increments the same counter. `createCounter`'s local variable should have died when the function returned; the closure keeps it alive because the inner function still references it. Every call to `createCounter` produces an *independent* counter with its own `count`. This mechanism — functions carrying their environment — is what makes the other techniques in this lesson possible: factory functions, private data, and much of how frameworks create isolated component state.

## Closures in the real world

Three patterns make closures invaluable. **Private data**: a closure creates state that no code outside can touch — the counter's `count` is unmodifiable from outside; it is as close to "private" as the language gets. **Factory functions**: `makeGreeter('Hello')` returns a function that greets in a captured language. **Memoization and callbacks**: the previous lessons' `setTimeout` callbacks, `addEventListener` handlers and `.map` functions are all closures — every callback you have written closes over the variables around it. The classic debugging puzzle — "loop counters in callbacks all show the final value" — is a closure and hoisting interaction: with `var`, all callbacks share one loop variable; with `let`, each iteration gets its own binding, which is exactly why `let` made that bug disappear.

```js
function makeGreeter(greeting) {
  return function (name) {
    console.log(`${greeting}, ${name}!`)
  }
}

const sayHi = makeGreeter('Hello')
sayHi('Ada')    // Hello, Ada!
```

## The event loop: how async really works

JavaScript runs on **one thread** — one line of code executes at a time. So how did the fetch lesson's page stay responsive while a request was in flight? The answer is the **event loop**, and it has three ingredients. First, **the call stack**: the current line-by-line execution, where synchronous work happens. Second, **the task queue**: work scheduled to run later — `setTimeout` callbacks, event handlers, resolved promise continuations. Third, **the loop itself**: when the call stack is empty, the event loop takes the next task from the queue and runs it.

```js
console.log('Start')

setTimeout(() => {
  console.log('Timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('Promise')
})

console.log('End')
// Logs: Start → End → Promise → Timeout
```

The output surprises everyone the first time: `Start`, `End`, then `Promise`, then `Timeout`. The synchronous lines print in order. Then the loop picks up tasks: microtasks (promise continuations) run before macrotasks (timeouts) — `setTimeout(…, 0)` does *not* mean "now", it means "queue this". This is why awaiting a promise works: the `await` yields control, the page keeps running, and when the promise settles, its continuation is queued and run when the stack is clear.

## The loop in your async code

Put the model to work on the fetch pattern from the previous lesson. `fetch` starts a network request and returns a promise immediately — the stack continues, the page renders, the user scrolls. When the response arrives, the promise settles and the continuation (`await`'s next line) is queued as a microtask. The event loop, idle between user interactions, runs it. The page never froze because *nothing on the main thread waited* — the waiting happened outside the thread, in the network stack, and JavaScript was notified when work was done. This is the entire explanation for how a single-threaded language powers interactive applications: blocking operations are delegated, and the loop only ever does small slices of work. Heavy synchronous code — a huge loop, a giant parse — *does* block the thread: the page janks, animations stutter, and the queue stalls behind it. That is why performance matters: any work that runs on the main thread is work the page cannot do anything else while doing.

## Real-world usage

Closures are everywhere in production code: React hooks and Vue reactivity are closure-driven (each hook call captures its component's state); event handlers close over the data they were created with; factory functions and currying style data transformations are closures; module boundaries (next lesson) are built on the same mechanism. The event loop explains every "why did this log late?" mystery, every debounce/throttle implementation, every requestAnimationFrame animation, and why `setTimeout(0)` is used to defer work out of a blocking stretch. Interviewers ask about them because they gate comprehension — and they gate *your* comprehension too, because once these are solid, frameworks stop looking like magic and start looking like JavaScript.

## Common mistakes

Using `var` and inheriting its block-ignoring, shared-binding bugs. Expecting `setTimeout(fn, 0)` to run immediately — it queues. Creating closures in loops with `var` and reading one final value everywhere. Closing over loop variables you expect to be frozen per-iteration. Leaking memory: closures keep their environment alive as long as they live, so long-lived closures over huge objects retain them — be aware of what a closure holds. Reading a `let`/`const` before its declaration and debugging a "phantom" ReferenceError. And reasoning about async code line-by-line without the queue model: order of logs becomes predictable the moment you think in terms of stack, queue and microtasks.

## Best practices

- Default to `const`, use `let` only to rebind, never use `var`.
- Declare variables at the top of their block to dodge temporal-dead-zone confusion.
- Use closures deliberately: factories, private state, memoization.
- Remember closures keep their environment alive — don't hold large data in closures longer than needed.
- Think in terms of the event loop: synchronous code blocks; async code queues.
- Use `await` instead of `setTimeout` chains for sequencing async work.
- When logs arrive out of order, trace the queue, not the file.
- Keep long synchronous work off the main thread (chunk it, or defer it) to protect responsiveness.

## Summary

Scope decides where variables live — block for `let`/`const`, function for `var`, nested scopes look outward. Hoisting explains when they exist: functions hoist whole, `var` hoists undefined, `let`/`const` have a temporal dead zone. Closures — functions carrying their creation environment — enable factories, private state and the callback style woven through the whole language. The event loop — stack, queue, microtasks — explains how single-threaded JavaScript stays responsive while the world's slowest operations (networks) run. Together they are the deep mental model beneath frameworks, async code and the entire runtime.

## Practice

Build a module of closure factories. Write `createTally()` returning an object with `add(n)` and `total()` methods closing over a private count — verify the count is unreadable from outside. Write `createStep(step)` returning `increment()` and `reset()` — a counter with configurable step and resettable state. Then the loop puzzle: create five buttons in a loop, attach click handlers that log their index — with `var` first (every button logs 5) and `let` second (each logs its own index), and explain to yourself in one sentence why the results differ. Finally, log `Start`, a `setTimeout(…, 0)`, a resolved promise's `.then`, and `End` — predict the output *before* running, then confirm the microtask-before-macrotask order you predicted.