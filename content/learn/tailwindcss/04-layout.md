---
title: 'Layout: Flexbox, CSS Grid & Positioning'
description: 'Master modern CSS layout with Tailwind: Flexbox (direction, wrap, justify, align, gap), CSS Grid (grid-cols, rows, auto-fit), and Positioning (absolute, relative, fixed, sticky, z-index).'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/tailwindcss/02-core-utility-classes']
---

# Layout: Flexbox, CSS Grid & Positioning

Building responsive web interfaces requires mastery over modern CSS layout systems: **Flexbox** for one-dimensional linear distributions, **CSS Grid** for two-dimensional column and row matrices, and **CSS Positioning** for overlaying modals, tooltips, and sticky headers.

Tailwind provides an intuitive, expressive utility syntax that makes constructing complex multi-column layouts effortless.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Flexbox vs CSS Grid in Tailwind             │
├──────────────────────────────┬──────────────────────────────┤
│ Flexbox (1D Distribution)    │ CSS Grid (2D Matrix Layout)  │
├──────────────────────────────┼──────────────────────────────┤
│ <div class="flex items-center│ <div class="grid             │
│            justify-between   │            grid-cols-3       │
│            gap-4">           │            gap-6">           │
│   <div>Logo</div>            │   <div>Card 1</div>          │
│   <nav>Nav Links</nav>       │   <div>Card 2</div>          │
│   <button>Sign In</button>   │   <div>Card 3</div>          │
│ </div>                       │ </div>                       │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Flexbox Layouts in Detail

- **Display**: `flex`, `inline-flex`.
- **Direction**: `flex-row` (default), `flex-col` (vertical stack), `flex-row-reverse`.
- **Alignment (Cross Axis)**: `items-start`, `items-center`, `items-end`, `items-baseline`, `items-stretch`.
- **Justification (Main Axis)**: `justify-start`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly`.
- **Flex Grow & Shrink**: `grow`, `grow-0`, `shrink-0` (prevents icons/avatars from squishing).
- **Gap**: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `gap-x-4`, `gap-y-2`.

## 2. CSS Grid Layouts in Detail

CSS Grid divides space into structured rows and columns:

```html
<!-- Responsive Product Grid: 1 col on mobile, 2 on tablet, 4 on desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="bg-white p-4 rounded-xl shadow">Product 1</div>
  <div class="bg-white p-4 rounded-xl shadow">Product 2</div>
  <div class="bg-white p-4 rounded-xl shadow">Product 3</div>
  <div class="bg-white p-4 rounded-xl shadow">Product 4</div>
</div>
```

- **Column Spanning**: `col-span-2` (spans 2 columns), `col-span-full` (spans entire width).

## 3. CSS Positioning & Z-Index

- **`relative`**: Establishes a positioning context for absolute children.
- **`absolute`**: Positions element relative to nearest positioned ancestor (`top-0`, `right-0`, `bottom-4`, `left-2`, `inset-0`).
- **`fixed`**: Positions element relative to the browser viewport (`fixed top-0 left-0 w-full`).
- **`sticky`**: Element scrolls normally until reaching offset threshold, then sticks (`sticky top-0 z-50`).
- **`z-index`**: `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-auto`.

## Summary & Key Takeaways

- Use Flexbox (`flex`) for navigation bars, button groups, and linear content rows.
- Use CSS Grid (`grid grid-cols-*`) for card lists, galleries, and dashboard widgets.
- Use `gap-*` to distribute spacing between grid and flex children automatically.
- Pair `relative` parents with `absolute` children for badges, dropdowns, and overlays.

## Best Practices & Senior Guidance

1. **Prefer `gap-*` Over Margins**: Use `flex gap-4` rather than applying `mr-4` to every child element to eliminate trailing margin bugs.
2. **Use `shrink-0` on Avatars & Icons**: Prevents SVG icons and user avatars from collapsing when neighboring text wraps onto multiple lines.
