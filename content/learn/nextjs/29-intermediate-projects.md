---
title: 'Intermediate Full-Stack Projects: E-Commerce & SaaS Dashboard'
description: 'Build 2 comprehensive full-stack Next.js intermediate projects: Production E-Commerce Platform with PostgreSQL & Stripe, and Multi-Tenant SaaS Analytics Dashboard with RBAC & Server Actions.'
order: 29
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 60
prerequisites:
  - /learn/nextjs/15-advanced-routing
  - /learn/nextjs/19-server-actions
  - /learn/nextjs/20-forms
  - /learn/nextjs/21-authentication
  - /learn/nextjs/22-databases
  - /learn/nextjs/23-api-architecture
---

# Intermediate Full-Stack Projects: E-Commerce & SaaS Dashboard

At the intermediate level, building production-ready applications means synthesizing the entire Next.js full-stack toolkit: React Server Components, Server Actions for mutations, relational databases with Prisma/Drizzle, secure authentication, Stripe payment integrations, and responsive UI components.

In this project lab, you will architect and build 2 complete full-stack web applications.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Level 2 Intermediate Projects Lab                      │
├───────┬───────────────────────────────┬─────────────────────────────────────┤
│ Lab   │ Project Title                 │ Key Architecture & Integrations     │
├───────┼───────────────────────────────┼─────────────────────────────────────┤
│ Lab 1 │ Full-Stack E-Commerce Store   │ PostgreSQL, Stripe Checkout, Orders │
│ Lab 2 │ Multi-Tenant SaaS Dashboard   │ Auth.js, RBAC, Server Actions, KPI  │
└───────┴───────────────────────────────┴─────────────────────────────────────┘
```

---

## Project 1: Full-Stack E-Commerce Store with PostgreSQL & Stripe

### Architecture Overview:
- **Database**: PostgreSQL with Prisma ORM (`User`, `Product`, `Order`, `OrderItem`).
- **Server Components**: Product catalog with dynamic filtering, category search, and reviews.
- **Server Actions**: Add to cart, update quantity, and initiate Stripe Checkout session.
- **Webhooks**: `/api/webhooks/stripe` to verify signatures and record fulfilled orders.

### Key Implementation: Initiating Stripe Checkout via Server Action
```typescript
// app/actions/checkout.ts
'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { auth } from '@/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function createCheckoutSession(items: { productId: string; quantity: number }[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Authentication required');

  const productIds = items.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: product.title },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    metadata: {
      userId: session.user.id,
      itemsJson: JSON.stringify(items),
    },
  });

  redirect(checkoutSession.url!);
}
```

---

## Project 2: Multi-Tenant SaaS Analytics Dashboard

### Architecture Overview:
- **Authentication**: Auth.js v5 with GitHub and Google OAuth.
- **Access Control**: Role-Based Access Control (`owner`, `admin`, `member`).
- **Data Visualizations**: Server Component metrics cards with streaming Suspense charts.
- **Organization Switcher**: URL-based sub-path routing (`/org/[slug]/dashboard`).

```tsx
// app/org/[slug]/dashboard/page.tsx
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function OrgDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect('/login');

  const org = await db.organization.findUnique({
    where: { slug },
    include: { members: true, projects: true },
  });

  if (!org) redirect('/dashboard');

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{org.name}</h1>
          <p className="text-slate-500">Plan: Enterprise Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-white rounded-xl shadow-sm border">
          <span className="text-sm text-slate-500 font-semibold uppercase">Total Projects</span>
          <h2 className="text-3xl font-bold mt-2">{org.projects.length}</h2>
        </div>
        <div className="card p-6 bg-white rounded-xl shadow-sm border">
          <span className="text-sm text-slate-500 font-semibold uppercase">Team Members</span>
          <h2 className="text-3xl font-bold mt-2">{org.members.length}</h2>
        </div>
      </div>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Real-world Next.js applications seamlessly blend Server Actions, database queries, and third-party APIs.
- Stripe checkout sessions can be initiated directly inside Server Actions using `redirect()`.
- Multi-tenant architectures isolate organizational data using dynamic parameters and verified user sessions.
