---
title: 'Sass Fundamentals & Customizing Bootstrap Sass'
description: 'Master customizing Bootstrap 5 via Sass: Sass variables, maps, mixins, functions, overriding !default flags, custom theme color maps, import order mechanics, and partial lightweight builds.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/bootstrap/01-bootstrap-fundamentals
---

# Sass Fundamentals & Customizing Bootstrap Sass

While using precompiled Bootstrap CSS is convenient for quick demos, professional enterprise development requires compiling Bootstrap from its modular **Sass (SCSS)** source files. Compiling from Sass allows you to change primary theme colors, modify border radiuses, adjust container breakpoints, and strip unneeded components to reduce CSS bundle size by up to 80%.

In this lesson, you will master Sass variables, maps, mixins, overriding `!default` values, customizing theme color maps, and structuring modular production builds.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bootstrap Sass Compilation Pipeline                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Custom Variable Overrides (Before Bootstrap imports)                    │
│     $primary: #4f46e5;                                                      │
│     $border-radius: 0.75rem;                                                │
│                                                                             │
│  2. Import Bootstrap Functions & Default Variables                          │
│     @import "bootstrap/scss/functions";                                     │
│     @import "bootstrap/scss/variables";                                     │
│                                                                             │
│  3. Custom Map Overrides (After variables, before components)              │
│     $theme-colors: map-merge($theme-colors, ("brand": #06b6d4));            │
│                                                                             │
│  4. Import Mixins, Utilities & Selected Components                         │
│     @import "bootstrap/scss/buttons";                                       │
│     @import "bootstrap/scss/card";                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The `!default` Override Mechanism

Every variable in Bootstrap's `_variables.scss` is declared with the `!default` flag:

```scss
// Inside bootstrap/scss/_variables.scss
$primary: #0d6efd !default;
$body-bg: #fff !default;
$border-radius: 0.375rem !default;
```

In Sass, `!default` means: *"Assign this value only if the variable has not already been assigned."* Therefore, if you declare `$primary: #6366f1;` *before* importing Bootstrap's variables, your custom value overrides Bootstrap's default value automatically.

---

## 2. Recommended SCSS Project Structure

Create a main SCSS file (e.g. `src/styles/main.scss`):

```scss
// 1. Your Custom Variable Overrides
$primary: #4f46e5;       // Modern Indigo
$secondary: #64748b;     // Slate Gray
$success: #10b981;       // Emerald Green
$danger: #ef4444;        // Red Rose
$font-family-base: 'Inter', system-ui, -apple-system, sans-serif;
$border-radius: 0.5rem;
$border-radius-lg: 0.75rem;
$enable-shadows: true;
$enable-rounded: true;

// 2. Import Bootstrap Functions, Variables & Maps
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";

// 3. Custom Map Additions
$custom-theme-colors: (
  "accent": #f59e0b,
  "dark-card": #1e293b
);
$theme-colors: map-merge($theme-colors, $custom-theme-colors);

// 4. Import Remaining Bootstrap Layout & Components
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/type";
@import "bootstrap/scss/containers";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/button-group";
@import "bootstrap/scss/card";
@import "bootstrap/scss/forms";
@import "bootstrap/scss/nav";
@import "bootstrap/scss/navbar";
@import "bootstrap/scss/modal";
@import "bootstrap/scss/transitions";
@import "bootstrap/scss/helpers";

// 5. Compile Utilities API
@import "bootstrap/scss/utilities/api";
```

---

## 3. Creating Lightweight Partial Builds

By selectively importing only the components your application actually uses, you can drop the CSS bundle size drastically:

```scss
// A micro-bundle including ONLY Grid, Typography, and Buttons (~18KB)
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/reboot";
@import "bootstrap/scss/type";
@import "bootstrap/scss/containers";
@import "bootstrap/scss/grid";
@import "bootstrap/scss/buttons";
@import "bootstrap/scss/helpers";
@import "bootstrap/scss/utilities/api";
```

---

## Summary & Key Takeaways

- Bootstrap SCSS relies on `!default` to allow clean overrides without editing `node_modules`.
- The strict import order is: **Custom Variables -> Functions -> Variables -> Maps -> Mixins -> Utilities -> Components -> Utilities API**.
- Use `map-merge($theme-colors, ...)` to add custom theme colors (`btn-accent`, `bg-accent`, `text-accent`).
- Selective imports eliminate unused components (e.g., Carousels, Accordions, Offcanvas) from production CSS bundles.

## Best Practices & Senior Guidance

1. **Never Edit `node_modules/bootstrap` Files Directly**: Always isolate your overrides in `_custom-variables.scss` to ensure upgrades are seamless.
2. **Turn on Feature Flags Wisely**: Flags like `$enable-shadows: true;` and `$enable-gradients: true;` apply subtle depth across all components with zero extra markup.
