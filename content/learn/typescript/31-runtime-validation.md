---
title: 'Runtime Validation'
description: 'Master schema validation in TypeScript: compile-time vs runtime types, Zod, Valibot, schema inference with z.infer, safe parsing, API payload validation, and form schemas.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/30-full-stack-typescript
---

# Runtime Validation

One of the most common misconceptions among developers starting with TypeScript is believing that TypeScript protects their application from bad data at runtime. It does not.

Because TypeScript types are completely erased during compilation, your compiled JavaScript code has zero type checking when parsing real-world runtime inputs: incoming HTTP request bodies, external API responses, localStorage data, or user form entries. If an external API changes a field name or returns `null` instead of an array, TypeScript's static types cannot prevent a runtime crash.

**Runtime Schema Validation** bridges this critical gap. Libraries like **Zod** and **Valibot** validate untrusted runtime inputs and automatically infer static TypeScript types from the schema, giving you total end-to-end security.

```text
┌────────────────────────────────────────────────────────────┐
│               Runtime Validation Architecture              │
├────────────────────────────────────────────────────────────┤
│ 1. Define Runtime Schema (Zod / Valibot):                  │
│    const UserSchema = z.object({                           │
│      email: z.string().email(),                            │
│      age: z.number().min(18)                               │
│    });                                                     │
│                                                            │
│ 2. Extract Static TypeScript Type Automatically:           │
│    type User = z.infer<typeof UserSchema>;                 │
│                                                            │
│ 3. Validate Incoming Network / User Input:                 │
│    const result = UserSchema.safeParse(rawJson);           │
│    if (result.success) {                                   │
│      // Guaranteed valid at BOTH runtime and compile-time! │
│    }                                                       │
└────────────────────────────────────────────────────────────┘
```

## Compile-Time Types vs Runtime Types

- **Compile-Time Types (`interface`, `type`)**: Exist only during development and compilation. They cost 0 KB of runtime bundle size and produce 0 runtime overhead, but they cannot validate untrusted runtime data.
- **Runtime Schemas (Zod, Valibot, ArkType)**: Real JavaScript objects and validator functions that execute at runtime in the user's browser or Node.js server. They parse raw inputs, strip malicious unknown keys, format values, and throw readable validation errors when data is invalid.

## Zod: The Industry Standard Schema Library

**Zod** is a TypeScript-first schema declaration and validation library. It is designed to make creating complex validators concise and enjoyable:

```typescript
import { z } from "zod";

// Define schema
export const RegistrationFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.string().email("Invalid email address format"),
  age: z.number().int().min(18, "Must be at least 18 years old"),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  role: z.enum(["developer", "designer", "manager"]).default("developer"),
});

// Infer TypeScript type directly from schema:
export type RegistrationFormInput = z.infer<typeof RegistrationFormSchema>;
// Equivalent to:
// {
//   username: string;
//   email: string;
//   age: number;
//   acceptedTerms: true;
//   role: "developer" | "designer" | "manager";
// }
```

## Parsing Untrusted Data: `parse` vs `safeParse`

Zod provides two primary methods for validating runtime data:

### 1. `safeParse(data)` (Recommended)
Does not throw exceptions. Returns a discriminated union object (`{ success: true; data: T } | { success: false; error: ZodError }`):

```typescript
function handleIncomingPayload(rawJson: unknown) {
  const result = RegistrationFormSchema.safeParse(rawJson);

  if (!result.success) {
    // result.error contains detailed field-by-field error issues
    const formattedErrors = result.error.format();
    console.error("Validation failed:", formattedErrors);
    return { status: 400, errors: formattedErrors };
  }

  // Inside this block, result.data is strictly typed as RegistrationFormInput!
  console.log(`Successfully registered: ${result.data.username}`);
  return { status: 200, user: result.data };
}
```

### 2. `parse(data)`
Validates the data synchronously and throws a `ZodError` if validation fails:

```typescript
try {
  const validData = RegistrationFormSchema.parse(rawJson);
} catch (err) {
  if (err instanceof z.ZodError) {
    console.error(err.flatten().fieldErrors);
  }
}
```

## Valibot: Ultra-Lightweight Modular Validation

While Zod is rich and feature-complete, its bundle size is approximately ~12-14 KB. In performance-critical frontend bundles, **Valibot** provides an identical mental model with a modular, functional architecture that achieves a tiny 1-2 KB bundle size through aggressive tree-shaking:

```typescript
import * as v from "valibot";

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 chars")),
});

export type LoginInput = v.InferOutput<typeof LoginSchema>;

const result = v.safeParse(LoginSchema, { email: "dev@domain.com", password: "password123" });
if (result.success) {
  console.log("Logged in:", result.output.email);
}
```

## Validating External API Responses

Never trust third-party APIs to strictly adhere to their documentation. Always parse external fetch responses with a runtime schema:

```typescript
const WeatherApiResponseSchema = z.object({
  main: z.object({
    temp: z.number(),
    humidity: z.number(),
  }),
  weather: z.array(
    z.object({
      main: z.string(),
      description: z.string(),
    })
  ).min(1),
  name: z.string(),
});

export async function fetchLiveWeather(city: string) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=KEY`);
  const json = await response.json();

  // Validate and parse incoming JSON payload at runtime
  return WeatherApiResponseSchema.parse(json);
}
```

## Summary

- TypeScript static types are erased at compile time and cannot validate runtime network or user inputs.
- Runtime validation libraries (Zod, Valibot) execute validations in the running application and auto-infer static types (`z.infer<typeof Schema>`).
- `safeParse()` returns a type-safe discriminated union, preventing unhandled exceptions.
- Valibot offers a tree-shakeable, ultra-lightweight alternative to Zod for client-side applications.
- Schema validation should guard all system boundaries: API endpoints, incoming webhooks, form submissions, and database reads.

## Best Practices

1. **Infer Types from Schemas (Single Source of Truth)**: Never manually duplicate an `interface User` and a `UserSchema`. Define the schema and use `type User = z.infer<typeof UserSchema>`.
2. **Always Use `safeParse()` at API Boundaries**: Use `safeParse` to format graceful JSON error responses (`400 Bad Request`) for frontend forms.
3. **Use `.strip()` or `.passthrough()` Intentionally**: Zod strips unknown object keys by default, protecting backend databases from mass-assignment vulnerabilities.
4. **Validate Environment Variables at Startup**: Parse `process.env` with a Zod schema when your application boots to fail fast if required secrets are missing.
