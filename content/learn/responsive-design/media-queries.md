---
title: 'Media queries'
description: 'Master @media syntax — min-width versus max-width, range syntax, combining conditions, and the pointer, hover, motion and colour-scheme queries beyond width.'
order: 3
difficulty: 'beginner'
category: 'Breakpoints'
estimatedMinutes: 30
prerequisites:
  - learn/css/responsive-design-and-media-queries
---

## Introduction

Fluid layouts handle the continuous range of screen sizes; media queries handle the moments where a fluid design is not enough — where a layout must *restructure*, not just resize. They are the precision tool of responsive design: a way to say "when the screen is at least this wide, add this enhancement".

The syntax is simple, but professional use has refinements that matter: preferring `min-width` over `max-width`, writing ranges instead of fixed points, and — crucially — remembering that media queries are not only about width.

## The basic syntax

A media query is `@media` followed by conditions, then a rule block. The most common conditions are `min-width` and `max-width`:

```css
@media (min-width: 768px) {
  /* applies when the viewport is at least 768px wide */
}

@media (max-width: 767px) {
  /* applies when the viewport is at most 767px wide */
}
```

Note the off-by-one: `(max-width: 767px)` and `(min-width: 768px)` do not overlap — a pattern you will see because both come from the same logical divide. The `and` keyword combines conditions; a comma acts as `or`; `not` inverts:

```css
@media (min-width: 768px) and (max-width: 1023px) {
  /* tablets: between 768px and 1023px */
}

@media (min-width: 768px), (orientation: landscape) {
  /* at least 768px wide OR in landscape */
}
```

## The direction matters: min-width versus max-width

**Desktop-first** styles write the desktop layout as the base and use `max-width` queries to downgrade it for smaller screens:

```css
/* Desktop-first: base is the full desktop layout */
.sidebar { display: block; }
@media (max-width: 1023px) {
  .sidebar { display: none; }   /* reset it away on small screens */
}
```

**Mobile-first** styles write the small-screen layout as the base and use `min-width` queries to add complexity upward:

```css
/* Mobile-first: base is the stacked mobile layout */
.sidebar { display: none; }
@media (min-width: 1024px) {
  .sidebar { display: block; }  /* add it when there's room */
}
```

The two produce identical pages and opposite codebases. Mobile-first wins for a simple reason: the base styles *are* the mobile styles, so there is never a "reset the mobile layout" step — each query layers enhancement on top of the previous state. Desktop-first code spends its life fighting its own base with `display: none` resets. Write `min-width` queries, mobile-first.

## Range syntax

Modern browsers support the range syntax, which reads like maths instead of a fixed-point workaround:

```css
@media (width >= 768px) {
  /* 768px and up */
}

@media (768px <= width <= 1023px) {
  /* between 768px and 1023px, inclusive */
}
```

`(min-width: 768px)` is shorthand for `(width >= 768px)` — they are equivalent, and you will see both in the wild. The range form is clearer when you want an interval, and it makes the off-by-one dance unnecessary: `768px <= width <= 1023px` reads exactly like the range it means.

## Beyond width: the queries that matter

Width is the workhorse, but media queries are about *conditions*, and several are indispensable:

```css
@media (hover: hover) and (pointer: fine) {
  /* a mouse or trackpad — safe to show hover effects */
}

@media (pointer: coarse) {
  /* touch — larger targets, no hover-dependence */
}

@media (prefers-reduced-motion: reduce) {
  /* the user asked for less animation */
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

@media (prefers-color-scheme: dark) {
  /* the user's OS is in dark mode */
  :root { --surface: #0f172a; }
}
```

The pattern to internalise: `(hover: hover) and (pointer: fine)` detects a precise pointer, so you can ship hover effects to mouse users without leaving touch users without features — on a phone there is no hover, and a CSS `:hover` rule can trap a tap target in a stuck state. `prefers-color-scheme` is how automatic dark mode works. `prefers-reduced-motion` is an accessibility requirement, not a nicety — it respects users with motion sensitivities, and the CSS stage's lesson on motion covers it in depth.

## Orientation and other physical conditions

Beyond width, queries can react to how the device is held and what it can do:

```css
@media (orientation: portrait) { /* taller than wide */ }
@media (orientation: landscape) { /* wider than tall */ }

@media (min-resolution: 2dppx) {
  /* retina-class screens — serve sharper images */
}
```

Orientation matters most for phones: a landscape phone is short and wide, and a layout tuned for a portrait phone often needs adjustment. The `prefers-contrast` and `forced-colors` queries extend the same family — they let you respect users who need high contrast or who run forced colour modes. You will not use all of these daily, but knowing they exist changes how you design: you stop assuming "screen" means "width".

## Organising queries in your CSS

Two professional organisation patterns dominate. The first is **grouping by component**: each component's styles live together, with its queries directly underneath:

```css
.card-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .card-grid { grid-template-columns: repeat(4, 1fr); } }
```

The second is **grouping by breakpoint** — all queries for 1024px in one place. Component grouping scales better: when you delete a component, its queries go with it, and each component reads as a self-contained story.

## Common mistakes

Using `max-width` queries exclusively and building a tangle of resets that fight the base styles. Forgetting the off-by-one and creating a gap at exactly 768px where neither query applies. Writing device-specific widths ("iPhone 14") that go stale within a year. Putting `(hover: hover)` styles on touch-first designs and leaving mobile users with broken interactions. Ignoring `prefers-reduced-motion` and animating for users who asked you not to. And testing only in the desktop DevTools view, where hover queries behave differently than on a real phone.

## Best practices

- Write mobile-first: base styles for the smallest screen, `min-width` queries upward.
- Prefer range syntax for intervals; use it to avoid the off-by-one gap.
- Use `(hover: hover) and (pointer: fine)` to gate hover effects to precise pointers.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` from the start.
- Group queries with their component instead of scattering them.
- Keep breakpoints consistent across the site — the next lesson covers choosing them.

## Summary

Media queries apply rules when conditions hold: `min-width` to add enhancement upward, `max-width` to strip the layout down, ranges for intervals, and `and`/comma/`not` to combine. Mobile-first `min-width` queries keep the base simple because the base *is* the mobile layout. Beyond width, `hover`, `pointer`, `prefers-reduced-motion` and `prefers-color-scheme` make your design respond to the device's capabilities and the user's needs — which is the true meaning of responsive.

## Practice

Take the fluid page from the previous lesson and add three enhancements with `min-width` queries: at 640px, two card columns; at 1024px, four columns and a visible navigation row; at 1280px, roomier gaps and larger type. Add a `(hover: hover) and (pointer: fine)` block that shows a card shadow on hover, and a `prefers-reduced-motion` block that disables your transitions. Then open DevTools device mode at 320px, 375px, 768px, 1024px and 1440px, and verify each query engages exactly where intended — and that no width falls in a gap where the layout looks half-adapted.