---
title: 'Advanced Projects & Architecture Portfolio'
description: 'Build 9 production-grade advanced TypeScript systems: Type-Safe REST Framework, Validation Engine, State Management Store, Reactive Form Library, and Design System Tokens.'
order: 34
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites:
  - /learn/typescript/33-library-development
---

# Advanced Projects & Architecture Portfolio

At the advanced level, TypeScript is used to architect foundational software infrastructure: type-safe API routers, custom schema validation engines, reactive state managers, form controllers, and enterprise design systems.

In this capstone lesson, we construct nine production-grade architectural blueprints and implementations demonstrating the full power of advanced type-level programming, variadic generics, and runtime validation.

```text
┌────────────────────────────────────────────────────────────┐
│                  Advanced Portfolio Suite                  │
├──────────────────────────────┬─────────────────────────────┤
│ 1. Type-Safe REST Framework  │ 5. Reactive State Store     │
│ (Route Params & Middleware)  │ (Actions, Selectors, Immut) │
├──────────────────────────────┼─────────────────────────────┤
│ 2. Schema Validation Engine  │ 6. Type-Safe Event Emitter  │
│ (Custom mini-Zod with infer) │ (Wildcards, Payload Types)  │
├──────────────────────────────┼─────────────────────────────┤
│ 3. Typed Form Controller     │ 7. Full-Stack SaaS Engine   │
│ (Deep Path Validation)       │ (Tenancy, RBAC, Webhooks)   │
├──────────────────────────────┼─────────────────────────────┤
│ 4. Design System Tokens      │ 8. API Client Generator     │
│ (Tailwind-like Variant Engine│ 9. NPM Package Architecture │
└──────────────────────────────┴─────────────────────────────┘
```

## Project 1: Type-Safe REST Router with URL Parameter Extraction

A compile-time REST router that automatically extracts dynamic path parameters (`/users/:userId/posts/:postId`) into a strongly typed parameter object:

```typescript
// Type-level URL Parameter Extractor
export type ExtractRouteParams<TPath extends string> =
  TPath extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : TPath extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : Record<string, never>;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RouteHandler<TPath extends string, TBody = unknown, TResponse = unknown> {
  (context: { params: ExtractRouteParams<TPath>; body: TBody }): Promise<TResponse> | TResponse;
}

export class TypeSafeRouter {
  private routes: Array<{ method: HttpMethod; path: string; handler: Function }> = [];

  public get<TPath extends string, TResponse>(
    path: TPath,
    handler: RouteHandler<TPath, undefined, TResponse>
  ): void {
    this.routes.push({ method: "GET", path, handler });
  }

  public post<TPath extends string, TBody, TResponse>(
    path: TPath,
    handler: RouteHandler<TPath, TBody, TResponse>
  ): void {
    this.routes.push({ method: "POST", path, handler });
  }
}

// Usage Example:
const router = new TypeSafeRouter();

// 'context.params' is automatically inferred as { orgId: string; userId: string }!
router.get("/orgs/:orgId/users/:userId", async context => {
  return {
    organization: context.params.orgId.toUpperCase(),
    user: context.params.userId,
  };
});
```

## Project 2: Custom Schema Validation Engine (Mini-Zod)

Building a lightweight runtime validation engine with static type inference from scratch:

```typescript
export abstract class BaseSchema<TOutput> {
  public abstract parse(input: unknown): TOutput;
  public safeParse(input: unknown): { success: true; data: TOutput } | { success: false; error: string } {
    try {
      return { success: true, data: this.parse(input) };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
}

export type InferType<TSchema> = TSchema extends BaseSchema<infer T> ? T : never;

class StringSchema extends BaseSchema<string> {
  public parse(input: unknown): string {
    if (typeof input !== "string") {
      throw new Error(`Expected string, received ${typeof input}`);
    }
    return input;
  }
}

class NumberSchema extends BaseSchema<number> {
  public parse(input: unknown): number {
    if (typeof input !== "number" || isNaN(input)) {
      throw new Error(`Expected number, received ${typeof input}`);
    }
    return input;
  }
}

class ObjectSchema<TShape extends Record<string, BaseSchema<any>>> extends BaseSchema<{
  [K in keyof TShape]: InferType<TShape[K]>;
}> {
  constructor(private shape: TShape) {
    super();
  }

  public parse(input: unknown): { [K in keyof TShape]: InferType<TShape[K]> } {
    if (typeof input !== "object" || input === null) {
      throw new Error("Expected object");
    }
    const result: any = {};
    for (const key in this.shape) {
      result[key] = this.shape[key]!.parse((input as any)[key]);
    }
    return result;
  }
}

// Fluent factory
export const schema = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  object: <T extends Record<string, BaseSchema<any>>>(shape: T) => new ObjectSchema(shape),
};

// Application
const UserSchema = schema.object({
  name: schema.string(),
  age: schema.number(),
});

type InferredUser = InferType<typeof UserSchema>;
// InferredUser: { name: string; age: number; }
```

## Project 3: Reactive State Store (Mini Redux/Pinia)

A strongly typed state container with action dispatchers, state selectors, and subscriptions:

```typescript
export type Reducer<TState, TAction> = (state: TState, action: TAction) => TState;
export type Listener = () => void;

export class TypeSafeStore<TState, TAction extends { type: string }> {
  private state: TState;
  private listeners = new Set<Listener>();

  constructor(private readonly reducer: Reducer<TState, TAction>, initialState: TState) {
    this.state = initialState;
  }

  public getState(): Readonly<TState> {
    return this.state;
  }

  public select<TResult>(selector: (state: TState) => TResult): TResult {
    return selector(this.state);
  }

  public dispatch(action: TAction): void {
    this.state = this.reducer(this.state, action);
    for (const listener of this.listeners) {
      listener();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

## Project 4: Design System Variant Style Engine (cva Pattern)

A type-safe component variant engine modeled after Class Variance Authority:

```typescript
export type VariantConfig<TVariants extends Record<string, Record<string, string>>> = {
  variants: TVariants;
  defaultVariants?: {
    [K in keyof TVariants]?: keyof TVariants[K];
  };
};

export type VariantProps<TVariants extends Record<string, Record<string, string>>> = {
  [K in keyof TVariants]?: keyof TVariants[K];
};

export function createVariantEngine<TVariants extends Record<string, Record<string, string>>>(
  baseClass: string,
  config: VariantConfig<TVariants>
) {
  return (props?: VariantProps<TVariants>): string => {
    const classList = [baseClass];

    for (const variantKey in config.variants) {
      const selectedOption =
        props?.[variantKey] ?? config.defaultVariants?.[variantKey];

      if (selectedOption && config.variants[variantKey]?.[selectedOption as string]) {
        classList.push(config.variants[variantKey]![selectedOption as string]!);
      }
    }

    return classList.join(" ");
  };
}

// Button Style Generator
export const buttonStyles = createVariantEngine("btn-base font-semibold rounded-xl transition-all", {
  variants: {
    variant: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

// Output: "btn-base font-semibold rounded-xl transition-all bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-base"
const buttonClass = buttonStyles({ variant: "danger", size: "lg" });
```

## Summary

- The REST Router extracts URL route parameters into strongly typed objects using template literal string parsing.
- The Schema Validation Engine implements static type inference (`InferType<T>`) alongside runtime validation.
- The Reactive State Store demonstrates immutable state updates, action dispatching, and type-safe selectors.
- The Design System Variant Engine provides compile-time autocomplete and safety for component styling variants.
- These advanced projects prove that TypeScript transforms fragile string conventions into verifiable compile-time contracts.

## Best Practices

1. **Leverage Type-Level Parsers for String Protocols**: Extract parameters from URL routes, SQL queries, and GraphQL strings at compile time.
2. **Combine Static Inference with Runtime Validators**: Ensure all runtime schemas automatically export matching TypeScript types.
3. **Encapsulate Immutable State in Stores**: Prevent external components from mutating store state directly.
4. **Publish Tested, Type-Safe Packages**: Build and test all portfolio libraries with full unit test coverage and automated declaration mapping.
