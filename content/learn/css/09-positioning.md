---
title: 'CSS Positioning Schemes, Inset Offsets & Stacking Contexts'
description: 'Master CSS positioning: static, relative, absolute, fixed, sticky, coordinate offsets (top, right, bottom, left, inset), z-index, and Stacking Context creation.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/css/08-borders
---

# CSS Positioning Schemes, Inset Offsets & Stacking Contexts

While Flexbox and Grid handle macro page layout and alignment, CSS **Positioning** provides surgical micro-control over where elements render—allowing you to pin sticky navigation bars, overlay modal backdrops, position notification badges over icons, and float tooltips.

In this lesson, we explore the five positioning schemes (`static`, `relative`, `absolute`, `fixed`, `sticky`), coordinate offset properties (`top`, `right`, `bottom`, `left`, `inset`), and the rules governing **`z-index` and Stacking Contexts**.

```text
┌────────────────────────────────────────────────────────────┐
│                    CSS Positioning Schemes Overview        │
├──────────────┬───────────────────────────────┬─────────────┤
│ Scheme       │ Flow State                    │ Offset Base │
├──────────────┼───────────────────────────────┼─────────────┤
│ `static`     │ Normal document flow          │ Ignored     │
│ `relative`   │ Normal flow (keeps space)     │ Own position│
│ `absolute`   │ Removed from normal flow      │ Closest non-│
│              │                               │ static anc. │
│ `fixed`      │ Removed from normal flow      │ Viewport    │
│ `sticky`     │ Normal flow until threshold   │ Scroll cont.│
└──────────────┴─────────────────────────────┴─────────────┘
```

## 1. `static` & `relative` Positioning

- **`position: static` (Default)**: The element follows the normal document flow. `top`, `right`, `bottom`, `left`, and `z-index` have **zero effect**.
- **`position: relative`**: The element remains in the normal document flow (its original physical space is completely preserved). However, applying `top` or `left` offsets visually shifts the element from its normal position without affecting surrounding sibling elements.
- **The Most Common Use for `relative`**: Serving as the **containing anchor** for child elements positioned `absolute`!

```css
.card {
  position: relative; /* Establishes coordinate reference anchor! */
  padding: 1.5rem;
  border: 1px solid #ccc;
}

.card .badge-top-right {
  position: absolute; /* Positions relative to .card container */
  top: 12px;
  right: 12px;
}
```

## 2. `absolute` & `fixed` Positioning

- **`position: absolute`**: The element is **completely removed from the normal document flow** (occupying zero physical space in the layout). It positions itself relative to its **closest ancestor element** that has a `position` other than `static` (such as `relative` or `absolute`).
- **`position: fixed`**: The element is removed from normal flow and positioned directly relative to the **browser viewport window**. It remains permanently fixed in place even when the user scrolls the page (ideal for navigation bars and cookie consent banners):

```css
/* Fixed sticky header banner */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;
  background-color: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
}
```

## 3. `position: sticky` (The Modern Hybrid)

`position: sticky` behaves like `position: relative` until the user scrolls past a defined threshold, at which point it becomes `fixed` within the bounds of its parent container:

```css
/* Table headers that stick during scrolling */
th {
  position: sticky;
  top: 0; /* Sticks to top of scroll container when reached */
  background-color: #1e293b;
  z-index: 10;
}
```

**Rule for Sticky**: An ancestor with `overflow: hidden` or `overflow: auto` can prevent `position: sticky` from working!

## 4. `z-index` & Stacking Contexts

The `z-index` property controls the 3D stacking order along the z-axis (perpendicular to the screen):
- `z-index` only works on elements with a `position` other than `static`.
- A higher `z-index` renders in front of a lower `z-index`.

```css
/* Modal Backdrop Overlay using modern inset */
.modal-overlay {
  position: fixed;
  inset: 0; /* Shorthand for top: 0; right: 0; bottom: 0; left: 0; */
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}
```

## Summary

- `position: static` is the normal document flow default.
- `position: relative` retains its flow space and serves as an anchor for absolute children.
- `position: absolute` is removed from flow and positions relative to its nearest positioned ancestor.
- `position: fixed` pins elements to the viewport window.
- `position: sticky` transitions from relative flow to fixed positioning at a scroll threshold.
- `inset: 0` is the modern shorthand for pinning all four edges (`top/right/bottom/left: 0`).

## Best Practices

1. **Always Set `position: relative` on Containers of Absolute Children**: Prevent elements from flying off to the root document.
2. **Use `inset: 0` Over 4 Individual Offsets**: Clean, modern syntax for full-coverage overlays.
3. **Establish a Controlled `z-index` System**: Define standard layers (e.g., `10` for dropdowns, `100` for headers, `1000` for modals).
4. **Beware of `overflow: hidden` Parents with `position: sticky`**: Keep scroll parents unobstructed.
