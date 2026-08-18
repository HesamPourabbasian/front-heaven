---
title: 'Modules'
description: 'Master TypeScript module systems: ES Modules, CommonJS, named and default exports, type-only imports, path aliases, module resolution, and ambient declarations.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/16-classes-and-oop
---

# Modules

In modern software development, applications are divided into independent, cohesive files called **Modules**. In TypeScript, just like in modern ECMAScript, any file containing a top-level `import` or `export` statement is treated as a module. Files without import or export statements are treated as global scripts whose declarations pollute the global scope.

In this lesson, we explore how TypeScript models ES Modules and CommonJS, deep-dive into **Type-Only Imports and Exports**, configure **Path Aliases**, master modern **Module Resolution** algorithms (`NodeNext` and `Bundler`), and create **Ambient Module Declarations**.

```text
┌────────────────────────────────────────────────────────────┐
│                    Module System Overview                  │
├──────────────────────────────┬─────────────────────────────┤
│ ES Modules (Native Standard) │ CommonJS (Legacy Node)      │
│ import { User } from './u'   │ const { User } = require()  │
│ export const api = ...       │ module.exports = ...        │
├──────────────────────────────┴─────────────────────────────┤
│ Type-Only Imports (Erased at compile-time with 0 JS bytes) │
│ import type { UserProfile, Config } from './models'        │
├────────────────────────────────────────────────────────────┤
│ Path Aliases (Configured in tsconfig.json)                 │
│ import { Button } from '@/components/Button'               │
└────────────────────────────────────────────────────────────┘
```

## ES Modules: Named and Default Exports

TypeScript natively supports standard ECMAScript Module (ESM) syntax:

### Named Exports
Named exports allow you to export multiple variables, functions, interfaces, or classes from a single file:

```typescript
// src/utils/math.ts
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export interface CalculationOptions {
  precision: number;
}
```

```typescript
// src/index.ts
import { add, PI, CalculationOptions } from "./utils/math";
```

### Default Exports
A module can specify a single default export:

```typescript
// src/services/Logger.ts
export default class Logger {
  public log(msg: string) {
    console.log(`[LOG]: ${msg}`);
  }
}
```

```typescript
// src/index.ts
import Logger from "./services/Logger";
```

*Best Practice*: Prefer **named exports** over default exports across your codebase. Named exports provide instant, unambiguous IDE autocomplete and make refactoring seamless.

## Type-Only Imports (`import type`) and Type-Only Exports

When you import an interface or a type alias, that type only exists at compile time. In emitted JavaScript, the type is completely stripped away.

However, if you import both values and types using standard `import`, bundlers or transpilers without full type checkers (like Babel, Vite, SWC, or esbuild) might retain empty import statements, causing runtime issues or circular dependency bugs.

TypeScript provides **Type-Only Imports** (`import type`) and **Type-Only Exports** (`export type`):

```typescript
// Type-only import guarantees 100% erasure in emitted JavaScript
import type { UserProfile, AccountSettings } from "./types/user";

// Inline type-only specifiers (TypeScript 4.5+):
import { fetchUserData, type ApiRequestConfig } from "./api/client";

// Type-only export:
export type { UserProfile, AccountSettings };
```

Enabling `"verbatimModuleSyntax": true` in `tsconfig.json` forces all non-value imports to use `import type`, ensuring clean, predictable code emission.

## Module Resolution Strategies: `NodeNext` vs `Bundler`

The `"moduleResolution"` setting in `tsconfig.json` dictates how TypeScript maps an import path (`import x from './utils'`) to an actual file on disk:

1. **`"NodeNext"` / `"Node16"`**: The official standard for modern Node.js applications. It strictly enforces relative file extensions in relative imports (`import { util } from './util.js'`) matching Node's native ESM rules.
2. **`"Bundler"`**: Designed for frontend applications bundled with tools like Vite, Nuxt, Next.js, or Webpack. It permits extensionless imports (`import { util } from './util'`) and honors package.json `exports` subpaths.

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

## Path Aliases (`paths` and `baseUrl`)

In large nested directory structures, relative import paths like `../../../../components/Button` are fragile and ugly. TypeScript supports **Path Aliases** via the `paths` compiler option:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

With path aliases configured, imports become clean and absolute relative to the project root:

```typescript
import { Button } from "@components/Button";
import { formatDate } from "@utils/date";
```

*Note*: TypeScript path aliases only inform `tsc` how to type-check paths; your bundler (Vite, Webpack) must also be configured with matching aliases.

## Declaration Files (`.d.ts`)

A **Declaration File** (`.d.ts`) contains only type annotations, interfaces, and function signatures with no executable runtime JavaScript implementation code.

Declaration files are used to:
1. Provide types for third-party JavaScript libraries published without native TypeScript support (such as `@types/lodash`, `@types/node`).
2. Distribute types alongside compiled JavaScript packages on npm.

```typescript
// types/global.d.ts
declare interface Window {
  analyticsTracker?: {
    trackEvent: (name: string, payload: Record<string, unknown>) => void;
  };
}
```

## Ambient Module Declarations (`declare module`)

When importing non-code assets (such as `.svg`, `.png`, `.css` files) or third-party untyped npm packages, TypeScript will report an error (`Cannot find module '...'`) unless an **Ambient Module Declaration** is defined:

```typescript
// types/assets.d.ts

// Declare SVG asset imports as string URLs or components
declare module "*.svg" {
  const content: string;
  export default content;
}

// Declare PNG image imports
declare module "*.png" {
  const src: string;
  export default src;
}

// Declare an untyped legacy npm module
declare module "legacy-untyped-analytics" {
  export function init(apiKey: string): void;
  export function sendEvent(name: string): void;
}
```

## Summary

- Any file with an `import` or `export` is an isolated module in TypeScript.
- Named exports offer superior autocomplete and refactoring ergonomics compared to default exports.
- `import type` and `export type` ensure compile-time types are completely stripped from emitted JavaScript bundles.
- `"moduleResolution": "Bundler"` is the modern standard for Vite/Next.js/Nuxt projects; `"NodeNext"` is standard for modern Node.js.
- Path aliases (`@/*`) replace long relative paths (`../../`) with clean root-relative paths.
- `.d.ts` declaration files distribute type information without shipping TypeScript source code.
- Ambient module declarations (`declare module "*.svg"`) provide type definitions for non-code assets and untyped libraries.

## Best Practices

1. **Use `import type` for Type-Only Imports**: Keep emitted JavaScript bundles lean by explicitly marking type imports with `import type`.
2. **Standardize on Named Exports**: Ban default exports in team style guides to avoid inconsistent import naming across files.
3. **Configure Path Aliases**: Use `@/*` or `~/*` for clean imports across frontend components and shared utilities.
4. **Use `"verbatimModuleSyntax": true`**: Enforce strict separation between value imports and type imports across your codebase.
