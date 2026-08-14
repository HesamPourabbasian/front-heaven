---
title: Modules and Web Storage
description: Organize code for scale and persist it across visits. Master ES modules, import/export and localStorage/sessionStorage.
order: 11
difficulty: intermediate
category: Browser APIs
estimatedMinutes: 30
prerequisites:
  - learn/javascript/closures-scope-and-the-event-loop
---

## Introduction

Two systems turn a script into an application. **ES modules** — the `import`/`export` syntax — divide code into files with explicit boundaries: each module is its own scope, exposes only what it exports, and imports exactly what it needs. **Web storage** — `localStorage` and `sessionStorage` — persists data across visits in the browser, so preferences, progress and drafts survive a refresh, a tab, a restart. This lesson teaches both: module syntax and behaviour, the module patterns that structure real projects, and the storage APIs with their JSON pattern — and it closes your JavaScript stage by showing how the pieces combine into the architecture of a real application.

## Why modules?

Without modules, every script shares the global scope — every variable is visible everywhere, names collide, order of inclusion matters, and a typo in one file silently overwrites another. Modules fix all of it: each file is its own **module scope** (top-level variables are private by default), code is *explicitly* shared via exports and imports, and dependencies are visible in the file itself — no more "where did this function come from?". Modules also enable tooling: the bundler can include only what is imported, tree-shake unused exports, and split code into lazy-loadable chunks. When you later work in Vue or React, every component file is a module — this syntax is the backbone of every modern codebase.

## Export and import

A module exports the values it wants to share — with the `export` keyword — and another module imports them. Two styles cover the language: **named exports** (several per module, imported by name) and **default exports** (one per module, imported with any name):

```js
// utils/format.js
export function formatPrice(amount, currency = '$') {
  return `${currency}${amount.toFixed(2)}`
}

export const siteName = 'Front-Heaven'
```

```js
// main.js
import { formatPrice, siteName } from './utils/format.js'

console.log(formatPrice(9.5))   // $9.50
console.log(siteName)           // Front-Heaven
```

Named imports can be renamed (`import { formatPrice as price }`), and a module can export a default alongside named exports (`export default function App() {}`). One detail that trips everyone: the file extension — `./utils/format.js`, written explicitly in the browser (the bundler relaxes this in frameworks, but the mental model is the same). The imports are static and hoisted: they run when the module loads, which is also why they appear at the top of every file.

## What runs when a module loads

Modules execute **once** per import, on first load, top to bottom. That has one beautiful consequence: the *singleton* pattern for free. State at module top level is shared by every importer:

```js
// store.js
let count = 0
export function increment() { return ++count }
export function current() { return count }
```

```js
// a.js and b.js both import from ./store.js
```

Both files see the same `count` — the module ran once, and its top-level state is a single shared instance. This is how many state stores (and the `useProgress` pattern in real apps) are built: a module holding state, exporting functions to read and mutate it. No classes, no singletons ceremony — the module system does it.

## Importing for side effects

Sometimes a module exists only to run code — attach a polyfill, register a service worker, define custom elements — and exports nothing. The syntax is `import './polyfills.js'` — import for side effects only. Less commonly, `import * as utils from './utils.js'` imports the entire namespace as an object (`utils.formatPrice(...)`), useful for grouping related utilities. In everyday work you will use named imports 95% of the time — they make dependencies explicit and tree-shaking possible — and side-effect imports for the rare setup file.

## Web storage: localStorage and sessionStorage

