---
title: 'Vue 3 Performance Optimization'
description: 'Master enterprise frontend performance in Vue 3: Core Web Vitals (LCP, INP, CLS), v-memo, v-once, virtual scrolling, bundle analysis, shallow reactivity, and tree shaking.'
order: 23
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/vue/19-vue-internals
  - /learn/vue/20-advanced-reactivity
---

# Vue 3 Performance Optimization

Delivering blazing-fast user experiences is a non-negotiable requirement for modern web applications. High-performance applications retain users, rank higher on search engines, and operate reliably on low-powered mobile hardware. While Vue 3 is exceptionally fast out of the box, building large-scale applications with rich datasets, real-time charts, and complex component trees requires deliberate performance optimization techniques.

In this lesson, we will explore Core Web Vitals, code-splitting and dynamic chunk loading, bundle size analysis, virtual list scrolling, template memoization with `v-once` and `v-memo`, and reactivity memory minimization.

## Core Web Vitals and Vue Metrics

Google's **Core Web Vitals** measure real-world user experience across three critical dimensions:

1. **Largest Contentful Paint (LCP)**: Measures loading speed. Measures when the main content of a page has likely loaded (Target: $< 2.5\text{ s}$). Optimizations include SSR/SSG, image optimization, and eliminating render-blocking JavaScript bundles.
2. **Interaction to Next Paint (INP)**: Measures responsiveness. Measures latency after user interaction (clicks, taps, keystrokes) until the next frame repaints (Target: $< 200\text{ ms}$). Optimizations include debouncing handlers, unblocking the main thread, and leveraging `shallowRef`.
3. **Cumulative Layout Shift (CLS)**: Measures visual stability. Ensures page elements do not unexpectedly shift as fonts, images, or async components load (Target: $< 0.1$).

## Bundle Size Analysis with `rollup-plugin-visualizer`

The fastest JavaScript code is the code that is never sent to the browser. Heavy third-party packages (like un-tree-shaken Lodash, Moment.js, or duplicate icon packs) inflate initial bundle sizes.

Install the Rollup visualizer plugin in your Vite project:

```bash
npm install -D rollup-plugin-visualizer
```

Configure in `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'bundle-stats.html',
      open: true, // Automatically opens visual treemap in browser after build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

Run `npm run build` to inspect your bundle treemap, identify oversized dependencies, and replace them with modern, tree-shakeable lightweight alternatives (e.g. replacing Moment.js with `date-fns` or native `Intl`).

## Template Optimization Directives: `v-once` and `v-memo`

Vue 3 provides powerful compiler-assisted directives to bypass unnecessary virtual DOM diffing entirely:

### 1. `v-once` (Render Once, Never Update)
Elements and components marked with `v-once` are rendered exactly once on initial load. In all subsequent re-render cycles, Vue skips the element and all of its children completely, treating the entire subtree as static cached VNodes.

```vue
<template>
  <!-- Rendered once and never diffed again, even if description or terms change -->
  <section v-once class="terms-of-service">
    <h2>Legal Disclaimer</h2>
    <p>{{ legalTermsText }}</p>
  </section>
</template>
```

### 2. `v-memo` (Conditional Subtree Memoization)
Introduced in Vue 3.2, `v-memo` accepts an array of dependencies (`v-memo="[depA, depB]"`). Vue will **memoize the rendered VNode subtree** and skip diffing as long as every value in the dependency array remains identical to the previous render cycle.

`v-memo` is extraordinarily effective when rendering large `v-for` lists (1,000+ items) where only the selected item changes:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref(Array.from({ length: 2000 }, (_, i) => ({ id: i, name: `Entity #${i}` })))
const selectedId = ref<number | null>(null)
</script>

