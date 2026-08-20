---
title: 'Modules'
description: 'Master JavaScript modularity: ES Modules (ESM), import and export syntax, default vs named exports, dynamic imports (import()), CommonJS (CJS), ESM vs CJS interoperability, module resolution algorithms, and resolving circular dependencies.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/19-advanced-functions
---

# Modules

As JavaScript applications scaled from simple browser scripts into complex enterprise systems, organizing code into isolated, reusable, and maintainable units became a necessity. **JavaScript Modules** provide a formal standard for encapsulating private implementation details while explicitly exporting public APIs.

Historically, the ecosystem relied on community formats like **CommonJS (CJS)** in Node.js and AMD for browsers. With ECMAScript 2015 (ES6), the official standard **ES Modules (ESM)** was established. Today, ESM is natively supported across all modern browsers and server runtimes (Node.js, Deno, Bun).

In this lesson, we will explore ES Module syntax (`import` / `export`), compare named versus default exports, master dynamic asynchronous imports (`import()`), analyze CommonJS differences and interoperability, dissect module resolution algorithms, and resolve circular dependency deadlocks.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ES Modules vs CommonJS                          │
├───────────────────┬────────────────────────────┬───────────────────────┤
│ Feature           │ ES Modules (ESM)           │ CommonJS (CJS)        │
├───────────────────┼────────────────────────────┼───────────────────────┤
│ Standard          │ Official ECMAScript (ES6)  │ Node.js Legacy Format │
│ Syntax            │ import / export            │ require / module.exports│
│ Loading           │ Asynchronous / Static AST  │ Synchronous / Runtime │
│ Tree Shaking      │ Yes (Dead-code elimination)│ Limited / No          │
│ Top-Level Await   │ Supported natively         │ No (Requires wrapper) │
│ Scope             │ Module Scope (Strict Mode) │ File Scope (Strict Opt)│
└───────────────────┴────────────────────────────┴───────────────────────┘
```

## ES Modules: Named and Default Exports

ES Modules allow modules to export values, functions, objects, and classes:
- **Named Exports**: Modules can export multiple named entities. Consumers must import them using the exact exported identifier (or alias them with `as`). Named exports enable IDE autocomplete and compiler tree-shaking.
- **Default Export**: A module can designate at most **one** default export. Consumers can import it using any arbitrary local identifier.

```javascript
// mathUtils.js - Named and Default exports
export const PI = 3.14159265359;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Default export
export default class CalculatorEngine {
  constructor() {
    this.version = "1.0.0";
  }
}
```

```javascript
// app.js - Importing from mathUtils
import CalculatorEngine, { PI, add as sumNumbers } from "./mathUtils.js";

const calc = new CalculatorEngine();
console.log(sumNumbers(10, 5)); // 15
console.log(PI);                // 3.14159265359
```

## Re-exporting and Aggregating Modules (Barrels)

A **Barrel File** (`index.js`) aggregates exports from multiple sub-modules into a single unified public entry point, simplifying consumer import paths:

```javascript
// components/index.js (Barrel Export)
export { default as Button } from "./Button.js";
export { default as Card } from "./Card.js";
export * from "./Modal.js";
```

```javascript
// Clean single import in consumer
import { Button, Card, openModal } from "./components/index.js";
```

## Dynamic Imports: `import()`

While standard `import` declarations are static and must be placed at the top level of a file, the dynamic **`import(specifier)`** function can be called conditionally anywhere in your code. It returns a **Promise** that resolves to the module namespace object.

Dynamic imports are the foundation of **Code Splitting** and **Lazy Loading**, drastically reducing initial bundle sizes by loading non-critical features only when requested by the user.

```javascript
const loadReportBtn = document.querySelector("#load-report-btn");

loadReportBtn.addEventListener("click", async () => {
  try {
    // Lazy-load charting library on demand
    const { renderChart } = await import("./analytics/chartEngine.js");
    renderChart("report-canvas");
  } catch (error) {
    console.error("Failed to load chart module:", error);
  }
});
```

## CommonJS (CJS) vs ES Modules (ESM)

In Node.js CommonJS:
- Modules are loaded synchronously using `require("module")`.
- Exports are assigned to `module.exports` or `exports`.
- `require()` evaluates the module synchronously at runtime.

In modern Node.js, setting `"type": "module"` in `package.json` enables native ESM support across `.js` files, or you can use the `.mjs` extension.

```javascript
// CommonJS (Legacy Node.js)
const fs = require("fs");
function readConfig() { /* ... */ }
module.exports = { readConfig };

// ES Module equivalent
import fs from "node:fs";
export function readConfig() { /* ... */ }
```

## Circular Dependencies and Deadlocks

A **Circular Dependency** occurs when Module A imports Module B, and Module B directly or indirectly imports Module A.

While ES Modules handle circular references gracefully via live bindings (references to variables that are evaluated when accessed rather than copied), accessing a variable from a circular module before it has been initialized will result in a Temporal Dead Zone (TDZ) `ReferenceError`.

```text
┌────────────────────────────────────────────────────────────┐
│                    Circular Dependency Loop                │
├────────────────────────────────────────────────────────────┤
│  [ Module A ] ──imports──> [ Module B ]                    │
│       ▲                          │                         │
│       └──────────imports─────────┘                         │
│  Resolution: Extract shared interface into [ Module C ]    │
└────────────────────────────────────────────────────────────┘
```

The best architectural remedy for circular dependencies is to extract the shared types or functions into an independent third module (`Module C`) that both A and B import.

## Summary

ES Modules (ESM) provide the official ECMAScript standard for JavaScript modularity. ESM uses static, top-level `import` and `export` statements that facilitate static analysis and tree shaking. Dynamic `import()` enables runtime asynchronous code splitting. CommonJS remains supported in Node.js but lacks static tree-shaking and browser compatibility. Prevent circular dependencies by refactoring shared logic into standalone leaf modules.

## Best Practices

1. **Prefer Named Exports Over Default Exports**: Named exports enforce consistent naming across large teams and improve refactoring autocomplete in IDEs.
2. **Use Dynamic `import()` for Heavy, Infrequently Used Routes**: Lazy-load admin panels, modal dialogs, and large visualization libraries.
3. **Specify Explicit File Extensions**: Always include `.js` or `.mjs` extensions in relative import paths for standards compliance.
4. **Avoid Huge Barrel Files in Performance-Critical Libraries**: Indiscriminate barrel files can defeat bundler tree-shaking and bloat output bundles.
5. **Use Node.js Protocol Prefixes**: When importing built-in Node.js modules in ESM, use the `node:` prefix (`import fs from 'node:fs'`).
