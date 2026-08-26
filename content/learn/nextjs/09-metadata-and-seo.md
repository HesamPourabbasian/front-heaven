---
title: 'Metadata, SEO, Open Graph & Search Indexing'
description: 'Master SEO and metadata in Next.js App Router: static metadata, generateMetadata for dynamic routes, Open Graph social sharing cards, automated robots.ts and sitemap.ts generation.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/04-routing
---

# Metadata, SEO, Open Graph & Search Indexing

Search Engine Optimization (SEO) and social media link previews are essential for public-facing web applications. Next.js provides a built-in **Metadata API** that allows you to define page titles, descriptions, canonical links, Open Graph images, Twitter card previews, automated `sitemap.xml`, and `robots.txt` directly through TypeScript exports.

In this lesson, you will master static and dynamic metadata generation, Open Graph image mapping, and search engine crawler indexing.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Metadata API Architecture                        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Static Metadata                      │ Dynamic Metadata (generateMetadata)  │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Declared via `export const metadata`│ • Declared via `generateMetadata()`  │
│ • Defined on static pages/layouts    │ • Fetches product/blog data to set   │
│ • Inherited down child route trees   │   custom titles & Open Graph images  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Static Metadata

Define static titles, descriptions, and keywords in any `layout.tsx` or `page.tsx`:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Enterprise Dev',
    default: 'Enterprise Dev — Leading Next.js Engineering',
  },
  description: 'Master full-stack React and Next.js App Router engineering.',
  metadataBase: new URL('https://myenterprise.dev'),
  openGraph: {
    title: 'Enterprise Dev',
    description: 'Master full-stack React and Next.js App Router engineering.',
    url: 'https://myenterprise.dev',
    siteName: 'Enterprise Dev',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Enterprise Dev Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@enterprisedev',
    creator: '@enterprisedev',
  },
};
```

---

## 2. Dynamic Metadata with `generateMetadata()`

For dynamic routes (such as blog posts or e-commerce products), export an `async function generateMetadata()`:

```tsx
// app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { db } from '@/lib/db';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.summary,
    openGraph: {
      title: `${product.title} - $${product.price}`,
      description: product.summary,
      images: [{ url: product.coverImage }],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <div>Product: {slug}</div>;
}
```

---

## 3. Dynamic `sitemap.ts` Generation

Generate a standards-compliant XML sitemap programmatically:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany();

  const productUrls = products.map((p) => ({
    url: `https://myenterprise.dev/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://myenterprise.dev',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...productUrls,
  ];
}
```

---

## 4. Search Engine Crawlers with `robots.ts`

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://myenterprise.dev/sitemap.xml',
  };
}
```

---

## Summary & Key Takeaways

- Use `export const metadata: Metadata` for static routes.
- Use `export async function generateMetadata()` for dynamic database-backed pages.
- Title templates (`%s | Brand`) eliminate repetitive brand suffixes across sub-pages.
- `app/sitemap.ts` and `app/robots.ts` dynamically generate search engine indexing files.

## Best Practices & Senior Guidance

1. **Always Define `metadataBase` in Root Layout**: Ensures relative Open Graph image paths (`/og-image.png`) resolve to absolute URLs (`https://domain.com/og-image.png`).
2. **Next.js Automatically Deduplicates Fetches in `generateMetadata`**: Calling `fetchProduct(id)` inside both `generateMetadata` and `Page` executes only ONE network request thanks to Next.js request deduplication.
