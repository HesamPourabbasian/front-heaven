---
title: 'Sizing Utilities & Viewport Constraints'
description: 'Master Bootstrap 5 sizing utilities: fractional widths (w-25 to w-100, w-auto), fractional heights (h-25 to h-100, h-auto), and viewport constraints (min-vw, min-vh, max-vw, max-vh).'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 25
prerequisites:
  - /learn/bootstrap/07-spacing
---

# Sizing Utilities & Viewport Constraints

Controlling the width and height of elements relative to their parent containers or the browser viewport is a cornerstone of responsive layout design. Bootstrap 5 provides utility classes for relative percentage sizing, automatic sizing, and full-viewport constraints.

In this lesson, you will master width utilities (`w-*`), height utilities (`h-*`), maximum constraints (`mw-100`, `mh-100`), and viewport units (`min-vh-100`, `vw-100`).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Bootstrap Sizing Scale                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Relative Percentage Widths:                                                │
│  w-25   (25%)   ├───┤                                                       │
│  w-50   (50%)   ├───────┤                                                   │
│  w-75   (75%)   ├───────────┤                                               │
│  w-100  (100%)  ├────────────────┤                                          │
│  w-auto (auto)  ├─ (content width)                                          │
│                                                                             │
│  Viewport Constraints:                                                      │
│  • min-vh-100: Minimum height of 100vh (Full-screen hero & sticky layouts)  │
│  • min-vw-100: Minimum width of 100vw                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Width Utilities (`w-*` & `mw-*`)

Set element width relative to its parent container:

- `w-25`: `width: 25%;`
- `w-50`: `width: 50%;`
- `w-75`: `width: 75%;`
- `w-100`: `width: 100%;`
- `w-auto`: `width: auto;`
- `mw-100`: `max-width: 100%;`

```html
<div class="bg-light p-3 border mb-3">
  <div class="w-25 p-2 bg-primary text-white text-center mb-2">w-25 (25%)</div>
  <div class="w-50 p-2 bg-success text-white text-center mb-2">w-50 (50%)</div>
  <div class="w-75 p-2 bg-warning text-dark text-center mb-2">w-75 (75%)</div>
  <div class="w-100 p-2 bg-danger text-white text-center">w-100 (100%)</div>
</div>
```

---

## 2. Height Utilities (`h-*` & `mh-*`)

Set element height relative to parent containers that have an explicitly declared height:

- `h-25`: `height: 25%;`
- `h-50`: `height: 50%;`
- `h-75`: `height: 75%;`
- `h-100`: `height: 100%;`
- `h-auto`: `height: auto;`
- `mh-100`: `max-height: 100%;`

```html
<div class="d-flex gap-2 bg-light border p-3" style="height: 160px;">
  <div class="h-25 p-2 bg-primary text-white text-center">25%</div>
  <div class="h-50 p-2 bg-primary text-white text-center">50%</div>
  <div class="h-75 p-2 bg-primary text-white text-center">75%</div>
  <div class="h-100 p-2 bg-primary text-white text-center">100%</div>
</div>
```

---

## 3. Viewport Width & Height Utilities

Scale elements directly relative to the device viewport dimensions:

- `vw-100`: `width: 100vw;`
- `min-vw-100`: `min-width: 100vw;`
- `max-vw-100`: `max-width: 100vw;`
- `vh-100`: `height: 100vh;`
- `min-vh-100`: `min-height: 100vh;`
- `max-vh-100`: `max-height: 100vh;`

### Building a Full-Screen Centered Hero Section:
```html
<main class="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white text-center p-4">
  <h1 class="display-3 fw-bold">Next-Gen Cloud Solutions</h1>
  <p class="lead text-white-50 col-md-6">Engineered for 99.999% uptime and instant multi-region scalability.</p>
  <div class="d-flex gap-3 mt-3">
    <button class="btn btn-primary btn-lg">Explore Platform</button>
    <button class="btn btn-outline-light btn-lg">Request Demo</button>
  </div>
</main>
```

---

## Summary & Key Takeaways

- Percentage width utilities (`w-25`, `w-50`, `w-75`, `w-100`) adjust size relative to parent containers.
- Height percentage utilities (`h-100`) require parent elements to possess an explicit height or flex stretch.
- `min-vh-100` is the standard class for full-screen hero sections and single-page apps.
- `mw-100` prevents media and large text blocks from overflowing their parent boundaries.

## Best Practices & Senior Guidance

1. **Use `min-vh-100` Instead of `vh-100` for Dynamic Pages**: `min-vh-100` guarantees full-screen height while allowing the page to expand vertically when content overflows on small mobile devices.
2. **Ensure Parent Has Height for `h-100`**: If a parent element has no defined height, `h-100` on a child will compute to `height: auto` in CSS.
