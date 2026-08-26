---
title: 'The 12-Column Grid System'
description: 'Master the Bootstrap 5 12-column flexbox grid: rows, columns, auto-layout, column sizing, responsive breakpoint prefixes, offsets, ordering, nested grids, and gutter controls.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/02-containers
---

# The 12-Column Grid System

The Bootstrap **Grid System** is built on CSS Flexbox and uses a 12-column architecture to construct flexible, responsive layouts. By combining containers, rows, and columns, you can quickly build multi-device responsive page structures without writing custom media queries.

In this lesson, you will master row-column hierarchy, fractional 12-column distribution, auto-layout columns, responsive breakpoint modifiers, column offsets, ordering, nested grids, and gutter spacing.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      The 12-Column Grid Architecture                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  [col-1][col-1][col-1][col-1][col-1][col-1][col-1][col-1][col-1][col-1][col-1][col-1]│
│  [            col-6            ] [                   col-6                  ]│
│  [        col-4        ] [        col-4        ] [        col-4        ]    │
│  [             col-8             ] [               col-4               ]    │
│  [                               col-12                                    ]│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Grid Anatomy: Containers, Rows & Columns

Bootstrap grid mechanics follow a strict 3-tier hierarchy:
1. **Container (`.container` or `.container-fluid`)**: Provides horizontal padding and centers layout.
2. **Row (`.row`)**: Acts as a flex container (`display: flex; flex-wrap: wrap;`) and applies negative margins to counteract container padding.
3. **Columns (`.col-*`)**: Immediate children of `.row` that define horizontal width spanning 1 to 12 fractional units.

```html
<div class="container">
  <div class="row">
    <div class="col-md-8">Main 8-Column Content</div>
    <div class="col-md-4">Sidebar 4-Column Content</div>
  </div>
</div>
```

---

## 2. Auto-Layout & Equal-Width Columns

If you omit numeric column units and use `.col`, Bootstrap automatically divides the row equally among all sibling columns:

```html
<div class="row">
  <div class="col">1 of 3 (33.3%)</div>
  <div class="col">2 of 3 (33.3%)</div>
  <div class="col">3 of 3 (33.3%)</div>
</div>

<div class="row mt-3">
  <div class="col">1 of 2 (50%)</div>
  <div class="col">2 of 2 (50%)</div>
</div>
```

---

## 3. Responsive Column Modifiers

Bootstrap offers responsive modifiers (`col-sm-*`, `col-md-*`, `col-lg-*`, `col-xl-*`, `col-xxl-*`) targeting specific viewport tiers:

```html
<div class="row">
  <!-- Full width on mobile (col-12), half on tablet (col-md-6), third on desktop (col-lg-4) -->
  <div class="col-12 col-md-6 col-lg-4">Card 1</div>
  <div class="col-12 col-md-6 col-lg-4">Card 2</div>
  <div class="col-12 col-md-12 col-lg-4">Card 3</div>
</div>
```

---

## 4. Column Offsets

Offset classes (`offset-*` or `offset-md-*`) shift columns to the right by increasing `margin-left`:

```html
<div class="row">
  <!-- Centered 6-column box: offset by 3 columns on both sides -->
  <div class="col-md-6 offset-md-3">
    <div class="card p-4 shadow-sm text-center">
      <h3>Centered Form Card</h3>
    </div>
  </div>
</div>
```

---

## 5. Column Ordering

Reorder visual presentation without altering HTML semantic source order using `order-*`:

```html
<div class="row">
  <!-- Visually displayed second on mobile, first on desktop -->
  <div class="col-md-8 order-2 order-md-1">
    <h2>Main Article</h2>
  </div>
  <!-- Visually displayed first on mobile, second on desktop -->
  <div class="col-md-4 order-1 order-md-2">
    <aside>Promoted Ad</aside>
  </div>
</div>
```

---

## 6. Gutters (`g-*`, `gx-*`, `gy-*`)

Gutters define horizontal and vertical spacing between grid columns using CSS variables (`--bs-gutter-x` and `--bs-gutter-y`):
- `g-0`: Removes all gutters (flush grid).
- `g-1` to `g-5`: Sets both horizontal and vertical gutters (e.g. `g-3` = 1rem / 16px).
- `gx-4`: Sets only horizontal column spacing.
- `gy-3`: Sets only vertical row spacing on wrapped columns.

```html
<div class="row g-4">
  <div class="col-6"><div class="p-3 bg-light border">Gutter Box A</div></div>
  <div class="col-6"><div class="p-3 bg-light border">Gutter Box B</div></div>
</div>
```

---

## 7. Nested Grids

To nest grid columns within a parent column, simply add a new `.row` inside that column:

```html
<div class="row">
  <div class="col-md-8">
    <h3>Parent Column (8 Units)</h3>
    <div class="row">
      <div class="col-6 bg-info p-2">Nested 6 (50% of parent)</div>
      <div class="col-6 bg-warning p-2">Nested 6 (50% of parent)</div>
    </div>
  </div>
  <div class="col-md-4">
    <h3>Sidebar (4 Units)</h3>
  </div>
</div>
```

---

## 8. Row Columns Utilities (`.row-cols-*`)

Instead of declaring `.col-md-4` on every individual child column, use `.row-cols-*` on the parent `.row` to specify the number of columns per row:

```html
<!-- Automatically creates a 2-column grid on mobile, 4-column grid on desktop -->
<div class="row row-cols-2 row-cols-lg-4 g-3">
  <div class="col"><div class="p-3 bg-light border">Card 1</div></div>
  <div class="col"><div class="p-3 bg-light border">Card 2</div></div>
  <div class="col"><div class="p-3 bg-light border">Card 3</div></div>
  <div class="col"><div class="p-3 bg-light border">Card 4</div></div>
</div>
```

---

## Summary & Key Takeaways

- The grid is composed of containers, rows (`display: flex; flex-wrap: wrap;`), and 12-column fractional children (`col-*`).
- `.col` provides auto-distributing equal-width columns.
- `.row-cols-*` sets column counts declaratively on the parent row container.
- Breakpoint classes (`col-sm-*`, `col-md-*`, `col-lg-*`) control mobile-first responsive layout adaptation.
- `offset-*` pushes columns rightwards, `order-*` reorganizes visual order, and `g-*` adjusts gutter spacing.

## Best Practices & Senior Guidance

1. **Columns Sum to 12 per Row**: Ensure immediate column units add up to 12 within each viewport tier; any overflow automatically wraps to the next line.
2. **Use `.row-cols-*` for Uniform Card Grids**: Eliminates redundant class names across dozens of dynamic template items.
3. **Never Apply Padding Directly to `.row`**: Always configure gutters via `g-*` classes or apply spacing to parent containers.
