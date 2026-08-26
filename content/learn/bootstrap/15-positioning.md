---
title: 'Positioning, Coordinates & Stacking Context'
description: 'Master Bootstrap 5 positioning utilities: static, relative, absolute, fixed, sticky, edge coordinates (top, start, bottom, end), translation offsets, and z-index layers.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 25
prerequisites:
  - /learn/bootstrap/07-spacing
---

# Positioning, Coordinates & Stacking Context

Precise element positioning is critical when building floating badges, sticky navigation bars, overlay notifications, and interactive modals. Bootstrap 5 provides utility classes covering CSS `position`, coordinate offsets (`top`, `bottom`, `start`, `end`), centering transforms, and `z-index` stacking layers.

In this lesson, you will master relative, absolute, fixed, and sticky positioning, coordinate mapping, translate utilities, and stacking context management.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Bootstrap 5 Positioning Coordinates                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  top-0 start-0           top-0 start-50            top-0 end-0              │
│  ┌───────────────┐       ┌───────────────┐         ┌───────────────┐        │
│  │ Badge         │       │ Center Top    │         │ Badge         │        │
│  │               │       │               │         │               │        │
│  │               │       │  translate-   │         │               │        │
│  │               │       │   middle-x    │         │               │        │
│  └───────────────┘       └───────────────┘         └───────────────┘        │
│  bottom-0 start-0        bottom-0 start-50         bottom-0 end-0           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CSS Position Classes

- `position-static`: Normal document flow (default).
- `position-relative`: Establishes a positioning context for child elements.
- `position-absolute`: Positioned relative to the closest positioned ancestor.
- `position-fixed`: Positioned relative to the viewport.
- `position-sticky`: Sticks at a specified coordinate during scrolling.

```html
<!-- Sticky Header Bar -->
<header class="position-sticky top-0 bg-white border-bottom shadow-sm z-3 p-3">
  <div class="container d-flex justify-content-between align-items-center">
    <span class="fw-bold">Sticky Header</span>
    <button class="btn btn-sm btn-primary">Action</button>
  </div>
</header>
```

---

## 2. Coordinate Utilities (`top`, `bottom`, `start`, `end`)

Coordinates specify placement percentages (`0`, `50`, `100`):

- `top-0`, `top-50`, `top-100`
- `bottom-0`, `bottom-50`, `bottom-100`
- `start-0`, `start-50`, `start-100` (Left in LTR)
- `end-0`, `end-50`, `end-100` (Right in LTR)

```html
<!-- Badge Anchored to Top-Right Corner of a Button -->
<div class="position-relative d-inline-block">
  <button class="btn btn-secondary">Notifications</button>
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    99+
    <span class="visually-hidden">unread alerts</span>
  </span>
</div>
```

---

## 3. Translate Centering Utilities

Bootstrap includes translate classes using CSS transforms:
- `translate-middle`: Applies `transform: translate(-50%, -50%);` (centers element on both axes).
- `translate-middle-x`: Centers horizontally (`transform: translateX(-50%);`).
- `translate-middle-y`: Centers vertically (`transform: translateY(-50%);`).

```html
<!-- Perfectly Centered Loading Spinner inside Relative Box -->
<div class="position-relative bg-light border rounded" style="height: 180px;">
  <div class="position-absolute top-50 start-50 translate-middle text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading data...</span>
    </div>
    <div class="small text-muted mt-2">Loading analytics...</div>
  </div>
</div>
```

---

## 4. Z-Index Utilities (`z-*`)

Bootstrap 5 provides explicit `z-index` helper classes to manage layer stacking:
- `z-0` (`z-index: 0`)
- `z-1` (`z-index: 1`)
- `z-2` (`z-index: 2`)
- `z-3` (`z-index: 3`)
- `z-n1` (`z-index: -1`)

```html
<!-- Overlapping Cards with Stacking Control -->
<div class="position-relative" style="height: 150px;">
  <div class="position-absolute top-0 start-0 p-3 bg-secondary text-white rounded z-1">
    Background Card (z-1)
  </div>
  <div class="position-absolute top-0 start-0 mt-3 ms-4 p-3 bg-primary text-white rounded shadow z-2">
    Foreground Card (z-2)
  </div>
</div>
```

---

## Summary & Key Takeaways

- `position-relative` creates the parent anchor for `position-absolute` children.
- Coordinate classes (`top-0`, `start-50`, `end-0`) map to 0%, 50%, and 100% offsets.
- `translate-middle` pairs with `top-50 start-50` to achieve perfect horizontal and vertical centering.
- `position-sticky top-0` keeps navigation bars fixed during viewport scrolling.

## Best Practices & Senior Guidance

1. **Always Set `position-relative` on Parent Containers**: Forgetting `position-relative` on the container causes `position-absolute` elements to anchor to the `<body>` element unexpectedly.
2. **Use Semantic Logical Coordinates**: Use `start-*` and `end-*` rather than manual left/right styles to ensure clean bidirectional Right-to-Left (RTL) localization.
