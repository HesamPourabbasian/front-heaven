---
title: 'Performance Engineering & Core Web Vitals'
description: 'Master Angular performance engineering: Core Web Vitals (LCP, INP, CLS), NgOptimizedImage, route-level and component-level code splitting, virtual scrolling, and memory profiling.'
order: 30
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/29-rendering-and-ssr']
---

# Performance Engineering & Core Web Vitals

Performance is a fundamental feature of web applications. Poor performance directly increases user bounce rates and damages conversion metrics. Google measures real-world user experience using **Core Web Vitals**:
1. **Largest Contentful Paint (LCP)**: Loading performance (target: < 2.5s).
2. **Interaction to Next Paint (INP)**: Responsiveness and main-thread blocking (target: < 200ms).
3. **Cumulative Layout Shift (CLS)**: Visual stability and layout shifts (target: < 0.1).

Engineering high-performance Angular applications requires optimizing critical rendering paths, utilizing `NgOptimizedImage`, implementing virtual scrolling for large lists, and eliminating memory leaks.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Core Web Vitals Optimization Matrix         │
├──────┬──────────────────────┬───────────────────────────────┤
│ Metric│ Measurement         │ Angular Optimization Solution │
├──────┼──────────────────────┼───────────────────────────────┤
│ LCP  │ Time to render main  │ - SSR & Non-destructive Hydr  │
│      │ image or text block  │ - NgOptimizedImage (priority) │
│      │                      │ - Critical CSS Inlining       │
├──────┼──────────────────────┼───────────────────────────────┤
│ INP  │ Delay after user     │ - Zoneless / OnPush Strategy  │
│      │ interaction (click)  │ - Fine-grained Signals        │
│      │                      │ - Web Workers for heavy calc  │
├──────┼──────────────────────┼───────────────────────────────┤
│ CLS  │ Unexpected visual    │ - Explicit image dimensions   │
│      │ layout movements     │ - Font fallback matching      │
│      │                      │ - Reserved skeleton sizes     │
└──────┴──────────────────────┴───────────────────────────────┘
```

## 1. Image Optimization with `NgOptimizedImage`

Images often account for over 70% of total page weight. The **`NgOptimizedImage`** directive enforces image optimization best practices automatically:
- Generates responsive `srcset` attributes automatically.
- Enforces explicit `width` and `height` to prevent CLS.
- Prioritizes critical hero images (`priority` attribute) with `<link rel="preload">`.
- Automatically lazy-loads off-screen images.

```typescript
import { Component } from '@angular/core';
import { NgOptimizedImage, provideImgixLoader } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <!-- LCP Hero Image: Preloaded with priority -->
    <img
      ngSrc="hero-banner.webp"
      width="1200"
      height="600"
      priority
      alt="Front-Heaven Platform Banner"
    />

    <!-- Lazy-loaded off-screen product thumbnail -->
    <img
      ngSrc="products/keyboard.webp"
      width="300"
      height="200"
      alt="Mechanical Keyboard"
    />
  `
})
export class HeroBannerComponent {}
```

## 2. Virtual Scrolling for Massive Lists (`@angular/cdk/scrolling`)

Rendering 5,000 DOM elements causes massive memory overhead and sluggish frame rates. **Virtual Scrolling** renders only the items currently visible inside the viewport:

```typescript
import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-large-data-list',
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <!-- Virtual viewport with 50px fixed item size -->
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport-container">
      <div *cdkVirtualFor="let item of largeList; trackBy: trackById" class="item-row">
        <span>Item #{{ item.id }}: {{ item.title }}</span>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport-container { height: 400px; width: 100%; border: 1px solid #cbd5e1; }
    .item-row { height: 50px; display: flex; align-items: center; padding: 0 1rem; border-bottom: 1px solid #f1f5f9; }
  `]
})
export class LargeDataListComponent {
  readonly largeList = Array.from({ length: 10000 }).map((_, i) => ({
    id: i + 1,
    title: `Enterprise Transaction Record #${i + 1}`
  }));

  trackById(index: number, item: any) { return item.id; }
}
```

## Summary & Key Takeaways

- Optimize Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) for optimal UX and SEO.
- `NgOptimizedImage` automates responsive sizing, preloading, and lazy loading for images.
- Virtual Scrolling renders only visible DOM nodes, allowing smooth scrolling over 100,000+ items.
- OnPush and Zoneless change detection minimize main-thread execution time for low INP.

## Best Practices & Senior Guidance

1. **Mark Above-the-Fold Images with `priority`**: Always add `priority` to your hero banner image to boost LCP scores.
2. **Never Render Unbounded Lists Directly**: For lists containing over 100 items, always use `CdkVirtualScrollViewport` or pagination.
3. **Audit with Lighthouse & PageSpeed Insights**: Integrate automated Lighthouse score assertions into CI/CD build checks.
