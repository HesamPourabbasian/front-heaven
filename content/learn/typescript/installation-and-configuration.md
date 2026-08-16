---
title: 'Installation & Configuration'
description: 'Master TypeScript project setup, tsconfig.json configuration, strict mode flags, and essential compiler options.'
order: 3
difficulty: 'beginner'
category: 'Level 1 - TypeScript Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/running-typescript
---

## Installing TypeScript

TypeScript can be installed locally in a project (recommended) or globally on your system.

### Local Installation (Recommended)
Installing TypeScript as a project `devDependency` ensures that everyone on your team uses the exact same compiler version:

```bash
# Using npm
npm install -D typescript

# Using pnpm
pnpm add -D typescript

# Using yarn
yarn add -D typescript
```

### Global Installation
You can also install TypeScript globally to access the `tsc` command anywhere on your machine:

```bash
npm install -g typescript
tsc --version
```

## Initializing `tsconfig.json`

The `tsconfig.json` file resides at the root of your project directory. It marks the directory as the root of a TypeScript project and specifies the compiler flags, module settings, and file inclusion patterns.

To generate a starter `tsconfig.json` file with detailed comments, run:

```bash
npx tsc --init
```

## Structure of `tsconfig.json`

A standard `tsconfig.json` consists of `compilerOptions`, `include`, and `exclude` blocks:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Essential Compiler Options Explained

### 1. `target`
Specifies the target JavaScript version emitted by the compiler (e.g., `ES5`, `ES6/ES2015`, `ES2020`, `ES2022`, `ESNext`). Modern browsers and Node.js versions support `ES2022` or `ESNext`.

### 2. `module` and `moduleResolution`
Controls how modules are emitted and resolved:
- `module`: Options include `CommonJS`, `ESNext`, `NodeNext`, or `Preserve`.
- `moduleResolution`: Specifies the lookup strategy (e.g., `NodeNext` for modern Node.js ESM/CJS, or `Bundler` when using Vite/Webpack).

### 3. `strict`
Enables a broad suite of strict type-checking behaviors. **Always keep `strict: true` in new projects**. It includes:
- `noImplicitAny`: Raises an error on expressions and declarations with an implied `any` type.
- `strictNullChecks`: Ensures `null` and `undefined` are not assignable to other types unless explicitly typed.
- `strictFunctionTypes`: Enforces stricter checking of function parameter bivariance.
- `strictBindCallApply`: Enforces strict types on `bind`, `call`, and `apply` methods.
- `noImplicitThis`: Raises an error when `this` has an implicit `any` type.
- `alwaysStrict`: Emits `"use strict"` in all output files.

### 4. `rootDir` and `outDir`
- `rootDir`: The root directory of your input TypeScript source files (e.g., `./src`).
- `outDir`: The output folder where compiled JavaScript and declaration files are emitted (e.g., `./dist`).

### 5. `declaration` and `sourceMap`
- `declaration`: Emits corresponding `.d.ts` type declaration files for distribution as a library.
- `sourceMap`: Generates `.js.map` source maps so you can debug original `.ts` source files in browser DevTools or VS Code.

### 6. `skipLibCheck`
Skips type checking of all declaration files (`.d.ts`) found in `node_modules`. This drastically speeds up compilation times without sacrificing your own project's type safety.

## Configuration for Modern Frontend (Vite / Next.js / Nuxt)

In modern frontend projects bundled by Vite or similar tools, TypeScript is used solely for type checking rather than transpiling files. In this setup, `moduleResolution` is set to `"Bundler"` and `noEmit` is set to `true`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "jsx": "preserve"
  },
  "include": ["src/**/*"]
}
```

## Summary

- Install TypeScript locally with `npm install -D typescript`.
- Initialize a configuration file with `npx tsc --init`.
- `tsconfig.json` dictates target JavaScript versions, module resolution, build paths, and strictness rules.
- Always enable `"strict": true` for robust type safety.
- For bundler-driven setups (Vite/Nuxt/Next), use `"moduleResolution": "Bundler"` and `"noEmit": true`.

## Practice

1. Initialize a new folder, create a `package.json`, and install `typescript` as a dev dependency.
2. Run `npx tsc --init` and locate `target`, `rootDir`, `outDir`, and `strict` in the generated file.
3. Configure `rootDir` as `"./src"` and `outDir` as `"./dist"`. Place a test file in `src/app.ts` and run `npx tsc` to verify the compiled output appears in `dist/app.js`.
