---
title: Promises, Async/Await and Fetch
description: The async engine of the web. Master promises, async functions and the Fetch API to load data without freezing your page.
order: 9
difficulty: intermediate
category: Async
estimatedMinutes: 35
prerequisites:
  - learn/javascript/error-handling-and-json
---

## Introduction

Some operations take time: loading an image, sending a request to a server, reading a file. JavaScript's superpower — and its most misunderstood area — is how it handles these *asynchronous* operations. The browser does not freeze while waiting; the rest of the code keeps running, and the slow operation's result arrives later, out of order. The language models this with **promises** — objects representing work that has not finished yet — and the modern syntax for consuming them: `async`/`await`. And the operation you will perform most: fetching data from a server, with the built-in **Fetch API**.

This lesson builds the async mental model step by step: why async exists, what a promise is, consuming and creating promises, the `async`/`await` syntax that makes async code read like normal code, error handling in the async world, and the complete `fetch` pattern — the shape of nearly every data interaction in modern web development.

## The problem: blocking

Imagine `getWeather()` takes two seconds to reach a server. If JavaScript waited for it line by line — *blocking* — the entire page would freeze for those two seconds: no scrolling, no clicks, no animation. That is unacceptable for the web. The solution: start the slow operation, let the rest of the program continue, and handle the result when it arrives. This "start now, finish later" model is asynchronous programming, and it is why JavaScript, despite being single-threaded, can power an entire interactive interface while network requests are in flight.

The old mechanism for this was **callbacks** — pass a function to be called when the work finishes. Callbacks work, but nested sequences become "callback hell" — pyramids of indentation that are hard to read and impossible to refactor. Promises were invented to fix exactly that: a structured object with built-in handling for both success and failure.

## What is a promise?

A **promise** is an object representing a value that may not exist yet. It has three states: **pending** (work in progress), **fulfilled** (the value arrived), and **rejected** (the work failed with a reason). A promise's two consumers: `.then(callback)` runs the callback when fulfilled; `.catch(callback)` runs when rejected; and `.finally(callback)` runs either way.

```js
fetch('https://api.example.com/user')
  .then((response) => response.json())    // fulfilled: process the response
  .then((user) => console.log(user.name)) // chain another async step
  .catch((error) => console.error('Failed:', error))  // rejected: handle
```

Read the chain as a pipeline: fetch returns a promise; when it fulfills, the first `.then` converts the response to JSON (itself a promise, so a second `.then` chains on); the second `.then` uses the data; any failure anywhere in the chain skips to `.catch`. Chaining `.then` calls is what converts callback nesting into a flat sequence — the promise's reason for existing. Each `.then` returns a new promise, which is why chains can go as deep as the logic needs.

## Creating promises

Most of the time you *consume* promises — but understanding how they are made clarifies everything. `new Promise((resolve, reject) => { ... })` receives a function with two tools: call `resolve(value)` when the work succeeds, `reject(error)` when it fails. The classic simulation is a delayed operation:

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

