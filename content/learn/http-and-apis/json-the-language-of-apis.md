---
title: 'JSON: the language of APIs'
description: Master the format that carries data across the web — syntax rules, parsing and serialising in JavaScript, validation, and the common traps.
order: 5
difficulty: intermediate
category: Data Formats
estimatedMinutes: 30
prerequisites:
  - learn/javascript/error-handling-and-json
---

## Introduction

Almost every API you will ever consume speaks one dialect: **JSON** — JavaScript Object Notation. It is the format that `fetch` responses arrive in, the format request bodies are written in, and the lingua franca of every modern web service. You already met it in the JavaScript stage; this lesson makes you fluent: the exact syntax rules, the JavaScript interop (`JSON.parse` / `JSON.stringify`), the traps that produce silent bugs, and how to validate data you cannot trust.

## What JSON is

JSON is a text format for structured data, descended from JavaScript object literals — which is why it looks familiar:

```json
{
  "user": {
    "id": 42,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "admin": false,
    "skills": ["math", "computing"],
    "joined": "2024-01-15",
    "address": null
  }
}
```

Four facts define its power and its limits:

- **It is text.** A JSON document is a string of characters — nothing but text. That is why it travels anywhere (HTTP bodies are text) and why it is language-independent: any language can parse it.
- **It has only six value types** — objects (`{...}`), arrays (`[...]`), strings, numbers, booleans, and `null`. That is the entire vocabulary. There are no dates, no undefined, no comments, no functions.
- **Its syntax is strict.** This is the price of universality — and the source of most parsing bugs.
- **Keys are always quoted strings**, and values follow the type rules exactly.

## The strict syntax rules

JSON looks like JavaScript but is stricter. The rules that bite beginners:

```json
{
  "name": "Ada",          // double quotes for strings — no single quotes
  "age": 36,              // numbers, no leading zeros
  "active": true,         // true/false, lowercase, no quotes
  "nothing": null,        // null, lowercase
  "list": [1, 2, 3],      // trailing commas are invalid
  "nested": { "ok": 1 }
}
```

- **Strings must use double quotes.** `'Ada'` is valid JavaScript and invalid JSON.
- **No trailing commas.** JavaScript allows `[1, 2, 3,]`; JSON rejects it.
- **No comments.** The `//` and `/* */` of JavaScript are illegal in JSON.
- **No `undefined`, no `NaN`, no `Infinity`.** Only the six types exist.
- **Keys must be quoted.** `{ name: "Ada" }` is valid JavaScript, invalid JSON.

Every one of these is a violation you will meet in the wild — usually not as "invalid JSON" errors but as responses that crash your parser.

## Parsing and serialising in JavaScript

The two functions do all the work:

```js
const text = '{"name": "Ada", "age": 36}'
const data = JSON.parse(text)      // string → JavaScript value

const back = JSON.stringify(data)  // JavaScript value → string
```

`JSON.parse` throws on any syntax violation — a malformed document, a trailing comma, a single-quoted string all raise a `SyntaxError`. Uncaught, it crashes your whole handler; the professional pattern wraps it:

```js
function safeParse(text) {
  try {
    return { ok: true, data: JSON.parse(text) }
  } catch (error) {
    return { ok: false, error }
  }
}
```

`JSON.stringify` is the mirror: it serialises a value to text, ready for a request body. Its notable behaviours: `undefined`, functions and symbols are *omitted* from objects; `NaN` and `Infinity` become `null`; and a circular reference (an object pointing back to itself) throws `TypeError: Converting circular structure to JSON` — a daily bug in front-end code that tries to stringify a state object with a back-reference. The second argument and the replacer function let you shape output; `JSON.stringify(data, null, 2)` pretty-prints for debugging.

## Dates, numbers and the traps they hide

JSON has no date type — so every date you receive is a string, and every date you send must become one. The standard is **ISO 8601**: `"2024-01-15T10:30:00Z"` — a string, not a `Date`. The trap is parsing lazily:

