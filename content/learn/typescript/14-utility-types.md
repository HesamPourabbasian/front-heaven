---
title: 'Utility Types'
description: 'Master all 15 built-in TypeScript utility types: Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters, ConstructorParameters, InstanceType, Awaited, and ThisType.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/13-generics
---

# Utility Types

TypeScript includes a standard library of globally available **Utility Types**. These utility types use mapped types, conditional types, and generics behind the scenes to perform common type transformations.

Instead of writing custom type manipulation boilerplate in every file, you can use these built-in utilities to make properties optional, pick subsets of fields, unwrap Promises, extract function signatures, and construct typed dictionaries.

```text
┌────────────────────────────────────────────────────────────┐
│                  TypeScript Utility Matrix                 │
├──────────────────────────────┬─────────────────────────────┤
│ Object Modifiers             │ Property Pickers            │
│ - Partial<T>                 │ - Pick<T, K>                │
│ - Required<T>                │ - Omit<T, K>                │
│ - Readonly<T>                │ - Record<K, T>              │
├──────────────────────────────┼─────────────────────────────┤
│ Union Filters                │ Function & Async Helpers    │
│ - Exclude<T, U>              │ - ReturnType<T>             │
│ - Extract<T, U>              │ - Parameters<T>             │
│ - NonNullable<T>             │ - Awaited<T>                │
├──────────────────────────────┼─────────────────────────────┤
│ Class & Context              │                             │
│ - ConstructorParameters<T>   │ - InstanceType<T>           │
│ - ThisType<T>                │                             │
└──────────────────────────────┴─────────────────────────────┘
```

## 1. Object Modifier Utilities: `Partial`, `Required`, and `Readonly`

These three utilities transform the mutability and optionality modifiers of all properties on an object type:

### `Partial<T>`
Constructs a type with all properties of `T` set to optional (`?`). Perfect for update/patch DTOs:

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
}

// All fields become optional:
function updateUserProfile(id: string, updates: Partial<UserProfile>): void {
  // Can provide { bio: "New bio" } without supplying name or email
}
```

### `Required<T>`
Constructs a type with all optional properties of `T` converted into strictly required properties:

```typescript
interface AppConfig {
  apiUrl?: string;
  timeoutMs?: number;
  retryAttempts?: number;
}

// In production runtime, all config values must be fully resolved:
type ConcreteConfig = Required<AppConfig>;
```

### `Readonly<T>`
Constructs a type with all properties of `T` marked as `readonly`, preventing reassignment:

```typescript
type ImmutableProfile = Readonly<UserProfile>;
```

## 2. Selection Utilities: `Pick`, `Omit`, and `Record`

### `Pick<T, K>`
Constructs a type by picking a specific subset of property keys `K` from type `T`:

```typescript
// Pick only 'id' and 'name' from UserProfile:
type UserSummary = Pick<UserProfile, "id" | "name">;
// { id: string; name: string }
```

### `Omit<T, K>`
Constructs a type by picking all properties from `T` and then removing the specified keys `K`:

```typescript
// Create a registration payload omitting auto-generated 'id':
type CreateUserDto = Omit<UserProfile, "id">;
// { name: string; email: string; bio: string }
```

### `Record<K, T>`
Constructs an object type whose property keys are `K` and whose property values are `T`. This is the standard way to type dictionaries, maps, and lookup tables:

```typescript
type PermissionLevel = "admin" | "editor" | "viewer";

