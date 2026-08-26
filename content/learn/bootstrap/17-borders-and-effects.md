---
title: 'Borders, Radius, Shadows, Opacity & Overflow'
description: 'Master Bootstrap 5 visual styling utilities: border width and subtraction, contextual border colors, border radius scales, pill/circle shaping, box shadows, opacity scales, and overflow control.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/bootstrap/06-colors
---

# Borders, Radius, Shadows, Opacity & Overflow

Visual polish transforms raw wireframes into production-grade user interfaces. Bootstrap 5 provides a rich array of utility classes for manipulating element borders, directional borders, corner radiuses, subtle elevation shadows, alpha opacity, and overflow scrolling mechanics.

In this lesson, you will master border configuration, subtraction rules, rounding shapes, elevation levels, opacity filters, and overflow containers.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Bootstrap Visual Styling Toolkit                       │
├───────────────────┬───────────────────────────┬─────────────────────────────┤
│ Borders & Radius  │ Box Shadows (Elevation)   │ Effects & Flow              │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ .border / .border-0│ .shadow-none              │ .opacity-75 / .opacity-50   │
│ .border-primary   │ .shadow-sm                │ .overflow-auto              │
│ .border-3         │ .shadow (default)         │ .overflow-hidden            │
│ .rounded-circle   │ .shadow-lg                │ .overflow-x-scroll          │
└───────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 1. Border Utilities & Border Subtraction

Add or remove borders on specific sides:

```html
<!-- Add Borders -->
<span class="border p-2 me-2">All Sides</span>
<span class="border-top p-2 me-2">Top Only</span>
<span class="border-bottom p-2 me-2">Bottom Only</span>

<!-- Border Subtraction (Remove specific side) -->
<span class="border border-0 p-2 me-2">No Border</span>
<span class="border border-top-0 p-2 me-2">No Top Border</span>
```

---

## 2. Border Width & Contextual Colors

Set border thickness (`border-1` through `border-5`) and contextual theme colors:

```html
<div class="p-3 mb-2 border border-primary border-2 rounded">Primary Border (2px)</div>
<div class="p-3 mb-2 border border-success border-3 rounded">Success Border (3px)</div>
<div class="p-3 mb-2 border border-danger border-4 rounded">Danger Border (4px)</div>
<div class="p-3 mb-2 border border-warning border-5 rounded">Warning Border (5px)</div>
```

---

## 3. Border Radius & Rounded Shapes

Shape element corners from square to fully circular:

```html
<div class="d-flex gap-3 align-items-center">
  <div class="p-3 bg-light border rounded-0">Square (rounded-0)</div>
  <div class="p-3 bg-light border rounded">Default Rounded</div>
  <div class="p-3 bg-light border rounded-3">Medium (rounded-3)</div>
  <div class="p-3 bg-light border rounded-pill px-4">Pill Shape</div>
  <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
    Circle
  </div>
</div>
```

---

## 4. Box Shadows (Elevation)

Establish visual elevation and depth using Bootstrap's box shadow scale:

```html
<div class="row g-4 my-2">
  <div class="col-md-3"><div class="p-4 bg-white rounded shadow-none border">.shadow-none</div></div>
  <div class="col-md-3"><div class="p-4 bg-white rounded shadow-sm border">.shadow-sm</div></div>
  <div class="col-md-3"><div class="p-4 bg-white rounded shadow border">.shadow</div></div>
  <div class="col-md-3"><div class="p-4 bg-white rounded shadow-lg border">.shadow-lg</div></div>
</div>
```

---

## 5. Opacity Utilities (`opacity-*`)

Adjust alpha transparency on any element:

```html
<div class="opacity-100 p-2 bg-primary text-white mb-1">100% Opacity</div>
<div class="opacity-75 p-2 bg-primary text-white mb-1">75% Opacity</div>
<div class="opacity-50 p-2 bg-primary text-white mb-1">50% Opacity</div>
<div class="opacity-25 p-2 bg-primary text-white">25% Opacity</div>
```

---

## 6. Overflow Utilities

Manage content overflow along axes:

```html
<!-- Scrollable vertical log box -->
<div class="overflow-y-scroll bg-light border p-3" style="max-height: 120px;">
  <p class="mb-1">Log line 1: Service initialized.</p>
  <p class="mb-1">Log line 2: Database connected.</p>
  <p class="mb-1">Log line 3: Cluster ready.</p>
  <p class="mb-1">Log line 4: Ingress routing active.</p>
  <p class="mb-1">Log line 5: Worker heartbeat received.</p>
</div>
```

---

## Summary & Key Takeaways

- `.border` adds a 1px border; `.border-1` through `.border-5` scale thickness.
- Directional and subtraction classes (`border-top-0`, `border-bottom`) enable granular control.
- `.rounded-pill` creates pill capsules, and `.rounded-circle` creates round avatars.
- Shadow classes (`shadow-sm`, `shadow`, `shadow-lg`) apply pre-configured elevation physics.
- `overflow-auto`, `overflow-hidden`, and `overflow-x-scroll` contain clipped content cleanly.

## Best Practices & Senior Guidance

1. **Use `shadow-sm` on Cards for Modern Flat Design**: Overly heavy shadows (`shadow-lg`) can cause visual clutter; subtle shadows (`shadow-sm`) create clean, professional aesthetics.
2. **Combine `rounded-circle` with Equal Width and Height**: To prevent oval distortion, always ensure width and height are identical when using `.rounded-circle`.
