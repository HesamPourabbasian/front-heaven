---
title: 'CSS Grid Layouts (2D)'
description: 'Master CSS Grid: grid-template-columns, fr units, repeat(), minmax(), auto-fit vs auto-fill, grid-template-areas, and responsive grids without media queries.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 30
prerequisites:
  - /learn/css/flexbox
---

## What is CSS Grid?

**CSS Grid Layout** is a two-dimensional grid-based layout system designed to handle both columns and rows simultaneously.

---

## Defining a Grid Container

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr; /* 3 columns */
  grid-template-rows: auto 1fr auto;   /* 3 rows */
  gap: 1.5rem;
}
```

---

## The Fractional Unit (`fr`) & `repeat()`

The `fr` unit represents a fraction of the available free space in the grid container:

```css
/* 3 equal columns */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* 12-column grid system */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
```

---

## The Holy Grail: Responsive Grid Without Media Queries

Using `auto-fit` and `minmax()`, the grid automatically creates as many columns as will fit on screen, wrapping items into new rows on mobile:

```css
/* Auto-responsive card grid: min card size 280px, expanding to fill row */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

---

## Grid Template Areas

Name layout regions visually for full-page application skeletons:

```css
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

---

## Summary & Key Takeaways

- Use CSS Grid for 2D macro layouts and responsive card listings.
- Use `repeat(auto-fit, minmax(300px, 1fr))` for zero-media-query responsiveness.
- Use `grid-template-areas` to declare readable page scaffolding.

---

## Practice Challenge

Build an e-commerce product catalog grid using `auto-fit` and `minmax()` that reorganizes smoothly from 1 to 4 columns.
