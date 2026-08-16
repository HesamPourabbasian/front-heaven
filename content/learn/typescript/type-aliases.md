---
title: 'Type Aliases'
description: 'Learn how to declare custom reusable types with the type keyword, create union/intersection aliases, and simplify complex data models.'
order: 7
difficulty: 'beginner'
category: 'Level 2 - TypeScript Types'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/type-compatibility
---

## What is a Type Alias?

A **Type Alias** creates a new name for an existing type. You define a type alias using the `type` keyword. Type aliases do not create a completely new type; rather, they provide a descriptive, reusable shorthand identifier for any valid TypeScript type.

```ts
type ID = string | number
type Username = string

let userId: ID = 'usr_98124'
userId = 1042 // Valid
```

---

## Defining Custom Types

Type aliases can describe primitive values, object structures, arrays, functions, unions, and tuples:

### 1. Object Types
```ts
type User = {
  id: string
  name: string
  email: string
  role?: 'admin' | 'user' // Optional property
  readonly createdAt: Date // Readonly property
}

const user: User = {
  id: 'u_1',
  name: 'Hesam',
  email: 'hesam@example.com',
  createdAt: new Date(),
}

// user.createdAt = new Date() // Error: Cannot assign to 'createdAt' because it is a read-only property.
```

### 2. Function Signatures
```ts
type Formatter = (value: string, uppercase?: boolean) => string

const formatGreeting: Formatter = (val, uppercase) => {
  return uppercase ? `HELLO, ${val.toUpperCase()}` : `Hello, ${val}`
}
```

### 3. Tuples & Arrays
```ts
type GeoPoint = [latitude: number, longitude: number]
type UserList = User[]
```

---

## Combining Type Aliases

Type aliases can be composed together using **Union Types (`|`)** and **Intersection Types (`&`)**:

### Union Types (`|`)
A value can match one of several types:
```ts
type Status = 'pending' | 'active' | 'suspended' | 'deleted'
type ResponsePayload = { success: true; data: User } | { success: false; error: string }
```

### Intersection Types (`&`)
An intersection merges multiple type definitions into one:
```ts
type Timestamped = {
  createdAt: Date
  updatedAt: Date
}

type Identifiable = {
  id: string
}

type Article = Identifiable & Timestamped & {
  title: string
  content: string
  published: boolean
}

const post: Article = {
  id: 'art_12',
  title: 'Mastering TypeScript',
  content: 'Type aliases are versatile...',
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

---

## Generic Type Aliases

Type aliases can accept type parameters to create reusable dynamic containers:

```ts
type ApiResponse<TData> = {
  status: 200 | 400 | 404 | 500
  data: TData
  message: string
}

type UserResponse = ApiResponse<User>
type ProductListResponse = ApiResponse<{ id: number; title: string }[]>
```

---

## Summary

- Use `type Name = ...` to create a type alias.
- Type aliases can represent primitives, objects, functions, unions, tuples, and intersections.
- Combine types using `|` for alternatives and `&` for merging.
- Type aliases support generic parameters `<T>` for flexible reusability.

## Practice

1. Create a type alias `ContactInfo` that represents an object with `email: string` and optional `phone?: string`.
2. Create another type alias `Customer` that intersects `ContactInfo` with `{ id: number; name: string }`.
3. Create a function type `FilterFn<T>` that accepts an item of type `T` and returns a boolean.
