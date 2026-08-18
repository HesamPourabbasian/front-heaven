---
title: 'Library Development'
description: 'Master authoring and publishing type-safe TypeScript npm packages: API design, dual ESM/CJS builds with tsup, package.json exports mapping, and semantic versioning.'
order: 33
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/32-performance-and-tooling
---

# Library Development

Authoring a reusable open-source library or internal corporate SDK in TypeScript requires a fundamentally different mindset than building an application. When building an application, you control all consuming code. When building a library, your types *are* your user interface—consumed by thousands of unknown developers across diverse bundlers, Node versions, and TypeScript configurations.

In this lesson, we explore how to design intuitive, ergonomic generic library APIs, build dual **ESM & CommonJS** output bundles using **`tsup`**, configure modern **`package.json` `exports` maps**, and maintain backward-compatible type contracts across Semantic Versioning (SemVer) releases.

```text
┌────────────────────────────────────────────────────────────┐
│                Modern Library Build Output                 │
├────────────────────────────────────────────────────────────┤
│ Source Code (src/index.ts)                                 │
│        │                                                   │
│        ├───> tsup / unbuild                                │
│        │                                                   │
│        ├─► dist/index.mjs       (ESM output)               │
│        ├─► dist/index.cjs       (CommonJS output)          │
│        ├─► dist/index.d.ts      (TypeScript declarations)  │
│        └─► dist/index.d.mts     (ESM declaration maps)     │
└────────────────────────────────────────────────────────────┘
```

## 1. Designing Ergonomic, Type-Safe Library APIs

When authoring a public API, prioritize inference over manual generic annotations. Callers should rarely need to type angle brackets (`<T>`) manually:

```typescript
// Good: Type parameter is automatically inferred from passed schema/object
export function createValidator<TShape extends Record<string, (val: unknown) => boolean>>(
  schema: TShape
) {
  return (input: unknown): input is { [K in keyof TShape]: any } => {
    if (typeof input !== "object" || input === null) return false;
    for (const key in schema) {
      if (!schema[key]!((input as any)[key])) return false;
    }
    return true;
  };
}

const isUser = createValidator({
  name: val => typeof val === "string",
  age: val => typeof val === "number",
});

// Callers enjoy instant type predicate narrowing without writing angle brackets!
```

## 2. Dual ESM & CommonJS Bundling with `tsup`

Modern Node.js and frontend tools use native ES Modules (`.mjs`, `import`), but millions of legacy backend services still use CommonJS (`.cjs`, `require`). A well-behaved library should support both formats seamlessly.

**`tsup`** (powered by esbuild) is the modern zero-config tool for bundling TypeScript libraries:

```bash
npm install --save-dev tsup
```

Configure `tsup.config.ts`:

```typescript
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],       // Generates both .mjs and .cjs
  dts: true,                     // Generates .d.ts declaration files
  clean: true,                   // Clean dist directory before build
  sourcemap: true,
  minify: false,                 // Libraries should avoid aggressive minification
  treeshake: true,
});
```

Add the build script to `package.json`:

```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

## 3. Configuring `package.json` Modern `exports` Map

The `"exports"` field in `package.json` defines explicit entry points and maps them to appropriate ESM, CJS, and declaration files:

```json
{
  "name": "my-awesome-sdk",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

*Crucial Rule for `exports`*: The `"types"` condition **must always be listed first** in every subpath block of the `"exports"` map so TypeScript can resolve declarations before standard runtime entry points.

## 4. Semantic Versioning and Type Compatibility

In library development, **Type Changes are Breaking Changes**:

- **PATCH Release (`1.0.1`)**: Internal bug fixes, documentation updates, performance improvements. Zero changes to public runtime APIs or type signatures.
- **MINOR Release (`1.1.0`)**: Adding new optional functions, interfaces, or generic parameters with defaults. Existing consumer code compiles with zero errors.
- **MAJOR Release (`2.0.0`)**: Removing methods, renaming properties, changing parameter orders, narrowing return types, or increasing required parameters.

If you tighten an interface (e.g., changing `theme?: string` to `theme: 'dark' | 'light'`), existing consumer code passing arbitrary strings will fail compilation. Therefore, narrowing types is always a **Major (Breaking) change**.

## Summary

- Library APIs should maximize automatic type inference to minimize caller annotation boilerplate.
- `tsup` bundles TypeScript libraries into dual ESM (`.js`/`.mjs`) and CommonJS (`.cjs`) outputs with matching `.d.ts` declarations.
- Modern `package.json` `"exports"` maps provide explicit entry points with `"types"` listed first.
- In Semantic Versioning, any change that causes previously valid consumer TypeScript code to fail compilation constitutes a Major breaking release.

## Best Practices

1. **Always Put `"types"` First in `package.json` `exports`**: Ensure all bundlers and TypeScript compilers locate your `.d.ts` declaration entry points first.
2. **Ship Source Maps with Declarations**: Enable `declarationMap: true` in your build config so consumers' IDEs jump to original source files.
3. **Use `are-the-types-wrong` CLI (attw)**: Run `npx @are-the-types-wrong/cli --pack` in CI to detect CommonJS/ESM module resolution export mismatches before publishing.
4. **Never Expose Internal Private Utility Types**: Only export types intended for public consumer use from your root `index.ts`.
