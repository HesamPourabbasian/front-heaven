---
title: 'API Routes & Route Handlers Architecture'
description: 'Master Next.js App Router Route Handlers (route.ts): standard HTTP methods (GET, POST, PUT, DELETE), NextRequest and NextResponse, reading headers/cookies, and building robust RESTful endpoints.'
order: 12
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/04-routing
---

# API Routes & Route Handlers Architecture

Next.js is a complete full-stack framework capable of hosting custom backend APIs alongside React frontend interfaces. In the App Router, backend API endpoints are defined using **Route Handlers (`route.ts`)**. Built on the modern Web Request and Response standards, Route Handlers handle RESTful HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), webhook receivers, and authentication endpoints.

In this lesson, you will master Route Handler file conventions, request body parsing, query parameter extraction, header/cookie manipulation, and status responses.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Route Handlers (route.ts) Architecture                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  app/api/users/route.ts                                                     │
│  ├── export async function GET(request: Request) { ... }                    │
│  └── export async function POST(request: Request) { ... }                   │
│                                                                             │
│  app/api/users/[id]/route.ts (Dynamic Route Handler)                        │
│  ├── export async function GET(request: Request, { params }) { ... }        │
│  └── export async function DELETE(request: Request, { params }) { ... }     │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **Important Rule**: You cannot have a `route.ts` and a `page.tsx` in the exact same folder segment, as they both handle requests at that URL.

---

## 1. Creating a RESTful Route Handler (`GET` & `POST`)

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const products = await db.product.findMany({
    where: category ? { category } : undefined,
  });

  return NextResponse.json({ success: true, data: products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Title and price are required.' },
        { status: 400 }
      );
    }

    const newProduct = await db.product.create({
      data: {
        title: body.title,
        price: body.price,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## 2. Dynamic Route Handlers (`[id]`)

Extract dynamic path parameters from the second argument of the handler:

```typescript
// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  await db.product.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
```

---

## 3. Managing Cookies & Headers in Route Handlers

Read and write HTTP cookies securely:

```typescript
// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear authentication session cookie
  cookieStore.delete('session_token');

  return NextResponse.json({ message: 'Logged out successfully' });
}
```

---

## Summary & Key Takeaways

- Route Handlers are declared inside `route.ts` files using exported HTTP method functions (`GET`, `POST`, `PUT`, `DELETE`).
- Handlers rely on standard Web APIs: `Request`, `Response`, and Next.js's helper `NextResponse`.
- Dynamic parameters (`[id]`) are passed as an asynchronous promise to the second argument.
- Route Handlers are ideal for public REST APIs, third-party webhooks (e.g. Stripe, GitHub), and external mobile apps.

## Best Practices & Senior Guidance

1. **Use Server Actions for First-Party UI Mutations**: For form submissions inside your Next.js frontend, use Server Actions rather than creating boilerplate API Route Handlers.
2. **Validate Request Bodies with Zod**: Always validate incoming JSON payloads to prevent injection attacks and runtime crashes.
