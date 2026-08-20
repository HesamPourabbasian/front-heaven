---
title: 'Advanced Responsive Design & Container Queries'
description: 'Master advanced responsive design: container queries (@container, @md, @lg), fluid responsive typography with clamp(), complex multi-column grids, and print media stylesheets.'
order: 11
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/05-responsive-design']
---

# Advanced Responsive Design & Container Queries

Standard responsive design evaluates the size of the global browser viewport (`@media (min-width: 768px)`). However, in modern component-driven architectures, a reusable `<UserCard>` component might be placed inside a wide main content area on one page and inside a narrow sidebar on another.

Viewport-based media queries fail here because the card needs to adapt to **its parent container's width, not the whole screen**. **CSS Container Queries (`@container`)** solve this definitively.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Viewport Query vs Container Query           │
├──────────────────────────────┬──────────────────────────────┤
│ Viewport Queries (@media)    │ Container Queries (@container│
├──────────────────────────────┼──────────────────────────────┤
│ Evaluates window.innerWidth  │ Evaluates parent element width│
│ All cards on screen change   │ Card adapts independently    │
│ layout simultaneously.       │ whether placed in sidebar    │
│                              │ or main content grid!        │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Using Container Queries with `@tailwindcss/container-queries`

```bash
npm install -D @tailwindcss/container-queries
```

Add plugin to `tailwind.config.js`:

```javascript
plugins: [
  require('@tailwindcss/container-queries'),
]
```

### Component Implementation:

```html
<!-- 1. Mark parent as a container with '@container' -->
<div class="@container">
  <!-- 2. Apply responsive styles based on CONTAINER width (@md:, @lg:) -->
  <div class="flex flex-col @md:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow">
    <img src="/avatar.jpg" class="w-16 h-16 rounded-full @md:w-20 @md:h-20 shrink-0">
    <div>
      <h4 class="text-base @md:text-xl font-bold">Hesam Pourabbasian</h4>
      <p class="text-xs @md:text-sm text-slate-500">Lead Frontend Architect</p>
    </div>
  </div>
</div>
```

## 2. Print Stylesheets (`print:`)

Tailwind provides the `print:` modifier for styling printouts and PDF exports:

```html
<nav class="print:hidden">Navigation bar hidden on paper print</nav>
<div class="p-8 text-black print:p-0 print:text-xs">
  Print-optimized report content
</div>
```

## Summary & Key Takeaways

- Container queries (`@container`, `@md:`) adapt components to parent width rather than viewport.
- Eliminates context-dependent component styling bugs.
- `print:` modifier optimizes pages for printing and PDF generation.

## Best Practices & Senior Guidance

1. **Use Container Queries for Reusable Widget Libraries**: Any component intended for sidebars, modals, or modular dashboards should be styled with `@container`.
