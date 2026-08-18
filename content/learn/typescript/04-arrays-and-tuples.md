---
title: 'Arrays & Tuples'
description: 'Master typed collections in TypeScript: array syntax, generic arrays, readonly arrays, tuples, optional tuple elements, and rest elements.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/typescript/03-variables-and-functions
---

# Arrays & Tuples

Collections are central to almost every software program. In standard JavaScript, arrays are dynamic and heterogeneous—a single array can contain numbers, strings, objects, and nested arrays simultaneously without restriction. While this flexibility seems convenient initially, it frequently results in runtime `TypeError` exceptions when array elements are manipulated assuming a specific uniform type.

TypeScript provides two core collection structures to solve this: **Typed Arrays** (ordered lists of variable length containing a uniform element type) and **Tuples** (fixed-length arrays where specific index positions carry distinct types).

```text
┌─────────────────────────────────────────────────────────────┐
│ Array: type[] (Variable length, uniform element type)       │
│ ['react', 'vue', 'svelte', 'angular'] : string[]            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Tuple: [type1, type2] (Fixed length, positional type safety)│
│ ['HTTP_STATUS', 200, true] : [string, number, boolean]      │
│      Index 0: string                                        │
│      Index 1: number                                        │
│      Index 2: boolean                                       │
└─────────────────────────────────────────────────────────────┘
```

## Typed Array Syntax: `T[]` vs Generic `Array<T>`

TypeScript provides two equivalent syntaxes for annotating arrays:

1. **Square Bracket Syntax (`T[]`)**: The standard, idiomatic syntax preferred in most TypeScript style guides.
2. **Generic Syntax (`Array<T>`)**: Uses TypeScript's built-in `Array` generic interface.

```typescript
// Both declarations are functionally identical
const frameworks: string[] = ["React", "Vue", "Svelte", "SolidJS"];
const latencyLogs: Array<number> = [12.4, 45.1, 19.8, 8.2];

// Array containing objects:
const users: { id: number; name: string }[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
```

Both syntaxes guarantee that only elements matching type `T` can be added to the array via `.push()`, `.unshift()`, or indexed assignment. Attempting to push an invalid type triggers an instant compile error:

```typescript
// Error: Argument of type 'boolean' is not assignable to parameter of type 'string'.
frameworks.push(true);
```

## Readonly Arrays: Preventing Mutations

In functional programming and state management architectures (such as Redux, Pinia, or React state), mutating arrays in-place leads to unintended side effects and difficult-to-trace bugs. TypeScript provides `readonly T[]` and `ReadonlyArray<T>` to guarantee immutability at compile time.

When an array is marked as `readonly`, all mutating methods (`push()`, `pop()`, `splice()`, `shift()`, `unshift()`, `sort()`, `reverse()`) are completely removed from its type signature:

```typescript
const immutableTags: readonly string[] = ["typescript", "frontend", "architecture"];
// Alternative generic syntax:
const immutableScores: ReadonlyArray<number> = [99, 85, 92];

// Compile-time errors on mutation attempts:
// Property 'push' does not exist on type 'readonly string[]'.
immutableTags.push("react");

// Index assignment is also forbidden:
// Index signature in type 'readonly string[]' only permits reading.
immutableTags[0] = "javascript";

// Non-mutating methods (map, filter, slice, concat) remain fully valid:
const uppercaseTags = immutableTags.map(tag => tag.toUpperCase());
```

## Understanding Tuples

A **Tuple** is a specialized array with a fixed number of elements where each specific index position has a known, predefined type. Tuples are ideal for representing structured records, coordinates, key-value pairs, or multi-value return pairs (such as React's `useState` hook returning `[state, setState]`):

```typescript
// A tuple representing [Longitude, Latitude, CityName]
let geographicPoint: [number, number, string];

geographicPoint = [-122.4194, 37.7749, "San Francisco"]; // Valid

// Error: Type 'string' is not assignable to type 'number' (at index 0)
geographicPoint = ["San Francisco", 37.7749, -122.4194];
```

When destructuring a tuple, TypeScript automatically infers the exact type of each individual element based on its index position:

```typescript
const [longitude, latitude, cityName] = geographicPoint;
// longitude: number
// latitude: number
// cityName: string
```

## Optional Tuple Elements

Tuples can specify optional elements using the question mark (`?`) modifier. Just like function parameter lists, optional tuple elements must always be placed at the end of the tuple definition:

```typescript
// [HTTP Status Code, Status Message, Optional Timestamp]
type HttpResponse = [number, string, number?];

const successResponse: HttpResponse = [200, "OK"]; // Valid (2 elements)
const cachedResponse: HttpResponse = [304, "Not Modified", Date.now()]; // Valid (3 elements)
```

## Rest Elements in Tuples

Tuples can incorporate rest elements (`...T[]`) to define open-ended or variable-length tuples that retain positional typing for prefix or suffix elements:

```typescript
// A tuple that must start with a string command followed by arbitrary number arguments:
type CommandTuple = [string, ...number[]];

const moveCommand: CommandTuple = ["MOVE", 100, 250, 400];
const resetCommand: CommandTuple = ["RESET"]; // Valid: zero rest arguments

// A tuple with required start and end elements:
type BoundedList = [string, ...boolean[], number];
const sample: BoundedList = ["HEAD", true, false, true, 42];
```

## Readonly Tuples

By default, tuples allow mutations such as `.push()` unless they are explicitly marked as `readonly`. Adding `readonly` ensures the tuple's length and element values can never be altered at runtime:

```typescript
type Point2D = readonly [number, number];

const origin: Point2D = [0, 0];

// Compile error: Property 'push' does not exist on type 'readonly [number, number]'.
origin.push(10);
```

You can also create readonly tuples using TypeScript's `as const` assertion:

```typescript
// Inferred as readonly ['dark', 'light', 'system']
const themeModes = ['dark', 'light', 'system'] as const;
```

## Summary

- Arrays (`T[]` or `Array<T>`) store uniform elements of variable length.
- Readonly arrays (`readonly T[]` / `ReadonlyArray<T>`) prevent in-place mutation methods at compile time.
- Tuples (`[Type1, Type2]`) enforce fixed lengths and positional types for each index.
- Optional tuple elements (`[string, number?]`) allow variable-length tuples while preserving positional safety.
- Rest elements in tuples (`[string, ...number[]]`) enable open-ended tuples with typed variable segments.
- Readonly tuples (`readonly [number, number]` or `as const`) guarantee immutable tuple structures.

## Best Practices

1. **Use `T[]` for Arrays**: Standardize on `T[]` for simple element types (`string[]`, `User[]`) and use `Array<T>` when dealing with complex nested generics.
2. **Mark Parameter Arrays as Readonly**: When writing functions that do not need to mutate input arrays, type them as `readonly T[]` to prevent accidental side effects on caller state.
3. **Use Tuples for Small, Fixed Sets**: Prefer tuples for small data pairs (e.g., key-value pairs, coordinate pairs, state tuples). For structures with more than 3 fields, prefer structured interfaces or object types for readability.
4. **Use `as const` for Immutable Literal Lists**: When defining static lookup tables or config arrays, add `as const` to produce readonly literal tuples.
