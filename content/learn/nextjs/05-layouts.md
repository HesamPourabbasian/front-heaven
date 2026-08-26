---
title: 'Layouts, Templates & Shared UI Architecture'
description: 'Master Next.js App Router layouts: mandatory root layout, nested sub-layouts, state persistence across page transitions, route-specific layouts, and layout.tsx vs template.tsx mechanics.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/nextjs/03-app-router
---

# Layouts, Templates & Shared UI Architecture

In modern web applications, large portions of the UI (such as global headers, navigation sidebars, breadcrumbs, and footers) remain constant as users navigate between pages. Next.js provides a sophisticated layout hierarchy via **`layout.tsx`** and **`template.tsx`** that preserves component state, prevents unnecessary DOM re-rendering, and supports nested view hierarchies.

In this lesson, you will master the mandatory root layout, nested layouts, layout state persistence, and understand when to choose `template.tsx` over `layout.tsx`.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Next.js Layout Nesting Cascade                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  app/layout.tsx (Root Layout: <html>, <body>, Global Providers, Nav)        │
│    └── app/dashboard/layout.tsx (Dashboard Shell: Sidebar, Auth Check)     │
│          └── app/dashboard/settings/layout.tsx (Settings Tab Bar)           │
│                └── app/dashboard/settings/page.tsx (Active Page Content)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The Mandatory Root Layout (`app/layout.tsx`)

Every Next.js App Router project must have a top-level `app/layout.tsx`. It is the only layout that contains the `<html>` and `<body>` tags:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Enterprise Platform',
  description: 'Built with Next.js App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

---

## 2. Nested Layouts & State Persistence

When a user navigates between sibling routes inside a folder (e.g. from `/dashboard/analytics` to `/dashboard/settings`), Next.js only re-renders the `page.tsx` component. The parent `layout.tsx` **never unmounts or re-renders**, preserving scroll positions, active tab states, and form inputs:

```tsx
// app/dashboard/layout.tsx
import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays mounted across all dashboard sub-page navigations */}
      <DashboardSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

---

## 3. `layout.tsx` vs `template.tsx`

While layouts maintain their state and do not re-render across sub-routes, **templates (`template.tsx`)** create a new component instance on every navigation:

```text
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ layout.tsx (Default & Recommended)   │ template.tsx (Opt-In Exception)      │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Persists across navigations        │ • Creates a new instance every time  │
│ • Maintains state & scroll position  │ • State is reset upon navigation     │
│ • Effects (useEffect) do not re-run  │ • useEffect re-runs on every page    │
│ • Best for: Navbars, Sidebars, Shells│ • Best for: Page entry animations,   │
│                                      │   per-page analytics tracking        │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Example `template.tsx` for Page Transition Animations:
```tsx
// app/template.tsx
'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Summary & Key Takeaways

- `app/layout.tsx` is required and must define the `<html>` and `<body>` tags.
- Nested layouts nest automatically based on the folder hierarchy.
- Layouts persist across navigations without unmounting, guaranteeing high performance.
- Use `template.tsx` only when you specifically require component remounting (e.g. CSS entrance animations).

## Best Practices & Senior Guidance

1. **Do Not Fetch Per-Page Data in Root Layout**: Data fetched in root layout blocks initial page generation; fetch page-specific data inside individual `page.tsx` components.
2. **Keep Global Providers in Root Layout**: Wrap React Context Providers (Theme, QueryClient, Auth) in client component wrappers inside `app/layout.tsx`.
