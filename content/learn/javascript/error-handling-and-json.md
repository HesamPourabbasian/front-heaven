---
title: Error Handling and JSON
description: Fail loudly, recover gracefully. Master try/catch, custom errors and the JSON format that moves data across the web.
order: 8
difficulty: beginner
category: Language Core
estimatedMinutes: 25
prerequisites:
  - learn/javascript/dom-and-events
---

## Introduction

Programs fail. Files vanish, servers return errors, users type nonsense, network connections drop. The difference between a fragile script and a robust application is how failures are *handled* — and how the program communicates them. JavaScript gives you the `try`/`catch` machinery for handling errors at runtime, the `Error` object for describing them, and — because data travels the web as text — **JSON**, the format in which structured data crosses every API boundary.

This lesson teaches the error model end to end: what errors are and how they propagate, `try`/`catch`/`finally` for handling them, throwing your own errors, and then JSON — parsing, stringifying, and the pitfalls that make JSON the most-fixed "invalid JSON" bug in existence.

## The error model

When something goes wrong in JavaScript — calling a function that does not exist, reading a property of `undefined`, asking for a file that is missing — the engine throws an **Error**. Throwing stops execution at that point and hands control to the nearest error handler; if there is no handler, the program crashes (in the browser, the console shows a red message).

```js
const user = null
console.log(user.name)   // TypeError: Cannot read properties of null
```

Every error has a name, a message and a stack trace — the chain of calls that led to the failure, which is the single most useful debugging tool in existence. The common built-in types are worth knowing by name: `TypeError` (wrong kind of value), `ReferenceError` (unknown variable), `SyntaxError` (bad code — often from parsing), `RangeError` (out-of-range number), and the network-era `fetch` errors you will meet in the async lesson.

## Try and catch

`try`/`catch` lets you attempt risky work and handle failure locally. The structure: `try` runs the risky block; if anything inside throws, execution jumps to `catch`, which receives the error object; the optional `finally` block always runs, whether the try succeeded or failed — the right home for cleanup like closing connections or re-enabling buttons.

```js
try {
  const parsed = JSON.parse('{"name": "Ada"}')
  console.log(parsed.name)
} catch (error) {
  console.error('Parsing failed:', error.message)
} finally {
  console.log('Attempt finished')
}
```

Read the flow: if `JSON.parse` succeeds, the catch block never runs; if it throws (the string is invalid JSON), the catch receives the error and logs a helpful message instead of crashing the page. The `finally` block logs regardless. The disciplined rule: catch only what you can *handle* — recover, retry or translate into a user-friendly message — and otherwise let errors propagate to a central handler. Swallowing errors silently (`catch {}` with no logging) is the anti-pattern that hides bugs for months.

## Throwing your own errors

Code quality improves when failures are *explicit*. Instead of returning `undefined` or `null` from a function to signal failure — which callers forget to check — throw an `Error` with a descriptive message. Your own functions can validate input and fail loudly:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}

try {
  divide(10, 0)
} catch (error) {
  console.error(error.message)   // Cannot divide by zero
}
```

Custom error classes extend this: `class ValidationError extends Error {}` lets callers distinguish *kinds* of failure — "the user's input was wrong" versus "the network is down" — and handle each appropriately. The message is for humans: it should say what happened and what was expected, not "Error: failed". Modern code often attaches structured data too (`new Error('...', { cause })`) so handlers can react programmatically, not just log.

## JSON: the data format of the web

**JSON** — JavaScript Object Notation — is the text format in which almost all structured data crosses the web. Its syntax is a subset of JavaScript's object and array literals: `{ "key": value }` objects, `[ ... ]` arrays, and the value types string, number, boolean, `null`, arrays and nested objects. Two rules matter: keys are *always* double-quoted, and strings are always double-quoted too. It is text — readable, language-independent, and parseable by every programming language on earth.

```json
{
  "course": "Front-Heaven",
  "lessons": ["HTML", "CSS", "JavaScript"],
  "isFree": true,
  "rating": 4.9,
  "author": null
}
```

This JSON describes a course as data. Notice the details: no trailing commas (a JSON killer), no comments, no single quotes, keys and strings double-quoted. Compare it with a JavaScript object literal and you will see the differences are exactly these — which is why "JSON.parse failed" trips up even experienced developers who habitually write JS objects.

## Stringify and parse

JavaScript converts between its objects and JSON text with two functions: `JSON.stringify` (object → text) and `JSON.parse` (text → object). These two functions are the bridge between your program's memory and the wire:

```js
const course = { name: 'Front-Heaven', lessons: ['HTML', 'CSS'] }

