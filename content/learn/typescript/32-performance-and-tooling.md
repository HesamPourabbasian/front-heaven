---
title: 'Performance & Tooling'
description: 'Master enterprise TypeScript compiler performance: build optimization, profiling with --extendedDiagnostics, Vite, esbuild, SWC, ESLint type-aware linting, and CI pipelines.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/31-runtime-validation
---

# Performance & Tooling

As TypeScript codebases grow beyond tens of thousands of lines of code, compilation times, editor responsiveness, and CI test pipeline durations can degrade significantly if the build toolchain is not properly optimized.

In modern frontend and backend architectures, we separate **Type Checking** from **Code Transpilation**. Tools like **esbuild**, **SWC**, and **Vite** handle sub-millisecond code emission, while **`tsc`** runs asynchronously to guarantee 100% type safety.

In this lesson, we explore how to diagnose slow compilation bottlenecks using `--extendedDiagnostics`, configure high-performance build tools, set up type-aware **ESLint** rules, and optimize CI/CD pipelines.

```text
┌────────────────────────────────────────────────────────────┐
│              Modern Dual-Speed Build Pipeline              │
├────────────────────────────────────────────────────────────┤
│ 1. Local Development (Sub-Millisecond HMR):                │
│    Vite / esbuild / SWC                                    │
│    - Fast AST Transpilation (Strips types instantly)       │
│    - Zero type checking latency in dev server              │
│                                                            │
│ 2. Background / CI Validation (Strict Type Checking):      │
│    tsc --noEmit (or vue-tsc / tsc --build)                 │
│    - Full static type verification                         │
│    - Incremental compilation via .tsbuildinfo              │
└────────────────────────────────────────────────────────────┘
```

## 1. Diagnosing Compiler Performance with `--extendedDiagnostics`

When `tsc` feels sluggish, the first step is profiling where the compiler spends its time and memory using the `--extendedDiagnostics` flag:

```bash
npx tsc --noEmit --extendedDiagnostics
```

Sample diagnostics output:
```text
Files:                         1,450
Lines of Library code:       180,412
Lines of Definitions:         95,300
Lines of TypeScript code:     62,150
Nodes:                       780,120
Identifiers:                 245,300
Symbols:                     420,100
Types:                       110,240
Memory used:                 320,450K
Assignability cache size:    120,400
Identity cache size:           5,200
I/O Read time:                 0.18s
Parse time:                    0.65s
Program time:                  0.92s
Bind time:                     0.34s
Check time:                    1.85s
Total time:                    3.11s
```

If `Lines of Library code` or `Total time` is abnormally high, check whether `skipLibCheck: true` is enabled and verify that giant deeply nested conditional types are not blowing up the `Types` count.

## 2. Key Performance Optimizations in `tsconfig.json`

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.cache/tsbuildinfo",
    "isolatedModules": true,
    "moduleResolution": "Bundler"
  },
  "exclude": [
    "node_modules",
    "dist",
    ".output",
    "coverage"
  ]
}
```

### Explanation of Performance Flags:
1. **`skipLibCheck: true`**: Skips type-checking all declaration files (`.d.ts`) inside `node_modules`. This single flag typically reduces compilation times by 50% to 70%!
2. **`incremental: true`**: Caches AST and type results between builds, enabling near-instant rebuilds.
3. **`isolatedModules: true`**: Ensures each file can be transpiled safely by single-file transpilers (esbuild, SWC, Babel) without cross-file type resolution.

## 3. Fast Transpilation: Vite, esbuild, and SWC

In modern web development, `tsc` is rarely used for development bundling. Instead:

- **Vite & esbuild**: Written in Go, esbuild transpiles TypeScript code 20x to 100x faster than traditional JavaScript-based compilers.
- **SWC**: Written in Rust, used in Next.js and NestJS for rapid transpilation.

Because esbuild and SWC strip types without evaluating type errors, developers enjoy instant sub-millisecond Hot Module Replacement (HMR) in their browsers while IDEs display real-time type warnings via the TypeScript Language Server.

## 4. Modern Linting with ESLint (`@typescript-eslint`)

ESLint complements TypeScript by enforcing code style, preventing common runtime bugs, and enforcing architectural conventions.

Using **Type-Aware Linting**, ESLint rules can inspect static types (e.g., catching unhandled Promises or floating Promises):

```javascript
// eslint.config.js (Flat Config Format)
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error", // Catches forgotten await
      "@typescript-eslint/no-explicit-any": "error",       // Bans 'any'
      "@typescript-eslint/await-thenable": "error",        // Bans awaiting non-promises
      "@typescript-eslint/strict-boolean-expressions": "warn",
    },
  },
];
```

## 5. Optimized CI/CD Pipeline Configuration

In CI/CD environments (GitHub Actions, GitLab CI), split your pipeline into parallel jobs to minimize build durations:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

jobs:
  typecheck:
    name: TypeScript Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      # Fast type check without emitting JS files
      - run: npx tsc --noEmit

  lint:
    name: ESLint & Prettier
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    name: Vitest Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
```

## Summary

- Separating type checking (`tsc --noEmit`) from transpilation (Vite/esbuild/SWC) delivers maximum local developer velocity.
- `--extendedDiagnostics` profiles compiler bottlenecks and identifies runaway type computations.
- `"skipLibCheck": true` dramatically cuts compilation times by skipping library `.d.ts` checks.
- Type-aware ESLint rules catch critical asynchronous bugs like unhandled floating Promises.
- CI/CD pipelines should run type checking, linting, and unit tests concurrently in parallel jobs.

## Best Practices

1. **Always Enable `"skipLibCheck": true`**: Prevent third-party library typings from slowing down your compilation.
2. **Use `@typescript-eslint/no-floating-promises`**: Prevent silent unhandled asynchronous promise rejections.
3. **Run `tsc --noEmit` on Pre-Commit or CI**: Guarantee that no broken types enter your main git branch.
4. **Avoid Deep Unbounded Type Recursion**: If complex type-level programming causes editor lag, introduce recursion depth counters or simplify mapped types.
