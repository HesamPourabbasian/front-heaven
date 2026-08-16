---
title: 'Linting'
description: 'Enforce code quality, catch anti-patterns, and master type-aware linting with ESLint and typescript-eslint.'
order: 34
difficulty: 'intermediate'
category: 'Level 10 - Tooling & Ecosystem'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/formatting
---

## Formatting vs Linting

- **Formatters** (like Prettier) deal *only* with aesthetic layout: indentation, quotes, commas, line wrapping.
- **Linters** (like ESLint) inspect code semantics: catching unused variables, memory leaks, unhandled promises, security vulnerabilities, and enforcing best practices.

---

## 1. Setting Up `typescript-eslint`

Modern TypeScript projects use ESLint with the official **`typescript-eslint`** tooling suite:

```bash
npm install -D eslint @eslint/js typescript-eslint
```

### ESLint Flat Config (`eslint.config.js`)
In ESLint v9+ flat configuration:

```js
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
```

---

## 2. Type-Aware Linting (Strict Mode Rules)

The true power of `typescript-eslint` comes from **Type-Aware Linting**. By connecting ESLint directly to your `tsconfig.json`, ESLint rules can inspect type information across files:

```js
// eslint.config.js
export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Prevents unhandled floating promises:
      '@typescript-eslint/no-floating-promises': 'error',
      // Prevents passing promises to conditions (e.g. if (asyncFn()))
      '@typescript-eslint/no-misused-promises': 'error',
      // Enforces exhaustive switches:
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
)
```

### Why Type-Aware Rules Catch Critical Bugs:
```ts
// Catches unawaited promises that could crash silent background tasks:
async function updateUserData() { ... }

// ESLint flags an error: Promises must be awaited or tagged with void!
updateUserData() // ❌ Flagged by @typescript-eslint/no-floating-promises
void updateUserData() // ✅ Explicitly ignored
await updateUserData() // ✅ Handled
```

---

## 3. Running ESLint

```bash
# Run linter
npx eslint src/

# Run and automatically fix safe issues
npx eslint src/ --fix
```

---

## Summary

- ESLint analyzes code quality, potential runtime bugs, and idiomatic practices.
- `typescript-eslint` provides the parser and rules for TypeScript.
- Type-aware rules leverage the TypeScript type checker for advanced bug detection (e.g., floating promises, misused promises, and exhaustive switches).

## Practice

1. Set up `typescript-eslint` in your project with recommended rules.
2. Enable `@typescript-eslint/no-floating-promises`.
3. Create an unawaited async function call to see ESLint catch the mistake.
