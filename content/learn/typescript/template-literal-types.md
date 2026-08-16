---
title: 'Template Literal Types'
description: 'Master advanced string manipulation at the type level with template literal types, intrinsic string utilities, and type-safe event emitters.'
order: 29
difficulty: 'advanced'
category: 'Level 8 - Advanced Types'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/recursive-types
---

## Advanced Template Literal Types

Template literal types build on JavaScript's string interpolation syntax `${}` to produce exact string types, compute combinations, and enforce string-pattern contracts at compile time.

```ts
type World = 'world'
type Greeting = `hello ${World}` // "hello world"
```

---

## 1. Intrinsic String Manipulation Utilities

TypeScript includes four built-in utility types for string case transformations:

### Uppercase Utility
```ts
type Loud = Uppercase<'hello'> // "HELLO"
```

### Lowercase Utility
```ts
type Quiet = Lowercase<'HELLO'> // "hello"
```

### Capitalize Utility
```ts
type Title = Capitalize<'frontend'> // "Frontend"
```

### Uncapitalize Utility
```ts
type Property = Uncapitalize<'UserName'> // "userName"
```

---

## 2. Generating Combinations (Cross Products)

When multiple union types are interpolated into a template literal, TypeScript calculates the Cartesian product of all variations:

```ts
type Vertical = 'top' | 'bottom'
type Horizontal = 'left' | 'right'

// Result: "top-left" | "top-right" | "bottom-left" | "bottom-right"
type Alignment = `${Vertical}-${Horizontal}`

type Color = 'red' | 'blue' | 'green'
type Shade = '100' | '500' | '900'

// Result: "bg-red-100" | "bg-red-500" | "bg-blue-100" | ...
type BackgroundClass = `bg-${Color}-${Shade}`
```

---

## 3. Type-Safe Event Emitters

Template literal types are commonly used to build strongly-typed event listener APIs:

```ts
type Entity = 'user' | 'order' | 'product'
type Action = 'created' | 'updated' | 'deleted'

type EventName = `${Entity}:${Action}`

interface EventPayloadMap {
  'user:created': { userId: string; email: string }
  'user:updated': { userId: string; changes: Record<string, any> }
  'user:deleted': { userId: string }
  'order:created': { orderId: string; amount: number }
  'order:updated': { orderId: string }
  'order:deleted': { orderId: string }
  'product:created': { productId: string }
  'product:updated': { productId: string }
  'product:deleted': { productId: string }
}

class TypedEventEmitter {
  on<E extends keyof EventPayloadMap>(
    event: E,
    handler: (payload: EventPayloadMap[E]) => void,
  ) {
    // register handler
  }

  emit<E extends keyof EventPayloadMap>(
    event: E,
    payload: EventPayloadMap[E],
  ) {
    // dispatch event
  }
}

const emitter = new TypedEventEmitter()

// Fully autocompleted event name and strongly typed payload:
emitter.on('user:created', (payload) => {
  console.log(`User created with email: ${payload.email}`)
})
```

---

## 4. String Pattern Inference with infer

You can use `infer` inside template literal types to parse and extract substrings at compile time:

```ts
// Parse URL route parameters:
type ExtractRouteParam<Path extends string> =
  Path extends `:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParam<Rest>
    : Path extends `:${infer Param}`
    ? Param
    : Path extends `${string}/${infer Rest}`
    ? ExtractRouteParam<Rest>
    : never

type UserRoute = '/users/:userId/posts/:postId'
type Params = ExtractRouteParam<UserRoute> // "userId" | "postId"
```

---

## Summary

- Template literal types allow string manipulation and pattern validation at compile time.
- Built-in intrinsic utilities (Uppercase, Lowercase, Capitalize, Uncapitalize) transform casing.
- Union interpolation generates all possible combinations.
- Combine with `infer` to parse strings and extract parameters from URLs, CSS properties, or event names.

## Practice

1. Write a template literal type `CSSPixelValue` that enforces strings ending with `"px"` (e.g. `${number}px`).
2. Test valid values (`"16px"`, `"100px"`) and invalid values (`"16em"`, `"auto"`).
3. Create a type `GetterNames<T>` that produces `get${Capitalize<string & keyof T>}` for any object `T`.
