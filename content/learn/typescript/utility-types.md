---
title: 'Utility Types'
description: 'Master all built-in TypeScript utility types including Partial, Pick, Omit, Readonly, Record, Exclude, Extract, Awaited, NonNullable, Parameters, and ReturnType.'
order: 24
difficulty: 'advanced'
category: 'Level 7 - Utility Types'
estimatedMinutes: 25
prerequisites:
  - /learn/typescript/decorators
---

## Built-In Utility Types Overview

TypeScript ships with a rich set of global **Utility Types** to facilitate common type transformations. Instead of writing custom mapped types from scratch, you can reshape existing types with these utilities.

---

## 1. Object Mutation Utilities

### Partial Utility Type
Makes all properties in `T` optional:
```ts
interface User {
  id: string
  name: string
  email: string
}

// All fields become optional (?):
function updateUser(id: string, fieldsToUpdate: Partial<User>) {
  // e.g. fieldsToUpdate can be { name: "New Name" }
}
```

### Required Utility Type
Makes all properties in `T` required (removes `?`):
```ts
interface Props {
  title?: string
  visible?: boolean
}

type StrictProps = Required<Props> // { title: string; visible: boolean; }
```

### Readonly Utility Type
Marks all properties in `T` as `readonly`:
```ts
const user: Readonly<User> = {
  id: 'u_1',
  name: 'Ada',
  email: 'ada@example.com',
}

// user.name = 'New' // Error: Cannot assign to 'name' because it is a read-only property.
```

---

## 2. Property Selection and Shape Utilities

### Pick Utility Type
Constructs a type by picking the set of properties `Keys` from `T`:
```ts
type UserProfilePreview = Pick<User, 'id' | 'name'>
// Equivalent to: { id: string; name: string }
```

### Omit Utility Type
Constructs a type by picking all properties from `T` and then removing `Keys`:
```ts
type CreateUserInput = Omit<User, 'id'>
// Equivalent to: { name: string; email: string }
```

### Record Utility Type
Constructs an object type whose property keys are `Keys` and values are `Type`:
```ts
type Role = 'admin' | 'editor' | 'viewer'

interface Permissions {
  canRead: boolean
  canWrite: boolean
}

const rolePermissions: Record<Role, Permissions> = {
  admin: { canRead: true, canWrite: true },
  editor: { canRead: true, canWrite: true },
  viewer: { canRead: true, canWrite: false },
}
```

---

## 3. Union Manipulation Utilities

### Exclude Utility Type
Excludes members from a union:
```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
type CompletedStatus = Exclude<Status, 'idle' | 'loading'> // 'success' | 'error'
```

### Extract Utility Type
Extracts members from a union that are assignable to `Union`:
```ts
type Action = { type: 'CLICK'; x: number } | { type: 'SCROLL'; y: number } | string
type ObjectActions = Extract<Action, { type: string }> // { type: 'CLICK'; x: number } | { type: 'SCROLL'; y: number }
```

### NonNullable Utility Type
Excludes `null` and `undefined` from `T`:
```ts
type Input = string | number | null | undefined
type ValidInput = NonNullable<Input> // string | number
```

---

## 4. Function and Promise Utilities

### ReturnType Utility Type
Extracts the return type of a function type `T`:
```ts
function createSession() {
  return { sessionId: 'sess_123', expiresAt: new Date() }
}

type Session = ReturnType<typeof createSession>
// Inferred as: { sessionId: string; expiresAt: Date }
```

### Parameters Utility Type
Extracts parameter types of a function type as a tuple:
```ts
function registerUser(name: string, age: number, isAdmin: boolean) {}

type RegisterParams = Parameters<typeof registerUser>
// Inferred as: [name: string, age: number, isAdmin: boolean]
```

### Awaited Utility Type
Recursively unwraps the resolved type of a `Promise`:
```ts
type AsyncResult = Promise<Promise<string[]>>
type Unwrapped = Awaited<AsyncResult> // string[]
```

### InstanceType Utility Type
Extracts the instance type of a class constructor:
```ts
class Widget {}
type WidgetInstance = InstanceType<typeof Widget> // Widget
```

---

## Summary Reference Table

| Utility | Description | Example |
| :--- | :--- | :--- |
| `Partial<T>` | Makes all properties optional | `Partial<User>` |
| `Required<T>` | Makes all properties required | `Required<Props>` |
| `Readonly<T>` | Makes all properties read-only | `Readonly<Config>` |
| `Pick<T, K>` | Picks specific keys `K` from `T` | `Pick<User, 'id'>` |
| `Omit<T, K>` | Removes specific keys `K` from `T` | `Omit<User, 'id'>` |
| `Record<K, T>` | Creates dictionary of keys `K` to type `T` | `Record<string, number>` |
| `Exclude<T, U>` | Removes `U` from union `T` | `Exclude<'a'\|'b', 'a'>` |
| `Extract<T, U>` | Extracts `U` from union `T` | `Extract<string\|number, string>` |
| `NonNullable<T>` | Strips `null` and `undefined` | `NonNullable<string\|null>` |
| `ReturnType<T>` | Obtains function return type | `ReturnType<typeof fn>` |
| `Parameters<T>` | Obtains function parameters tuple | `Parameters<typeof fn>` |
| `Awaited<T>` | Unwraps Promise payload type | `Awaited<Promise<T>>` |

---

## Practice

1. Given an interface `Article { id: number; title: string; body: string; authorId: number; publishedAt: Date }`:
   - Create a type `DraftArticle` where all fields except `title` are optional using `Pick`, `Omit`, and `Partial`.
   - Create a type `ArticleUpdateInput` omitting `id` and `publishedAt`.
2. Extract the return type of `window.fetch` using `ReturnType` and `Awaited`.
