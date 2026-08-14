---
title: Loops
description: Repeat without repeating yourself. Master for, while and the modern iteration methods that process every item in a collection.
order: 4
difficulty: beginner
category: Fundamentals
estimatedMinutes: 25
prerequisites:
  - learn/javascript/operators-and-conditionals
---

## Introduction

A program that writes the same instruction a hundred times would be absurd — and pointless. **Loops** are the language's answer: a way to run the same block of code repeatedly, over a collection of values or until a condition flips. Almost every real program contains one: rendering a list of products, summing a scoreboard, filtering search results, retrying a failed request. If conditionals are the nervous system, loops are the heartbeat.

This lesson teaches the loop family — `for`, `while`, `do...while` — and then the modern, more idiomatic layer: the iteration methods (`forEach`, `map`, `filter`, `reduce`) that professional JavaScript prefers for working with arrays. The mental model that unifies everything: *iteration* — visiting each item in a collection, one at a time, in order.

## The for loop

The `for` loop is the classic workhorse. Its syntax packs three parts into the parentheses: the initialiser (run once before the loop), the condition (checked before every iteration — the loop runs while it is true), and the update (run after each iteration).

```js
for (let i = 0; i < 5; i++) {
  console.log(`Iteration ${i}`)
}
```

Read it aloud: "Start with `i` at 0. While `i` is less than 5, run the block, then increment `i`." The output is `Iteration 0` through `Iteration 4` — exactly five lines, because the loop stops when `i` reaches 5. The variable name `i` (for index) is tradition, and `let` is mandatory: `const` would make the increment impossible. The classic use is stepping through an array by index:

```js
const days = ['Mon', 'Tue', 'Wed']
for (let i = 0; i < days.length; i++) {
  console.log(days[i])
}
```

Each pass visits `days[0]`, `days[1]`, `days[2]` — the loop runs *while the index is still inside the array*. Using `days.length` in the condition means the loop adapts automatically when the array grows or shrinks.

## While and do...while

The `while` loop repeats while a condition is true — the condition is checked *before* each iteration, so a false condition means zero runs. It is the right tool when you do not know the iteration count in advance: keep reading until the file ends, keep polling until a response arrives.

```js
let attempts = 0
while (attempts < 3) {
  console.log(`Attempt ${attempts + 1}`)
  attempts++
}
```

The `do...while` variant flips the order: the body runs *once first*, then the condition is checked. Guaranteeing at least one run makes it right for "ask the user, repeat until they answer validly" patterns.

```js
let roll
do {
  roll = Math.floor(Math.random() * 6) + 1
} while (roll !== 6)
console.log(`Got a ${roll}`)
```

