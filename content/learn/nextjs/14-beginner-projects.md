---
title: 'Beginner Projects & Hands-On Application Labs'
description: 'Build 7 practical real-world beginner Next.js projects: modern developer portfolio, dynamic markdown blog, multi-tier documentation site, live news aggregator, product catalog, analytics dashboard, and e-commerce frontend.'
order: 14
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 50
prerequisites:
  - /learn/nextjs/04-routing
  - /learn/nextjs/05-layouts
  - /learn/nextjs/06-server-and-client-components
  - /learn/nextjs/07-data-fetching
  - /learn/nextjs/09-metadata-and-seo
  - /learn/nextjs/11-images-and-fonts
---

# Beginner Projects & Hands-On Application Labs

The most effective way to consolidate your Next.js App Router skills is by building complete, production-ready web applications. In this project lab, you will construct 7 hands-on applications that exercise routing, layouts, server components, data fetching, metadata, and dynamic parameters.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Level 1 Beginner Projects Lab                        │
├───────┬───────────────────────────────┬─────────────────────────────────────┤
│ Lab   │ Project Title                 │ Core Next.js Features Exercised     │
├───────┼───────────────────────────────┼─────────────────────────────────────┤
│ Lab 1 │ Developer Portfolio           │ next/image, next/font, SEO metadata │
│ Lab 2 │ Dynamic Markdown Tech Blog    │ [slug] dynamic routing, sitemap.ts  │
│ Lab 3 │ Hierarchical Documentation    │ [...slug] catch-all, nested layouts │
│ Lab 4 │ Live News Aggregator          │ Parallel fetch, Suspense streaming  │
│ Lab 5 │ E-Commerce Product Catalog    │ useSearchParams, generateMetadata   │
│ Lab 6 │ SaaS Analytics Dashboard      │ loading.tsx, error.tsx, charts      │
│ Lab 7 │ E-Commerce Storefront         │ Server/Client boundary, Cart state  │
└───────┴───────────────────────────────┴─────────────────────────────────────┘
```

---

## Lab 1: Dynamic Tech Blog with `generateMetadata()`

Build a high-performance blog reading dynamic articles with custom Open Graph tags:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
}

// Simulated data access
async function getArticle(slug: string): Promise<Article | null> {
  const articles: Record<string, Article> = {
    'mastering-rsc': {
      slug: 'mastering-rsc',
      title: 'Mastering React Server Components in Next.js',
      excerpt: 'Learn how RSC shifts rendering workloads to the server.',
      content: 'Server Components execute exclusively on the server...',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      publishedAt: '2026-08-20',
    },
  };
  return articles[slug] || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{article.title}</h1>
      <p className="text-sm text-slate-500 mt-2">Published on {article.publishedAt}</p>
      
      <div className="relative h-80 w-full mt-6 rounded-2xl overflow-hidden shadow-md">
        <Image src={article.coverImage} alt={article.title} fill priority className="object-cover" />
      </div>

      <div className="prose prose-slate mt-8 text-lg leading-relaxed text-slate-700">
        {article.content}
      </div>
    </article>
  );
}
```

---

## Lab 2: Catch-All Documentation Portal (`app/docs/[...slug]/page.tsx`)

Build an enterprise docs layout with deep nested routing:

```tsx
// app/docs/[...slug]/page.tsx
interface DocsProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: DocsProps) {
  const { slug } = await params;
  const currentPath = slug.join(' / ');

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
        <span>Docs</span>
        <span>/</span>
        <span className="capitalize">{currentPath}</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mt-4 capitalize">
        {slug[slug.length - 1].replace(/-/g, ' ')}
      </h1>
      <p className="mt-4 text-slate-600">
        Displaying comprehensive documentation for section: <code>{slug.join('/')}</code>
      </p>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- Beginner projects combine static and dynamic route segments with React Server Components.
- `generateMetadata()` provides dynamic social sharing cards and SEO for every dynamic route.
- Catch-all routes (`[...slug]`) power robust multi-tier documentation structures.
- Next.js automatically splits code per route, ensuring instant client navigation.
