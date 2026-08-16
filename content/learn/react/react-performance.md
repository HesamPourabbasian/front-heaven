---
title: "React Performance Optimization"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 25
description: "Reconciliation, Virtual DOM optimization, React.memo, lazy loading, code splitting, and bundle analysis."
---

# React Performance Optimization

React is inherently fast out of the box due to its Virtual DOM and efficient reconciliation engine. However, as applications grow in complexity, unnecessary re-renders, oversized bundle payloads, unoptimized images, and inefficient state placements can cause frame drops and sluggish user experiences.

In this lesson, you will learn how to identify performance bottlenecks using the React Profiler, eliminate wasted re-renders with `React.memo`, implement route-level code splitting with `React.lazy`, and optimize heavy list rendering.

## Understanding Wasted Re-Renders

In React, whenever a parent component re-renders, all of its child components re-render by default—even if their props have not changed. While rendering a virtual DOM tree is generally fast, rendering hundreds of complex child components with nested DOM trees can degrade performance.

You can prevent unnecessary child re-renders by wrapping functional components in **`React.memo`**:

```jsx
import React, { memo } from 'react';

interface MetricCardProps {
  label: string;
  value: number;
}

// React.memo performs a shallow comparison of props:
export const MetricCard = memo(function MetricCard({ label, value }: MetricCardProps) {
  console.log('Rendering MetricCard:', label);
  return (
    <div className="card">
      <span className="text-muted">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
});
```

## Code Splitting with `React.lazy` and `Suspense`

By default, single-page applications bundle all JavaScript into one massive file. Users must download code for entire admin dashboards and analytics graphs even if they only visit the public homepage.

**Code splitting** breaks your bundle into smaller chunks that load on demand:

```jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Dynamic imports load chunk files only when navigated to:
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AnalyticsChart = lazy(() => import('./pages/AnalyticsChart'));

export function App() {
  return (
    <Suspense fallback={<div className="loading-spinner">Loading page...</div>}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsChart />} />
      </Routes>
    </Suspense>
  );
}
```

## Optimizing Large Lists with Virtualization

Rendering thousands of DOM elements simultaneously exhausts browser memory and causes scroll stuttering. **Windowing / Virtualization** (via libraries like `@tanstack/react-virtual`) renders *only* the visible items inside the current viewport:

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualizedList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Height in px per row
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto border">
      <div
        className="w-full relative"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            className="absolute top-0 left-0 w-full p-2 border-b"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].title}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

- **Profile Before Optimizing**: Use the React DevTools Profiler to record rendering performance and pinpoint actual bottlenecks before adding `useMemo` or `React.memo`.
- **Push State Down**: Keep state as close as possible to where it is used to prevent triggering widespread parent-to-child re-renders.
- **Implement Route-Level Lazy Loading**: Always lazy-load secondary pages and heavy third-party visualization libraries.

## Summary

Optimizing React applications involves eliminating wasted re-renders using `React.memo` and `useCallback`, deferring bundle weight with `React.lazy`, and virtualizing massive data lists. Proactive profiling ensures smooth, 60fps user experiences.