interface AccessRule {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

const rolePermissions: Record<PermissionLevel, AccessRule> = {
  admin: { canRead: true, canWrite: true, canDelete: true },
  editor: { canRead: true, canWrite: true, canDelete: false },
  viewer: { canRead: true, canWrite: false, canDelete: false },
};
```

## 3. Union Manipulation Utilities: `Exclude`, `Extract`, and `NonNullable`

### `Exclude<UnionType, ExcludedMembers>`
Excludes from `UnionType` all union members that are assignable to `ExcludedMembers`:

```typescript
type AllEvents = "click" | "scroll" | "mousemove" | "keydown" | "keyup";
type KeyboardEvents = "keydown" | "keyup";

type NonKeyboardEvents = Exclude<AllEvents, KeyboardEvents>;
// 'click' | 'scroll' | 'mousemove'
```

### `Extract<Type, Union>`
Extracts from `Type` all union members that are assignable to `Union`:

```typescript
type MixedValues = string | number | boolean | (() => void);
type FunctionsOnly = Extract<MixedValues, Function>; // () => void
type NumericValues = Extract<MixedValues, number>;   // number
```

### `NonNullable<T>`
Constructs a type by excluding `null` and `undefined` from `T`:

```typescript
type RawInput = string | number | null | undefined;
type ValidatedInput = NonNullable<RawInput>; // string | number
```

## 4. Function & Async Utilities: `ReturnType`, `Parameters`, and `Awaited`

### `ReturnType<T>`
Extracts the return type of a function type `T`:

```typescript
function buildUserSession(userId: string) {
  return {
    userId,
    token: "jwt_token_here",
    expiresAt: new Date(Date.now() + 3600000),
    permissions: ["read", "write"] as const,
  };
}

// Extract the return type dynamically from the implementation:
type UserSession = ReturnType<typeof buildUserSession>;
```

### `Parameters<T>`
Extracts the tuple of parameter types accepted by a function type `T`:

```typescript
type SessionParams = Parameters<typeof buildUserSession>; // [userId: string]
```

### `Awaited<T>`
Recursively unwraps the resolved type of a `Promise` or thenable:

```typescript
async function fetchUserFromDb(): Promise<{ id: string; name: string }> {
  return { id: "101", name: "Ada Lovelace" };
}

// Unwraps Promise<{ id: string; name: string }> into { id: string; name: string }
type FetchedUser = Awaited<ReturnType<typeof fetchUserFromDb>>;
```

## 5. Class & Context Utilities: `ConstructorParameters`, `InstanceType`, and `ThisType`

### `ConstructorParameters<T>` and `InstanceType<T>`
- **`ConstructorParameters<T>`**: Extracts the tuple of parameter types accepted by a class constructor.
- **`InstanceType<T>`**: Extracts the instance type produced by a class constructor function:

```typescript
class DatabasePool {
  constructor(public connectionUri: string, public poolSize: number = 10) {}
  public executeQuery(query: string): void {}
}

type PoolConstructorArgs = ConstructorParameters<typeof DatabasePool>; // [connectionUri: string, poolSize?: number]
type PoolInstance = InstanceType<typeof DatabasePool>;                   // DatabasePool
```

### `ThisType<T>`
Serves as a marker for contextual `this` typing in object literal configurations without returning a transformed type:

```typescript
interface ComponentDescriptor<D, M> {
  data: () => D;
  methods: M & ThisType<D & M>; // Inside methods, 'this' has access to both data and methods
}

function defineCustomComponent<D, M>(desc: ComponentDescriptor<D, M>) {
  return desc;
}

defineCustomComponent({
  data: () => ({ count: 0 }),
  methods: {
    increment() {
      this.count++; // TypeScript recognizes 'this.count' from data()!
    },
  },
});
```

## Summary

- Object utilities (`Partial`, `Required`, `Readonly`) systematically adjust property modifiers.
- Selection utilities (`Pick`, `Omit`, `Record`) create focused data shapes and typed key-value maps.
- Union utilities (`Exclude`, `Extract`, `NonNullable`) filter members from broad union types.
- Function utilities (`ReturnType`, `Parameters`) extract return and parameter types from functions.
- `Awaited<T>` unwraps nested Promise resolutions into their resolved value type.
- Class and context helpers (`ConstructorParameters`, `InstanceType`, `ThisType`) provide deep type reflection over classes and contextual execution scopes.

## Best Practices

1. **Prefer `Omit` / `Pick` over Duplicate Interface Declarations**: Keep a single canonical domain model (`User`) and derive `CreateUserDto` using `Omit<User, 'id' | 'createdAt'>`.
2. **Use `Record<K, V>` for Lookup Dictionaries**: Always specify both key and value types explicitly instead of relying on loose object literals.
3. **Use `ReturnType<typeof fn>` for Factory Functions**: Extract return types directly from factory and builder functions to maintain a single source of truth.
4. **Use `NonNullable` for Sanitized Inputs**: Wrap API request payloads in `NonNullable` once validation middleware has cleared null/undefined values.
