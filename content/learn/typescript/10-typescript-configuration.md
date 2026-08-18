---
title: 'TypeScript Configuration'
description: 'Master tsconfig.json compiler settings: target, module, strict mode flags, rootDir, outDir, include/exclude, source maps, and declaration files (.d.ts).'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/typescript/01-typescript-fundamentals
---

# TypeScript Configuration

The TypeScript compiler (`tsc`) is highly configurable. The `tsconfig.json` file in the root of a project defines the compiler options, project boundaries, module resolution strategies, and file inclusion/exclusion rules. A properly configured `tsconfig.json` is the backbone of a reliable, high-performance TypeScript project.

In this lesson, we will deconstruct the most critical compiler options, understand how TypeScript emits modern JavaScript, configure source maps for browser and Node debugging, and generate `.d.ts` declaration files for library distribution.

```text
┌────────────────────────────────────────────────────────────┐
│                    tsconfig.json Architecture              │
│                                                            │
│  {                                                         │
│    "compilerOptions": {                                    │
│      "target": "ES2022",           <── JS output version   │
│      "module": "NodeNext",         <── Module system       │
│      "strict": true,               <── Strict type checks  │
│      "rootDir": "./src",           <── TS source folder    │
│      "outDir": "./dist",           <── Emitted JS folder   │
│      "sourceMap": true,            <── Debugging maps      │
│      "declaration": true           <── .d.ts typings       │
│    },                                                      │
│    "include": ["src/**/*"],        <── Files to compile    │
│    "exclude": ["node_modules"]     <── Files to ignore     │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
```

## `target`: Setting the JavaScript Output Version

The `"target"` option specifies the ECMAScript target version for emitted JavaScript. TypeScript will downlevel newer syntax (such as arrow functions, `async/await`, class fields, or template literals) into equivalent older JavaScript constructs if a legacy target is specified:

- `"ES5"`: Legacy JavaScript for archaic browsers (generates verbose prototype functions and IIFEs).
- `"ES6"` / `"ES2015"`: Standard modern JavaScript baseline (native Promises, Classes, `let`/`const`).
- `"ES2020"` / `"ES2022"`: Contemporary Node.js and modern evergreen browsers (native Optional Chaining, Nullish Coalescing, Top-level `await`).
- `"ESNext"`: The absolute latest ECMAScript features supported by the compiler.

```json
{
  "compilerOptions": {
    "target": "ES2022"
  }
}
```

*Rule of Thumb*: For modern web applications bundled with Vite or Next.js, or backend services running on Node.js 18+, set `"target": "ES2022"` to minimize bundle size and retain native performance optimizations.

## `module` and `moduleResolution`

The `"module"` setting controls how module import/export statements are emitted in the resulting JavaScript files:

- `"CommonJS"`: Traditional Node.js `require()` / `module.exports` format.
- `"ESNext"` / `"ES2022"`: Standard ECMAScript `import` / `export` statements (used with bundlers like Vite, Rollup, or Webpack).
- `"NodeNext"` / `"Node16"`: Modern Node.js standard supporting native ESM alongside CommonJS with strict file extension requirements (`.ts`, `.mts`, `.cts`).

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

## `strict` Mode and Its Constituent Flags

Setting `"strict": true` acts as a master toggle that turns on a broad suite of strict type-checking behaviors. In modern professional TypeScript projects, strict mode should **always** be enabled:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

When `"strict": true` is enabled, it automatically turns on the following critical sub-flags:

1. **`noImplicitAny`**: Raises errors whenever TypeScript cannot infer a type and defaults to `any` (e.g., untyped function parameters).
2. **`strictNullChecks`**: Treats `null` and `undefined` as distinct types rather than allowing them to be assigned to arbitrary strings or numbers.
3. **`strictFunctionTypes`**: Enables strict bivariant checking of function parameter types.
4. **`strictBindCallApply`**: Checks that `call`, `bind`, and `apply` methods are invoked with correct parameter arguments.
5. **`strictPropertyInitialization`**: Ensures all declared class properties are initialized in the constructor.
6. **`noImplicitThis`**: Raises errors when the `this` keyword is used in a context with an implicit `any` type.
7. **`useUnknownInCatchVariables`**: Types caught error objects in `catch(err)` blocks as `unknown` instead of `any`.

## `rootDir` and `outDir`: Structuring Build Output

- **`rootDir`**: Specifies the root folder of your TypeScript source files (usually `"./src"`). TypeScript uses this to mirror your source directory structure inside the output folder.
- **`outDir`**: Specifies the target output directory where compiled `.js`, `.js.map`, and `.d.ts` files will be placed (typically `"./dist"` or `"./build"`).

```text
Project Structure:
my-app/
├── tsconfig.json
├── src/                      <── rootDir
│   ├── index.ts
│   └── utils/
│       └── math.ts
└── dist/                     <── outDir (Emitted output)
    ├── index.js
    └── utils/
        └── math.js
```

## `include` and `exclude`

The `"include"` and `"exclude"` arrays control which files the TypeScript compiler includes in its program:

- **`include`**: An array of glob patterns specifying files to compile.
- **`exclude`**: An array of glob patterns specifying files or folders to skip.

```json
{
  "include": [
    "src/**/*",
    "types/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

*Important*: The `"exclude"` option only prevents files from being included as root entry points; if an included file explicitly imports an excluded file, TypeScript will still process it to ensure type safety.

## Source Maps (`sourceMap`)

When TypeScript code is transpiled into JavaScript and executed in Chrome DevTools or a Node.js debugger, line numbers and variable names in the compiled JS often differ from your original `.ts` source.

Enabling `"sourceMap": true` emits `.js.map` JSON files that allow debuggers to map runtime execution breakpoints and stack traces directly back to your original `.ts` source files:

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

## Declaration Files (`declaration` and `declarationMap`)

When you build a reusable library or package to publish on npm, consumers need TypeScript type information without needing your original `.ts` source files.

- **`declaration: true`**: Instructs `tsc` to emit `.d.ts` declaration files containing only type signatures and interfaces (with all implementation bodies removed).
- **`declarationMap: true`**: Generates source maps for `.d.ts` files, enabling IDE features like "Go to Definition" to jump directly to the original TypeScript source code instead of compiled `.d.ts` stubs.

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

## Summary

- `tsconfig.json` orchestrates compiler targets, module systems, output locations, and type-checking strictness.
- `"target"` specifies the emitted ECMAScript version (e.g., `"ES2022"` for modern runtimes).
- `"module"` and `"moduleResolution"` control how imports and exports are processed (prefer `"NodeNext"` for modern Node or `"ESNext"` with bundlers).
- `"strict": true` enables strict checks (`noImplicitAny`, `strictNullChecks`, `strictPropertyInitialization`).
- `"rootDir"` and `"outDir"` cleanly separate TypeScript source code (`./src`) from compiled artifacts (`./dist`).
- `"sourceMap": true` allows seamless step-through debugging of TypeScript in browsers and debuggers.
- `"declaration": true` produces `.d.ts` type definition files for library distribution.

## Best Practices

1. **Always enable `"strict": true`**: Do not compromise on strict mode; it catches the overwhelming majority of silent JavaScript bugs.
2. **Enable `"noUncheckedIndexedAccess": true`**: Adds `undefined` to index access lookups (`arr[0]`), eliminating out-of-bounds runtime crashes.
3. **Use `"skipLibCheck": true`**: Speeds up compilation times significantly by skipping full type checks on all `.d.ts` files inside `node_modules`.
4. **Use `"esModuleInterop": true`**: Enables seamless default imports from CommonJS modules (e.g., `import express from 'express'`).
