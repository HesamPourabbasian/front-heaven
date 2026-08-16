---
title: 'TypeScript Modules'
description: 'Learn how TypeScript handles ES Modules, explicit type imports with import type, export patterns, and CommonJS interoperability.'
order: 30
difficulty: 'intermediate'
category: 'Level 9 - Modules & Namespaces'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/template-literal-types
---

## Modules in Modern TypeScript

In modern TypeScript, any file containing a top-level `import` or `export` is treated as a **Module**. Variables, functions, classes, and types declared inside a module are scoped locally to that file and are not visible in the global scope unless explicitly exported.

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

export const PI = 3.14159
```

```ts
// app.ts
import { add, PI } from './math'

console.log(add(10, 5))
```

---

## 1. Exporting Types and Interfaces

You can export types, interfaces, and values using standard `export` statements or inline export lists:

```ts
// types.ts
export interface User {
  id: string
  name: string
}

export type UserRole = 'admin' | 'editor' | 'member'
```

---

## 2. Explicit Type Imports: `import type`

TypeScript 3.8 introduced **Type-Only Imports** (`import type`). Type-only imports guarantee that the imported construct is **completely erased** during compilation and will never emit an actual JavaScript `require()` or `import` at runtime:

```ts
// Explicit type-only import:
import type { User, UserRole } from './types'

// Inline type import (TS 4.5+):
import { calculateTotal, type CartItem, type Order } from './checkout'
```

### Why `import type` Matters:
- **Zero bundle footprint**: Prevents accidental bundling of unused runtime code.
- **Solves circular dependency crashes**: Circular type dependencies are stripped completely during compilation, preventing runtime `undefined` module errors.
- **Works with transpile-only compilers**: Tools like Babel, esbuild, and SWC process one file at a time; `import type` ensures they know which imports can be safely removed.

---

## 3. Re-Exporting (`export *` and `export type *`)

You can create "barrel files" (such as `index.ts`) to aggregate exports from multiple sub-modules:

```ts
// components/index.ts
export * from './Button'
export * from './Card'
export * from './Modal'
export type * from './types' // Re-export only types (TS 4.5+)
```

---

## 4. ES Modules vs CommonJS Interoperability

In Node.js projects, TypeScript bridges the gap between ES Modules (`import/export`) and CommonJS (`module.exports / require`) using `esModuleInterop: true`:

```ts
// With "esModuleInterop": true in tsconfig.json
import express from 'express' // Works seamlessly with CommonJS default export
import path from 'node:path'
```

---

## Summary

- Files with top-level `import` or `export` are treated as modular scopes.
- Use `import type` for type-only imports to guarantee 100% dead-code elimination at compile time.
- Re-export modules via barrel files for clean public package APIs.
- Enable `esModuleInterop: true` in `tsconfig.json` for effortless CommonJS library consumption.

## Practice

1. Create a `types/user.ts` file exporting an interface `UserProfile`.
2. Create an `api/user.ts` file that uses `import type { UserProfile } from '../types/user'` to type a function `fetchProfile()`.
3. Create an `index.ts` barrel file that re-exports all members from both files.