```js
const res = await fetch('/api/events')
const events = await res.json()

// WRONG — '2024-01-15T10:30:00Z' is a string; comparisons are alphabetical
events.sort((a, b) => a.date - b.date)   // NaN comparisons, silent garbage

// RIGHT — convert explicitly
events.forEach(e => { e.date = new Date(e.date) })
```

Numbers carry a subtler trap. JSON numbers are just text; `JSON.parse` converts them to JavaScript numbers, and very large integers (like a 64-bit database id — `9007199254740993`) lose precision because JavaScript numbers cannot represent them exactly. The standard workaround for big ids: the server sends them as **strings** in JSON, and your code treats them as opaque strings, never as numbers.

## Validating data you cannot trust

`JSON.parse` guarantees valid *syntax* — it guarantees nothing about the *shape*. An API can return `{"user": {}}`, `{"error": "..."}` or `null` with a 200 status. Untyped access (`data.user.email`) on unexpected shapes produces `TypeError: Cannot read properties of undefined` — the most common runtime crash in front-end code. The professional response is validation at the boundary: check the shape before using it.

```js
function isUser(value) {
  return value !== null
    && typeof value === 'object'
    && typeof value.id === 'number'
    && typeof value.name === 'string'
}
```

For anything non-trivial, hand-rolled checks become tedious — which is why schema validators exist (Zod in the TypeScript world is the standard). The discipline is the same with or without a library: *never* trust that a parsed response has the shape you expect. Validate at the boundary once, then use the data confidently.

## JSON everywhere

JSON is the default of the modern web: request bodies (`Content-Type: application/json`), response bodies, configuration files, stored data, WebSocket messages. Its universal reach is why the error-handling lesson's fetch pattern — parse, check, validate — matters: every data interaction in your career will pass through `JSON.parse` at least once. Alternatives exist (XML, form data, Protocol Buffers) — XML you will still meet in legacy systems, form data in file uploads — but JSON is the language you will write and read daily.

## Common mistakes

Writing JSON by hand with single quotes, trailing commas or comments — then wondering why `JSON.parse` throws. Calling `res.json()` without checking the status, and parsing an HTML error page. Forgetting that `JSON.stringify` throws on circular references and omits `undefined`. Comparing ISO date *strings* with `-` as if they were dates. Doing arithmetic on numeric ids that lose precision. And accessing deeply nested fields without any shape check, crashing the whole UI on a slightly different response. The pattern for all of these: parse safely, check status, validate shape, then use.

## Best practices

- Double quotes, no trailing commas, no comments — when hand-writing JSON, follow the strict rules.
- Wrap `JSON.parse` in try/catch; treat a parse failure as an error branch, not a crash.
- Check the status code before parsing; parse error bodies as JSON too.
- Treat all dates as ISO strings; convert explicitly with `new Date()` where you need date maths.
- Treat large ids as opaque strings — never do arithmetic on them.
- Validate the shape of untrusted responses at the boundary before use.
- Use `JSON.stringify(data, null, 2)` for debugging output.

## Summary

JSON is the text format that carries data across the web: six value types, strict syntax (double quotes, no trailing commas, no comments), and universal parsers in every language. In JavaScript, `JSON.parse` and `JSON.stringify` are the two interop functions, each with traps — parse throws on malformed input, stringify throws on circular references and silently drops `undefined`. Dates arrive as ISO strings, big ids arrive as strings, and untrusted shapes must be validated at the boundary. Master these rules and JSON stops being a mystery — it becomes the reliable medium you read and write every day.

## Practice

In your browser console, construct a JSON document by hand and parse it: start with a *deliberately invalid* one — single-quoted keys, a trailing comma, an unquoted `true` — and confirm `JSON.parse` throws `SyntaxError` on each. Then fix them one by one until it parses. Next, round-trip a real object through `JSON.stringify` and `JSON.parse` and observe the losses: a `Date` becomes a string, `undefined` disappears from objects, `NaN` becomes `null`. Then fetch `jsonplaceholder.typicode.com/users/1`, parse the response, and validate its shape by hand — write `isUser()` checks for `id`, `name` and `email` and confirm your fetched data passes. Finally, stringify an object with a self-reference (`const o = {}; o.self = o`) and observe the circular-structure error — then never be surprised by it again.