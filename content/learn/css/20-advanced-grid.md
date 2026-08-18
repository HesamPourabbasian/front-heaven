---
title: 'Advanced CSS Grid, Subgrid & Template Areas'
description: 'Master advanced CSS Grid architectures: grid-template-areas ascii maps, named lines, explicit vs implicit tracks, CSS Subgrid alignment, and complex dashboard shells.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/19-advanced-flexbox
---

# Advanced CSS Grid, Subgrid & Template Areas

CSS Grid reaches its full potential when authoring complex, macro-level application shells using **ASCII Grid Template Areas**, named line tracks, and **CSS Subgrid**—a modern capability that allows nested child components to directly inherit and align with their grandparent's column and row tracks.

In this lesson, we explore **`grid-template-areas`**, named line coordinate systems, explicit versus implicit track generation, and the mechanics of **CSS Subgrid (`grid-template-columns: subgrid`)**.

```text
┌────────────────────────────────────────────────────────────┐
│                    CSS ASCII Grid Template Areas Map       │
├────────────────────────────────────────────────────────────┤
│ grid-template-areas:                                       │
│   "header  header   header"                                │
│   "sidebar main     aside "                                │
│   "footer  footer   footer";                               │
│                                                            │
│ ┌── "header" ────────────────────────────────────────────┐ │
│ ├── "sidebar" ────┬── "main" ─────────┬── "aside" ───────┤ │
│ └── "footer" ────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## 1. ASCII Layout Mapping with `grid-template-areas`

Instead of calculating numerical line coordinates (`grid-column: 1 / 4`), `grid-template-areas` allows you to literally "draw" your page layout as an ASCII string map:

```css
.app-dashboard {
  display: grid;
  grid-template-columns: 260px 1fr 300px;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "nav    header  header"
    "nav    main    widgets"
    "nav    footer  footer";
  min-height: 100vh;
}

/* Assign child elements to named regions */
.site-nav    { grid-area: nav; }
.site-header { grid-area: header; }
.main-feed   { grid-area: main; }
.widgets-bar { grid-area: widgets; }
.site-footer { grid-area: footer; }

/* Responsive adaptation: Re-map grid areas with a single rule! */
@media (max-width: 1024px) {
  .app-dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "nav"
      "main"
      "widgets"
      "footer";
  }
}
```

## 2. The Power of CSS Subgrid (`subgrid`)

Historically, a direct child of a grid could create its own nested grid, but its children **could not align with the outer parent's tracks**. If Card A had a 3-line title and Card B had a 1-line title, their action buttons would fall out of vertical alignment.

**CSS Subgrid** solves this by letting child grids participate directly in the parent's track sizing:

```css
/* Outer Parent Grid */
.cards-catalog {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Individual Card (Spans 3 rows: Image, Title/Bio, Button) */
.card {
  display: grid;
  grid-row: span 3;
  /* Subgrid adopts parent row tracks! */
  grid-template-rows: subgrid;
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.card-img   { grid-row: 1; }
.card-body  { grid-row: 2; }
.card-btn   { grid-row: 3; } /* Action buttons across ALL cards align perfectly! */
```

With `subgrid`, every card's button sits at the exact same vertical baseline across the entire row, regardless of text length variations!

## 3. Explicit vs Implicit Grid Tracks

- **Explicit Grid**: Tracks explicitly declared via `grid-template-columns` or `grid-template-rows`.
- **Implicit Grid**: Tracks automatically synthesized by the browser when content exceeds the declared explicit grid. Control the sizing of these auto-generated tracks using **`grid-auto-rows`** and **`grid-auto-columns`**:

```css
.auto-feed {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Automatically give every dynamically added row a minimum height of 200px */
  grid-auto-rows: minmax(200px, auto);
}
```

## Summary

- `grid-template-areas` enables visual ASCII mapping of complex responsive page layouts.
- Subgrid (`grid-template-rows: subgrid`) aligns nested child elements with parent grid tracks.
- Explicit tracks are declared upfront; implicit tracks are auto-created when items overflow.
- `grid-auto-rows: minmax(...)` controls the sizing of dynamic implicit rows.
- Re-mapping `grid-template-areas` inside media queries reorganizes entire layouts cleanly.

## Best Practices

1. **Use `grid-template-areas` for Application Layout Shells**: Provide readable, maintainable layout blueprints.
2. **Adopt `subgrid` for Card Catalogs**: Keep titles, bodies, and call-to-action buttons aligned across uneven rows.
3. **Always Configure `grid-auto-rows`**: Ensure dynamically fetched API records render with consistent track heights.
4. **Use Period (`.`) for Empty Grid Area Slots**: `"header header" "sidebar ."` leaves an empty grid cell cleanly.
