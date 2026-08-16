---
title: 'Mapped Types'
description: 'Learn how to generate new types by transforming property keys and values dynamically using mapped types and key remapping.'
order: 26
difficulty: 'advanced'
category: 'Level 8 - Advanced Types'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/advanced-types
---

## What is a Mapped Type?

When you don't want to repeat property definitions across multiple interfaces, **Mapped Types** allow you to build new types based on the properties of an existing type.

A mapped type is a generic type which uses a syntax similar to array iteration: `[K in Keys]`:

```ts
type FeatureFlags = 'darkMode' | 'betaEditor' | 'analytics'

// Creates an object where every flag is a boolean:
type FeatureConfig = {
  [K in FeatureFlags]: boolean
}

// Result:
// {
//   darkMode: boolean;
//   betaEditor: boolean;
//   analytics: boolean;
// }
```

---

## Mapping Over Object Keys with keyof

By pairing mapped types with `keyof`, you can transform every property of an existing interface:

```ts
interface User {
  id: string
  name: string
  age: number
}

// Transform all values into string format:
type Stringified<T> = {
  [K in keyof T]: string
}

type StringifiedUser = Stringified<User>
// { id: string; name: string; age: string }
```

---

## Modifying Property Modifiers

You can add (`+`) or remove (`-`) the `readonly` and `?` (optional) modifiers during mapping:

### 1. Removing Optionality with Required
```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

interface OptionalConfig {
  host?: string
  port?: number
}

type StrictConfig = MyRequired<OptionalConfig>
// { host: string; port: number; }
```

### 2. Removing Readonly Modifiers
```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

interface ImmutableUser {
  readonly id: string
  readonly name: string
}

type EditableUser = Mutable<ImmutableUser>
// { id: string; name: string; }
```

### 3. Adding Readonly Modifiers
```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}
```

---

## Key Remapping via as clause

You can rename keys or filter them out during mapping using the **`as` clause**:

### 1. Renaming and Prefixing Getters
```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

### 2. Filtering Keys with never
```ts
// Pick only methods from an interface:
type OnlyMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

interface Service {
  apiKey: string
  retryCount: number
  connect(): Promise<void>
  disconnect(): void
}

type ServiceMethods = OnlyMethods<Service>
// {
//   connect(): Promise<void>;
//   disconnect(): void;
// }
```

---

## Summary

- Mapped types iterate over keys to construct new types dynamically: `[K in keyof T]: Type`.
- Use `+?` / `-?` and `+readonly` / `-readonly` to alter property modifiers.
- Use `as` key remapping to rename keys or filter them using `never`.

## Practice

1. Write a mapped type `Nullable<T>` that transforms every property in `T` into `T[K] | null`.
2. Write a mapped type `EventHandlers<T>` that renames each key `action` into `onAction` returning `(payload: T[K]) => void`.
