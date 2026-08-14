---
title: Arrays and Objects
description: The data structures of JavaScript. Master array methods, object patterns, destructuring and the spread operator.
order: 6
difficulty: beginner
category: Fundamentals
estimatedMinutes: 30
prerequisites:
  - learn/javascript/functions
---

## Introduction

Arrays and objects are the two data structures at the heart of JavaScript — and, since this is where almost all real data lives, they are the structures you will touch more than any other. An array is an ordered list; an object is a named record. Together they model everything: a shopping cart is an array of product objects; a user profile is an object with nested objects and arrays; an API response is an object whose fields are arrays and objects.

You met both in the types lesson. This lesson turns them into *tools*: the array method toolkit (beyond the basics), the common object patterns, destructuring (the elegant unpacking syntax), and the spread operator (the modern way to copy and merge). These four skills appear in virtually every line of modern JavaScript you will read.

## The array method toolkit

The fundamental methods — `map`, `filter`, `find`, `reduce` — came with the loops lesson. The full toolkit adds the everyday rest: `some`/`every` (does any/every item match?), `includes` (does the value exist?), `indexOf` (where?), `slice` (copy a portion), `splice` (mutate in place — used carefully), and `sort` (order — with a caution).

```js
const scores = [88, 54, 92, 67]

scores.some(s => s < 60)     // true — at least one failed
scores.every(s => s >= 50)   // true — none below 50
scores.includes(92)          // true — direct membership check
scores.slice(1, 3)           // [54, 92] — copies indexes 1..2, original untouched
```

Two cautions. `sort()` sorts in place, *and* by default it sorts as strings — `[10, 9, 100].sort()` becomes `[10, 100, 9]`. Always pass a comparator: `sort((a, b) => a - b)` for numbers. And `splice` mutates — removing from the middle shifts every later index. Prefer building new arrays (`slice`, `filter`) when possible; mutation in place is the source of subtle iteration bugs you met in the loops lesson.

```js
scores.sort((a, b) => a - b)          // [54, 67, 88, 92] — ascending
```

## Common object patterns

Objects are dictionaries: key/value stores where the key is a string and the value can be anything. Three patterns dominate daily work. The **config pattern** collects options in one object instead of a dozen parameters — `renderUser(user, { showEmail: true })`. The **map pattern** uses an object as a lookup table — status codes to labels:

```js
const statusLabels = {
  pending: 'Waiting',
  active: 'In progress',
  done: 'Complete',
}

function labelFor(status) {
  return statusLabels[status] ?? 'Unknown'
}
```

The lookup `statusLabels[status]` retrieves by key in one step — a `switch` or `if` chain replaced by data. And the **collection pattern** — an object mapping ids to records — turns "find this user" into `usersById[userId]`, which is instant where `find` would scan. The modern improvement for key collections is `Map` — but the object map pattern remains the everyday idiom.

## Destructuring: unpacking values

**Destructuring** unpacks values from arrays and objects into named variables — the syntax that reads like the data it extracts. Object destructuring extracts by property name; array destructuring extracts by position:

```js
const user = { name: 'Ada', role: 'Programmer', city: 'London' }
const { name, role } = user
console.log(name, role)          // Ada Programmer

const [first, second] = ['HTML', 'CSS', 'JavaScript']
console.log(first, second)       // HTML CSS
```

The object form is a mirror of the literal: `{ name, role } = user` says "take the `name` and `role` properties out". It renames with `{ name: displayName }`, and defaults with `{ city = 'Unknown' }`. Array destructuring handles *skipping* with commas — `const [, second] = ...` — and, combined with rest, captures the remainder: `const [first, ...rest] = list`. You already saw destructuring in the loops lesson's `for (const [key, value] of Object.entries(user))` — that pattern is everywhere because it is the cleanest way to work with pairs.

## Destructuring in function parameters

The pattern shines hardest in function parameters. Instead of positional arguments (`createUser('Ada', 30, 'London', true)` — what is `true`?), pass an object and destructure it in the signature, with defaults inline:

```js
function createUser({ name, age = 18, city = 'Unknown', isAdmin = false }) {
  return { name, age, city, isAdmin }
}

createUser({ name: 'Ada', city: 'London' })
// { name: 'Ada', age: 18, city: 'London', isAdmin: false }
```