delay(2000).then(() => console.log('Two seconds passed'))
```

`setTimeout` fires after `ms` milliseconds; the promise resolves when it fires. The rule of thumb: the executor function starts work immediately; calling `resolve` or `reject` settles the promise exactly once — subsequent calls are ignored, so a race between success and failure resolves cleanly. You will rarely write `new Promise` yourself — built-in APIs like `fetch` and `localStorage`-adjacent helpers already return promises — but reading them is essential.

## Async/await: the readable syntax

`async`/`await` is the modern way to consume promises — the same machinery with a syntax that reads like synchronous code. Mark a function `async`, and it automatically returns a promise. Inside it, `await` pauses the function (not the program!) until the awaited promise settles, and yields its fulfilled value:

```js
async function loadUser() {
  const response = await fetch('https://api.example.com/user')
  const user = await response.json()
  console.log(user.name)
}
```

Compare with the `.then` chain above: the same logic, half the punctuation, and the code flows top-to-bottom in the order the work actually happens. The key insight: `await` only pauses *this* function — the rest of the page keeps running, because the function's own promise is what the caller awaits. Errors in an async function follow the natural path: a rejected awaited promise throws, and you catch it with `try`/`catch` — bringing the error handling from the previous lesson into the async world unchanged.

```js
async function loadUser() {
  try {
    const response = await fetch('https://api.example.com/user')
    const user = await response.json()
    console.log(user.name)
  } catch (error) {
    console.error('Failed to load user:', error)
  }
}
```

This is the modern professional pattern: `async` function, `await` on each slow step, `try`/`catch` around the whole sequence. No nesting, no chaining gymnastics — just readable code that handles failures.

## The Fetch API

The **Fetch API** — `fetch(url, options)` — is the browser's built-in HTTP client. It returns a promise that resolves when the *response headers* arrive (not necessarily when the body is complete), which is why the `.json()` step exists: reading the body is another async operation. The response object carries `status` (200, 404, 500…), `ok` (true for 200–299), `headers`, and methods like `.json()` and `.text()`.

```js
async function saveProfile(profile) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return await response.json()
}
```

Read the full pattern: the URL, then an options object with `method` (default GET), `headers`, and a `body` — the profile object serialised to JSON text, the exact round trip from the JSON lesson. Then the most important check in the whole pattern: `if (!response.ok)` — because `fetch` only rejects on *network* failures; a 404 or 500 still resolves, and you must check `status` yourself. Only then parse the JSON and return it. This shape — fetch, check, parse — is the skeleton of every data call in every application you will build.

## Parallel work: Promise.all

Sometimes the slow operations are independent — load the user *and* the lessons, then render. Running them sequentially wastes time; running them in parallel is what `Promise.all` is for: it takes an array of promises and returns a promise for an array of results, resolving when *all* succeed and rejecting on the first failure.

```js
const [user, lessons] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/lessons').then(r => r.json()),
])
```

Both requests start immediately and the code waits for both. Destructuring (from the arrays and objects lesson) assigns the results by position. `Promise.allSettled` is the tolerant sibling — it resolves with each result's status even when some fail — the right tool when one bad request must not sink the whole batch.

## Real-world usage

Async code is the daily reality of front-end development: every page load that shows data, every search-as-you-type, every form submission that reaches a server, every image gallery, every dashboard. The professional patterns are built on this lesson: loading states (`await` in progress), error states (`catch`), skeletons while data arrives, retry logic on failure, and `Promise.all` to parallelise independent fetches. When you learn frameworks, the "data fetching" story is exactly this — `fetch` inside a component, with state for loading/success/error. And the tools get deeper too: you can `AbortController` to cancel in-flight requests, which you will meet in the HTTP & APIs stage.

## Common mistakes

Forgetting `await` — the classic: `const user = fetch(...)` gives you a *promise*, not the data; log it and you will see `Promise { <pending> }`. Forgetting to check `response.ok` — a 404 silently produces `undefined` data. `await` inside a non-async function (SyntaxError). Catching nothing around an awaited fetch — unhandled rejections crash in the console. Blocking wrongly: `await` in a loop over independent requests — that is sequential; use `Promise.all`. Passing a promise into `.json()` confusion — `response.json()` is already a promise; no extra await-then-await nesting needed. And the eternal one: expecting `fetch` to reject on HTTP errors — it does not; only network failures reject.

## Best practices

- Use `async`/`await` for readable sequences; reserve `.then` chains for short pipelines.
- Always check `response.ok` (or `response.status`) after every fetch.
- Wrap awaited work in `try`/`catch`; surface user-friendly errors.
- Use `Promise.all` for independent parallel requests; `allSettled` when partial success is fine.
- Never forget `await` — and when values look wrong, log them and check whether you got a promise.
- Parse JSON defensively: the response body may not be JSON at all.
- Keep async functions focused — one job per function, called by the UI layer.
- Set timeouts or use `AbortController` for long-running requests in production.

## Summary

Async programming keeps the page alive while slow operations finish. Promises represent pending work — `then` for success, `catch` for failure, chainable into flat pipelines. `async`/`await` consumes promises with synchronous-looking code: `await` pauses the function, `try`/`catch` handles failure. The Fetch API (`fetch` + `response.ok` + `.json()`) is the standard pattern for talking to servers, and `Promise.all` parallelises independent requests. This is the engine under every data interaction on the modern web.

## Practice

Build a "random user" page: a button and an empty card. On click, `fetch` the Random User API (`https://randomuser.me/api/`) with `async`/`await`, check `response.ok`, parse the JSON, and render the name and email into the card — with a "Loading…" state while awaiting and a friendly error message in a `catch`. Then press the button rapidly: since each fetch is independent, this is a natural place to note the pattern of disabling the button while loading. Finally, extend the practice with `Promise.all`: fetch the user and a placeholder image in parallel, log both results, and confirm the total time is the slower request, not the sum.