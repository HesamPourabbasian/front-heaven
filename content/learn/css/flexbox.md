---
title: 'Flexbox Layouts (1D)'
description: 'Master CSS Flexible Box Layout: main vs cross axis, flex-direction, justify-content, align-items, flex-grow, flex-shrink, flex-basis, and gap.'
order: 13
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/basic-css-practice
---

## What is Flexbox?

**Flexbox (Flexible Box Layout Module)** is a one-dimensional layout model designed for distributing space and aligning items along a single axis (either horizontally as a row or vertically as a column).

---

## Flex Container vs. Flex Items

Applying `display: flex` transforms the element into a **Flex Container** and its immediate direct children into **Flex Items**:

```html
<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>
```

```css
.flex-container {
  display: flex;
  flex-direction: row;        /* row | row-reverse | column | column-reverse */
  justify-content: space-between; /* main axis alignment */
  align-items: center;        /* cross axis alignment */
  gap: 1rem;                  /* space between items */
}
```

---

## The Two Axes of Flexbox

1. **Main Axis**: Defined by `flex-direction`.
   - `flex-direction: row` (default): Main axis runs **horizontally** (left to right).
   - `flex-direction: column`: Main axis runs **vertically** (top to bottom).
2. **Cross Axis**: Runs perpendicular to the main axis.

---

## Aligning Items

### Main Axis Alignment: `justify-content`
- `flex-start`: Items packed at start of main axis.
- `center`: Items centered along main axis.
- `flex-end`: Items packed at end of main axis.
- `space-between`: First item at start, last item at end, equal space between.
- `space-around`: Equal space around each item.
- `space-evenly`: Completely equal spacing between items and outer edges.

### Cross Axis Alignment: `align-items`
- `stretch` (default): Items stretch to fill container height.
- `center`: Items centered along cross axis.
- `flex-start` / `flex-end`: Aligned to top or bottom.

---

## Flex Item Sizing: `flex-grow`, `flex-shrink`, `flex-basis`

- **`flex-basis`**: Initial size of the item before remaining space is distributed.
- **`flex-grow`**: Ability for an item to grow if extra space exists (`flex-grow: 1`).
- **`flex-shrink`**: Ability for an item to shrink if space is constrained.
- **Shorthand `flex`**: `flex: [grow] [shrink] [basis];` (e.g. `flex: 1 1 auto`).

```css
/* Responsive navigation layout */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}
```

---

## Summary & Key Takeaways

- Flexbox is optimal for one-dimensional linear layouts (navbars, card rows, buttons).
- Use `gap` to add consistent spacing between items without margin hacks.
- Center anything in 2 lines: `display: flex; justify-content: center; align-items: center;`.

---

## Practice Challenge

Build a responsive application header with a logo pinned to the left, navigation links centered, and user avatar button pinned to the right using Flexbox.
