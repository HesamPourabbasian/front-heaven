---
title: 'Databases & ORMs: PostgreSQL, Prisma & Drizzle'
description: 'Master database architecture in Next.js: PostgreSQL, Prisma ORM, Drizzle ORM, serverless connection pooling, schema migrations, relations, and ACID transactions.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites:
  - /learn/nextjs/07-data-fetching
  - /learn/nextjs/19-server-actions
---

# Databases & ORMs: PostgreSQL, Prisma & Drizzle

Next.js Server Components and Server Actions can query relational databases directly without requiring an intermediate backend microservice. To manage database connections, schema migrations, and type safety, modern Next.js teams use **Prisma ORM** or **Drizzle ORM** paired with scalable cloud **PostgreSQL** databases (Neon, Supabase, AWS RDS).

In this lesson, you will master Prisma and Drizzle integration, connection pooling in serverless environments, relational queries, and ACID database transactions.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Database Architecture                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js Server Component / Action                                          │
│         │                                                                   │
│         ▼                                                                   │
│  Prisma Client / Drizzle ORM (Type-Safe Query Builder)                      │
│         │                                                                   │
│         ▼ (Connection Pooler: PgBouncer / Neon Serverless Driver)           │
│  PostgreSQL Relational Database                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Prisma ORM Architecture

Prisma uses a declarative schema (`prisma/schema.prisma`) to generate fully type-safe TypeScript clients:

### A. Singleton Prisma Client (`lib/db.ts`):
In Next.js development, hot-reloading can instantiate multiple database connections. Use a global singleton to prevent exhausting connection limits:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

---

## 2. Drizzle ORM (Lightweight SQL-First Alternative)

Drizzle provides zero-overhead, SQL-like query syntax with instant cold-start times:

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
});
```

---

## 3. ACID Database Transactions in Server Actions

When performing multi-table mutations (e.g. creating an order and decrementing stock inventory), wrap the operations in a database transaction:

```typescript
// app/actions/checkout.ts
'use server';

import { db } from '@/lib/db';

export async function processOrder(userId: string, productId: string, quantity: number) {
  return await db.$transaction(async (tx) => {
    // 1. Decrement Product Stock
    const product = await tx.product.update({
      where: { id: productId },
      data: { inventory: { decrement: quantity } },
    });

    if (product.inventory < 0) {
      throw new Error('Insufficient inventory in stock.');
    }

    // 2. Create Order Record
    const order = await tx.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalPrice: product.price * quantity,
      },
    });

    return order;
  });
}
```

---

## Summary & Key Takeaways

- Next.js Server Components and Server Actions connect directly to databases with TypeScript ORMs.
- Prisma offers an intuitive high-level ORM; Drizzle offers lightweight SQL-first performance.
- Global singleton patterns in `lib/db.ts` prevent connection pool exhaustion during development hot-reloading.
- Multi-step database operations must use ACID transactions (`$transaction`).

## Best Practices & Senior Guidance

1. **Use Serverless Connection Poolers (PgBouncer)**: Serverless functions scale to hundreds of concurrent instances; connecting without a pooler will crash Postgres connection limits.
2. **Avoid N+1 Queries**: Always use `include` (Prisma) or `with` (Drizzle) to fetch parent-child relations in a single SQL query.
