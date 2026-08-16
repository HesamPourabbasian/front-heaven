---
title: 'Recursive Types'
description: 'Learn how to build self-referencing recursive types in TypeScript for nested data structures, trees, DeepReadonly, and JSON modeling.'
order: 28
difficulty: 'advanced'
category: 'Level 8 - Advanced Types'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/conditional-types
---

## What is a Recursive Type?

A **Recursive Type** is a type that references itself in its own definition. In TypeScript 3.7+, type aliases can directly reference themselves, enabling elegant modeling of hierarchical, tree-shaped, and deeply nested structures.

```ts
// Self-referencing tree node:
type TreeNode<T> = {
  value: T
  children?: TreeNode<T>[]
}

const fileSystemTree: TreeNode<string> = {
  value: 'root',
  children: [
    {
      value: 'src',
      children: [
        { value: 'index.ts' },
        { value: 'utils.ts' },
      ],
    },
    {
      value: 'package.json',
    },
  ],
}
```

---

## 1. Modeling JSON Values

Standard JSON values can be primitives, arrays of JSON values, or objects whose properties are JSON values:

```ts
type JSONPrimitive = string | number | boolean | null
type JSONObject = { [key: string]: JSONValue }
type JSONArray = JSONValue[]

type JSONValue = JSONPrimitive | JSONObject | JSONArray

const validConfig: JSONValue = {
  appName: 'FrontHeaven',
  version: 2,
  tags: ['typescript', 'learning'],
  features: {
    darkMode: true,
    experiments: null,
  },
}
```

---

## 2. Deep Readonly Transformation

While standard `Readonly<T>` only marks top-level properties as read-only, a recursive mapped type can freeze all nested structures at arbitrary depths:

```ts
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

interface AppState {
  user: {
    profile: {
      name: string
      address: {
        city: string
      }
    }
  }
}

const state: DeepReadonly<AppState> = {
  user: {
    profile: {
      name: 'Ada',
      address: {
        city: 'London',
      },
    },
  },
}

// All levels are immutable:
// state.user.profile.address.city = "Paris" // Error: Cannot assign to 'city' because it is a read-only property.
```

---

## 3. Deep Partial Transformation

Similarly, you can make all nested fields optional:

```ts
type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? DeepPartial<U>[]
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

type PartialState = DeepPartial<AppState>
// Can provide: { user: { profile: { name: "Ada" } } }
```

---

## 4. Flattening Nested Arrays

```ts
type Flatten<T> = T extends (infer Item)[] ? Flatten<Item> : T

type NestedNumbers = number[][][][]
type FlatNumbers = Flatten<NestedNumbers> // Inferred as: number
```

---

## Summary

- Recursive types reference themselves to model hierarchical structures (trees, linked lists, ASTs).
- TypeScript natively supports recursive type aliases for JSON and nested graphs.
- Recursive mapped types like DeepReadonly and DeepPartial recursively transform deeply nested objects and arrays.

## Practice

1. Define a recursive type `LinkedList<T>` where each node has `value: T` and `next: LinkedList<T> | null`.
2. Construct a 3-node linked list holding numbers `1 -> 2 -> 3`.
3. Implement `DeepRequired<T>` that recursively removes optionality and `undefined` from all nested levels.
