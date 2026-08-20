---
title: 'Core Utility Classes: Spacing, Sizing, Colors & Borders'
description: 'Master core Tailwind CSS utilities: spacing scale (margin, padding, space-between), sizing (width, height, min/max), color system, backgrounds, borders, radius, and shadows.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/tailwindcss/01-tailwind-fundamentals']
---

# Core Utility Classes: Spacing, Sizing, Colors & Borders

Tailwind provides a cohesive, mathematically balanced design system built on a numeric scale. Every spacing unit, color shade, border radius, and shadow level is designed to create visually harmonious user interfaces.

Mastering core utility classes for **Spacing**, **Sizing**, **Colors**, **Borders**, and **Shadows** gives you complete control over UI layout and presentation.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The Tailwind 4px Spacing Scale              │
├─────────┬──────────────┬─────────┬──────────────┬───────────┤
│ Class   │ Pixel Value  │ Class   │ Pixel Value  │ Rem Value │
├─────────┼──────────────┼─────────┼──────────────┼───────────┤
│ p-1     │ 4px          │ p-6     │ 24px         │ 1.5rem    │
│ p-2     │ 8px          │ p-8     │ 32px         │ 2rem      │
│ p-3     │ 12px         │ p-12    │ 48px         │ 3rem      │
│ p-4     │ 16px (1rem)  │ p-16    │ 64px         │ 4rem      │
└─────────┴──────────────┴─────────┴──────────────┴───────────┘
```

## 1. Spacing Utilities: Margin & Padding

- **Padding**: `p-4` (all sides), `px-6` (horizontal left/right), `py-3` (vertical top/bottom), `pt-2`, `pr-4`, `pb-2`, `pl-4`.
- **Margin**: `m-4`, `mx-auto` (horizontal centering), `my-6`, `-mt-4` (negative margin).
- **Space Between**: `space-y-4` or `space-x-2` automatically applies top or left margins to child elements.

## 2. Sizing Utilities: Width & Height

- **Fixed Sizing**: `w-16` (64px), `w-64` (256px), `h-12` (48px).
- **Relative / Percentage Sizing**: `w-full` (100%), `w-1/2` (50%), `w-1/3` (33.333%), `w-screen` (100vw), `h-screen` (100vh), `h-dvh` (Dynamic Viewport Height for mobile).
- **Max & Min Constraints**: `max-w-md` (28rem), `max-w-xl` (36rem), `max-w-7xl` (80rem), `min-h-screen`.

## 3. Color System & Backgrounds

Tailwind includes a 22-color palette spanning shades from 50 (lightest) to 950 (darkest):

```html
<div class="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
  <p class="text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full inline-block text-sm font-semibold">
    Active Status
  </p>
</div>
```

- **Opacity Modifiers**: Append `/50` to any color (e.g. `bg-blue-600/50` or `text-slate-900/80`) to adjust alpha transparency dynamically!

## 4. Borders & Box Shadows

- **Borders**: `border` (1px), `border-2` (2px), `border-t-4` (top 4px), `border-indigo-500`.
- **Border Radius**: `rounded-none`, `rounded-md` (6px), `rounded-xl` (12px), `rounded-full` (pills/circles).
- **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-2xl`, `shadow-inner`.

## Summary & Key Takeaways

- Spacing follows a 4px scale where 1 unit = 0.25rem (4px).
- Sizing utilities support fixed, percentage, viewport, and constraint (`max-w-*`) classes.
- Colors scale from 50 to 950 with slash opacity modifiers (`bg-indigo-600/80`).
- Box shadows and rounded corners create visual hierarchy and depth.

## Best Practices & Senior Guidance

1. **Stick to the Spacing Scale**: Avoid arbitrary values like `p-[17px]` unless matching exact third-party pixel assets; standard spacing maintains visual consistency.
2. **Use `mx-auto max-w-7xl` for Page Containers**: Centering content within a standard max-width container prevents stretched layouts on ultra-wide monitors.
