---
title: 'The satisfies Operator'
description: 'Master the satisfies operator (TypeScript 4.9+) to validate that an expression matches a type without losing its specific inferred type.'
order: 13
difficulty: 'intermediate'
category: 'Level 3 - Type Manipulation'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/type-operators
---

## The Problem with Type Annotations

Prior to TypeScript 4.9, when you wanted to validate that an object conformed to a certain contract, you wrote an explicit type annotation:

```ts
type RGB = [red: number, green: number, blue: number]
type Color = string | RGB

interface Palette {
  [colorName: string]: Color
}

// Problem: Explicit type annotation widens every value to 'Color' (string | RGB)
const palette: Palette = {
  primary: '#6366f1',
  accent: [14, 165, 233],
}

// Error: Property 'toUpperCase' does not exist on type 'Color'.
// Property 'toUpperCase' does not exist on type 'RGB'.
// palette.primary.toUpperCase()
```

Because `palette` was annotated with `Palette`, TypeScript forgot that `primary` was specifically a `string` and `accent` was specifically a tuple `[number, number, number]`.

---

## Enter `satisfies`

The `satisfies` operator validates that an expression conforms to a type definition **without changing or widening the resulting type of that expression**:

```ts
type RGB = [red: number, green: number, blue: number]
type Color = string | RGB

const palette = {
  primary: '#6366f1',
  accent: [14, 165, 233],
} satisfies Record<string, Color>

// Now TypeScript KNOWS palette.primary is a string:
console.log(palette.primary.toUpperCase()) // Valid!

// And TypeScript KNOWS palette.accent is a tuple:
console.log(palette.accent[0]) // Valid!
```

If you introduce an invalid property type or a typo, `satisfies` catches it immediately:

```ts
const badPalette = {
  primary: '#6366f1',
  accent: true, // Error: Type 'boolean' is not assignable to type 'Color'.
} satisfies Record<string, Color>
```

---

## Validating Exact Property Names with `satisfies`

Another major benefit of `satisfies` is ensuring that all required keys of a known configuration exist without losing autocomplete for other custom properties:

```ts
type Route = {
  path: string
  title: string
}

type AppRoutes = 'home' | 'about' | 'learn'

const routes = {
  home: { path: '/', title: 'Home' },
  about: { path: '/about', title: 'About Us' },
  learn: { path: '/learn', title: 'Learn TypeScript' },
} satisfies Record<AppRoutes, Route>

// You get exact autocompletion on keys:
routes.learn.path // Inferred with full precision
```

If you forget the `about` route:
```ts
// Error: Property 'about' is missing in type '{ home: ...; learn: ...; }'
const incomplete = {
  home: { path: '/', title: 'Home' },
  learn: { path: '/learn', title: 'Learn TypeScript' },
} satisfies Record<AppRoutes, Route>
```

---

## Comparison: Annotation vs `satisfies` vs `as`

| Technique | Example | Safety | Preserves Exact Types? |
| :--- | :--- | :--- | :--- |
| **Type Annotation** | `const x: T = ...` | High (strict check) | ❌ No (widens to `T`) |
| **Type Assertion** | `const x = ... as T` | Low (bypasses errors) | ❌ No (forces type `T`) |
| **`satisfies` Operator** | `const x = ... satisfies T` | High (strict check) | ✅ Yes (keeps inferred shape) |

---

## Summary

- The `satisfies` operator checks that a value matches a contract without widening its inferred type.
- It prevents property type loss, allowing specific methods (like `.toUpperCase()` or array index access) to work without extra type assertions.
- It ensures completeness of keys while preserving literal key information.

## Practice

1. Create a type `ConfigValue = string | number | boolean`.
2. Create a configuration object `appConfig` with keys `appName: 'FrontHeaven'`, `port: 3000`, `isProduction: false`.
3. Use `satisfies Record<string, ConfigValue>` on `appConfig` and verify that `appConfig.port.toFixed(0)` works without type errors.
