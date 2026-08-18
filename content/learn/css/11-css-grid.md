---
title: 'CSS Grid Layout & 2D Grid Geometry'
description: 'Master CSS Grid: Grid containers, grid-template-columns/rows, fraction unit (fr), repeat(), minmax(), auto-fit vs auto-fill, grid lines, and responsive grids with zero media queries.'
order: 11
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/css/10-flexbox
---

# CSS Grid Layout & 2D Grid Geometry

While Flexbox is fundamentally a 1-dimensional layout system designed for rows *or* columns, **CSS Grid Layout** is a true **2-Dimensional Layout Engine** capable of controlling rows and columns simultaneously. Grid allows front-end engineers to author sophisticated magazine-style layouts, complex responsive dashboards, and auto-adapting card catalogs with a fraction of the code.

In this lesson, we explore Grid containers, the **`fr` (Fraction)** unit, `repeat()`, `minmax()`, responsive auto-fitting without media queries (`auto-fit` vs `auto-fill`), and explicit line placement.

```text
┌────────────────────────────────────────────────────────────┐
│                    CSS 2D Grid Coordinate System           │
├────────────────────────────────────────────────────────────┤
│ Line 1        Line 2        Line 3        Line 4           │
│   │             │             │             │              │
│ 1 ├── [Col 1] ──┼── [Col 2] ──┼── [Col 3] ──┤ (Row 1)      │
│   │             │             │             │              │
│ 2 ├── [Col 1] ──┼── [Col 2] ──┼── [Col 3] ──┤ (Row 2)      │
│   │             │             │             │              │
│ 3 └─────────────┴─────────────┴─────────────┘              │
└────────────────────────────────────────────────────────────┘
```

## 1. Grid Fundamentals: Templates & The Fraction Unit (`fr`)

Setting `display: grid` activates the grid formatting context. Define columns and rows using explicit tracks:

- **`fr` (Fraction Unit)**: Represents a fraction of the remaining available space inside the grid container after fixed dimensions (`px`, `rem`) are allocated:

```css
/* 3-Column Layout: 250px fixed sidebar, and remaining space split 2:1 */
.dashboard-layout {
  display: grid;
  grid-template-columns: 250px 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1.5rem;
  min-height: 100vh;
}
```

## 2. Track Repetition with `repeat()`

Avoid repeating identical track definitions by wrapping them in `repeat(count, track_size)`:

```css
/* 4 equal columns */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
```

## 3. The Responsive Holy Grail: `repeat(auto-fit, minmax(280px, 1fr))`

Create a completely responsive card grid that automatically wraps, scales, and fills available space across mobile, tablet, and 4K desktop screens **with zero media queries**:

```css
.auto-responsive-catalog {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### Dissecting the Formula:
1. **`minmax(280px, 1fr)`**: Each card will never be narrower than `280px`, but can expand up to `1fr` to fill extra room.
2. **`auto-fit`**: The browser computes how many 280px columns fit on screen. On a 320px mobile screen, it renders 1 column; on a 1200px desktop screen, it fits 4 columns and stretches them evenly!

### `auto-fit` vs `auto-fill`:
- **`auto-fit`**: Stretches existing items to fill the full container width when fewer items exist than total possible columns.
- **`auto-fill`**: Reserves empty ghost column slots without stretching existing items.

## 4. Grid Lines & Item Placement: `grid-column` & `grid-row`

Grid lines are numbered starting at `1` from the outer edges:

```css
/* Feature card spanning 2 columns and 2 rows */
.hero-card {
  /* Spans from line 1 to line 3 (2 columns wide) */
  grid-column: 1 / 3;
  /* Spans from line 1 to line 3 (2 rows tall) */
  grid-row: 1 / 3;
}

/* Header spanning full width of any grid */
.grid-header {
  grid-column: 1 / -1; /* Line -1 is the very last edge! */
}
```

## Summary

- CSS Grid operates in two dimensions simultaneously (rows and columns).
- The `fr` fraction unit divides available space proportionally.
- `repeat(auto-fit, minmax(280px, 1fr))` delivers fluid responsive grids without media queries.
- Grid lines are 1-indexed, and `-1` targets the final outer grid boundary.
- `gap` provides clean row and column gutters without margin hacks.

## Best Practices

1. **Use `repeat(auto-fit, minmax(...))` for Product Catalogs**: Eliminate dozens of brittle `@media` breakpoints.
2. **Use `grid-column: 1 / -1` for Full-Bleed Section Breaks**: Stretch banners across all active columns easily.
3. **Use Grid for 2D Layouts, Flexbox for 1D Components**: Pair Grid page shells with Flex navigation bars.
4. **Always Specify `gap` on the Grid Container**: Keep grid item margins clean and isolated.
