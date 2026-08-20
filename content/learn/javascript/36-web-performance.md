---
title: 'Web Performance'
description: 'Master web performance engineering: Core Web Vitals (LCP, INP, CLS, FCP, TTFB), Critical Rendering Path optimization, code splitting, tree shaking, asset preloading/prefetching, Long Task elimination, list virtualization, and performance budgets.'
order: 36
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/35-advanced-browser-architecture
---

# Web Performance Engineering

Web performance is a fundamental quality indicator for modern web applications. Study after study confirms that slow load times, high input latency, and visual instability directly degrade user engagement, search engine SEO rankings, and business conversion rates.

Performance engineering requires moving beyond basic file minification. Modern practitioners optimize around Google's standardized **Core Web Vitals** metrics, eliminate main-thread **Long Tasks**, architect granular **Code-Splitting** boundaries, leverage intelligent asset resource hints (`preload`, `prefetch`), and implement DOM **Virtualization** for massive datasets.

In this lesson, we will explore Core Web Vitals (LCP, INP, CLS, FCP, TTFB), analyze Critical Rendering Path optimizations, implement dynamic code splitting, configure prefetching strategies, eliminate main-thread bottlenecks, build a DOM virtualization engine, and establish CI performance budgets.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Google Core Web Vitals Thresholds               │
├───────────────────┬────────────────────┬───────────────┬───────────────┤
│ Metric            │ Description        │ Good (Fast)   │ Poor (Slow)   │
├───────────────────┼────────────────────┼───────────────┼───────────────┤
│ LCP               │ Largest Contentful │ ≤ 2.5 seconds │ > 4.0 seconds │
│ (Loading)         │ Paint (Hero image) │               │               │
│ INP               │ Interaction to     │ ≤ 200 ms      │ > 500 ms      │
│ (Responsiveness)  │ Next Paint         │               │               │
│ CLS               │ Cumulative Layout  │ ≤ 0.1         │ > 0.25        │
│ (Stability)       │ Shift              │               │               │
└───────────────────┴────────────────────┴───────────────┴───────────────┘
```

## Core Web Vitals Deep Dive

1. **LCP (Largest Contentful Paint)**: Measures perceived loading speed by recording when the largest visual content element (hero image, video poster, large text block) becomes visible.
   - Optimization: Prioritize hero image with `<link rel="preload" as="image">`, compress images to WebP/AVIF, and eliminate render-blocking CSS/JS.
2. **INP (Interaction to Next Paint)**: Measures user responsiveness across all clicks, taps, and keypresses throughout the page lifetime, capturing the latency until the browser renders visual feedback.
   - Optimization: Break Long Tasks (>50ms) using `scheduler.yield()` or Web Workers; avoid blocking synchronous computations during event handlers.
3. **CLS (Cumulative Layout Shift)**: Measures visual stability by calculating the sum total of all unexpected layout shifts occurring during viewing.
   - Optimization: Always declare explicit `width` and `height` attributes on `<img>` and `<video>` tags; reserve space for dynamic ads and embeds using CSS `aspect-ratio` or `min-height`.
4. **FCP (First Contentful Paint)**: Time until the browser renders the very first bit of DOM text or image.
5. **TTFB (Time to First Byte)**: Time taken for the server to process the request and deliver the initial HTML byte.

## Critical Rendering Path and Asset Hints

Optimizing how the browser discovers, downloads, and executes critical assets:

- **`dns-prefetch`**: Resolves DNS records for third-party domains in advance: `<link rel="dns-prefetch" href="https://fonts.googleapis.com">`.
- **`preconnect`**: Performs DNS resolution + TCP handshake + TLS negotiation in advance: `<link rel="preconnect" href="https://api.example.com">`.
- **`preload`**: High-priority request for critical assets needed in the immediate rendering path (hero fonts, LCP images): `<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>`.
- **`prefetch`**: Low-priority background download of assets anticipated for future user navigations: `<link rel="prefetch" href="/js/checkout-chunk.js">`.

## Code Splitting and Tree Shaking

- **Route-Based Code Splitting**: Dividing the application bundle into distinct chunks per route via dynamic `import()`. Users download only the JavaScript needed for their active page.
- **Component-Level Lazy Loading**: Loading heavy components (charts, rich text editors, 3D canvases) only when rendered.
- **Tree Shaking**: The static analysis process performed by bundlers (Rollup, Webpack, esbuild) that removes unused exports from final production bundles.

```javascript
// Route-based dynamic import in client routers
const routes = {
  "/": () => import("./views/HomeView.js"),
  "/dashboard": () => import("./views/DashboardView.js"),
  "/analytics": () => import("./views/AnalyticsView.js")
};
```

## Main-Thread Optimization and Yielding: `scheduler.yield()`

A **Long Task** is any JavaScript task that monopolizes the main thread for **more than 50 milliseconds**. Long tasks block the browser from processing user interactions, causing high INP scores.

Modern browsers provide the **Prioritized Task Scheduling API** and `scheduler.yield()` to allow long tasks to periodically yield control back to the browser:

```javascript
async function processLargeDataset(items) {
  for (let i = 0; i < items.length; i++) {
    performHeavyCalculation(items[i]);

    // Yield control to the browser every 50 items so the UI stays responsive
    if (i % 50 === 0 && "scheduler" in window && "yield" in scheduler) {
      await scheduler.yield();
    }
  }
}
```

## DOM Virtualization (Windowing)

Rendering 10,000 DOM nodes simultaneously crashes browser memory and causes layout lag. **Virtualization** renders only the small subset of items currently visible within the viewport (plus a small overscan buffer), dynamically reusing DOM nodes as the user scrolls.

```javascript
class VirtualList {
  constructor({ container, totalItems, itemHeight, renderItem }) {
    this.container = container;
    this.totalItems = totalItems;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.viewportHeight = container.clientHeight;

    this.container.addEventListener("scroll", () => this.render());
    this.render();
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - 2);
    const endIndex = Math.min(
      this.totalItems - 1,
      Math.floor((scrollTop + this.viewportHeight) / this.itemHeight) + 2
    );

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push(this.renderItem(i, i * this.itemHeight));
    }

    this.container.innerHTML = `
      <div style="height: ${this.totalItems * this.itemHeight}px; position: relative;">
        ${visibleItems.join("")}
      </div>
    `;
  }
}
```

## Summary

Web performance engineering focuses on optimizing user-centric Core Web Vitals (LCP, INP, CLS). Asset hints (`preload`, `prefetch`, `preconnect`) optimize the Critical Rendering Path. Route-based code splitting and tree shaking reduce initial bundle sizes. Break Long Tasks with `scheduler.yield()` to maintain responsive INP, and implement DOM Virtualization to render massive datasets smoothly.

## Best Practices

1. **Preload the LCP Hero Image**: Eliminate image discovery latency with `<link rel="preload" as="image">` and `fetchpriority="high"`.
2. **Always Specify Image Aspect Ratios**: Prevent Cumulative Layout Shift (CLS) by giving all images explicit dimensions or CSS `aspect-ratio`.
3. **Break Up Long Tasks (>50ms)**: Yield control using `scheduler.yield()` or offload heavy processing to Web Workers.
4. **Enforce Bundle Size Budgets in CI**: Configure automated tools (Lighthouse CI, Bundlesize) to fail builds if bundles exceed established size limits.
5. **Use List Virtualization for >100 Items**: Never render thousands of complex table rows or list items directly into the DOM; virtualize the viewport.
