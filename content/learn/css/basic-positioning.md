---
title: 'CSS Positioning'
description: 'Learn normal document flow, position static, relative, absolute, fixed, sticky, top/right/bottom/left coordinates, and z-index stacking.'
order: 8
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/display-and-visibility
---

## The 5 CSS Position Modes

### 1. `position: static` (Default)
Element flows naturally in the standard document order. `top`, `right`, `bottom`, `left`, and `z-index` have zero effect.

### 2. `position: relative`
Positioned relative to its normal position. Does not disrupt other elements. Crucially acts as the **positioning context anchor** for child elements with `position: absolute`.

### 3. `position: absolute`
Removed from normal flow and positioned relative to the nearest positioned ancestor (an ancestor with `relative`, `absolute`, or `fixed`).

```css
/* Parent Card acts as reference container */
.card {
  position: relative;
  padding: 1.5rem;
}

/* Badge pinned to top-right corner of card */
.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
```

### 4. `position: fixed`
Removed from normal flow and pinned relative to the **viewport**. Stays in the exact same place during scrolling (used for fixed navbars, floating action buttons, modals).

### 5. `position: sticky`
Toggles between `relative` and `fixed` based on scroll position. Stays in document flow until reaching its offset threshold (like `top: 0`), then sticks!

```css
.sticky-navbar {
  position: sticky;
  top: 0;
  z-index: 40;
}
```

---

## Stacking Order with `z-index`

Controls which overlapping elements appear in front:
- Higher `z-index` numbers render on top of lower numbers.
- `z-index` only works on positioned elements (`relative`, `absolute`, `fixed`, `sticky`).

---

## Summary & Key Takeaways

- Pair `position: relative` on parent with `position: absolute` on child.
- Use `position: sticky; top: 0;` for sticky table headers and navigation bars.
- Ensure parents have defined heights when testing sticky positioning.

---

## Practice Challenge

Build a product card with:
1. A parent card with `position: relative`.
2. A "Sale" badge pinned to the top-right corner using `position: absolute`.
3. A sticky navbar at `top: 0` with a high `z-index`.