Every caller writes `{ name: ... }` — self-documenting — and every option carries its default. The function returns a new object using the *shorthand property* `{ name, age, ... }` — which is just `{ name: name, age: age }` abbreviated. Parameters-destructured-from-object is the professional default for any function with more than two or three options, and it is exactly how framework component props work.

## The spread operator

The spread operator `...` is the modern copy-and-merge tool. Spread into an array concatenates; spread into an object copies properties; both leave the originals untouched:

```js
const basics = ['HTML', 'CSS']
const fullStack = [...basics, 'JavaScript', 'TypeScript']
// ['HTML', 'CSS', 'JavaScript', 'TypeScript']

const base = { theme: 'dark', radius: 8 }
const extended = { ...base, radius: 12, accent: 'indigo' }
// { theme: 'dark', radius: 12, accent: 'indigo' }
```

The object spread is the professional replacement for `Object.assign` and the answer to the immutability question: to "modify" an object, you copy it with spread and override the changed fields — `{ ...user, role: 'Admin' }` returns a new object with the role updated and the original untouched. Order matters: later spreads (and later literal keys) win, which is exactly why the radius override above works. This copy-and-override idiom is the single most common object pattern in modern code.

## Copying: shallow versus deep

One caveat that bites everyone: spread copies *shallowly*. Nested arrays and objects are shared by reference, not cloned:

```js
const original = { user: { name: 'Ada' } }
const copy = { ...original }
copy.user.name = 'Grace'
console.log(original.user.name)    // 'Grace' — the nested object was shared!
```

The top level of `copy` is new, but `copy.user` is the *same object* as `original.user` — mutating one mutates both. For genuinely independent copies of nested structures you need a deep clone (`structuredClone(original)` is the modern built-in). Knowing where the boundaries are — shallow by default, deep only when asked — prevents the most confusing "why did my other object change?" bugs in the language.

## Real-world usage

This toolkit is the daily vocabulary of data handling. Fetch a list of users from an API: map over the results, filter by search term, sort by name, reduce to a count — a one-line pipeline of methods. Display a form: destructure the user object into fields. Update state in a framework: `setUsers(prev => [...prev, newUser])` or `{ ...user, role: 'admin' }` — immutable patterns built on spread. Parse an API response: destructure `const { data, error } = await fetchJson(...)`. Read any modern codebase and you will find destructuring in signatures, spread in every update, and method chains over every collection — this lesson is the grammar of that style.

## Common mistakes

Mutating with `sort`/`splice` when a new array was intended (and the "original changed" surprise). Forgetting `sort`'s string default — number arrays need a comparator. Destructuring a property that does not exist (you get `undefined`; defaults cover intentional cases). Trying to destructure `null` — `const { x } = null` throws; guard with `?.` first. Confusing array and object spread — spreading an object into an array yields nothing useful. Deep-copy surprise: spread copies shallowly, nested objects stay shared. And the classic: `const copy = original` — that is not a copy at all, just a second name for the same object.

## Best practices

- Prefer immutable updates: copy with spread, override fields, never mutate the source.
- Destructure objects in function parameters with defaults; avoid long positional argument lists.
- Use the map-pattern objects and id-keyed objects instead of chains of conditionals.
- Always pass a comparator to `sort`.
- Remember spread is shallow; use `structuredClone` for deep copies.
- Use `some`/`every`/`includes` for boolean checks over arrays — clearer than `filter(...).length > 0`.
- Prefer `slice`/`filter` for copies; reserve `splice` for intentional in-place edits.
- Name destructured variables meaningfully; rename when the source key is unclear.

## Summary

Arrays and objects model all data. Arrays are ordered lists processed with the method toolkit — `map`, `filter`, `find`, `reduce`, `some`, `every`, `slice`, `sort` (with comparator). Objects are named records using config, map and collection patterns. Destructuring unpacks either structure elegantly — especially in function parameters — and spread copies and merges immutably (shallowly). These four skills are the everyday grammar of professional JavaScript, in every codebase and every framework.

## Practice

Build a `lessons` array of three objects (`title`, `duration`, `completed`) and answer with method chains: the total duration of completed lessons (`filter` + `reduce`), the titles of incomplete lessons (`filter` + `map`), and whether any lesson is shorter than 10 minutes (`some`). Then model a user update: create `const updated = { ...user, completedLessons: user.completedLessons + 1 }` and verify the original object is unchanged. Finally, refactor a small function `renderLesson(lesson)` that destructures its object parameter with a default and returns a template string using shorthand — then read it aloud as a sentence: it should read like the data it describes.