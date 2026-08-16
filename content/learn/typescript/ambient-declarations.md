---
title: 'Ambient Declarations'
description: 'Master ambient modules, global augmentation, declaration files (.d.ts), and DefinitelyTyped (@types/*) packages.'
order: 32
difficulty: 'advanced'
category: 'Level 9 - Modules & Namespaces'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/namespaces
---

## What is an Ambient Declaration?

When using third-party JavaScript libraries or global browser objects injected at runtime (like analytics scripts or environment variables), TypeScript has no way of knowing their types unless you tell it.

An **Ambient Declaration** uses the `declare` keyword to inform TypeScript that a variable, function, or module exists in the runtime environment, without providing an implementation:

```ts
// Informs TS that a global variable 'analytics' is available at runtime:
declare const analytics: {
  track(event: string, properties?: Record<string, any>): void
}

// Now you can safely call it in your app:
analytics.track('page_view', { page: '/learn/typescript' })
```

---

## 1. Declaration Files (`.d.ts`)

A file ending with `.d.ts` is a **Type Declaration File**. It contains *only* type information and produces zero compiled JavaScript code.

### Declaring Non-Code Assets (Images, CSS Modules)
When importing assets like `.png`, `.svg`, or `.module.css` in frontend projects, TypeScript requires ambient module declarations in an `env.d.ts` or `globals.d.ts` file:

```ts
// env.d.ts
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
```

Now importing images and CSS modules works seamlessly:
```ts
import logo from './logo.svg'
import styles from './Button.module.css'
```

---

## 2. Declaring Untyped Third-Party Modules

If you install a legacy JavaScript package without built-in types or DefinitelyTyped definitions:

```ts
// shims-legacy.d.ts
declare module 'untyped-package' {
  export function doSomething(input: string): boolean
  export const version: string
}
```

---

## 3. Global Augmentation (`declare global`)

You can augment built-in global objects (such as `window`, `process.env`, or `Document`) inside an ES module by wrapping declarations in `declare global`:

```ts
// globals.d.ts
export {} // Ensures file is treated as a module

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, any>
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_SECRET_KEY: string
      PORT?: string
    }
  }
}

// Inside your application:
if (window.__INITIAL_STATE__) {
  console.log(window.__INITIAL_STATE__)
}
```

---

## 4. DefinitelyTyped (`@types/*`)

**DefinitelyTyped** is a massive community-driven repository containing type definitions for thousands of JavaScript libraries. When you install an npm package that does not bundle its own types, you can install its companion `@types` package as a `devDependency`:

```bash
npm install lodash
npm install -D @types/lodash
```

TypeScript automatically discovers all `@types/*` packages located in `node_modules/@types` during compilation.

---

## Summary

- Use `declare` to describe variables, functions, and objects that exist at runtime from external scripts.
- `.d.ts` declaration files supply type definitions without emitting JavaScript.
- Declare ambient module shims for assets like `.svg`, `.png`, and `.module.css`.
- Use `declare global` to safely augment the `Window` and `ProcessEnv` interfaces.
- Install companion type packages from DefinitelyTyped (`@types/*`) for untyped npm dependencies.

## Practice

1. Create a file `globals.d.ts` that adds a custom property `gtag` to the global `Window` interface.
2. Add an ambient module declaration for `*.json` files.
3. Test referencing `window.gtag` in a TypeScript file without compiler errors.
