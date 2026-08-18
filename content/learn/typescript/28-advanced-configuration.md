---
title: 'Advanced TypeScript Configuration'
description: 'Master advanced tsconfig compiler flags: noUncheckedIndexedAccess, exactOptionalPropertyTypes, verbatimModuleSyntax, Project References, and incremental compilation.'
order: 28
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/27-declaration-files
---

# Advanced TypeScript Configuration

While basic `tsconfig.json` configurations enable standard type checking, enterprise monorepos and mission-critical production systems demand elite compiler strictness and high-speed build performance.

TypeScript includes specialized strictness flags that eliminate edge-case runtime exceptions, alongside **Project References** and **Incremental Compilation** to scale builds across massive multi-package monorepos.

```text
┌────────────────────────────────────────────────────────────┐
│              Elite Compiler Strictness Matrix              │
├────────────────────────────────────────────────────────────┤
│ Beyond "strict": true                                      │
│ - "noUncheckedIndexedAccess": true (arr[0] -> T | undefined│
│ - "exactOptionalPropertyTypes": true (prop?: T vs T | und) │
│ - "verbatimModuleSyntax": true (Enforce import type)       │
├────────────────────────────────────────────────────────────┤
│ Monorepo Project References Architecture                   │
│ Root tsconfig.json ──> references: [                       │
│   { path: './packages/core' },                             │
│   { path: './packages/ui' },                               │
│   { path: './apps/web' }                                   │
│ ]                                                          │
└────────────────────────────────────────────────────────────┘
```

## 1. Elite Strictness Flags (Beyond `"strict": true`)

Enabling `"strict": true` is the baseline, but the following optional strictness flags elevate type safety to the highest possible standard:

### `noUncheckedIndexedAccess: true`
By default in TypeScript, looking up an element in an array (`arr[i]`) or an object index signature (`obj[key]`) produces type `T`, ignoring the very real possibility that the index or key is out-of-bounds or missing at runtime.

Enabling `"noUncheckedIndexedAccess": true` causes all index access lookups to return `T | undefined`, forcing you to verify existence before use:

```typescript
const userNames: string[] = ["Ada", "Alan"];

// With "noUncheckedIndexedAccess": true
const thirdUser = userNames[2]; // Type: string | undefined (NOT string!)

// Compile Error if you try to use it directly without a guard:
// Error: 'thirdUser' is possibly 'undefined'.
// thirdUser.toUpperCase();

// Safe access:
if (thirdUser !== undefined) {
  console.log(thirdUser.toUpperCase());
}
```

### `exactOptionalPropertyTypes: true`
In standard TypeScript, an optional property `theme?: 'dark' | 'light'` can be explicitly assigned the value `undefined`: `{ theme: undefined }`. However, in JavaScript, `{}` (key absent) and `{ theme: undefined }` (key present with value undefined) behave differently in `Object.keys()` and `"theme" in obj` checks.

Enabling `"exactOptionalPropertyTypes": true` enforces that optional properties can only be omitted—they cannot be explicitly assigned `undefined` unless the type explicitly includes `| undefined`:

```typescript
interface WidgetConfig {
  title: string;
  theme?: "dark" | "light"; // Can be omitted, but cannot be assigned undefined!
}

// Compile Error under exactOptionalPropertyTypes:
// Type 'undefined' is not assignable to type '"dark" | "light"'.
// const config: WidgetConfig = { title: "Dashboard", theme: undefined };

// Valid: Property omitted completely
const validConfig: WidgetConfig = { title: "Dashboard" };
```

### `verbatimModuleSyntax: true`
Introduced in TypeScript 5.0, `verbatimModuleSyntax` replaces legacy module flags (`importsNotUsedAsValues`, `preserveValueImports`). It guarantees that:
1. Any `import` without the `type` keyword is emitted as a real JavaScript import statement.
2. Any `import type` statement is 100% erased from the emitted JS bundle.

## 2. Incremental Compilation (`incremental`)

In large projects with thousands of files, re-checking the entire repository on every minor file change is slow.

Enabling `"incremental": true` instructs `tsc` to save an incremental build graph state into a `.tsbuildinfo` cache file. On subsequent compilations, `tsc` only type-checks files that changed and their direct dependents:

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.cache/tsbuildinfo"
  }
}
```

Incremental compilation cuts local and CI compilation times by up to 80%.

## 3. Project References (`references` and `composite`)

In large monorepos (such as Nx, Turborepo, or pnpm workspaces) containing multiple packages, compiling the entire workspace as a single monolithic TypeScript program causes memory bloat and slow build times.

**Project References** allow you to divide a large repository into independent, modular TypeScript projects that depend on one another.

### Package `tsconfig.json` (Composite Project):
```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "target": "ES2022",
    "module": "NodeNext"
  },
  "include": ["src/**/*"]
}
```

### Consumer Package depending on Core:
```json
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "references": [
    { "path": "../../packages/core" }
  ],
  "include": ["src/**/*"]
}
```

### Root Monorepo `tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" }
  ]
}
```

When you run `tsc --build` (or `tsc -b`) in the root directory, TypeScript analyzes the dependency graph, compiles packages in the correct topological order, and skips re-compiling packages whose declaration outputs have not changed!

## Summary

- `"noUncheckedIndexedAccess": true` adds `undefined` to index access lookups, eliminating out-of-bounds array crashes.
- `"exactOptionalPropertyTypes": true` prevents explicitly assigning `undefined` to optional properties.
- `"verbatimModuleSyntax": true` enforces clean boundaries between value and type imports.
- `"incremental": true` uses a `.tsbuildinfo` cache to accelerate subsequent builds.
- Project References (`references` and `composite: true`) enable modular, scalable builds across enterprise monorepos.

## Best Practices

1. **Enable `"noUncheckedIndexedAccess": true`**: Essential for preventing runtime crashes when working with dynamic arrays and dictionaries.
2. **Use `"verbatimModuleSyntax": true`**: Ensure your codebase is fully compliant with native ES modules and zero-runtime type erasure.
3. **Use Project References in Monorepos**: Break multi-package repositories into composite sub-projects built via `tsc --build`.
4. **Cache `.tsbuildinfo` in CI Pipelines**: Persist the `.tsbuildinfo` cache across CI runs for ultra-fast build pipelines.
