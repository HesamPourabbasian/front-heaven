---
title: 'Incremental Static Regeneration (ISR) & generateStaticParams'
description: 'Master Incremental Static Regeneration (ISR) in Next.js: generateStaticParams for dynamic routes, time-based background regeneration, on-demand cache purges, and the stale-while-revalidate algorithm.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/17-caching
---

# Incremental Static Regeneration (ISR) & generateStaticParams

**Incremental Static Regeneration (ISR)** allows you to create or update static pages *after* you’ve built your site. ISR gives you the benefits of static sites (instant global CDN delivery, high security, zero database load per visitor) with the flexibility of dynamic content.

In this lesson, you will master `generateStaticParams()`, route-level ISR (`export const revalidate`), and the Stale-While-Revalidate background regeneration cycle.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    The ISR Stale-While-Revalidate Cycle                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  User visits /products/123                                                  │
│         │                                                                   │
│  Is cached page older than revalidate window (e.g. > 60s)?                  │
│         ├── NO  ──> Serves cached static HTML immediately (sub-50ms)        │
│         └── YES ──> 1. Serves current STALE static HTML immediately         │
│                     2. Triggers BACKGROUND REGENERATION on server           │
│                     3. Next visitor receives newly generated FRESH HTML!    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. `generateStaticParams()` for Pre-generating Dynamic Routes

Use `generateStaticParams()` to pre-render dynamic routes (like top 100 popular products or blog posts) at build time:

```tsx
// app/posts/[slug]/page.tsx
import { db } from '@/lib/db';

export const revalidate = 3600; // Revalidate at most once every hour (3600 seconds)

// Pre-render the top 50 most popular posts at build time
export async function generateStaticParams() {
  const posts = await db.post.findMany({
    select: { slug: true },
    take: 50,
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });

  return (
    <article className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{post?.title}</h1>
      <p className="mt-4">{post?.content}</p>
    </article>
  );
}
```

> **Dynamic Fallback Behavior**: If a user requests a slug that was *not* generated at build time (e.g. post #51), Next.js automatically renders that page on-demand upon first visit, caches the static HTML, and serves it statically to all future visitors!

---

## 2. On-Demand ISR vs Scheduled Time-Based ISR

| Feature | Time-Based ISR (`revalidate = 60`) | On-Demand ISR (`revalidatePath`) |
| :--- | :--- | :--- |
| **Trigger** | Clock timer (e.g. after 60 seconds) | CMS Webhook or Server Action |
| **Best For** | High-traffic news, weather, stock feeds | E-commerce inventory, blog updates |
| **Latency** | Immediate stale HTML + background update | Immediate fresh HTML upon mutation |

---

## Summary & Key Takeaways

- ISR generates static HTML pages that can update in the background without rebuilding the entire project.
- `generateStaticParams()` pre-renders dynamic paths at build time.
- Un-generated paths are rendered on-demand and permanently cached for subsequent visitors.
- Route-level `export const revalidate = 3600` configures background regeneration intervals.

## Best Practices & Senior Guidance

1. **Pre-render Only High-Traffic Slugs**: Don't pre-render 100,000 product pages at build time; pre-render the top 1,000 and let ISR generate the remaining 99,000 on demand.
2. **Pair with CMS Webhooks**: Trigger `revalidatePath('/blog/[slug]')` from Contentful/Sanity/Strapi webhooks so content edits appear live immediately.
