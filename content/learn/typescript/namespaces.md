---
title: 'Namespaces'
description: 'Learn how TypeScript namespaces work, namespace declarations, namespace augmentation, and when to use modern ES modules instead.'
order: 31
difficulty: 'intermediate'
category: 'Level 9 - Modules & Namespaces'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/typescript-modules
---

## What is a Namespace?

A **Namespace** (formerly called an *Internal Module* in early TypeScript versions) is a TypeScript-specific way to group logically related code, types, and functions under a single global or local identifier.

```ts
namespace Geometry {
  const PI = 3.14159 // Private to namespace

  export function calculateCircleArea(radius: number): number {
    return PI * radius * radius
  }

  export function calculateRectangleArea(width: number, height: number): number {
    return width * height
  }
}

// Accessing exported members:
const area = Geometry.calculateCircleArea(5)
```

---

## Nested Namespaces

Namespaces can be nested hierarchically to organize deep functional domains:

```ts
namespace App.Utils.Validation {
  export function isEmail(val: string): boolean {
    return val.includes('@')
  }
}

const isValid = App.Utils.Validation.isEmail('test@example.com')
```

---

## Namespace Augmentation

Just like interfaces, namespaces can merge with each other across files, or merge with existing classes and functions to attach static properties or sub-types:

```ts
// Merging a namespace with a class:
class Album {
  label: Album.AlbumLabel = new Album.AlbumLabel()
}

namespace Album {
  export class AlbumLabel {
    name: string = 'Universal Music'
  }
}

const album = new Album()
const label = new Album.AlbumLabel()
```

---

## Namespaces vs Modern ES Modules

In modern TypeScript development (especially for frontend web applications with Vite, Next.js, Nuxt, or Webpack), **ES Modules (`import`/`export`) are the official and strongly recommended standard**.

| Feature | Namespaces | ES Modules |
| :--- | :--- | :--- |
| **Standardization** | TypeScript-specific construct | ECMAScript official standard |
| **Tree-shaking** | Difficult for bundlers to optimize | Excellent tree-shaking / dead-code removal |
| **Scope** | Often attached to global scope | Purely file-scoped |
| **Tooling Support** | Legacy | Universal across modern JavaScript tooling |

### When to Use Namespaces Today:
- Writing type declaration files (`.d.ts`) for legacy UMD or global browser script libraries (like jQuery, Google Maps SDK).
- Extending third-party libraries that rely on namespace augmentation.

---

## Summary

- Namespaces group related code and types under a named container.
- Members must be prefixed with `export` to be accessible from outside the namespace.
- Namespaces can merge with same-name classes, functions, or other namespaces.
- Modern TypeScript codebases should default to ES Modules (`import/export`) for modularity and optimal tree-shaking.

## Practice

1. Declare a namespace `MathUtils` containing a private constant `PHI = 1.618` and an exported function `goldenRatio(val: number): number`.
2. Call `MathUtils.goldenRatio(10)` from outside the namespace.
3. Compare the generated JavaScript output between a namespace and an ES module.
