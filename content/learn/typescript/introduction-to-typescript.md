---
title: 'Introduction to TypeScript'
description: 'Learn what TypeScript is, why it was created, how it compares to JavaScript, and how to experiment in the official TypeScript Playground.'
order: 1
difficulty: 'beginner'
category: 'Level 1 - TypeScript Fundamentals'
estimatedMinutes: 15
prerequisites: []
---

## What is TypeScript?

**TypeScript** is a statically typed, open-source programming language developed and maintained by Microsoft. It is a **syntactic superset of JavaScript**, which means that every valid JavaScript program is already a valid TypeScript program. TypeScript takes JavaScript and adds a powerful **static type system** on top of it.

```text
┌──────────────────────────────────────────────┐
│ TypeScript                                   │
│  ┌────────────────────────────────────────┐  │
│  │ Modern JavaScript (ES2022+ / ESNext)   │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ JavaScript (ES5 / ES6)           │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│  + Static Type Checking                      │
│  + Type Inference & Generics                 │
│  + Interfaces & Type Aliases                 │
└──────────────────────────────────────────────┘
```

When you write TypeScript, your browser or Node.js environment cannot execute it directly. Instead, TypeScript code is **compiled (transpiled)** down into regular JavaScript. During compilation, the TypeScript compiler checks your code for type errors, strips away all type annotations, and produces clean JavaScript that runs anywhere JavaScript runs.

## TypeScript vs JavaScript

JavaScript is **dynamically typed** and **weakly typed**. Types are associated with runtime values, not variable declarations, and type errors only surface when code actually executes:

```js
// JavaScript (runtime error)
function calculateTotal(price, taxRate) {
  return price + (price * taxRate)
}

// If someone passes a string by accident:
calculateTotal(100, "0.1") // Result: "10010" (string concatenation bug!)
```

TypeScript is **statically typed**. You declare or infer types during development, and the compiler catches type mismatches before you ever run the code:

```ts
// TypeScript (compile-time error prevention)
function calculateTotal(price: number, taxRate: number): number {
  return price + (price * taxRate)
}

// The editor immediately flags an error:
// Argument of type 'string' is not assignable to parameter of type 'number'.
calculateTotal(100, "0.1")
```

### Key Differences Comparison

| Feature | JavaScript | TypeScript |
| :--- | :--- | :--- |
| **Type System** | Dynamic (checked at runtime) | Static (checked at compile time) |
| **Error Detection** | Errors occur during runtime | Errors caught while writing code |
| **Refactoring** | Manual, risky in large codebases | Automated, safe with IDE rename & symbol search |
| **Autocomplete & IntelliSense** | Limited, relies on heuristics | Rich, instant parameter hints & property autocompletion |
| **Compilation Step** | None (interpreted / JIT compiled directly) | Compiled to plain JavaScript via `tsc`, Babel, Vite, etc. |

## TypeScript and JavaScript Interoperability

One of TypeScript’s greatest strengths is that it is not an all-or-nothing proposition. You can adopt it incrementally in existing JavaScript projects:

1. **Any valid JavaScript is valid TypeScript**: You can rename a file from `.js` to `.ts` and it will immediately compile.
2. **Gradual typing**: You can configure TypeScript to be lenient at first (e.g. using `allowJs: true` and `checkJs: false`) and enable stricter checks gradually.
3. **Consuming JS libraries**: TypeScript can consume plain JavaScript libraries through declaration files (`.d.ts`), either bundled by the library author or downloaded from DefinitelyTyped (`@types/*`).

```ts
// Importing regular JavaScript packages in TypeScript
import lodash from 'lodash' // Type definitions provided via @types/lodash
```

## The TypeScript Playground

The fastest way to test TypeScript features without setting up a local build environment is the official **TypeScript Playground** at [typescriptlang.org/play](https://www.typescriptlang.org/play).

The Playground allows you to:
- Write TypeScript in the left panel and see the emitted JavaScript output in the right panel.
- Inspect the generated `.d.ts` declaration files.
- Toggle compiler options in real time (e.g., `strict`, `target`, `module`).
- Share code snippets via URL.

```ts
interface User {
  id: number
  name: string
  isActive: boolean
}

const user: User = {
  id: 1,
  name: 'Hesam',
  isActive: true,
}

console.log(`Hello, ${user.name}!`)
```

## Summary

- TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
- It catches errors at compile time rather than runtime, offering superior developer experience, autocomplete, and refactoring tools.
- It interoperates seamlessly with JavaScript, allowing gradual adoption.
- The TypeScript Playground is the ideal sandbox for testing types and compiler settings.

## Practice

1. Open the [TypeScript Playground](https://www.typescriptlang.org/play).
2. Create a function `formatUser(name: string, age: number): string` that returns a formatted string.
3. Try passing a boolean to the `age` parameter and observe the exact compiler error emitted in the editor.
