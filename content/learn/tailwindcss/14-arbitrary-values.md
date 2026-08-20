---
title: 'Arbitrary Values, Properties & CSS Functions'
description: 'Master arbitrary values in Tailwind: bracket notation ([17px]), arbitrary properties ([mask-type:alpha]), CSS variables (bg-[var(--brand)]), calc() dynamic math, and CSS functions (clamp, min, max).'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites: ['/learn/tailwindcss/02-core-utility-classes']
---

# Arbitrary Values, Properties & CSS Functions

While Tailwind's design scale provides pre-configured spacing and colors, real-world development occasionally demands one-off values (e.g. integrating a legacy 37px marketing banner or matching a 3D canvas viewport).

Tailwind's **Arbitrary Value Syntax (`[...]`)** allows you to inject precise custom values, arbitrary CSS properties, and native CSS functions directly in your class names without creating custom CSS files.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Arbitrary Value Syntax Examples             │
├───────────────────┬─────────────────────────────────────────┤
│ Pattern           │ Tailwind Class Example                  │
├───────────────────┼─────────────────────────────────────────┤
│ Exact Dimensions  │ w-[320px] h-[calc(100vh-4rem)]          │
├───────────────────┼─────────────────────────────────────────┤
│ Custom Hex / RGB  │ bg-[#0f172a] text-[rgb(34,197,94)]      │
├───────────────────┼─────────────────────────────────────────┤
│ CSS Variables     │ bg-[var(--brand-primary)]               │
├───────────────────┼─────────────────────────────────────────┤
│ Arbitrary Property│ [mask-type:alpha] [clip-path:polygon(..)]│
├───────────────────┼─────────────────────────────────────────┤
│ Complex Grid Area │ grid-cols-[240px_1fr_300px]             │
└───────────────────┴─────────────────────────────────────────┘
```

## 1. Dynamic Calculations with `calc()`

When writing math inside arbitrary brackets, **spaces must be omitted or replaced with underscores (`_`)**, because spaces delimit class names in HTML:

```html
<!-- Correct calc() syntax: No spaces around operators -->
<div class="w-[calc(100%-2rem)] h-[calc(100vh-64px)]">
  Full height minus navbar
</div>
```

## 2. Fluid Typography with `clamp()`

```html
<!-- Fluid headline scaling smoothly from 24px on mobile to 64px on 4K -->
<h1 class="text-[clamp(1.5rem,5vw,4rem)] font-black">
  Fluid Typography Headline
</h1>
```

## 3. Arbitrary Properties & Selectors

For obscure or cutting-edge CSS properties not covered by core Tailwind:

```html
<div class="[writing-mode:vertical-rl] [text-orientation:upright]">
  Vertical Text
</div>
```

## Summary & Key Takeaways

- Square brackets `[...]` inject arbitrary values on the fly.
- Connect CSS variables directly via `bg-[var(--custom-var)]`.
- Replace spaces with underscores or omit spaces in `calc()` expressions.
- Arbitrary properties `[property:value]` style any valid CSS rule.

## Best Practices & Senior Guidance

1. **Use Arbitrary Values Sparingly**: If a value is used more than 3 times across your project, promote it to a named token in `tailwind.config.js`.