<template>
  <ul class="large-list">
    <!-- v-memo only re-renders an item if its selection status changes! -->
    <li
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id === selectedId]"
      @click="selectedId = item.id"
      :class="{ 'bg-primary text-white': item.id === selectedId }"
      class="p-2 border-b"
    >
      {{ item.name }} (Selected: {{ item.id === selectedId }})
    </li>
  </ul>
</template>
```

In the example above, clicking an item skips re-rendering 1,998 list items and updates only the previous and newly selected items!

## Virtual Scrolling for Massive Datasets

When rendering datasets with 10,000+ rows (e.g. data grids, financial logs, live chat history), rendering 10,000 real DOM elements crashes mobile browser performance and consumes hundreds of megabytes of RAM.

**Virtual Scrolling** solves this by only rendering the 20 to 50 DOM nodes currently visible within the user's viewport, continuously recycling elements as the user scrolls:

```bash
npm install vue-virtual-scroller
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

interface LogEntry {
  id: number
  timestamp: string
  message: string
}

// 50,000 records handled effortlessly at 60 FPS!
const logs = ref<LogEntry[]>(
  Array.from({ length: 50000 }, (_, i) => ({
    id: i,
    timestamp: new Date().toISOString(),
    message: `Server event log record #${i} status: 200 OK`,
  }))
)
</script>

<template>
  <div class="scroller-container h-96 border rounded-2xl overflow-hidden">
    <RecycleScroller
      class="h-full"
      :items="logs"
      :item-size="42"
      key-field="id"
      v-slot="{ item }"
    >
      <div class="flex justify-between items-center px-4 py-2 border-b text-xs font-mono">
        <span class="text-muted">{{ item.timestamp }}</span>
        <span class="font-bold text-ink">{{ item.message }}</span>
      </div>
    </RecycleScroller>
  </div>
</template>
```

## Minimizing Reactivity Overhead with `shallowRef` and `markRaw`

Wrapping massive, deeply nested JavaScript objects (such as complex JSON responses, Map instances, or charts) in standard `ref()` causes Vue to recursively traverse every single nested key to attach `Proxy` handlers.

For large immutable or read-only datasets, replace `ref()` with **`shallowRef()`**:

```typescript
import { shallowRef } from 'vue'

// 1. FAST: shallowRef creates a single Proxy on the root .value container
const largeAnalyticsData = shallowRef<MetricPayload[]>([])

async function loadData() {
  // Replacing the entire array triggers reactivity instantly with zero deep proxy overhead
  largeAnalyticsData.value = await fetchBigMetrics()
}
```

Use **`markRaw()`** on complex third-party class instances (e.g. Leaflet Map, Three.js Scene, Chart.js instance) to ensure Vue never attempts to make them reactive.

## Profiling Performance with Vue DevTools

To find performance bottlenecks in your running application:
1. Open Chrome DevTools and navigate to the **Vue DevTools** tab.
2. Select the **Timeline / Performance** tab and click **Record**.
3. Perform the slow user interaction (e.g. filtering a table or opening a dialog).
4. Inspect the flame chart to identify components with high render durations or excessive re-render counts.

## Best Practices

- **Use `v-memo` on Large Lists**: Add `v-memo="[item.id === selectedId]"` to long lists where only individual items update.
- **Adopt Virtual Scrolling for >500 Items**: Never render thousands of real DOM nodes at once; virtualize long lists with `vue-virtual-scroller`.
- **Default to `shallowRef` for Heavy Remote Datasets**: Avoid deep proxying overhead for API payloads that are replaced wholesale rather than mutated property-by-property.
- **Audit Third-Party Bundle Weight**: Periodically run `rollup-plugin-visualizer` to eliminate heavy, un-tree-shaken dependencies.

## Summary

Performance optimization in Vue 3 is a disciplined engineering process. By understanding Core Web Vitals, analyzing bundles, virtualizing massive lists, applying `v-once` and `v-memo` compiler optimizations, and leveraging `shallowRef` for large datasets, you can ensure your Vue applications execute smoothly at a consistent 60 frames per second.
