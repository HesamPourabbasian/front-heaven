---
title: 'Responsive Architecture, Container Queries & Fluid Math'
description: 'Master component-driven responsive architecture: Container Queries (@container), container query units (cqi, cqw), fluid typography math with clamp(), and eliminating viewport-bound breakpoints.'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/20-advanced-grid
---

# Responsive Architecture, Container Queries & Fluid Math

For over a decade, Responsive Web Design was bound to a single global constraint: the **browser viewport width** via `@media` queries. However, in modern component-driven architectures (Vue, React, Design Systems), a card component might be placed inside a wide full-width hero section, a narrow 250px sidebar, or a 3-column grid cell. The component should adapt based on the width of its **parent container**, not the global screen!

In this lesson, we explore **Container Queries (`@container`)**, **Container Query Units (`cqi`, `cqw`)**, mathematical fluid functions (**`clamp()`**, **`min()`**, **`max()`**, **`calc()`**), and component-first architecture.

```text
┌────────────────────────────────────────────────────────────┐
│                    Media Queries vs Container Queries      │
├──────────────────┬─────────────────────────────┬───────────┤
│ Feature          │ Media Query (`@media`)      │ Container Query (`@container`)
├──────────────────┼─────────────────────────────┼───────────┤
│ Query Reference  │ Entire browser window / screen│ Parent container box size │
│ Context Scope    │ Global viewport width       │ Local component slot width│
│ Component Reusability│ Brittle (fails in sidebar)│ 100% Modular everywhere │
│ Units Available  │ `vw`, `vh`, `px`, `rem`     │ `cqi`, `cqw`, `cqb`, `cqh`│
└──────────────────┴─────────────────────────────┴───────────┘
```

## 1. Establishing a Container Context: `container-type`

To query a parent container's dimensions, register it as a **Query Container** using `container-type`:

```css
.card-wrapper {
  /* Establishes an inline-size (width) query container */
  container-type: inline-size;
  /* Optional: Name the container for explicit queries */
  container-name: product-slot;
}
```

- **`inline-size`**: Queries the container's horizontal width (most common for responsive components).
- **`size`**: Queries both horizontal width and vertical height simultaneously.

## 2. Authoring Component Queries with `@container`

Now, style child elements based on the exact width of their enclosing container:

```css
/* Base: Default narrow layout (Vertical stacked card) */
.product-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* When the parent container is at least 450px wide: Switch to Horizontal */
@container (min-width: 450px) {
  .product-card {
    flex-direction: row;
    align-items: center;
    padding: 1.5rem;
  }
  .product-card__img {
    width: 140px;
    height: 140px;
  }
}

/* When the parent container is at least 700px wide: Expand feature details */
@container (min-width: 700px) {
  .product-card {
    padding: 2rem;
  }
  .product-card__desc {
    display: block; /* Reveals description on wide parent slots */
  }
}
```

Now, this single `<product-card>` component can be placed anywhere—in sidebars, grid cells, or main feeds—and it automatically styles itself appropriately for its allocated slot!

## 3. Container Query Units (`cqi`, `cqw`, `cqb`, `cqh`)

Container Query Units allow you to scale typography and padding relative to the container rather than the viewport:
- **`1cqi`**: 1% of the query container's inline size (width in horizontal writing modes).
- **`1cqb`**: 1% of the query container's block size (height).

```css
.hero-card h2 {
  /* Font size is exactly 5% of this card container's width! */
  font-size: clamp(1.25rem, 5cqi, 2.5rem);
}
```

## 4. Mathematical Functions: `clamp()`, `min()`, `max()` & `calc()`

Combine CSS mathematical functions to build fluid layouts without jumpy media queries:

```css
:root {
  /* Fluid Spacing: Minimum 1rem (16px), scales at 2.5vw, Maximum 3rem (48px) */
  --space-fluid: clamp(1rem, 2.5vw + 0.5rem, 3rem);

  /* Mathematical calculation */
  --header-offset: calc(100vh - 64px);

  /* Lower bound clamp using min() and max() */
  --content-width: min(100% - 2rem, 1200px);
}

.section-padding {
  padding-block: var(--space-fluid);
}
```

## Summary

- Container Queries (`@container`) enable components to adapt based on their parent container's width.
- `container-type: inline-size` registers an element as a queryable parent container.
- Container Query Units (`cqi`, `cqw`) scale typography and spacing relative to local containers.
- `clamp(min, preferred, max)` eliminates media query jumps with fluid mathematical interpolation.
- Container queries make design system components truly portable across all layouts.

## Best Practices

1. **Adopt Container Queries for All Reusable Design System Cards**: Guarantee self-contained responsive portability.
2. **Use `container-type: inline-size`**: Avoid querying full `size` unless vertical height queries are strictly required.
3. **Combine `clamp()` with `cqi` Units**: Deliver fluid component typography tailored to parent slots.
4. **Use `min(100% - 2rem, 1280px)` for Centered Layout Wrappers**: Eliminate extra container classes.
