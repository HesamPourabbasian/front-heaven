---
title: 'Advanced Layout & Subgrid'
description: 'Master CSS Subgrid, combining Grid and Flexbox, intrinsic vs extrinsic sizing (min-content, max-content, fit-content), and masonry layouts.'
order: 26
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/intermediate-projects
---

## What is CSS Subgrid?

When building card grids where cards contain headers, descriptions, and footers of varying heights, child elements traditionally cannot align with sibling cards. **Subgrid** allows child grid items to inherit and participate directly in the parent grid tracks!

```css
/* Parent Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Card item spanning 3 rows and adopting parent row tracks */
.card {
  grid-row: span 3;
  display: grid;
  grid-template-rows: subgrid; /* Inherits row track alignments! */
}
```

---

## Intrinsic vs. Extrinsic Sizing Keywords

- **`min-content`**: The smallest possible size without overflowing (e.g. width of the longest single word).
- **`max-content`**: The ideal size if no line wrapping occurred (e.g. full unbroken sentence width).
- **`fit-content(limit)`**: Uses `max-content` up to the specified upper limit, then wraps.

```css
.auto-tag {
  width: fit-content;
  padding: 0.5rem 1rem;
}
```

---

## CSS Grid + Flexbox Combinations

Professional architectures use **CSS Grid for 2D macro-layout** (page scaffolds, product grids) and **Flexbox for 1D micro-alignments** (button contents, navbar item distribution, pill badges).

---

## Summary & Key Takeaways

- Use `grid-template-rows: subgrid` to perfectly align uneven card headers and buttons across grid columns.
- Use `fit-content` and `min-content` for snug content-driven UI controls.
- Combine Grid for the outer frame and Flexbox for inner components.

---

## Practice Challenge

Build a 3-column pricing grid using CSS Subgrid where all feature lists and CTA buttons align perfectly regardless of varying description lengths.
