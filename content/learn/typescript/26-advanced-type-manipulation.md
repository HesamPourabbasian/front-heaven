---
title: 'Advanced Type Manipulation'
description: 'Master deep type transformations: DeepPartial, DeepReadonly, DeepRequired, Key Remapping with as, Object Path types (Path<T>, Get<T, P>), and type-safe event buses.'
order: 26
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/25-advanced-generics
---

# Advanced Type Manipulation

Built-in utility types like `Partial<T>` and `Readonly<T>` operate exclusively on top-level properties (shallow transformation). However, production domain models and state management stores feature deeply nested hierarchies of objects, arrays, and primitive maps.

In this lesson, we build industrial-grade **Custom Utility Types**: recursive deep transformers (`DeepPartial`, `DeepReadonly`, `DeepRequired`), **Key Remapping with `as`**, compile-time **Dot-Notation Path Types** (`"user.address.street"`), and fully **Type-Safe Event Emitter Systems**.

```text
┌────────────────────────────────────────────────────────────┐
│                Advanced Type Transformations               │
├────────────────────────────────────────────────────────────┤
│ Deep Partial Transformation:                               │
│ DeepPartial<UserProfile> ──> All Nested Keys Optional      │
│                                                            │
│ Key Remapping via 'as':                                    │
│ [K in keyof T as `get${Capitalize<K>}`]: () => T[K]        │
│                                                            │
│ Object Path Query:                                         │
│ Path<User> ──> 'id' | 'profile.email' | 'profile.address' │
│ Get<User, 'profile.email'> ──> string                      │
└────────────────────────────────────────────────────────────┘
```

## 1. Deep Recursive Transformers: `DeepPartial`, `DeepReadonly`, `DeepRequired`

### `DeepPartial<T>`
Recursively converts all properties and nested objects/arrays into optional fields:

```typescript
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T;

type _DeepPartialArray<T> = Array<DeepPartial<T>>;
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

interface Company {
  name: string;
  headquarters: {
    address: {
      street: string;
      city: string;
      zipCode: number;
    };
  };
  departments: { id: string; name: string }[];
}

// Deep partial update allows patching only zipCode deep inside:
const partialUpdate: DeepPartial<Company> = {
  headquarters: {
    address: {
      zipCode: 94105,
    },
  },
};
```

### `DeepReadonly<T>`
Recursively marks all properties, nested objects, and arrays as immutable:

```typescript
export type DeepReadonly<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
```

### `DeepRequired<T>`
Recursively removes `undefined` and optional modifiers from all nested structures:

```typescript
export type DeepRequired<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<DeepRequired<NonNullable<U>>>
  : T extends object
  ? { [P in keyof T]-?: DeepRequired<NonNullable<T[P]>> }
  : NonNullable<T>;
```

## 2. Key Remapping via the `as` Clause

Introduced in TypeScript 4.1, mapped types can filter or remap property keys using an `as` clause. This allows you to filter keys by type or rename keys dynamically:

### Generating Getters and Setters Automatically
```typescript
interface Person {
  name: string;
  age: number;
  location: string;
}

// Generate typed getter methods for every property in T:
type ObjectGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PersonGetters = ObjectGetters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```

### Filtering Keys by Value Type
```typescript
// Pick only properties of type Function:
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type MethodsOnly<T> = Pick<T, FunctionPropertyNames<T>>;

// Alternative using direct key remapping with 'as':
type PickByValueType<T, TValue> = {
  [K in keyof T as T[K] extends TValue ? K : never]: T[K];
};

interface Service {
  id: string;
  port: number;
  start(): void;
  stop(): void;
}

type OnlyMethods = PickByValueType<Service, Function>; // { start(): void; stop(): void; }
type OnlyStrings = PickByValueType<Service, string>;   // { id: string; }
```

## 3. Dot-Notation Object Path Types (`Path<T>` and `Get<T, P>`)

In forms, UI state bindings, and database ORMs, querying nested properties using dot strings (e.g., `"user.address.street"`) is common. With template literal types and recursive conditional types, TypeScript can type-check these dot-paths at compile time:

```typescript
// Compute all valid dot-paths of an object type
export type Path<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${Path<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : never;

// Extract the value type at a specific path
export type Get<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Get<T[Key], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

interface AppState {
  auth: {
    user: {
      profile: {
        username: string;
        email: string;
      };
      isLoggedIn: boolean;
    };
  };
  theme: "dark" | "light";
}

type ValidAppPaths = Path<AppState>;
// 'theme' | 'auth' | 'auth.user' | 'auth.user.profile' | 'auth.user.profile.username' | ...

function getNestedValue<P extends Path<AppState>>(state: AppState, path: P): Get<AppState, P> {
  const parts = path.split(".");
  let current: any = state;
  for (const part of parts) {
    current = current?.[part];
  }
  return current;
}
```

## 4. Fully Type-Safe Event Bus System

A strongly typed event emitter guarantees that event names and their corresponding payload tuples match perfectly:

```typescript
export type EventMap = Record<string, any>;

export class TypedEventEmitter<TEvents extends EventMap> {
  private listeners: { [K in keyof TEvents]?: Array<(payload: TEvents[K]) => void> } = {};

  public on<K extends keyof TEvents>(event: K, listener: (payload: TEvents[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  public emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const list = this.listeners[event] ?? [];
    for (const listener of list) {
      listener(payload);
    }
  }

  public off<K extends keyof TEvents>(event: K, listener: (payload: TEvents[K]) => void): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }
}

// Application Event Registry
interface ApplicationEvents {
  "user:login": { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "order:placed": { orderId: string; totalAmount: number };
}

const eventBus = new TypedEventEmitter<ApplicationEvents>();

// Type-safe listener registration:
eventBus.on("user:login", payload => {
  console.log(`User ${payload.userId} logged in at ${payload.timestamp.toISOString()}`);
});

// Type-safe emit:
eventBus.emit("user:login", { userId: "usr_42", timestamp: new Date() });
```

## Summary

- Recursive utility types (`DeepPartial`, `DeepReadonly`, `DeepRequired`) apply transformations to deeply nested object hierarchies.
- Key remapping with `as` dynamically filters and modifies property names using template literal transformations.
- Object Path types (`Path<T>` and `Get<T, P>`) enable compile-time validation of dot-separated string property lookups.
- `TypedEventEmitter<TEvents>` enforces strict payload contracts between event producers and consumers.

## Best Practices

1. **Guard Recursion on Functions and Primitives**: When authoring recursive mapped types, always check `T extends Function ? T : ...` to prevent corrupting method signatures.
2. **Use `-?` and `+readonly` Modifiers Explicitly**: Use `-?` to remove optionality and `readonly` to enforce strict immutability.
3. **Use Path Types for Form State and Store Selectors**: Replace untyped string paths with `Path<TState>` in form libraries and state selectors.
4. **Export Reusable Utility Libraries**: Group project-wide type transformers into a shared `src/types/utils.ts` module.
