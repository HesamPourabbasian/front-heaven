---
title: 'Database Integration & Full-Stack SvelteKit'
description: 'Master full-stack database integration in SvelteKit: PostgreSQL, SQLite, Drizzle ORM, Prisma, database schema design, migrations, relations, and transactions.'
order: 22
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/svelte/11-data-fetching
  - /learn/svelte/12-form-actions
  - /learn/svelte/20-advanced-sveltekit
---

# Database Integration & Full-Stack SvelteKit

Full-stack web engineering reaches its full potential when SvelteKit's frontend and server routing integrate seamlessly with relational databases. Rather than building and maintaining a separate backend service, SvelteKit allows you to query PostgreSQL, MySQL, or SQLite directly inside server load functions (`+page.server.ts`), execute atomic database transactions in Form Actions, and enforce end-to-end TypeScript type safety from database columns all the way to Svelte 5 UI components.

In this lesson, we will explore database architecture in SvelteKit, compare modern TypeScript Object-Relational Mappers (ORMs) like **Drizzle ORM** and **Prisma**, design relational schemas, manage migrations, execute type-safe CRUD operations, handle database transactions, and configure connection pooling for serverless and edge environments.

## Modern TypeScript ORMs: Drizzle vs Prisma

When selecting an ORM for SvelteKit projects:

1. **Drizzle ORM (`drizzle-orm`)**:
   - Lightweight, zero-dependency, ultra-fast TypeScript SQL query builder.
   - Emits raw SQL with zero runtime overhead; optimal for serverless and edge environments (Cloudflare Workers, Vercel Edge).
   - Direct TypeScript schema definitions with automatic type inference (`InferSelectModel`, `InferInsertModel`).
2. **Prisma (`@prisma/client`)**:
   - Declarative schema language (`schema.prisma`), automated migrations, and rich developer tooling (Prisma Studio).
   - Generates a rich, high-level client API with automated relational joins.

## Schema Design with Drizzle ORM & SQLite / PostgreSQL

Let's configure **Drizzle ORM** for a production SvelteKit application using SQLite / libSQL (Turso) or PostgreSQL:

```typescript
// src/lib/server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// 1. Users Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'member'] }).default('member').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// 2. Posts Table with Foreign Key
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  published: integer('published', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// 3. Relational Definitions
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

// Export inferred TypeScript models
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

## Initializing the Database Client in `$lib/server/db/index.ts`

Instantiate the database connection singleton inside a server-only module:

```typescript
// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { DATABASE_PATH } from '$env/static/private'

const sqlite = new Database(DATABASE_PATH || './app.db')

// Export typed Drizzle instance
export const db = drizzle(sqlite, { schema })
```

## Running Database Migrations with Drizzle Kit

Configure `drizzle.config.ts` in the project root:

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './app.db',
  },
})
```

Generate and apply SQL migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Querying Data in SvelteKit Server Load Functions

Connect your server `load()` functions directly to database queries:

```typescript
// src/routes/blog/+page.server.ts
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { posts } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export const load: PageServerLoad = async () => {
  // Query all published posts with author relations in a single SQL query
  const publishedPosts = await db.query.posts.findMany({
    where: eq(posts.published, true),
    orderBy: [desc(posts.createdAt)],
    with: {
      author: {
        columns: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return { posts: publishedPosts }
}
```

The returned `posts` payload in `+page.svelte` contains full relational types inferred directly from the database schema!

## Mutations & Atomic Transactions in Form Actions

Database mutations (inserts, updates, deletes) belong inside SvelteKit Form Actions. When multiple database records must be updated together (e.g. creating an invoice and updating inventory), execute them inside an atomic **database transaction** to guarantee ACID consistency:

```typescript
// src/routes/posts/new/+page.server.ts
import type { Actions } from './$types'
import { db } from '$lib/server/db'
import { posts, users } from '$lib/server/db/schema'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const title = formData.get('title')?.toString().trim()
    const content = formData.get('content')?.toString().trim()

    if (!title || !content) {
      return fail(400, { error: 'Title and content are required.', values: { title, content } })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newPostId = crypto.randomUUID()

    // Execute atomic transaction
    await db.transaction(async (tx) => {
      await tx.insert(posts).values({
        id: newPostId,
        authorId: locals.user!.id,
        title,
        slug,
        content,
        published: true,
        createdAt: new Date(),
      })
    })

    throw redirect(303, `/blog/${slug}`)
  }
}
```

## Connection Pooling for Serverless & Edge Deployments

When deploying SvelteKit applications to serverless environments (like Vercel, Netlify, AWS Lambda, or Cloudflare Workers), each incoming request can spin up a new serverless function instance. If thousands of requests hit your database simultaneously, traditional PostgreSQL connection pools will exhaust available connections and crash.

### Serverless Solutions:
- **Serverless PostgreSQL**: Use providers with built-in connection pooling over HTTP / WebSockets (such as **Neon**, **Supabase**, or **Prisma Accelerate**).
- **Edge SQLite / libSQL**: Use distributed edge database engines like **Turso** (`@libsql/client`) that replicate databases globally with sub-10ms read latencies.

## Best Practices

- **Isolate Database Clients in `$lib/server/db`**: Always keep database connection files in `$lib/server/` so the SvelteKit compiler prevents accidental imports into client components.
- **Always Wrap Multi-Table Mutations in Transactions**: Use `db.transaction()` to ensure that partial database writes do not corrupt state if an intermediate operation fails.
- **Leverage Inferred TypeScript Types**: Export `typeof table.$inferSelect` from your schema to ensure UI components reflect database schema updates automatically.
- **Use Connection Pooling in Serverless**: Use HTTP/WebSocket connection pooling (Neon, Turso) to prevent connection exhaustion in serverless deployments.

## Summary

Full-stack database integration elevates SvelteKit from a frontend framework into an end-to-end application development platform. By pairing SvelteKit with modern type-safe ORMs like Drizzle, managing relational schemas and migrations, querying data in `+page.server.ts`, and executing atomic transactions in Form Actions, you can build data-driven web applications with unparalleled performance and type safety.