This dice loop rolls until a six appears — the first roll happens before any check. Both `while` forms are loop-with-condition tools; `for` is the index-driven tool. The beginner risk is the **infinite loop**: if the condition never becomes false — forgetting to increment, or a condition that never flips — the program hangs. An infinite `while(true)` is sometimes intentional (a server's main loop), but in your code, the condition must change state toward termination.

## Breaking and continuing

Two statements give loops an escape hatch. `break` exits the loop entirely, immediately. `continue` skips the rest of the current iteration and jumps to the next one.

```js
for (const tech of technologies) {
  if (tech === 'TypeScript') break      // stop searching, we found it
  console.log(tech)
}

for (const grade of grades) {
  if (grade < 50) continue              // skip failures silently
  console.log(`${grade}% — passed`)
}
```

The first loop scans a list and stops at a match — the classic "find the first" pattern. The second processes every item but skips the ones that fail a filter — "process all except". Use `break` and `continue` sparingly and readably; a loop littered with them becomes a maze.

## The modern iteration methods

Modern JavaScript rarely writes `for (let i = 0; ...)` loops for arrays at all. The array *methods* encode the common patterns with names that document intent: `forEach` visits every item; `map` transforms every item into a new array; `filter` keeps matching items; `find` returns the first match; `reduce` folds the array into one value.

```js
const prices = [10, 25, 8, 40]

// forEach: visit each item
prices.forEach((price) => console.log(price))

// map: transform each item — a NEW array, original untouched
const withTax = prices.map((price) => price * 1.2)

// filter: keep items matching the predicate
const affordable = prices.filter((price) => price < 30)

// find: the first match, or undefined
const firstExpensive = prices.find((price) => price > 30)
```

Each method takes a function and calls it with each item. Read them as sentences: "prices *mapped* to prices times 1.2", "prices *filtered* to those under 30". The crucial property of `map` and `filter`: they return *new arrays* and leave the original untouched — this immutability is the foundation of predictable code, and you will meet it again in every framework's data flow.

## Reduce: folding to one value

`reduce` is the most powerful and the most feared method — it collapses an array into a single value, accumulating through a callback that receives the running total and the current item.

```js
const prices = [10, 25, 8, 40]

const total = prices.reduce((sum, price) => sum + price, 0)
console.log(total)    // 83

const max = prices.reduce((best, price) => Math.max(best, price), 0)
```

Read the sum: "Start the accumulator at 0; for each price, return the accumulator plus the price." The second argument (0) seeds the accumulator. Anything reducible — sums, averages, totals, counts, joined strings, grouped objects — is a `reduce`. When the accumulation logic is short and the callback is a single expression, `reduce` is beautiful; when the callback grows complex, a plain `for` loop is the more honest tool.

## Iterating objects

Objects are not arrays, but they need iterating too. The modern way: `Object.entries()` returns each key/value pair as a small array, which you can loop with the `for...of` syntax — the clean loop for arrays and iterables that avoids the index entirely:

```js
const user = { name: 'Ada', role: 'Programmer' }

for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`)
}
```

The `for...of` loop iterates *values* directly — no indexing, no bounds checking. Combined with destructuring (`[key, value]` — unpacking the pair array), it makes object iteration a one-liner. A sibling, `for...in`, iterates object keys — use `for...of` on `Object.keys()` or `Object.entries()` instead, which behave predictably.

## Real-world usage

Loops and iteration methods run the data side of every application. Rendering a shopping cart is `cart.map(item => <Row .../>)`; filtering a search is `products.filter(p => matches(p, query))`; computing an order total is `items.reduce((sum, item) => sum + item.price, 0)`; finding a user by id is `.find(u => u.id === id)`. Every framework's rendering, every state library's updates, every test suite's assertions — all of it is iteration with style. When you later learn about `async` code, iteration continues with `for await` loops; the model here never stops being the foundation.

## Common mistakes

The infinite loop (a condition that never flips, or forgetting the increment). Off-by-one errors: `i <= array.length` visits one too many, `i < array.length` is correct; accessing `array[array.length]` is `undefined`. Modifying an array *while* iterating it — items shift and get skipped or repeated; the fix is often to filter into a new array instead. Using `map` when you just want to do something (that is `forEach`) and `forEach` when you want a result (that is `map`). Forgetting that `map`/`filter` return new arrays, and ignoring the result. And for `reduce`, forgetting the seed value — without it, the first item becomes the accumulator, which changes the result for empty arrays and non-numeric data.

## Best practices

- Reach for `map`, `filter`, `find` and `reduce` before raw `for` loops — they document intent.
- Use `for...of` for simple value iteration; reserve index `for` loops for indexed work.
- Never mutate an array while iterating it; build new arrays instead.
- Guard against infinite loops: every loop must move its state toward the exit condition.
- Use `break`/`continue` sparingly; a filter method is often clearer than a `continue`.
- Keep `reduce` callbacks short; reach for a loop when accumulation gets complex.
- Iterate objects via `Object.entries()` with destructuring.
- Test loops with tiny inputs first — `[1,2,3]`, not a production array.

## Summary

Loops repeat work until done: `for` steps an index through a range or array; `while` runs while a condition holds (checking before), and `do...while` guarantees one run; `break` and `continue` steer from inside. Modern JavaScript prefers the array methods — `forEach`, `map`, `filter`, `find` and `reduce` — which encode each pattern by name and return new, unmodified arrays. Every application you will ever build, in any framework, is iteration under the hood.

## Practice

Start with a `prices = [12, 45, 8, 23, 60, 15]` array and produce, using only methods (no raw loops): a list with 20% tax via `map`; the affordable items under 30 via `filter`; the first item over 50 via `find`; and the total via `reduce`. Then rewrite one of them as a classic `for` loop with an index to prove you can walk both paths. Finally, write a `while` loop that rolls a die (`Math.random()`) until it exceeds 4, logging each roll — and a deliberate infinite loop that you fix by adding the missing state change, watching the browser tab freeze as a lesson in termination.