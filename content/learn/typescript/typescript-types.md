---
title: 'TypeScript Types'
description: 'Explore the foundational building blocks of the TypeScript type system — primitives, void, any, unknown, never, objects, arrays, tuples, and enums.'
order: 4
difficulty: 'beginner'
category: 'Level 2 - TypeScript Types'
estimatedMinutes: 25
prerequisites:
  - /learn/typescript/installation-and-configuration
---

## Introduction to TypeScript Types

Types in TypeScript describe the shape, structure, and capabilities of values. TypeScript includes all JavaScript primitive types, extends them with compile-time safety mechanisms, and adds new constructs such as tuples, enums, `unknown`, and `never`.

```text
                           ┌──────────────┐
                           │   unknown    │ (Top type)
                           └──────┬───────┘
                                  │
      ┌───────────┬───────────────┼───────────────┬────────────┐
      ▼           ▼               ▼               ▼            ▼
 ┌─────────┐ ┌─────────┐    ┌───────────┐   ┌───────────┐ ┌─────────┐
 │ string  │ │ number  │    │  boolean  │   │  object   │ │ void    │ ...
 └────┬────┘ └────┬────┘    └─────┬─────┘   └─────┬─────┘ └────┬────┘
      │           │               │               │            │
      └───────────┴───────────────┼───────────────┴────────────┘
                                  ▼
                           ┌──────────────┐
                           │    never     │ (Bottom type)
                           └──────────────┘
```

---

## Primitive Types

### 1. `string`
Represents textual data using single quotes, double quotes, or template literals:
```ts
const username: string = 'Ada Lovelace'
const greeting: string = `Hello, ${username}!`
```

### 2. `number` and `bigint`
Represents integers and floating-point numbers. `bigint` represents arbitrarily large integers (ES2020+):
```ts
const count: number = 42
const price: number = 19.99
const binaryFlag: number = 0b1010
const largeNumber: bigint = 9007199254740991n
```

### 3. `boolean`
Represents binary `true` or `false` values:
```ts
const isActive: boolean = true
const isCompleted: boolean = false
```

### 4. `null` and `undefined`
Under `strictNullChecks: true`, `null` and `undefined` have their own distinct types and are not assignable to strings or numbers:
```ts
let emptyValue: null = null
let notAssigned: undefined = undefined
```

---

## Special & Top/Bottom Types

### 1. `void`
Used primarily as the return type of functions that do not return a meaningful value:
```ts
function logMessage(message: string): void {
  console.log(`[LOG]: ${message}`)
}
```

### 2. `any`
Disables all type checking on a value. Avoid `any` whenever possible as it bypasses TypeScript's safety guarantees:
```ts
let dynamicValue: any = 42
dynamicValue = 'hello' // No error
dynamicValue.nonExistentMethod() // No compile error, but will crash at runtime!
```

### 3. `unknown` (The Safe Any)
`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but you cannot perform operations on an `unknown` value without first narrowing its type:
```ts
let data: unknown = JSON.parse('{"id": 1}')

// Error: Object is of type 'unknown'.
// data.id

// Safe: Type narrowed via typeof check
if (typeof data === 'object' && data !== null && 'id' in data) {
  console.log((data as { id: number }).id)
}
```

### 4. `never` (The Bottom Type)
`never` represents values that can never occur. It is the return type for functions that always throw an exception or never return (infinite loops):
```ts
function throwError(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {
    // runs forever
  }
}
```

---

## Complex Types

### 1. Object Types
Object types describe property names and their corresponding types:
```ts
const user: { name: string; age: number; isAdmin?: boolean } = {
  name: 'Hesam',
  age: 28,
  // isAdmin is optional (marked with ?)
}
```

### 2. Arrays
Arrays can be written using `type[]` syntax or the generic `Array<type>` syntax:
```ts
const scores: number[] = [95, 88, 100]
const tags: Array<string> = ['typescript', 'frontend', 'vue']
```

### 3. Tuples
Tuples are fixed-length arrays where each element at a specific index has a defined type:
```ts
// A tuple of [status code, status message]
let httpResponse: [number, string] = [200, 'OK']

httpResponse = [404, 'Not Found'] // Valid
// httpResponse = ['404', 200]    // Compile error: Type mismatch
```

Named tuple elements (TS 4.0+) improve readability:
```ts
type Coordinates = [latitude: number, longitude: number]
const position: Coordinates = [37.7749, -122.4194]
```

### 4. Enums
Enums allow you to define a set of named constants.

#### Numeric Enums
Values auto-increment from `0` unless initialized:
```ts
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

const move: Direction = Direction.Up
```

#### String Enums
String enums provide meaningful runtime values:
```ts
enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

const currentRole: Role = Role.Admin
```

#### `const enum`
`const enum` definitions are completely inlined at compile time, eliminating runtime JavaScript object overhead:
```ts
const enum StatusCode {
  Success = 200,
  NotFound = 404,
}

const code = StatusCode.Success // Emits: const code = 200;
```

---

## Summary

- Primitive types include `string`, `number`, `bigint`, `boolean`, `null`, and `undefined`.
- Use `void` for functions with no return value.
- Prefer `unknown` over `any` when dealing with untyped inputs from external sources.
- `never` denotes unreachable code or functions that always throw.
- Tuples define fixed-length arrays with per-index types.
- Enums create human-readable constant sets; `const enum` removes runtime overhead.

## Practice

1. Define a variable `rgbColor` as a tuple holding three numbers `[red, green, blue]`.
2. Create a string enum `ThemeMode` with values `'light'`, `'dark'`, and `'system'`.
3. Write a function `processInput(val: unknown): void` that checks if `val` is a string using `typeof`, and logs its length.
