---
title: 'Advanced Types'
description: 'Master intermediate type operations in TypeScript: keyof, typeof, indexed access, mapped types, conditional types, template literals, recursive types, and infer.'
order: 12
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/11-beginner-projects
---

# Advanced Types

As TypeScript applications scale, writing manual type annotations for every variation of an object becomes unmaintainable. Modern TypeScript provides powerful type-level operators that allow you to transform, extract, query, and compute types dynamically from existing code structures.

In this lesson, we explore the intermediate and advanced type system: type aliases vs interfaces, interface inheritance, recursive data structures, indexed access types, the `keyof` and `typeof` operators, mapped types, conditional types, template literal types, and the `infer` keyword.

```text
┌────────────────────────────────────────────────────────────┐
│                    Type-Level Computation                  │
├────────────────────────────────────────────────────────────┤
│ keyof UserProfile           ──> 'id' | 'name' | 'email'    │
│ typeof defaultConfig        ──> Extracts runtime shape     │
│ UserProfile['email']        ──> Indexed access (string)    │
│ [K in keyof T]?: T[K]       ──> Mapped type transformation │
│ T extends Promise<infer U>  ──> Conditional type unwrap   │
│ `on${Capitalize<Event>}`    ──> Template literal type      │
└────────────────────────────────────────────────────────────┘
```

## Type Aliases vs Interfaces & Interface Inheritance

In intermediate TypeScript, both `type` and `interface` are used to define contracts. However, their inheritance capabilities differ:

- **Interface Inheritance (`extends`)**: An interface can extend one or more other interfaces, creating a clear hierarchical object model.
- **Type Intersections (`&`)**: Type aliases combine structures using the intersection operator (`&`).

```typescript
interface Identifiable {
  readonly id: string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// Interface multiple inheritance:
interface UserEntity extends Identifiable, Timestamped {
  username: string;
  email: string;
}

// Type alias intersection equivalent:
type ProductEntity = Identifiable & Timestamped & {
  title: string;
  price: number;
};
```

## The `keyof` Type Operator

The `keyof` operator queries an object type and produces a string or numeric literal union representing all of its property keys:

```typescript
interface ServerConfig {
  host: string;
  port: number;
  maxConnections: number;
  ssl: boolean;
}

// ConfigKey is 'host' | 'port' | 'maxConnections' | 'ssl'
type ConfigKey = keyof ServerConfig;

function getSetting(config: ServerConfig, key: ConfigKey) {
  return config[key];
}
```

## `typeof` in Type Positions

In JavaScript, `typeof` evaluates a value's type at runtime. In TypeScript, `typeof` used in a **type position** extracts the static TypeScript type directly from an existing JavaScript variable or constant object:

```typescript
const appTheme = {
  primaryColor: "#3b82f6",
  backgroundColor: "#0f172a",
  fontFamily: "Inter, sans-serif",
  spacingUnit: 8,
};

// Extracts the entire type structure of appTheme without rewriting an interface:
type AppTheme = typeof appTheme;

// Combine typeof and keyof for instant type-safe lookup keys:
type ThemeProperty = keyof typeof appTheme; // 'primaryColor' | 'backgroundColor' | ...
```

## Indexed Access Types (`Type[Key]`)

You can look up the type of a specific property on another type using **Indexed Access Types** (lookup types), using square bracket syntax:

```typescript
interface UserProfile {
  id: string;
  account: {
    plan: "free" | "pro" | "enterprise";
    billingCycle: "monthly" | "annual";
  };
  roles: string[];
}

// Extract nested types directly:
type AccountPlan = UserProfile["account"]["plan"]; // 'free' | 'pro' | 'enterprise'
type RoleElement = UserProfile["roles"][number];   // string (accessing array element type)
```

## Mapped Types

**Mapped Types** allow you to build new types based on the properties of an existing type. Using the syntax `[K in Keys]`, TypeScript iterates over each property key:

```typescript
interface Vehicle {
  make: string;
  model: string;
  year: number;
}

// Create a mapped type that makes all properties optional and readonly:
type ReadonlyPartial<T> = {
  readonly [K in keyof T]?: T[K];
};

type ReadonlyPartialVehicle = ReadonlyPartial<Vehicle>;
// Equivalent to:
// { readonly make?: string; readonly model?: string; readonly year?: number }
```

## Conditional Types and the `infer` Keyword

A **Conditional Type** selects one of two possible types based on a condition expressed as a type relationship test (`T extends U ? TrueType : FalseType`):

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

### Type Inference within Conditional Types (`infer`)

The `infer` keyword allows you to extract and capture a component type from inside another compound type (such as unwrapping a Promise, an Array, or a Function return type):

```typescript
// Unwrapping a Promise return type:
type FlattenPromise<T> = T extends Promise<infer U> ? U : T;

type ResolvedNumber = FlattenPromise<Promise<number>>; // number
type UnwrappedString = FlattenPromise<string>;         // string

// Extracting function parameter type:
type FirstParameter<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never;

type Handler = (event: MouseEvent, index: number) => void;
type EventType = FirstParameter<Handler>; // MouseEvent
```

## Template Literal Types

TypeScript allows you to use template literal strings within type definitions to generate new string union types through string interpolation and pattern matching:

```typescript
type EventName = "click" | "hover" | "focus";
type Lifecycle = "start" | "end";

// Generates 'click:start' | 'click:end' | 'hover:start' | ...
type EventLifecycle = `${EventName}:${Lifecycle}`;

// Dynamic handler types using Capitalize helper:
type EventHandlerName<T extends string> = `on${Capitalize<T>}`;
type ClickHandler = EventHandlerName<"click">; // 'onClick'
type SubmitHandler = EventHandlerName<"submit">; // 'onSubmit'
```

## Recursive Types

TypeScript supports **Recursive Types**—types that reference themselves within their own definition. This is vital for nested structures like JSON data trees, file directory hierarchies, and ASTs:

```typescript
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const nestedConfig: JsonValue = {
  server: "alpha",
  port: 8080,
  features: ["metrics", "logging"],
  auth: {
    provider: "oauth2",
    retryLimits: [3, 5, 10],
  },
};
```

## Summary

- Interface inheritance (`extends`) and type intersections (`&`) combine multiple object shapes.
- `keyof` extracts a union of property keys from any object type.
- `typeof` in a type context captures the static type of existing runtime variables.
- Indexed access types (`T[K]`) extract specific nested property types.
- Mapped types (`[K in keyof T]`) transform properties systematically across an entire type.
- Conditional types (`T extends U ? X : Y`) implement compile-time type-level branching.
- `infer` introduces a type variable inside conditional types to extract nested inner types.
- Template literal types compute dynamic string literal unions.
- Recursive types model nested tree data structures like JSON objects.

## Best Practices

1. **Use `typeof` + `keyof` for Configuration Dictionaries**: Extract keys dynamically from single-source-of-truth runtime configuration objects.
2. **Prefer Indexed Access over Duplicate Types**: Use `User['address']['city']` instead of declaring separate disconnected `City` types.
3. **Use `infer` for Generic Unwrapping**: Write clean helper utilities using `infer` when extracting return types or Promise values.
4. **Leverage Template Literal Types for Event Busses**: Enforce strict string naming conventions for event emitters and API route paths.