const text = JSON.stringify(course)
console.log(text)              // {"name":"Front-Heaven","lessons":["HTML","CSS"]}

const back = JSON.parse(text)
console.log(back.name)         // Front-Heaven — a real object again
```

The round trip — object to text to object — is exactly what happens when a browser sends or receives API data. Two important behaviours: `stringify` can take a *replacer* and an *indent* (`JSON.stringify(course, null, 2)` produces pretty-printed JSON for debugging), and `parse` throws `SyntaxError` on invalid input — which is why it almost always appears inside `try`/`catch`. Also note what JSON cannot represent: `undefined`, functions, `NaN`, `Infinity`, and circular references — `stringify` silently drops the first three and throws on circular ones. Dates become strings, which is why every API's date fields need a documented format.

## The common JSON pitfalls

The classic pitfalls are all "it looks right to my eyes, but JSON.parse says no". Trailing commas — `{"a": 1,}` — are illegal in JSON. Single quotes — `{'a': 1}` — are illegal. Unquoted keys — `{a: 1}` — are illegal. Comments — `// ...` — are illegal. Comments in JSON are so commonly wished-for that the JSON5 format exists just for them, but *real* JSON forbids them: when your API responds with "invalid JSON", check for exactly these four things first. The other pitfall class: data loss through `stringify` — functions and `undefined` values vanish silently, so "why is my object missing fields after the round trip?" is answered by "because JSON cannot hold them".

## Real-world usage

JSON is the language of APIs. Every `fetch` you will write — and every API response you will ever consume — is JSON parsed into JavaScript objects and strings back into JSON when sending. Configuration files, saved game states, exported data, browser storage (the next lesson's `localStorage` uses JSON under the hood), clipboard formats — all JSON. Error handling runs alongside: every network call needs a `try`/`catch` (or its async equivalent, which the next lesson covers), every JSON.parse of untrusted input needs protection, and every form needs validation errors surfaced as friendly messages — which is the *point* of errors: handled well, they become part of the user experience rather than a red console.

## Common mistakes

Empty `catch {}` blocks that swallow failures silently — always log at minimum. Catching everything with one giant try around a whole script, which makes debugging impossible (catch the specific operation). Throwing strings (`throw 'nope'`) instead of `Error` objects — the message, name and stack are what make errors debuggable. Forgetting that `JSON.parse` throws — wrap it. Parsing the *same* JSON repeatedly instead of once. Believing `JSON.stringify` preserves everything (functions and `undefined` vanish). Adding trailing commas or comments to JSON files, then debugging "invalid JSON" for an hour. And re-throwing: catching an error and not rethrowing (`throw error`) when the caller also needs to know — swallowing at every layer hides the truth.

## Best practices

- Wrap risky operations (parsing, network, storage) in `try`/`catch`; log or recover in `catch`.
- Use `finally` for cleanup that must run either way.
- Throw `Error` objects (with class hierarchies for distinct failure kinds) rather than returning failure values.
- Never swallow errors silently; at minimum `console.error(error)`.
- Validate input early and fail loudly with clear messages.
- Use `JSON.parse` inside try/catch; prefer `JSON.stringify(data, null, 2)` when debugging.
- Follow JSON's syntax strictly — double quotes, no trailing commas, no comments.
- Keep error messages human-readable: what happened, what was expected, what the user can do.

## Summary

Errors are thrown when programs fail, and `try`/`catch`/`finally` handles them locally: try the risk, catch and respond to the failure, finally clean up. Functions can throw their own descriptive `Error`s — ideally typed via subclasses — so failures are loud and classifiable. JSON is the web's text format for structured data: `stringify` serializes objects, `parse` deserializes with strict syntax rules. Together, error handling and JSON are the plumbing through which every robust application survives failure and talks to the world.

## Practice

Write a `parseSettings(text)` function that parses a JSON string of settings (`{ theme, fontSize }`) inside `try`/`catch`, returning a friendly default object on failure and logging the real error. Test it with valid JSON, with a trailing comma, with single quotes, and with a `null` input — read each error message and note which rule of JSON it broke. Then add a `divide` function that throws a custom `ValidationError` for zero, and catch it in a caller that prints the message and the error's name. Finally, round-trip a course object with `stringify` and `parse` — and deliberately include a function and an `undefined` field, and confirm they vanish in transit.