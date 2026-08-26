---
title: 'The Bootstrap Utilities API'
description: 'Master the Bootstrap 5 Utilities API: Sass $utilities map structure, creating custom utilities (cursor, filter, z-index), modifying existing utilities, responsive generation, and pseudo-class states (hover, focus).'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/01-bootstrap-fundamentals
---

# The Bootstrap Utilities API

One of the most powerful architectural enhancements in Bootstrap 5 is the **Utilities API**. Implemented in Sass, the Utilities API is a data-driven utility generator powered by the `$utilities` map. It allows developers to generate custom utility classes, modify existing properties, create responsive variants, and attach pseudo-class states (`hover`, `focus`) without writing manual CSS rules.

In this lesson, you will master the anatomy of the `$utilities` map, generate custom utility classes, modify standard Bootstrap scales, and enable interactive pseudo-class states.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bootstrap 5 Utilities API Architecture                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Sass $utilities Map                                                        │
│  ├── property: 'cursor'                                                     │
│  ├── class: 'cursor'                                                        │
│  ├── responsive: true                                                       │
│  ├── state: (hover, focus)                                                  │
│  └── values: (pointer: pointer, grab: grab, not-allowed: not-allowed)       │
│                                                                             │
│  Generates Compiled CSS:                                                    │
│  .cursor-pointer { cursor: pointer !important; }                            │
│  .cursor-md-grab { cursor: grab !important; } (Responsive variant)         │
│  .cursor-pointer-hover:hover { cursor: pointer !important; } (State variant│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Anatomy of a Utility Definition

Every entry in the `$utilities` Sass map is configured with standard keys:

- `property`: The underlying CSS property (e.g., `cursor`, `opacity`, `filter`).
- `class`: The prefix name used in the generated HTML class.
- `values`: A list or map of values and class suffixes.
- `responsive` *(optional)*: When `true`, generates breakpoint variants (e.g., `cursor-md-pointer`).
- `state` *(optional)*: Generates pseudo-class variants (e.g., `hover`, `focus`).
- `css-var` *(optional)*: Generates a CSS custom property instead of direct inline styling.

---

## 2. Adding a New Custom Utility

To add a new utility (for example, `cursor` utilities), use Sass `map-merge`:

```scss
// custom.scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";

// Define custom cursor utilities
$utilities: map-merge(
  $utilities,
  (
    "cursor": (
      property: cursor,
      class: cursor,
      responsive: false,
      values: (
        pointer: pointer,
        grab: grab,
        grabbing: grabbing,
        not-allowed: not-allowed,
        default: default
      )
    ),
    "user-select": (
      property: user-select,
      class: select,
      values: (
        all: all,
        auto: auto,
        none: none
      )
    )
  )
);

@import "bootstrap/scss/utilities/api";
```

### HTML Usage:
```html
<div class="cursor-pointer select-none p-3 bg-light border">
  Clickable Non-Selectable Card
</div>
<button class="cursor-not-allowed btn btn-secondary" disabled>
  Disabled Button
</button>
```

---

## 3. Modifying Existing Utilities

You can expand existing Bootstrap utilities (like adding opacity or width values) using `map-get` and `map-merge`:

```scss
// Add a 33% and 66% width utility to existing "width" utility
$utilities: map-merge(
  $utilities,
  (
    "width": map-merge(
      map-get($utilities, "width"),
      (
        values: map-merge(
          map-get(map-get($utilities, "width"), "values"),
          (
            33: 33.333333%,
            66: 66.666667%
          )
        )
      )
    )
  )
);
```

---

## 4. Enabling Hover & Focus States

To generate interactive state utilities for backgrounds or text:

```scss
$utilities: map-merge(
  $utilities,
  (
    "background-color": map-merge(
      map-get($utilities, "background-color"),
      (
        state: (hover, focus)
      )
    )
  )
);
```

---

## Summary & Key Takeaways

- The Utilities API compiles the Sass `$utilities` map into atomic CSS helper classes.
- You can add completely new CSS properties (`cursor`, `filter`, `aspect-ratio`) in a few lines of Sass.
- `responsive: true` generates responsive infixes (`.utility-md-*`).
- `state: (hover, focus)` enables interactive modifier classes.

## Best Practices & Senior Guidance

1. **Import `utilities/api` Last**: Always merge your `$utilities` modifications before importing `"bootstrap/scss/utilities/api"`, which performs the compilation loop.
2. **Be Mindful of CSS Payload**: Enabling `responsive: true` and multiple `state` modifiers across many values increases compiled CSS file size; enable responsive variants only when needed.
