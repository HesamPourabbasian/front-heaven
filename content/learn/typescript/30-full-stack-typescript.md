---
title: 'Full-Stack TypeScript'
description: 'Master full-stack TypeScript ecosystems: Node.js, Fastify, NestJS, Next.js, Nuxt, Prisma ORM, Drizzle, tRPC, GraphQL Code Generator, and end-to-end schemas.'
order: 30
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/29-type-safe-architecture
---

# Full-Stack TypeScript

Writing TypeScript across the entire technology stack—from client-side UI components to serverless edge functions, backend microservices, and database ORMs—is the pinnacle of modern web development. When both the frontend and backend share the identical language and type system, the barrier between client and server evaporates.

In this lesson, we explore full-stack frameworks (**Next.js**, **Nuxt**, **SvelteKit**, **NestJS**), type-safe database ORMs (**Prisma** and **Drizzle**), RPC communication via **tRPC**, and automated **GraphQL Code Generation**.

```text
┌────────────────────────────────────────────────────────────┐
│                Full-Stack Type Safety Matrix               │
├──────────────────────────────┬─────────────────────────────┤
│ Full-Stack Frameworks        │ Type-Safe Database ORMs     │
│ - Next.js (App Router / RSC) │ - Drizzle ORM (TypeScript-1st)│
│ - Nuxt 4 (Nitro Server / SSR)│ - Prisma (Schema Generator) │
│ - SvelteKit (Universal Load) │                             │
├──────────────────────────────┴─────────────────────────────┤
│ End-to-End RPC & API Protocols                             │
│ - tRPC (Zero-API Glue, 100% Type Inference)                │
│ - GraphQL Code Generator (Typed Queries & Mutations)       │
└────────────────────────────────────────────────────────────┘
```

## 1. Type-Safe Database ORMs: Drizzle vs Prisma

Modern TypeScript ORMs generate static types directly from your database schemas, preventing SQL typos and type mismatches.

### Drizzle ORM (TypeScript-First SQL)
Drizzle allows you to define database tables directly in pure TypeScript with zero code generation steps:

```typescript
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Infer types directly from table definition:
export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;
```

### Prisma ORM (Schema Generator)
Prisma generates a fully typed client from a declarative `.prisma` schema file:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  fullName  String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

```typescript
import { PrismaClient, type User } from "@prisma/client";

const prisma = new PrismaClient();

async function getUser(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}
```

## 2. Zero-API Glue: tRPC for Full-Stack Type Safety

**tRPC** (TypeScript Remote Procedure Call) is a revolutionary library that allows you to build fully type-safe APIs without schemas, code generators, or manual fetch wrappers. Your frontend client directly imports the *type definition* of your backend router:

### Backend Router Definition (Server):
```typescript
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const appRouter = t.router({
  getUserById: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      // input.userId is strictly typed as string
      return {
        id: input.userId,
        name: "Ada Lovelace",
        email: "ada@dev.org",
      };
    }),

  createUser: t.procedure
    .input(z.object({ email: z.string().email(), name: z.string().min(2) }))
    .mutation(async ({ input }) => {
      // Database creation...
      return { success: true, user: input };
    }),
});

// Export ONLY the type of the router (zero runtime JS sent to client)
export type AppRouter = typeof appRouter;
```

### Frontend Client Consumption (Browser):
```typescript
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server/router";

const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/trpc" })],
});

// Full autocomplete, parameter checking, and return type inference!
const user = await trpc.getUserById.query({ userId: "usr_101" });
console.log(user.name); // 'user.name' is inferred as string!
```

If you rename a backend field or change a query parameter type, your frontend build immediately fails with exact line errors!

## 3. GraphQL Code Generator

In enterprise architectures using GraphQL, **GraphQL Code Generator** inspects your GraphQL schema and `.graphql` query documents, generating strongly typed React hooks, Apollo clients, or URQL bindings:

```graphql
# src/queries/getUser.graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    fullName
  }
}
```

Running `graphql-codegen` outputs typed hooks automatically:

```tsx
// Generated Hook in React:
import { useGetUserQuery } from "./generated/graphql";

export function UserProfileView({ userId }: { userId: string }) {
  const { data, loading, error } = useGetUserQuery({ variables: { id: userId } });

  if (loading) return <p>Loading...</p>;
  return <div>{data?.user?.fullName}</div>; // Strictly typed GraphQL data!
}
```

## 4. Full-Stack Meta-Frameworks: Next.js, Nuxt, and SvelteKit

Modern full-stack meta-frameworks unify client and server execution within a single codebase:

- **Next.js (App Router)**: Uses React Server Components (RSC) and Server Actions where asynchronous server functions can be invoked directly from client forms with full type inference.
- **Nuxt (Nuxt 4 / Nitro)**: Provides automatic type generation for server routes (`server/api/*.ts`) where `useFetch('/api/users')` automatically infers the return type from the server handler!
- **SvelteKit**: Uses `+page.server.ts` load functions with automatic type generation (`PageServerData`) passed into `+page.svelte`.

## Summary

- Drizzle ORM and Prisma generate compile-time types directly from database schemas.
- tRPC enables end-to-end type safety between client and server without code generation.
- GraphQL Code Generator converts GraphQL documents into strictly typed SDKs and UI hooks.
- Next.js Server Actions, Nuxt Nitro routes, and SvelteKit load functions provide unified full-stack type safety.

## Best Practices

1. **Adopt tRPC for TypeScript Monorepos**: If both your frontend and backend are written in TypeScript, use tRPC for maximum developer velocity and zero schema drift.
2. **Use Drizzle for Maximum TypeScript Control**: Choose Drizzle ORM for serverless edge and high-performance environments where zero-overhead pure TS schemas are preferred.
3. **Automate GraphQL Codegen in CI**: Ensure GraphQL types are regenerated automatically whenever backend schemas are updated.
4. **Use Shared Zod Schemas for Full-Stack Validation**: Validate client forms and backend request bodies with the exact same Zod schema definitions.
