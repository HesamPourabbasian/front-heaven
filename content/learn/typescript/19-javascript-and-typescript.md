---
title: 'JavaScript & TypeScript Integration'
description: 'Master migrating JavaScript codebases to TypeScript: allowJs, checkJs, JSDoc type annotations, declaration inference, and gradual adoption strategies.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/18-error-handling-and-safety
---

# JavaScript & TypeScript Integration

Most real-world engineering teams do not write new applications from a completely blank canvas. Instead, developers frequently work with existing, mature JavaScript codebases containing hundreds of thousands of lines of code. Attempting to convert an entire legacy codebase to TypeScript overnight in a single massive pull request is almost always a recipe for disaster.

TypeScript was specifically engineered for **Gradual Adoption**. You can introduce TypeScript incrementally into an existing JavaScript project, type-check vanilla JavaScript files using **JSDoc annotations**, configure **`allowJs`** and **`checkJs`**, and migrate files one-by-one with zero downtime.

```text
┌────────────────────────────────────────────────────────────┐
│                 Gradual Migration Pipeline                 │
├────────────────────────────────────────────────────────────┤
│ Step 1: Add tsconfig.json with "allowJs": true             │
│         (Compile existing .js files with tsc)              │
│                                                            │
│ Step 2: Enable "checkJs": true & annotate with JSDoc       │
│         (Gain type checking inside .js without renaming)   │
│                                                            │
│ Step 3: Rename leaf utility files (.js ──> .ts)            │
│         (Add strict interfaces, generics, and types)       │
│                                                            │
│ Step 4: Migrate complex modules and components             │
│                                                            │
│ Step 5: Turn on "strict": true & remove "allowJs"          │
└────────────────────────────────────────────────────────────┘
```

## Configuring `allowJs` and `checkJs`

To begin using TypeScript in an existing JavaScript project, install TypeScript and create a `tsconfig.json` enabling `allowJs`:

- **`allowJs: true`**: Allows JavaScript (`.js`, `.jsx`) files to be imported and compiled alongside TypeScript files.
- **`checkJs: true`**: Instructs the TypeScript compiler to perform static type checking on vanilla `.js` files using type inference and JSDoc comments.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "allowJs": true,
    "checkJs": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

If you only want type checking on specific `.js` files without enabling `checkJs` globally across the entire project, you can add `// @ts-check` as the very first line of any individual JavaScript file:

```javascript
// @ts-check
// This vanilla JS file is now type-checked by TypeScript!
let port = 8080;
// Error: Type 'string' is not assignable to type 'number'.
port = "8080";
```

Conversely, if a legacy `.js` or `.ts` file contains too many errors to fix immediately, you can suppress checks on that file with `// @ts-nocheck` or suppress a single line with `// @ts-expect-error`.

## Type Annotations with JSDoc

TypeScript has full native support for **JSDoc type annotations**. In vanilla `.js` files where TypeScript syntax (`: string`, `interface`) cannot be written directly, JSDoc comments provide 100% of TypeScript's type checking capabilities:

```javascript
// @ts-check

/**
 * Calculates discount price.
 * @param {number} originalPrice - The starting price before discount
 * @param {number} [discountPercentage=10] - Optional discount percentage
 * @returns {number} The final calculated price
 */
function calculateDiscount(originalPrice, discountPercentage = 10) {
  return originalPrice * (1 - discountPercentage / 100);
}

calculateDiscount(100, 20); // Valid
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.
calculateDiscount("100");
```

### Defining Complex Types with `@typedef` and `@callback`

You can define reusable interfaces, object shapes, and callback types inside JSDoc comments:

```javascript
// @ts-check

/**
 * @typedef {Object} DatabaseConfig
 * @property {string} host
 * @property {number} port
 * @property {boolean} [ssl]
 */

/**
 * @callback ConnectionCallback
 * @param {Error | null} err
 * @param {string} connectionId
 * @returns {void}
 */

/**
 * @param {DatabaseConfig} config
 * @param {ConnectionCallback} callback
 */
function connectDatabase(config, callback) {
  // TypeScript checks that 'config.host' exists and is a string
  console.log(`Connecting to ${config.host}:${config.port}`);
  callback(null, "conn_123");
}
```

## Importing TypeScript Types into JavaScript Files

You can even import TypeScript interfaces directly into vanilla JavaScript JSDoc comments:

```javascript
// @ts-check

/**
 * @param {import('./types').UserProfile} profile
 */
function displayProfile(profile) {
  console.log(profile.username);
}
```

## Step-by-Step Migration Strategy (JS → TS)

When migrating a large production repository, follow this battle-tested phased strategy:

### Phase 1: Setup & Pipeline
1. Install TypeScript and configure `tsconfig.json` with `allowJs: true` and `strict: false`.
2. Configure build scripts and CI pipelines to run `tsc --noEmit` on every pull request.

### Phase 2: Migrate Leaf Dependencies
Migrate files from the bottom of the dependency graph upwards:
1. Start with pure utility functions (`src/utils/math.js` → `src/utils/math.ts`).
2. Rename constants, configuration files, and helper libraries.
3. Add explicit interfaces for all shared data structures.

### Phase 3: Migrate Core Services and Components
1. Convert API client files, repository classes, and state management stores.
2. Rename UI components (`.jsx` → `.tsx`).
3. Replace loose `any` values with explicit domain models.

### Phase 4: Enable Strictness Flags
1. Incrementally turn on strictness compiler flags one by one:
   - First: `noImplicitAny: true`
   - Second: `strictNullChecks: true`
   - Third: `strict: true`
2. Remove `allowJs: true` once all `.js` files are converted.

## Summary

- TypeScript supports gradual adoption through `allowJs: true` and `checkJs: true`.
- `// @ts-check` enables per-file type checking on individual legacy JavaScript files.
- JSDoc comments (`@param`, `@returns`, `@typedef`, `@type`) provide full static typing inside standard `.js` files without a compilation step.
- Migration should proceed from leaf utilities up to high-level modules, ensuring continuous stability.
- Strict mode flags should be enabled incrementally as the codebase reaches full `.ts` coverage.

## Best Practices

1. **Migrate Leaf Utilities First**: Begin conversion on isolated files with no dependencies before tackling core business logic.
2. **Use JSDoc for Zero-Build JS Projects**: If a project cannot use a build tool or compiler step, use JSDoc + `// @ts-check` for instant TypeScript validation.
3. **Prefer `// @ts-expect-error` over `// @ts-ignore`**: If you must suppress a legacy error temporarily, `@ts-expect-error` ensures that if the error is fixed later, the compiler will alert you to delete the suppression comment.
4. **Automate Type Checking in CI**: Run `tsc --noEmit` on CI pull requests to prevent regressions during the migration period.