The browser gives every page a tiny key/value database: **localStorage** (persists until explicitly cleared — across refreshes, tabs and browser restarts) and **sessionStorage** (persists for the tab's lifetime, cleared when the tab closes). The API is the same for both: `getItem(key)`, `setItem(key, value)`, `removeItem(key)`, and `clear()`. Values are *strings only* — which is why the JSON lesson matters here: structured data is stored via `JSON.stringify` on the way in and `JSON.parse` on the way out:

```js
const progress = {
  completed: ['learn/javascript/functions'],
  updatedAt: new Date().toISOString(),
}

localStorage.setItem('front-heaven:progress:v1', JSON.stringify(progress))

const loaded = JSON.parse(localStorage.getItem('front-heaven:progress:v1'))
console.log(loaded.completed)   // ['learn/javascript/functions']
```

Note the string keys: `getItem` with a missing key returns `null`, not an error — so reading is safe, and the parse-and-default pattern handles the first visit: `JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultState`. The `storage` event even notifies other tabs when data changes — the primitive behind "log out everywhere" features. And `sessionStorage` is identical except its lifetime: a draft form, a scroll position, a tab-local wizard.

## Storage limits and guarding

Two realistic dangers shape how you use storage. **Size**: storage holds roughly 5–10 MB per origin — plenty for preferences and progress, wrong for images or large caches; the API throws `QuotaExceededError` when full, so production code wraps writes in `try`/`catch`. **Privacy**: storage is per-origin — `https://site.com` cannot read `https://other.com`'s data — but *anything* on the site's origin (including third-party scripts) can read it, so **never store tokens, passwords or sensitive data** in web storage; that is what HTTP-only cookies are for. And storage is synchronous: a giant write blocks the main thread briefly — another reason to keep stored payloads small. The pattern to remember: small, non-sensitive, structured data; stringify on write; parse with a fallback on read; `try`/`catch` around writes.

## The JSON storage pattern

Because storage holds only strings, the standard pattern is a small wrapper — a *storage module* that encapsulates the JSON round trip and the defaults. This is the perfect use of the module lesson: one file owns the storage interaction, exports typed functions, and every other module stays clean:

```js
// storage.js
const KEY = 'front-heaven:settings'

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { theme: 'dark', fontSize: 16 }
  } catch {
    return { theme: 'dark', fontSize: 16 }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Could not save settings:', error)
  }
}
```

One module, two functions, all the parsing, defaulting, and error handling in one place. Importers just call `loadSettings()` and `saveSettings(next)` — this is the exact shape of a storage layer, and it is how the platform you are reading this on persists its own progress. It also demonstrates the real value of modules: the file is small, testable in isolation, and its failure modes are contained.

## Modules and the app architecture

Real projects grow by module layers. **Utility modules** (`format.js`, `math.js`) — pure, importable functions. **Data modules** (`store.js`, `storage.js`) — state and persistence with the singleton-and-wrapper patterns above. **Feature modules** — each feature folder importing only what it needs. And **entry points** — the file that wires it together. The rules that make this scale are the module rules: explicit imports (nothing hidden), small files (one clear job), deliberate exports (share the public surface, hide the rest), and no circular imports (a.js importing b.js importing a.js — an error and a smell). When you reach the frameworks stage, every component, hook and store you write will use exactly these `import`/`export` statements — this lesson is the grammar of that structure.

## Real-world usage

Web storage powers the everyday web: dark-mode preferences, reading progress (this platform stores yours in `localStorage`), saved drafts in editors, recently-viewed items, dismissed banners, quiz scores, offline queues. Modules power every production codebase: package libraries export public APIs via `export`, applications import from their folders with clear paths, and bundlers compile the whole graph into deployed files. The two systems together — structure via modules, persistence via storage — are what turn "a script that runs" into "an application that remembers", which is precisely the leap this stage has been building toward.

## Common mistakes

Forgetting values must be strings — `setItem('key', 5)` stores `"5"`, and `{ object: true }` stores `"[object Object]"`; always stringify. Forgetting the parse on read and working with a string. Not handling the missing-key `null` — parse crashes on `null` unless guarded. Importing with a missing or wrong extension in the browser (the `./file.js` rule). Export/import name mismatches — typo in an import gives `undefined`, not an error. Circular imports — silently `undefined` values at load time. Storing sensitive data in storage. Writes without `try`/`catch` crashing on quota. And treating `localStorage` as a database — it is a small preference store; heavy data belongs on a server.

## Best practices

- Prefer named exports and named imports; keep one default export per module at most.
- Write explicit extensions in browser module imports; let bundlers handle frameworks.
- Keep module state at top level for singletons; export read/write functions around it.
- Stringify structured data on write; parse with a default on read.
- Wrap storage writes in `try`/`catch` (quota, privacy modes).
- Store only small, non-sensitive data; keep tokens out of storage.
- Encapsulate storage in one module — parse, defaults and errors in a single place.
- Avoid circular imports; keep modules small with a clear public surface.

## Summary

ES modules give every file its own scope with explicit sharing: named exports for common utilities, default exports for entry points, side-effect imports for setup, and module-level state as a free singleton. Web storage gives the browser a key/value store — `localStorage` for persistence, `sessionStorage` for tab lifetime — holding strings only, so structured data travels via the JSON stringify/parse pattern, guarded and defaulted. Together — modules for structure, storage for memory — they complete the JavaScript stage: from variables to data structures, from functions to async, from events to architecture.

## Practice

Split a small application into modules. Create `utils/math.js` exporting `average(...nums)` and `clamp(value, min, max)`; `utils/storage.js` exporting `load(key, fallback)` and `save(key, value)` wrapping the JSON pattern with `try`/`catch`; and `main.js` importing all three — computing an average, clamping a value, and persisting a `{ completed, updatedAt }` progress object to `localStorage`. Verify the round trip: reload the page and read the object back intact. Then test the failure modes you now own: check `localStorage.getItem('missing')` returns `null`, and confirm the stored `completed` array survives a full browser restart — you have just built, in miniature, the persistence layer of a real application.