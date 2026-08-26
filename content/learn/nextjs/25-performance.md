---
title: 'Performance Engineering: Dynamic Imports & Bundle Optimization'
description: 'Master web performance in Next.js: next/dynamic lazy loading, @next/bundle-analyzer tree-shaking analysis, minimizing Client Component footprints, and Core Web Vitals optimization.'
order: 25
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/nextjs/11-images-and-fonts
  - /learn/nextjs/16-data-fetching-architecture
---

# Performance Engineering: Dynamic Imports & Bundle Optimization

High-performing web applications drive higher search engine visibility and conversion rates. In Next.js, performance engineering centers around keeping the initial client-side JavaScript bundle as small as possible by maximizing **React Server Components**, lazy-loading heavy third-party client widgets with **`next/dynamic`**, and analyzing bundle trees with **`@next/bundle-analyzer`**.

In this lesson, you will master dynamic imports, bundle inspection, and Core Web Vitals tuning.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js JavaScript Bundle Optimization                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Heavy Client Widget (e.g. Monaco Editor, Chart.js, PDF Viewer: 350KB)      │
│         │                                                                   │
│         ├── BAD: Standard import -> Bloats initial page load JS to 450KB!   │
│         │                                                                   │
│         └── GOOD: next/dynamic lazy import with ssr: false                  │
│               └── Initial page load JS remains tiny (< 85KB)!               │
│               └── Heavy 350KB widget loads ONLY when user opens it!         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Lazy Loading Client Components with `next/dynamic`

Use `next/dynamic` to split code and lazy-load heavy client components on demand:

```tsx
// components/Dashboard.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import heavy charting library only when needed
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div className="h-64 animate-pulse bg-slate-100 rounded" />,
  ssr: false, // Disables server-side pre-rendering if component requires browser APIs
});

export function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowChart(true)}
        className="btn-primary"
      >
        View Analytics Chart
      </button>

      {showChart && <HeavyChart />}
    </div>
  );
}
```

---

## 2. Visualizing Bundle Size with `@next/bundle-analyzer`

Analyze which `npm` packages are consuming the most bytes in your client build:

```bash
npm install @next/bundle-analyzer
```

### Configuration (`next.config.ts`):
```typescript
import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  // your configuration
};

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default analyzer(nextConfig);
```

### Running the Analysis:
```bash
ANALYZE=true npm run build
```

---

## Summary & Key Takeaways

- Maximizing React Server Components ensures the majority of UI code sends 0KB of JavaScript to the client.
- `next/dynamic` defers loading heavy libraries (charts, rich text editors) until user interaction.
- `@next/bundle-analyzer` identifies bloated dependencies during build time.

## Best Practices & Senior Guidance

1. **Avoid Giant Monolithic Libraries in Client Components**: Replace `moment.js` (70KB) or full `lodash` (80KB) with native JavaScript `Intl` APIs or small tree-shakeable functions.
2. **Keep Client Component Leaves Small**: Isolate interactive widgets at the leaves of your component tree.
