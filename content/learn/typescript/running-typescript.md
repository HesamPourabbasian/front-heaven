---
title: 'Running TypeScript'
description: 'Learn how to execute TypeScript code using the tsc compiler, ts-node, and modern runtime alternatives like tsx and Bun.'
order: 2
difficulty: 'beginner'
category: 'Level 1 - TypeScript Fundamentals'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/introduction-to-typescript
---

## Why TypeScript Needs a Runner

Browsers and standard Node.js engines do not natively understand TypeScript syntax (type annotations, interfaces, enums, etc.). To execute TypeScript code, you have two primary strategies:

1. **Ahead-of-Time Compilation (AOT)**: Compile `.ts` files into `.js` files using the TypeScript compiler (`tsc`), then execute the resulting JavaScript with Node.js or in a browser.
2. **On-the-Fly Execution (JIT/Transpilation)**: Use execution tools like `ts-node`, `tsx`, or modern runtimes (e.g. Bun, Deno) that transpile TypeScript in-memory on the fly.

## Compiling with `tsc`

The official TypeScript compiler is `tsc`. When you run `tsc`, it reads your TypeScript files, checks for type errors, and outputs corresponding JavaScript files.

### 1. Compiling a single file
```bash
# Compile index.ts into index.js
npx tsc index.ts
```

If you have `index.ts`:
```ts
// index.ts
const greeting: string = 'Welcome to TypeScript!'
console.log(greeting)
```

Running `npx tsc index.ts` generates `index.js`:
```js
// index.js (types are stripped)
var greeting = 'Welcome to TypeScript!';
console.log(greeting);
```

You can then run the output file with Node.js:
```bash
node index.js
```

### 2. Watch mode (`--watch` or `-w`)
During development, running `tsc` manually after every change is slow. Use watch mode to automatically recompile whenever files change:

```bash
npx tsc --watch
```

### 3. Type-checking only (`--noEmit`)
If you use a bundler like Vite, esbuild, or SWC that handles JavaScript transpilation quickly, you can use `tsc` solely for type-checking:

```bash
npx tsc --noEmit
```

## Running Directly with `ts-node`

`ts-node` is a TypeScript execution engine and REPL for Node.js that transforms TypeScript into JavaScript on the fly, allowing you to run `.ts` files directly without an explicit compile step:

```bash
# Execute index.ts directly
npx ts-node index.ts
```

### Starting the Interactive REPL
You can start an interactive TypeScript REPL by running:
```bash
npx ts-node
```

Inside the REPL, you can test TypeScript expressions immediately:
```text
> const add = (a: number, b: number): number => a + b;
undefined
> add(5, 10)
15
```

## Modern Alternatives: `tsx` and Native Engines

While `ts-node` is standard, modern development workflows often use faster alternatives:

### 1. `tsx` (TypeScript Execute)
`tsx` is powered by `esbuild`. It is significantly faster than `ts-node` and works seamlessly with ES Modules (ESM) and CommonJS (CJS):

```bash
# Run a file with tsx
npx tsx src/index.ts

# Run in watch mode
npx tsx watch src/index.ts
```

### 2. Native TypeScript Engines (Bun & Deno)
Runtimes like **Bun** and **Deno** execute TypeScript files natively out of the box without any third-party packages:

```bash
# Running TypeScript with Bun
bun run index.ts

# Running TypeScript with Deno
deno run index.ts
```

## Summary

- Browsers and standard Node.js execute JavaScript, not TypeScript.
- `tsc` is the official compiler that turns `.ts` files into `.js` files.
- `tsc --watch` automatically recompiles files upon save, and `tsc --noEmit` performs type-checking without writing files.
- `ts-node` and `tsx` allow on-the-fly execution during development.
- Modern runtimes like Bun and Deno execute TypeScript directly.

## Practice

1. Create a simple `math.ts` file with a typed function `multiply(x: number, y: number): number`.
2. Compile it using `npx tsc math.ts` and inspect the generated `math.js` output file.
3. Run the TypeScript file directly using `npx tsx math.ts` or `npx ts-node math.ts`.
