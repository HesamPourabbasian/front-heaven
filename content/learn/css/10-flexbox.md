---
title: 'CSS Flexbox Architecture & 1D Alignment'
description: 'Master CSS Flexbox: Flex container, flex items, main vs cross axis, justify-content, align-items, flex-wrap, gap, flex-grow, flex-shrink, flex-basis, flex shorthand, align-self, and order.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/css/09-positioning
---

# CSS Flexbox Architecture & 1D Alignment

The **Flexible Box Layout Module (Flexbox)** is a 1-dimensional layout model designed for distributing space and aligning items along a single axis (either horizontally as a row or vertically as a column). Flexbox revolutionized front-end development by eliminating float hacks and making perfect vertical centering trivial.

In this lesson, we explore the dual-axis mechanics of Flexbox: Container properties (`flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`), Item properties (`flex-grow`, `flex-shrink`, `flex-basis`, `flex` shorthand), and item reordering.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Flexbox Dual-Axis Model             │
├────────────────────────────────────────────────────────────┤
│                       MAIN AXIS ──►                        │
│            (Controlled by `justify-content`)               │
│                                                            │
│   ▲   ┌───────────┐   ┌───────────┐   ┌───────────┐        │
│   │   │  Item 1   │   │  Item 2   │   │  Item 3   │        │
│ CROSS │           │   │           │   │           │        │
│  AXIS └───────────┘   └───────────┘   └───────────┘        │
│   │                                                        │
│   ▼        (Controlled by `align-items`)                   │
└────────────────────────────────────────────────────────────┘
```

## 1. The Main Axis vs Cross Axis

When an element is set to `display: flex`, it establishes a **Flex Formatting Context**:
- **Main Axis**: Defined by `flex-direction`:
  - `row` (default): Main axis runs **horizontally** (left to right). Cross axis runs vertically.
  - `column`: Main axis runs **vertically** (top to bottom). Cross axis runs horizontally.
- **`justify-content`**: Aligns items along the **Main Axis** (`flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`).
- **`align-items`**: Aligns items along the **Cross Axis** (`stretch`, `center`, `flex-start`, `flex-end`, `baseline`).

```css
/* The Universal 3-Line Perfect Centering Formula */
.perfect-center {
  display: flex;
  justify-content: center; /* Main axis center */
  align-items: center;     /* Cross axis center */
}
```

## 2. Wrapping & Gaps: `flex-wrap` and `gap`

By default, flex items attempt to squeeze onto a single line (`flex-wrap: nowrap`), shrinking until they overflow:

```css
.card-grid {
  display: flex;
  flex-wrap: wrap; /* Allows items to wrap onto new lines */
  gap: 1.5rem;     /* Clean uniform spacing without negative margins! */
}
```

The `gap` property provides modern, clean spacing between flex items without requiring sibling margins.

## 3. Flex Item Sizing: `grow`, `shrink` & `basis`

Flex items calculate their width/height dynamically using three properties:
- **`flex-grow`**: Factor defining how much free remaining space the item should absorb (default: `0`).
- **`flex-shrink`**: Factor defining how much the item should compress when space is constrained (default: `1`).
- **`flex-basis`**: The ideal starting size before grow/shrink calculations take place (e.g., `200px` or `auto`).

### The `flex` Shorthand:
```css
/* Syntax: flex: [grow] [shrink] [basis] */

/* 1. Equal-width flexible columns */
.col-equal {
  flex: 1 1 0%; /* Equivalent to flex: 1 */
}

/* 2. Fixed-width sidebar that never shrinks or grows */
.sidebar-fixed {
  flex: 0 0 280px; /* Stays locked at 280px */
}

/* 3. Flexible main content expanding to fill remaining width */
.main-expand {
  flex: 1 1 auto;
}
```

## 4. Item Overrides: `align-self` & `order`

- **`align-self`**: Overrides the container's `align-items` setting for a single individual flex item:
  ```css
  .item-custom {
    align-self: flex-end; /* Pushes only this item to bottom */
  }
  ```
- **`order`**: Changes the visual rendering sequence of items without altering the underlying HTML DOM tree (default is `0`). Use with caution as it can disconnect visual order from keyboard tab navigation order!

## Summary

- `display: flex` establishes a 1D layout along a Main Axis and Cross Axis.
- `justify-content` controls Main Axis alignment; `align-items` controls Cross Axis alignment.
- `flex-wrap: wrap` allows items to break into multiple lines.
- `gap` provides clean spacing between flex rows and columns.
- The `flex` shorthand (`flex: 1 1 0%`) distributes remaining container space predictably.

## Best Practices

1. **Always Use `gap` Instead of Child Margins**: Eliminate complex `:last-child` margin resets.
2. **Use the `flex` Shorthand Over Individual Properties**: `flex: 1` is cleaner and resets `flex-basis` safely.
3. **Avoid Abusing `order`**: Prevent confusing screen reader and keyboard tab navigation mismatches.
4. **Use Flexbox for 1D Components (Navbars, Toolbars, Badges)**: Reserve CSS Grid for 2D macro page layouts.
