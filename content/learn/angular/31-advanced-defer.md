---
title: 'Advanced Deferrable Views (@defer)'
description: 'Master Angular Deferrable Views (@defer): deferred sub-blocks (@placeholder, @loading, @error), triggers (on viewport, on interaction, on hover, on idle, on timer), prefetching strategies, and bundle splitting.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites: ['/learn/angular/30-performance-engineering']
---

# Advanced Deferrable Views (@defer)

Introduced in Angular 17, **Deferrable Views (`@defer`)** represent one of the most powerful declarative performance features in any modern frontend framework. With `@defer`, you can defer the downloading, compiling, and rendering of entire component subtrees until specific user interaction or viewport conditions are met.

The Angular compiler automatically splits any component, directive, pipe, or library imported exclusively inside a `@defer` block into a separate lazy-loaded JavaScript chunk without requiring manual dynamic `import()` statements or route splitting.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular @defer Block Architecture           │
│                                                             │
│  @defer (on viewport; prefetch on idle) {                   │
│    <app-heavy-analytics-chart [data]="chartData()" />       │
│  } @placeholder (minimum 500ms) {                           │
│    <div class="skeleton-chart">Chart Placeholder</div>      │
│  } @loading (after 100ms; minimum 300ms) {                  │
│    <app-spinner message="Loading heavy chart bundle..." />  │
│  } @error {                                                 │
│    <p class="error">Failed to load chart component.</p>     │
│  }                                                          │
│                                                             │
│  - heavy-chart.component.js is split into a lazy chunk.     │
│  - Prefetched in background during browser idle time.       │
│  - Rendered instantly when scrolled into viewport.          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Anatomy of the 4 Defer Sub-Blocks

A complete `@defer` structure contains up to 4 specialized blocks:
1. **`@defer`**: The main content block containing the lazy-loaded components.
2. **`@placeholder`**: Rendered initially before the deferred block triggers. (Can specify `minimum` display duration).
3. **`@loading`**: Rendered while the JavaScript chunk is being fetched over the network. (Can specify `after` delay and `minimum` display duration to prevent UI flickering).
4. **`@error`**: Rendered if the chunk fails to download (e.g. offline or network error).

## 2. Interaction Triggers (`on ...`)

Angular provides 6 built-in declarative triggers:
- **`on viewport`**: Triggers when the placeholder enters the browser viewport (using `IntersectionObserver`).
- **`on interaction`**: Triggers when the user clicks or presses a key on the placeholder.
- **`on hover`**: Triggers when the user hovers over the placeholder.
- **`on idle`**: Triggers when the browser main thread is idle (`requestIdleCallback`).
- **`on timer(duration)`**: Triggers after a specified duration (e.g. `on timer(5s)`).
- **`on immediate`**: Triggers immediately after client-side rendering completes.

```html
<!-- Example: Load comments only when user scrolls down to comments section -->
@defer (on viewport) {
  <app-comments-thread [articleId]="article.id" />
} @placeholder {
  <div class="comments-placeholder">Scroll down to view comments...</div>
} @loading {
  <p>Loading discussions...</p>
}
```

## 3. Custom Conditional Triggers (`when ...`)

The `when` clause accepts a boolean condition or signal:

```html
@defer (when isModalOpen() && hasPermission()) {
  <app-admin-secret-panel />
}
```

## 4. Advanced Prefetching Strategies

You can separate the **prefetching** of the JavaScript chunk from the actual **rendering** of the component. For example, prefetch the bundle when the browser is idle, but do not render the component until the user clicks:

```html
@defer (on interaction; prefetch on idle) {
  <app-complex-editor />
} @placeholder {
  <button>Click to Open Editor</button>
}
```

## Summary & Key Takeaways

- `@defer` provides declarative, fine-grained code splitting without manual dynamic imports.
- Use `@placeholder`, `@loading`, and `@error` sub-blocks to create smooth UX loading transitions.
- Combine `on viewport` and `prefetch on idle` to deliver instant interactivity without initial bundle weight.
- Dependencies used exclusively inside `@defer` are automatically extracted into separate chunks by esbuild.

## Best Practices & Senior Guidance

1. **Always Provide Sized Placeholders**: Ensure `@placeholder` elements have the same approximate height/width as the deferred component to prevent Cumulative Layout Shifts (CLS).
2. **Use `after 100ms; minimum 300ms` on `@loading`**: This prevents annoying 50ms visual flash transitions on fast network connections.
3. **Defer Heavy Third-Party Libraries**: Always wrap rich text editors (Monaco/TinyMCE), map SDKs (Mapbox/Leaflet), and charting engines (Chart.js/D3) in `@defer` blocks.
