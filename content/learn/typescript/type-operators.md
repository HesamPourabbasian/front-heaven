---
title: 'Type Operators'
description: 'Learn to query and extract types dynamically using the keyof, typeof, and instanceof operators in TypeScript.'
order: 12
difficulty: 'intermediate'
category: 'Level 3 - Type Manipulation'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/literal-types
---

## Introduction to Type Operators

TypeScript provides specialized operators that inspect, extract, and manipulate types at compile time:
- **`keyof`**: Extracts keys of an object type as a union of string/number literals.
- **`typeof`**: Captures the type of a runtime JavaScript value in type positions.
- **`instanceof`**: Tests class constructor identity at runtime and narrows types at compile time.

---

## 1. The `keyof` Operator

The `keyof` operator takes an object type and produces a string or numeric literal union of its keys:

```ts
interface User {
  id: number
  name: string
  email: string
  isActive: boolean
}

// UserKeys is: "id" | "name" | "email" | "isActive"
type UserKeys = keyof User

function getProperty(user: User, key: keyof User) {
  return user[key]
}

const u: User = { id: 1, name: 'Ada', email: 'ada@example.com', isActive: true }
getProperty(u, 'name')  // OK
// getProperty(u, 'age') // Error: Argument of type '"age"' is not assignable to parameter of type 'keyof User'.
```

### Generic Property Getter
Combining `keyof` with generics allows you to write perfectly typed property accessors:

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const userName = getProp(u, 'name') // Inferred as: string
const userId = getProp(u, 'id')     // Inferred as: number
```

---

## 2. The `typeof` Operator

In JavaScript, `typeof` is a runtime operator that returns a string (`"string"`, `"number"`, `"object"`, etc.).

In TypeScript, `typeof` can **also be used in type positions** to reference the static type of a variable or property:

```ts
const defaultAppSettings = {
  theme: 'dark',
  fontSize: 14,
  showSidebar: true,
  timeoutMs: 5000,
}

// AppSettings is inferred directly from the runtime object:
// type AppSettings = { theme: string; fontSize: number; showSidebar: boolean; timeoutMs: number; }
type AppSettings = typeof defaultAppSettings

function updateSettings(newSettings: Partial<typeof defaultAppSettings>) {
  // ...
}
```

### Combining `typeof` with `keyof`
You can combine both operators to extract the keys of an existing runtime object:

```ts
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

// HttpStatusName is: "OK" | "CREATED" | "NOT_FOUND" | "SERVER_ERROR"
type HttpStatusName = keyof typeof HTTP_STATUS
```

---

## 3. The `instanceof` Operator

`instanceof` is a JavaScript runtime operator that checks if an object is an instance of a specific class constructor. TypeScript understands this check and automatically **narrows** the variable's type inside conditional branches:

```ts
class CustomError extends Error {
  errorCode: number
  constructor(message: string, code: number) {
    super(message)
    this.errorCode = code
  }
}

function handleUnknownError(err: unknown) {
  if (err instanceof CustomError) {
    // Inside this block, 'err' is narrowed to CustomError!
    console.error(`Error code ${err.errorCode}: ${err.message}`)
  } else if (err instanceof Error) {
    // Inside this block, 'err' is narrowed to standard Error
    console.error(`Standard error: ${err.message}`)
  } else {
    console.error('Unknown error type:', err)
  }
}
```

---

## Summary

- `keyof T` returns a union of all property keys in type `T`.
- `typeof expr` in a type context captures the static type of a value.
- `keyof typeof obj` extracts keys directly from a JavaScript object.
- `instanceof` checks constructor identity and narrows class types safely.

## Practice

1. Create an object `themeColors = { primary: '#6366f1', secondary: '#0ea5e9', neutral: '#64748b' } as const`.
2. Use `keyof typeof` to generate a type `ColorKey`.
3. Write a function `getColor(key: ColorKey)` that returns the selected hex color.
