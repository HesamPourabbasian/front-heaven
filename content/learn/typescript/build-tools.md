---
title: 'Build Tools'
description: 'Master TypeScript compilation pipelines, project references, Vite, tsup, SWC, esbuild, and modern build architectures.'
order: 36
difficulty: 'intermediate'
category: 'Level 10 - Tooling & Ecosystem'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/useful-packages
---

## TypeScript in Modern Build Pipelines

Historically, `tsc` handled both **type checking** and **code transpilation**.

In modern frontend and backend architectures, these roles are often separated for optimal speed:
1. **Transpiler / Bundler** (e.g., Vite, esbuild, SWC, Turbopack, Rollup): Strips TypeScript types and bundles code in milliseconds.
2. **Type Checker** (`tsc --noEmit` or `vue-tsc`): Runs type checking in background watch mode or during CI/CD workflows.

```text
┌─────────────────────────────────────────────────────────────┐
│ Developer Writes TypeScript (.ts / .tsx)                    │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼ (Fast Transpile)              ▼ (Static Type Check)
    ┌──────────────────────┐        ┌──────────────────────┐
    │ Vite / esbuild / SWC │        │     tsc --noEmit     │
    └──────────┬───────────┘        └──────────┬───────────┘
               ▼                               ▼
       Runs in Browser                 Validates Types &
       or Node.js Runtime              Catches Build Errors
```

---

## 1. Fast Library Bundling with `tsup`

**`tsup`** is an esbuild-powered zero-config bundler that compiles TypeScript packages to ESM and CommonJS formats with `.d.ts` declaration files:

```bash
npm install -D tsup
```

In `package.json`:
```json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --watch --dts"
  }
}
```

---

## 2. Frontend Bundling with Vite

**Vite** handles TypeScript out of the box using `esbuild`. It provides instant hot-module replacement (HMR):

- `vite.config.ts`: Configures plugins, aliases, and build targets.
- For type checking during builds, modern projects use `npm run build` scripts that run type checkers before the bundler:

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && vite build"
  }
}
```

---

## 3. Project References (`tsc --build`)

In large monorepos (pnpm workspaces, Turborepo, Nx), compiling every file from scratch is slow. TypeScript **Project References** divide a large codebase into smaller, independently compiled projects:

```json
// packages/utils/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

In the root `tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/api" },
    { "path": "./packages/web" }
  ]
}
```

Build all packages incrementally:
```bash
npx tsc --build --verbose
```

---

## 4. SWC (Speedy Web Compiler)

**SWC** is a Rust-based platform for compilation and bundling that is up to 20x faster than Babel. It is used inside Next.js and NestJS.

---

## Summary

- Modern workflows separate type-checking (`tsc --noEmit`) from fast transpilation (Vite / esbuild / SWC).
- `tsup` provides zero-config bundling for TypeScript npm libraries with automatic `.d.ts` generation.
- Project references (`composite: true`, `tsc --build`) optimize compilation in monorepo workspaces.
- Always run `tsc --noEmit` in CI pipelines to prevent broken types from reaching production.

## Practice

1. Configure a `package.json` script `"typecheck": "tsc --noEmit"`.
2. Introduce an intentional type error into a `.ts` file and run `npm run typecheck` to verify the error is reported.
3. Fix the error and verify `typecheck` exits cleanly with code 0.
