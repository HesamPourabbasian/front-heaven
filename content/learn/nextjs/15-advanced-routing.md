---
title: 'Advanced Routing: Parallel & Intercepting Routes'
description: 'Master advanced Next.js App Router routing patterns: Parallel Routes (@slot), default.tsx fallbacks, Intercepting Routes ((.) and (..)), shareable modal routing, and conditional slot rendering.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/nextjs/04-routing
  - /learn/nextjs/05-layouts
---

# Advanced Routing: Parallel & Intercepting Routes

Enterprise applications require advanced routing capabilities such as simultaneously rendering multiple independent views on a single screen (e.g. split dashboards) and **Modal Routing** where opening a modal updates the URL without losing background page context. The Next.js App Router provides two cutting-edge routing primitives to achieve this: **Parallel Routes (`@slot`)** and **Intercepting Routes (`(..)` / `(.)`)**.

In this lesson, you will master Parallel Routes, `default.tsx` fallbacks, Intercepting Routes, and building shareable URL-driven modals.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Parallel Routes & Intercepting Routes                    │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Parallel Routes (@slot)              │ Intercepting Routes ((.) / (..))     │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Simultaneously renders multiple    │ • Intercepts navigation to display   │
│   pages in the same layout           │   a contextual modal overlay         │
│ • Slots passed as props to layout    │ • Refreshing the URL renders the     │
│ • Independent loading & error states │   full standalone page!              │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Parallel Routes (`@slot`)

Parallel Routes allow simultaneously rendering one or more pages in the same layout. Named slots are defined with an `@` prefix (e.g. `@analytics`, `@team`):

```text
app/
├── layout.tsx         # Receives { children, analytics, team } as props
├── page.tsx
├── @analytics/
│   ├── page.tsx
│   └── loading.tsx    # Independent loading skeleton for analytics!
└── @team/
    └── page.tsx
```

### Layout Integration:
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6">
      <div>{children}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4 bg-white shadow-sm">{analytics}</div>
        <div className="rounded-xl border p-4 bg-white shadow-sm">{team}</div>
      </div>
    </div>
  );
}
```

### The `default.tsx` File:
When a user navigates to a new route that does not have an active slot match, Next.js renders `default.tsx` as a fallback:

```tsx
// app/dashboard/@analytics/default.tsx
export default function DefaultAnalytics() {
  return <div>Default Analytics View</div>;
}
```

---

## 2. Intercepting Routes (`(.)`, `(..)`, `(...)`)

Intercepting Routes allow you to load a route from another part of your application within the current layout (e.g. expanding a photo in a modal overlay):

- `(.)`: Matches segments on the **same level**.
- `(..)`: Matches segments **one level above**.
- `(..)(..)`: Matches segments **two levels above**.
- `(...)`: Matches segments from the **root `app/` directory**.

```text
app/
├── feed/
│   ├── page.tsx           # Photo feed grid
│   └── @modal/
│       ├── (.)photo/[id]/ # Intercepts /photo/123 when navigated from /feed!
│       │   └── page.tsx   # Displays Modal overlay
│       └── default.tsx
└── photo/[id]/
    └── page.tsx           # Full standalone page if user opens link directly or refreshes!
```

---

## 3. URL-Driven Shareable Modals in Action

When a user clicks on a photo in `/feed`, the URL changes to `/photo/123` and the modal opens smoothly without reloading the feed. If someone copies that URL and opens it in a new browser tab, Next.js renders the full standalone `/photo/[id]` page!

```tsx
// app/feed/@modal/(.)photo/[id]/page.tsx
import { Modal } from '@/components/Modal';
import { PhotoDetail } from '@/components/PhotoDetail';

export default async function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Modal>
      <PhotoDetail id={id} />
    </Modal>
  );
}
```

---

## Summary & Key Takeaways

- Parallel Routes (`@slot`) enable multi-pane dashboards with isolated error and loading states.
- `default.tsx` prevents 404 errors during hard page refreshes on parallel routes.
- Intercepting Routes (`(.)`, `(..)`) intercept client navigations to present modal overlays while preserving standalone direct URLs.

## Best Practices & Senior Guidance

1. **Always Create a `default.tsx` for Every Slot**: Missing `default.tsx` causes Next.js to throw 404 errors during full browser page reloads.
2. **Use Modal Routing for Detail Views**: Provides superior UX by keeping background scroll context intact while generating shareable URLs.
