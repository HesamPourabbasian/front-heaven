---
title: 'Server-Side Rendering (SSR) & Hydration'
description: 'Deep dive into Vue 3 SSR and Hydration: client vs server rendering, solving hydration mismatches, ClientOnly components, server/client boundaries, and state serialization.'
order: 24
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/19-vue-internals
  - /learn/vue/22-nuxt-framework
---

# Server-Side Rendering (SSR) & Hydration

Server-Side Rendering (SSR) and Client-Side Hydration are foundational technologies powering high-performance, search-engine-optimized web applications built with Vue 3 and full-stack frameworks like Nuxt. While traditional Single Page Applications (SPAs) ship an empty HTML document that requires the browser to download, parse, and execute megabytes of JavaScript before rendering anything to the user, SSR renders the initial HTML markup on a Node.js server or edge worker and delivers pre-populated HTML instantaneously.

In this lesson, we will dissect the SSR rendering pipeline, master the client-side hydration process, diagnose and resolve hydration mismatch errors, enforce strict server/client boundary safety, and understand state serialization.

## CSR vs SSR vs SSG Architectural Comparison

Understanding the tradeoffs between rendering paradigms is essential when architecting web applications:

1. **Client-Side Rendering (CSR / SPA)**:
   - Server returns an empty `<div id="app"></div>` shell.
   - Browser executes JavaScript to fetch data and construct the DOM.
   - Fast post-load transitions, but slower Initial Page Load (LCP) and poor SEO indexing on social scrapers.
2. **Server-Side Rendering (SSR / Universal)**:
   - Server fetches data and executes Vue render functions on each request, returning fully formed HTML.
   - Browser displays text and visuals immediately, then boots up Vue to attach interactivity (**Hydration**).
   - Optimal for dynamic user dashboards, e-commerce, and real-time content requiring instant SEO indexing.
3. **Static Site Generation (SSG / Prerendering)**:
   - Pages are rendered into static `.html` files ahead of time at build time.
   - Served from edge CDNs with zero compute latency. Ideal for documentation, blogs, and marketing sites.

## The Hydration Process Explained

**Hydration** is the bridge between static server-generated HTML and interactive client-side Vue reactivity.

When an SSR page loads in the user's browser:
1. The browser parses and displays the raw server HTML instantly (Fast First Contentful Paint).
2. The browser downloads the client-side JavaScript bundles.
3. Vue executes client-side render functions to construct a virtual DOM tree corresponding to the markup.
4. Rather than creating new DOM elements from scratch, Vue's hydration algorithm walks the existing real DOM nodes, verifies that the client virtual DOM matches the server HTML, and attaches event listeners (`@click`, `@input`), timers, and reactive bindings directly to the existing elements.

Once hydration completes, the application transitions into a fully interactive Single Page Application.

## Diagnosing and Fixing Hydration Mismatches

A **Hydration Mismatch** occurs when the HTML generated on the server differs from the virtual DOM tree generated on the client during the initial render pass. When Vue detects a mismatch, it logs a console warning (`Hydration completed but contains mismatches`) and is forced to discard the server DOM subtree and re-render it on the client, degrading performance and causing visual flickering.

### Common Causes of Hydration Mismatches:

#### 1. Non-Deterministic Data (`Date.now()`, `Math.random()`)
Rendering timestamps or random IDs directly in templates produces different values on the server and client:

```vue
<!-- CAUSES HYDRATION MISMATCH -->
<template>
  <p>Current Time: {{ new Date().toLocaleTimeString() }}</p>
</template>
```

**Solution**: Format timestamps in `onMounted()` or pass a deterministic server timestamp through SSR state payload.

#### 2. Accessing Browser-Only Globals in Render Paths
Accessing `window`, `document`, or `localStorage` during initial setup or template evaluation:

```vue
<!-- CAUSES HYDRATION MISMATCH / CRASHES SERVER -->
<template>
  <div>Screen Width: {{ window.innerWidth }}px</div>
</template>
```

**Solution**: Initialize browser-specific values in `onMounted()` (which only runs on the client) or wrap the section in `<ClientOnly>`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const screenWidth = ref(0)
const isClientReady = ref(false)

onMounted(() => {
  screenWidth.value = window.innerWidth
  isClientReady.value = true
})
</script>

<template>
  <p v-if="isClientReady">Screen Width: {{ screenWidth }}px</p>
  <p v-else>Loading viewport...</p>
</template>
```

#### 3. Invalid HTML Nesting
Browsers automatically fix invalid HTML structures before Vue can hydrate them (e.g. putting a `<div>` inside a `<p>` tag causes browser parsers to split the `<p>` into two separate elements, breaking Vue's node alignment).

```html
<!-- INVALID HTML: Browser DOM parser will split this! -->
<p>
  <div>This is illegal inside a paragraph</div>
</p>
```

**Always adhere strictly to HTML5 element nesting specifications.**

## Isolating Client-Only Components with `<ClientOnly>`

In Nuxt and modern Vue SSR setups, use the built-in `<ClientOnly>` component to wrap third-party client-only widgets (such as interactive maps, chart canvases, rich text editors, or web-cam feeds):

```vue
<template>
  <div class="product-page">
    <h1>Interactive Product 3D Viewer</h1>

    <!-- Only rendered on the browser; server renders the fallback slot -->
    <ClientOnly>
      <ThreeJsModelViewer :model-url="modelPath" />
      
      <template #fallback>
        <div class="h-64 bg-surface-2 flex items-center justify-center text-sm text-muted">
          Loading 3D interactive viewer...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
```

## Server/Client Execution Boundaries

When writing isomorphic code that executes on both server and client, you must enforce strict environment boundaries:

```typescript
// Checking runtime environment in Nuxt / Vite
if (import.meta.client) {
  // Safe to access window, document, navigator, indexedDB
  const token = localStorage.getItem('auth_token')
}

if (import.meta.server) {
  // Safe to access server headers, Node.js buffer, private database credentials
  console.log('Rendering request on server worker')
}
```

## State Serialization & XSS Prevention

During SSR, data fetched on the server must be serialized into a JSON string and injected into the HTML document (e.g. `<script id="__NUXT_DATA__">`) so the client hydration pass can initialize state without re-fetching APIs.

Frameworks like Nuxt use specialized JSON serialization engines (like `devalue`) to sanitize payloads, automatically serialize complex types (like `Map`, `Set`, `Date`, and circular references), and encode special characters (`<`, `>`, `&`) to prevent Cross-Site Scripting (XSS) injection attacks via serialized state.

## Best Practices

- **Never Access Browser APIs in `<script setup>` Root**: Always defer `window`, `document`, and `localStorage` access to `onMounted()` or client-only utility functions.
- **Provide Fallback Slots in `<ClientOnly>`**: Always provide visual fallback placeholders in `<ClientOnly>` to maintain layout stability and prevent Cumulative Layout Shift (CLS).
- **Validate HTML Nesting Rigorously**: Avoid putting block elements (`<div>`, `<section>`) inside inline containers (`<p>`, `<span>`, `<a>`).
- **Use Isomorphic Universal Composables**: Use Nuxt's `useFetch()` or `useState()` rather than standard `ref()` initialized with random values to ensure deterministic state synchronization between server and client.

## Summary

Server-Side Rendering and Hydration combine the instantaneous speed and SEO visibility of static HTML with the interactive power of modern Vue Single Page Applications. By adhering to server/client boundary rules, preventing non-deterministic template rendering, using `<ClientOnly>` for client-specific widgets, and validating HTML structure, you can build flawless, lightning-fast SSR applications.
