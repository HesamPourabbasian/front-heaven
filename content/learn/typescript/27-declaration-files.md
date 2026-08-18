---
title: 'Declaration Files'
description: 'Master TypeScript declaration files (.d.ts): ambient declarations, declare module, global augmentation, declaration merging, and publishing types to npm.'
order: 27
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/26-advanced-type-manipulation
---

# Declaration Files

In TypeScript, **Declaration Files** (ending with `.d.ts`) serve as pure type metadata containers. They contain no executable JavaScript implementation code—only type annotations, interface definitions, and function signatures. When you write standard TypeScript code, the compiler uses `.d.ts` files to understand the shapes of external libraries, global browser/Node environments, and non-code assets.

In this lesson, we explore how declaration files work, how to write **Ambient Declarations** with `declare`, perform **Module Augmentation** on existing npm packages, leverage **Declaration Merging**, and publish type-safe packages on npm.

```text
┌────────────────────────────────────────────────────────────┐
│                 Declaration Architecture (.d.ts)            │
├────────────────────────────────────────────────────────────┤
│ 1. Ambient Declarations:                                   │
│    declare const __APP_VERSION__: string;                  │
│                                                            │
│ 2. Ambient Module Definitions:                             │
│    declare module 'untyped-library' { ... }                │
│                                                            │
│ 3. Global Augmentation:                                    │
│    declare global { interface Window { ... } }             │
│                                                            │
│ 4. Module Augmentation:                                    │
│    declare module 'express' { interface Request { ... } }  │
└────────────────────────────────────────────────────────────┘
```

## The `declare` Keyword & Ambient Declarations

The `declare` keyword informs the TypeScript compiler that a variable, function, class, or object already exists in the global runtime environment (injected via HTML `<script>` tags, build-time environment variables, or platform runtimes) even though TypeScript cannot see its source file:

```typescript
// types/env.d.ts

// Declare global constants injected by Vite or Webpack at build time:
declare const __BUILD_TIMESTAMP__: string;
declare const __DEV_MODE__: boolean;

// Declare global functions injected by browser extension or SDK:
declare function ga(event: string, category: string, action: string): void;
```

Once declared with `declare`, you can reference `__BUILD_TIMESTAMP__` or `ga()` anywhere across your TypeScript project without compiler errors.

## `declare module`: Typing Untyped Libraries

When you install a legacy JavaScript package from npm that does not ship with `.d.ts` types and has no `@types/` community package on DefinitelyTyped, TypeScript reports:
`Cannot find module 'package-name' or its corresponding type declarations.`

You can create an ambient module declaration file to type the package yourself:

```typescript
// types/untyped-markdown.d.ts

declare module "untyped-markdown-parser" {
  export interface ParserOptions {
    sanitize?: boolean;
    breaks?: boolean;
  }

  export function parse(rawMarkdown: string, options?: ParserOptions): string;
  export function tokenize(rawMarkdown: string): string[];
}
```

Now, importing `"untyped-markdown-parser"` anywhere in your project provides full static typing and autocomplete!

## Global Augmentation (`declare global`)

In external module files (files containing top-level `import`/`export`), TypeScript treats declarations as scoped locally to that module. To inject properties into global interfaces (such as the browser `Window`, `NodeJS.ProcessEnv`, or `globalThis`), you use `declare global`:

```typescript
// src/types/global.d.ts

export {}; // Ensure file is treated as an ES module

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, unknown>;
    analyticsSDK?: {
      identify: (userId: string) => void;
      track: (eventName: string, properties?: object) => void;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      PORT?: string;
    }
  }
}
```

## Module Augmentation: Extending Existing Libraries

**Module Augmentation** allows you to extend the types of existing third-party packages installed in `node_modules` without editing their files directly. A ubiquitous example is adding a `user` object to the Express `Request` interface after authentication middleware executes:

```typescript
// src/types/express.d.ts
import type { UserSession } from "../models/UserSession";

// Augment the existing 'express' module
declare module "express-serve-static-core" {
  interface Request {
    currentUser?: UserSession;
    correlationId: string;
  }
}
```

Now, inside your Express route handlers, `req.currentUser` and `req.correlationId` are recognized as first-class properties!

## Declaration Merging

In TypeScript, **Declaration Merging** occurs when the compiler joins two or more separate declarations sharing the same identifier into a single definition:

### 1. Merging Interfaces
```typescript
interface Box {
  height: number;
  width: number;
}

interface Box {
  depth: number;
}

// Resulting Box interface has height, width, and depth:
const myBox: Box = { height: 10, width: 20, depth: 30 };
```

### 2. Merging Namespaces with Classes or Functions
```typescript
function buildUrl(path: string): string {
  return `${buildUrl.baseOrigin}${path}`;
}

namespace buildUrl {
  export let baseOrigin = "https://api.myapp.com";
}

buildUrl("/v1/users");
buildUrl.baseOrigin = "https://staging.myapp.com";
```

## Publishing Type Definitions on npm

When publishing a library package to npm, configure your `package.json` to point to the emitted `.d.ts` file:

```json
{
  "name": "my-typed-library",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsc --project tsconfig.build.json"
  }
}
```

In `tsconfig.build.json`, ensure `"declaration": true` and `"declarationMap": true` are enabled so `tsc` emits the `.d.ts` files into `./dist`.

## Summary

- Declaration files (`.d.ts`) contain pure type metadata stripped of runtime implementation code.
- The `declare` keyword informs the compiler of ambient variables and global functions present at runtime.
- `declare module "pkg"` provides complete type coverage for untyped third-party npm libraries.
- `declare global` injects custom properties into global namespaces (`Window`, `NodeJS.ProcessEnv`).
- Module Augmentation adds custom properties to existing library types (`Express.Request`, `FastifyRequest`).
- Declaration Merging joins multiple declarations with the same name into a unified type contract.
- The `package.json` `"types"` field connects published npm packages with their root declaration file.

## Best Practices

1. **Keep `.d.ts` Files Free of Runtime Code**: Never write executable expressions or initializers inside declaration files.
2. **Use Module Augmentation for Middleware**: Augment framework request contexts (`Express`, `Koa`, `Fastify`) to avoid unsafe `(req as any).user` casts.
3. **Always Include `declarationMap: true` When Publishing Libraries**: Declaration maps enable consumers' IDEs to jump directly to original TypeScript source lines during debugging.
4. **Isolate Global Augmentations**: Keep all `declare global` statements inside a dedicated `types/global.d.ts` file for clean project discovery.
