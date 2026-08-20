---
title: 'Typography: Scales, Weights & Line Clamping'
description: 'Master Tailwind typography utilities: font families, font size scale (xs to 9xl), font weights, line heights (leading), letter spacing (tracking), text alignment, truncation, and line-clamp.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/tailwindcss/02-core-utility-classes']
---

# Typography: Scales, Weights & Line Clamping

Typography is the foundation of digital user interfaces. Clean, legible typography with balanced font scales, line heights, and letter spacing ensures effortless reading experiences across diverse devices.

Tailwind CSS provides a comprehensive typographic utility system covering **Font Sizes**, **Font Weights**, **Line Heights (`leading`)**, **Letter Spacing (`tracking`)**, and **Text Clamping**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Tailwind Font Size & Leading Scale          │
├───────────┬──────────────┬──────────────┬───────────────────┤
│ Class     │ Font Size    │ Default Line │ Typical Usage     │
├───────────┼──────────────┼──────────────┼───────────────────┤
│ text-xs   │ 12px         │ 16px (1rem)  │ Badges, Captions  │
│ text-sm   │ 14px         │ 20px         │ Secondary body    │
│ text-base │ 16px         │ 24px (1.5rem)│ Standard body     │
│ text-lg   │ 18px         │ 28px         │ Lead paragraphs   │
│ text-xl   │ 20px         │ 28px         │ Card headers      │
│ text-2xl  │ 24px         │ 32px (2rem)  │ Section titles    │
│ text-4xl  │ 36px         │ 40px         │ Page H1 titles    │
│ text-6xl  │ 60px         │ 60px (1)     │ Hero headlines    │
└───────────┴──────────────┴──────────────┴───────────────────┘
```

## 1. Font Weights & Styles

- **Weights**: `font-light` (300), `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700), `font-black` (900).
- **Transformations**: `uppercase`, `lowercase`, `capitalize`, `normal-case`.
- **Letter Spacing**: `tracking-tighter`, `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-widest`.

## 2. Text Alignment & Decoration

- **Alignment**: `text-left`, `text-center`, `text-right`, `text-justify`.
- **Decoration**: `underline`, `line-through`, `no-underline`, `decoration-indigo-500`, `underline-offset-4`.

## 3. Text Truncation & Multi-Line Clamping

When displaying user-generated titles or descriptions in cards, text overflow must be handled cleanly:

```html
<!-- Single line truncation with ellipsis (...) -->
<p class="truncate font-semibold text-slate-800">
  This is a very long article headline that will truncate automatically.
</p>

<!-- Multi-line truncation using line-clamp (Clamps to exactly 2 lines) -->
<p class="line-clamp-2 text-slate-600 text-sm">
  Tailwind CSS provides built-in multi-line truncation utilities that cleanly truncate multi-paragraph descriptions after a specified number of lines.
</p>
```

## Summary & Key Takeaways

- Font sizes scale from `text-xs` (12px) to `text-9xl` (128px) with tuned line heights.
- Use `font-semibold` and `font-bold` for clear visual hierarchy.
- `truncate` handles single-line overflow; `line-clamp-2` handles multi-line summaries.

## Best Practices & Senior Guidance

1. **Pair `leading-tight` with Large Headlines**: Large font sizes (`text-4xl+`) require tighter line heights (`leading-tight` or `leading-none`) to prevent awkward line gaps.
2. **Use `tracking-wide uppercase text-xs font-bold` for Overline Badges**: This combination creates clean, professional category labels.
