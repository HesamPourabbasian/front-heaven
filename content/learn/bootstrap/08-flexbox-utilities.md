---
title: 'Flexbox Utilities & Alignment'
description: 'Master Bootstrap 5 Flexbox utilities: d-flex, direction, justify-content, align-items, align-self, flex-wrap, flex-grow/shrink, auto margins, and gap alignment.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/bootstrap/07-spacing
---

# Flexbox Utilities & Alignment

Bootstrap 5 is built on CSS Flexbox. Beyond the grid system, Bootstrap provides an exhaustive suite of **Flexbox utility classes** that allow you to quickly manage element distribution, direction, horizontal and vertical alignment, wrapping, and growing behaviors directly in HTML.

In this lesson, you will master `d-flex`, flex direction controls, content justification, cross-axis alignment, flex item growth/shrink, and responsive flex modifiers.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Flexbox Alignment Quick Reference                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Justify Content (Main Axis):                                               │
│  [start       ] [    center   ] [         end] [start       end]            │
│  .justify-content-start  .center   .end         .between                    │
│                                                                             │
│  Align Items (Cross Axis):                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │▲ Top     │  │          │  │          │  │▲ Top     │                     │
│  │          │  │  Center  │  │          │  ││ Stretch │                     │
│  │          │  │          │  │▼ Bottom  │  │▼         │                     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                     │
│  .align-items-start  .center    .end         .stretch                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Enabling Flexbox (`d-flex` & `d-inline-flex`)

Convert any container into a flex container with `d-flex` or `d-inline-flex`:

```html
<!-- Full-width flex container -->
<div class="d-flex p-3 bg-light border">
  <div>Flex Item 1</div>
  <div>Flex Item 2</div>
  <div>Flex Item 3</div>
</div>

<!-- Inline flex container -->
<div class="d-inline-flex p-2 bg-secondary text-white rounded">
  <span>Inline Flex Element</span>
</div>
```

---

## 2. Flex Direction

Control the flow direction of flex items with `flex-row` and `flex-column`:

```html
<!-- Horizontal row (default) -->
<div class="d-flex flex-row bg-light p-2 mb-3">
  <div class="p-2 border">Item 1</div>
  <div class="p-2 border">Item 2</div>
</div>

<!-- Horizontal reversed row -->
<div class="d-flex flex-row-reverse bg-light p-2 mb-3">
  <div class="p-2 border">Item 1 (Rightmost)</div>
  <div class="p-2 border">Item 2</div>
</div>

<!-- Vertical column -->
<div class="d-flex flex-column bg-light p-2 mb-3">
  <div class="p-2 border">Top Item</div>
  <div class="p-2 border">Bottom Item</div>
</div>
```

---

## 3. Justify Content (Main Axis Alignment)

Align flex items along the main axis using `.justify-content-*`:

- `justify-content-start` (left / default)
- `justify-content-end` (right)
- `justify-content-center` (centered)
- `justify-content-between` (first item start, last item end, equal gap)
- `justify-content-around` (equal space around each item)
- `justify-content-evenly` (strictly equal space between and outside items)

```html
<!-- Spaced navbar layout: Logo on left, navigation on right -->
<div class="d-flex justify-content-between align-items-center bg-dark text-white p-3">
  <span class="fw-bold">MyBrand</span>
  <nav class="d-flex gap-2">
    <a href="#" class="text-white text-decoration-none">Home</a>
    <a href="#" class="text-white text-decoration-none">Projects</a>
  </nav>
</div>
```

---

## 4. Align Items & Align Self (Cross Axis Alignment)

Control cross-axis alignment for all items via `.align-items-*` or individually with `.align-self-*`:

```html
<div class="d-flex align-items-center bg-light border" style="height: 120px;">
  <div class="p-2 border bg-white">Vertically Centered</div>
  <div class="p-2 border bg-white align-self-start">Top Aligned (Self)</div>
  <div class="p-2 border bg-white align-self-end">Bottom Aligned (Self)</div>
</div>
```

---

## 5. Flex Grow, Shrink & Fill

Control how flex items expand to fill unused space or shrink under constrained widths:

```html
<div class="d-flex bg-light p-2">
  <div class="p-2 border bg-white flex-grow-1">Expands to fill all remaining space (flex-grow-1)</div>
  <div class="p-2 border bg-white">Fixed Width Item</div>
</div>

<div class="d-flex bg-light p-2 mt-3">
  <!-- flex-fill forces equal proportional width on all siblings -->
  <div class="p-2 border bg-white flex-fill text-center">Item A</div>
  <div class="p-2 border bg-white flex-fill text-center">Item B</div>
  <div class="p-2 border bg-white flex-fill text-center">Item C</div>
</div>
```

---

## 6. Auto Margins in Flexbox

Auto margins (`ms-auto`, `me-auto`, `my-auto`) in flexbox push adjacent elements to opposite edges:

```html
<div class="d-flex bg-light p-3">
  <div class="p-2">Left Brand</div>
  <!-- ms-auto pushes this item and subsequent items all the way to the right -->
  <div class="ms-auto p-2">
    <button class="btn btn-primary btn-sm">Login</button>
  </div>
</div>
```

---

## Summary & Key Takeaways

- `d-flex` turns any element into a flexbox container.
- `flex-row` and `flex-column` set main axis flow direction.
- `justify-content-*` aligns items horizontally along the main axis.
- `align-items-*` and `align-self-*` control vertical cross-axis alignment.
- `flex-grow-1` expands an item to fill remaining container space, and `ms-auto` acts as a powerful push spacer.

## Best Practices & Senior Guidance

1. **Leverage `ms-auto` for Navbars**: Using `ms-auto` on the rightmost nav item is cleaner than creating multiple nested wrapper divs.
2. **Combine `d-flex` with `gap-*`**: Use `gap-2` or `gap-3` instead of manual margin utilities to maintain clean responsive flex child spacing.
