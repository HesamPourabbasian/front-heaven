---
title: 'Objects'
description: 'Master object modeling in TypeScript: object type annotations, optional and readonly properties, nested objects, index signatures, excess property checks, type aliases, and interfaces.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/04-arrays-and-tuples
---

# Objects

Objects are the foundational data structure of modern JavaScript and TypeScript applications. Almost all domain entities—from database models and API payloads to UI component configurations and global state trees—are represented as key-value object structures. In dynamic JavaScript, objects can be mutated arbitrarily: properties can be added, deleted, or reassigned to different types at any time without warning.

TypeScript provides comprehensive mechanisms to strictly model object shapes. Through type annotations, optional properties, immutability flags, index signatures, type aliases, and interfaces, you can build self-validating, robust object schemas.

```text
┌──────────────────────────────────────────────────────────────┐
│                    TypeScript Object Model                   │
│                                                              │
│  interface UserProfile {                                     │
│    readonly id: string;         <── Cannot be modified       │
│    username: string;            <── Required property        │
│    avatarUrl?: string;          <── Optional property        │
│    settings: {                  <── Nested object            │
│      theme: 'dark' | 'light';                                │
│    };                                                        │
│    [customMetadata: string]: unknown; <── Index signature    │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

## Object Type Annotations

An object type annotation describes the exact property names and the corresponding types expected on an object instance:

```typescript
const serverInstance: {
  hostname: string;
  port: number;
  isActive: boolean;
} = {
  hostname: "worker-01.internal",
  port: 8080,
  isActive: true,
};
```

If any required property is omitted or assigned a value of an incorrect type, TypeScript immediately reports a compile-time error.

## Optional Properties (`?`)

Properties that may or may not exist on an object are marked with the question mark (`?`) modifier. When accessing an optional property at runtime, its type is evaluated as `T | undefined`:

```typescript
interface UserRegistration {
  email: string;
  fullName: string;
  phoneNumber?: string; // Optional: string | undefined
}

const userWithoutPhone: UserRegistration = {
  email: "ada@example.com",
  fullName: "Ada Lovelace",
};

// Safe access with optional chaining (?.)
console.log(userWithoutPhone.phoneNumber?.toUpperCase()); // undefined (no runtime error)
```

## Readonly Properties (`readonly`)

Prefixing a property name with the `readonly` modifier prevents it from being reassigned after the object is created. This is vital for primary keys, database IDs, and configuration settings that must remain immutable throughout the application lifecycle:

```typescript
interface DatabaseRecord {
  readonly id: number;
  readonly createdAt: Date;
  title: string;
}

const record: DatabaseRecord = {
  id: 1001,
  createdAt: new Date(),
  title: "Architecture Decision Record",
};

// Allowed: Title is mutable
record.title = "Updated ADR 001";

// Compile Error: Cannot assign to 'id' because it is a read-only property.
record.id = 1002;
```

Note that `readonly` operates shallowly. If a `readonly` property holds an object or an array, the nested contents can still be mutated unless they are also explicitly typed as `readonly`.

## Nested Object Types

Real-world objects are often deeply nested. TypeScript allows you to type nested objects inline or by composing smaller, focused interfaces:

```typescript
// Approach 1: Inline nested object typing
interface BlogPost {
  title: string;
  author: {
    name: string;
    social: {
      github: string;
      twitter?: string;
    };
  };
  tags: string[];
}

// Approach 2: Composed modular interfaces (Recommended for readability)
interface SocialLinks {
  github: string;
  twitter?: string;
}

interface Author {
  name: string;
  social: SocialLinks;
}

interface Article {
  title: string;
  author: Author;
  tags: string[];
}
```

Composing smaller interfaces makes individual types reusable across different areas of your codebase (e.g., passing just the `Author` to an `AuthorBio` UI component).

## Dynamic Properties with Index Signatures

When an object represents a dynamic dictionary, hash map, or cache where the specific keys are not known in advance, you can define an **Index Signature**:

```typescript
interface MetricRegistry {
  [metricName: string]: number;
}

const serverMetrics: MetricRegistry = {
  cpuUsagePercent: 42.5,
  memoryUsedMb: 2048,
  activeConnections: 350,
  latencyMs: 14.2,
};
```

Index signature keys must be either `string`, `number`, `symbol`, or template literal types. When index signatures are present, all explicitly named properties must have types that are assignable to the index signature's return type:

```typescript
interface CacheStore {
  // Named property
  readonly namespace: string;
  // Index signature must include 'string' because 'namespace' is string
  [key: string]: string | number;
}
```

## Excess Property Checks

TypeScript enforces **Excess Property Checking** when object literals are assigned directly to a variable or passed directly to a function parameter. This prevents typos and accidental invalid property additions:

```typescript
interface ModalProps {
  title: string;
  isOpen: boolean;
}

function renderModal(props: ModalProps) {
  // rendering logic...
}

// Direct object literal assignment triggers excess property check:
// Error: Object literal may only specify known properties, and 'isOPen' does not exist in type 'ModalProps'. Did you mean to write 'isOpen'?
renderModal({
  title: "Confirm Deletion",
  isOPen: true, // Typo caught immediately!
});
```

Excess property checks only occur on fresh object literals. If you assign an object to an intermediate variable first, excess property checks are bypassed due to structural typing (as long as the required properties are satisfied).

## Type Aliases vs Interfaces

TypeScript provides two primary ways to declare named object structures: **Type Aliases** (`type`) and **Interfaces** (`interface`).

```typescript
// Type Alias
type PointType = {
  x: number;
  y: number;
};

// Interface
interface PointInterface {
  x: number;
  y: number;
}
```

### Key Differences:

1. **Declaration Merging**: Interfaces with the same name in the same scope automatically merge their definitions together (essential for augmenting third-party library types). Type aliases cannot be redeclared.
2. **Extends vs Intersects**: Interfaces extend each other cleanly via `interface B extends A {}`. Type aliases combine structures using intersection operators `type B = A & {}`.
3. **Unions and Primitives**: Type aliases can represent unions, primitives, and tuples (`type Status = "idle" | "busy"`). Interfaces can only represent object shapes and function signatures.

```typescript
// Interface declaration merging:
interface WindowConfig {
  width: number;
}

interface WindowConfig {
  height: number;
}

// WindowConfig now has both 'width' and 'height' properties!
const config: WindowConfig = { width: 1920, height: 1080 };
```

## Summary

- Object type annotations enforce strict key-value contracts on JavaScript objects.
- Optional properties (`?`) represent values that can be `undefined` and should be safely accessed with optional chaining (`?.`).
- `readonly` prevents property reassignment after object instantiation.
- Nested object types are best modeled by composing smaller, modular interfaces.
- Index signatures (`[key: string]: T`) enable type-safe dynamic dictionaries and lookup tables.
- Excess property checking catches typos on fresh object literals passed to typed functions.
- Interfaces support declaration merging and OOP inheritance; type aliases support unions and type-level operations.

## Best Practices

1. **Default to `interface` for Object Shapes**: Use `interface` for public APIs, domain models, and extensible component props; use `type` for unions, intersections, and mapped types.
2. **Model Nested Structures with Named Types**: Avoid large anonymous inline object types inside function signatures; extract them into named interfaces.
3. **Use `readonly` on IDs and Immutable Flags**: Safeguard entity IDs and creation timestamps with `readonly` modifiers.
4. **Enable `"noUncheckedIndexedAccess": true`**: When using index signatures, enable this compiler option so accessing index keys returns `T | undefined`, forcing you to verify property existence before use.
