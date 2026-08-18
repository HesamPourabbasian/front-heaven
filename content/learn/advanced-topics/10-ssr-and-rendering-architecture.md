---
title: 'SSR, Islands & Modern Rendering Architectures'
description: 'Master enterprise rendering architectures: CSR, SSR, SSG, ISR, Streaming SSR with Suspense, Partial Hydration, React Server Components (RSC), Islands Architecture, and Edge Rendering.'
order: 10
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 50
prerequisites:
  - /learn/advanced-topics/09-framework-internals
---

# SSR, Islands & Modern Rendering Architectures

The architectural spectrum of modern web rendering extends far beyond simple Client-Side Rendering (CSR). Senior engineers must evaluate trade-offs across **Server-Side Rendering (SSR)**, **Static Site Generation (SSG)**, **Incremental Static Regeneration (ISR)**, **Streaming SSR with Suspense**, **React Server Components (RSC)**, and **Islands Architecture (Astro/Fresh)**.

In this lesson, we explore rendering architectures, hydration cost breakdowns, streaming HTML over Node/Edge streams, and diagnosing tricky hydration mismatches.

```text
┌────────────────────────────────────────────────────────────┐
│               Modern Rendering Strategy Matrix             │
├──────────────┬───────────────────────────────┬─────────────┤
│ Strategy     │ When HTML is Generated        │ Client JS   │
├──────────────┼───────────────────────────────┼─────────────┤
│ CSR          │ In browser (via JavaScript)   │ Full Bundle │
│ SSR          │ On each server request (On-Dm)│ Full Bundle │
│ SSG          │ At build time                 │ Full Bundle │
│ ISR          │ Background regenerate on edge │ Full Bundle │
│ Islands/RSC  │ Server stream + partial client│ Minimal JS  │
└──────────────┴───────────────────────────────┴─────────────┘
```

## 1. The Cost of Full-Page Hydration

In traditional SSR frameworks (early Next.js / Nuxt 2), the server generates the initial HTML string and sends it to the browser. While the user sees the page quickly (**FCP**), the page is completely dead and non-interactive until the client:
1. Downloads the entire framework runtime and component JavaScript bundle.
2. Parses and executes all JavaScript.
3. Re-renders the component tree in memory to attach DOM event listeners.

This process is called **Hydration**. On mobile devices, the gap between **FCP** (visual paint) and **TTI/INP** (interactivity readiness) can be 2-5 seconds long (the "Uncanny Valley").

## 2. Streaming SSR with HTML Chunks

**Streaming SSR** leverages HTTP chunked transfer encoding (`Transfer-Encoding: chunked`) to stream HTML to the browser progressively as data resolves on the backend:

```text
HTTP Response Stream (Time ──►):
[ <head> + Navigation Skeleton ] ──► [ Critical Hero Content ] ──► [ Slow Reviews Component ]
```

The browser begins parsing, downloading CSS, and rendering the header immediately, without waiting for the slowest database query to finish!

## 3. React Server Components (RSC) vs Client Components

**React Server Components (RSC)** introduce a fundamental split:
- **Server Components (Default)**: Execute **only on the server**. They can directly query databases, read the file system, and use heavy npm packages (like Markdown parsers) with **zero KB added to client JavaScript bundle size**.
- **Client Components (`'use client'`)**: Opt-in components that need browser interactivity (`useState`, `useEffect`, `onClick`, browser APIs).

```tsx
// Server Component (0 KB sent to client bundle!)
import db from "@/lib/db";
import { MarkdownRenderer } from "@/components/heavy-markdown"; // 0 KB to client!
import InteractiveLikeButton from "./InteractiveLikeButton";   // Client Component

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.posts.findUnique({ where: { slug: params.slug } });

  return (
    <article>
      <h1>{post.title}</h1>
      <MarkdownRenderer content={post.markdown} />
      {/* Client island embedded within server-rendered tree */}
      <InteractiveLikeButton initialLikes={post.likes} postId={post.id} />
    </article>
  );
}
```

## 4. Islands Architecture

In **Islands Architecture** (pioneered by Astro and Fresh), the page is rendered as 100% static HTML by default. Interactive components ("Islands") are hydrated independently on demand:

```html
<!-- Static HTML Header (0 KB JS) -->
<header>...</header>

<!-- Interactive Search Island (Hydrates immediately on page load) -->
<SearchInput client:load />

<!-- Static Blog Article Content (0 KB JS) -->
<main>...</main>

<!-- Interactive Comments Island (Hydrates ONLY when scrolled into view!) -->
<CommentSection client:visible />
```

## 5. Diagnosing & Eliminating Hydration Mismatches

A **Hydration Mismatch** occurs when the HTML generated on the server does not match the DOM tree generated during client hydration. When this happens, the framework must discard the server DOM, causing layout flashes and performance penalties.

### Common Causes & Fixes:
1. **Using Non-Deterministic Values (`Date.now()`, `Math.random()`):**
   ```javascript
   // ❌ Mismatch: Server renders timestamp at render time, client renders later
   <span>{new Date().toLocaleTimeString()}</span>

   // ✅ Fix: Format time inside a client-only lifecycle effect or pass initial timestamp prop
   ```
2. **Accessing Browser APIs During SSR (`window`, `localStorage`, `navigator`):**
   Accessing `window` during the initial SSR render causes the server to throw `ReferenceError: window is not defined` or render different HTML than the client.
3. **Invalid HTML Nesting:**
   Browsers automatically fix invalid HTML (e.g., `<p>` tag wrapping a `<div>`, or `<tr>` directly inside `<table>` without `<tbody>`), mutating the DOM before hydration runs.

## Summary

- Traditional SSR improves initial visual paint (FCP) but incurs a heavy hydration cost before reaching interactivity (INP).
- Streaming SSR streams HTML chunks over HTTP as server promises resolve.
- React Server Components (RSC) run exclusively on the server, adding 0 KB of dependencies to client bundles.
- Islands Architecture treats pages as static HTML with isolated, independently hydrated interactive widgets.
- Hydration mismatches occur from browser-specific globals, non-deterministic timestamps, or invalid HTML nesting.

## Best Practices

1. **Keep Heavy Dependencies on the Server**: Render markdown, date formatters, and data transformers inside Server Components.
2. **Use `client:visible` for Offscreen Islands**: Delay hydrating below-the-fold components until the user scrolls them into view.
3. **Ensure Valid HTML Semantic Nesting**: Never nest block elements inside `<p>` or `<a>` tags to prevent browser DOM auto-mutation.
4. **Deploy SSR & API Routes to Edge Locations**: Run server handlers close to users (Cloudflare Workers, Vercel Edge) to minimize TTFB.
