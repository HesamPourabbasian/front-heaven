---
title: 'Browser Compatibility, Feature Detection (@supports) & Baseline'
description: 'Master enterprise browser compatibility: CSS Feature Queries (@supports), Web Platform Baseline standards, Progressive Enhancement strategies, and cross-browser testing.'
order: 44
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/css/43-css-testing
---

# Browser Compatibility, Feature Detection (@supports) & Baseline

Writing modern CSS requires balancing the adoption of cutting-edge features (Subgrid, Container Queries, OKLCH, CSS Nesting) with the reality that users may access your applications from older smartphone browsers, locked-down enterprise Safari versions, or government legacy workstations. Senior engineers do not avoid new features; they employ **Feature Detection via `@supports`** and the **Web Platform Baseline standard** to deliver progressive enhancements without breaking older clients.

In this lesson, we explore **CSS Feature Queries (`@supports`)**, the **Web Platform Baseline Status**, progressive enhancement fallbacks, and automating browser compatibility checks.

```text
┌────────────────────────────────────────────────────────────┐
│              CSS Feature Detection Strategy (@supports)    │
├────────────────────────────────────────────────────────────┤
│ 1. Baseline Fallback CSS (Universal sRGB / Flexbox)        │
│       │                                                    │
│       ▼                                                    │
│ 2. `@supports (display: grid)` ──► Enhanced Grid Layout    │
│       │                                                    │
│       ▼                                                    │
│ 3. `@supports (color: oklch(0.6 0.2 250))` ──► OKLCH       │
│       │                                                    │
│       ▼                                                    │
│ 4. `@supports (animation-timeline: scroll())` ──► Motion   │
└────────────────────────────────────────────────────────────┘
```

## 1. Declarative Feature Detection with `@supports`

**CSS Feature Queries (`@supports`)** test whether the user's browser engine supports a specific property-value pair before applying modern rules:

```css
/* 1. Base Fallback: Standard Flexbox Card Layout */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* 2. Progressive Enhancement: If browser supports Subgrid, use it! */
@supports (grid-template-rows: subgrid) {
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  .card-grid > .card {
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
  }
}
```

If an older browser encounters the `@supports` block, it gracefully ignores the rules inside and renders the functional Flexbox fallback.

## 2. Testing Multiple Features with `and`, `or` & `not`

Combine logical operators to test complex feature combinations:

```css
/* Modern Backdrop Glassmorphism Query */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .glass-header {
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}

/* Fallback for browsers that LACK container queries */
@supports not (container-type: inline-size) {
  .card-fallback-alert {
    display: block;
  }
}
```

## 3. The Web Platform Baseline Standard

Created by Google, Apple, Microsoft, and Mozilla, **Baseline** clarifies feature support across the web ecosystem:
- **Baseline Newly Available**: The feature is supported across all four major browser engines (Chrome, Edge, Firefox, Safari), but has been available for less than 30 months. (Safe to use with progressive enhancement!).
- **Baseline Widely Available**: The feature has been supported across all major browsers for over 30 months. (Completely safe for 100% of production users without fallbacks!).

Features like **Flexbox**, **CSS Grid**, **CSS Variables**, and **`:focus-visible`** are **Widely Available Baseline**.

## 4. Modern Color Fallbacks

Provide clean cascade fallbacks for wide-gamut OKLCH colors:

```css
.hero-badge {
  /* 1. Universal sRGB Hex Fallback (Older browsers consume this line) */
  background-color: #2563eb;

  /* 2. Modern OKLCH (Supported browsers override with vibrant P3 color!) */
  background-color: oklch(0.6 0.24 255);
}
```

## Summary

- `@supports (property: value)` provides native CSS feature detection.
- Web Platform Baseline classifies browser readiness into Newly Available vs Widely Available tiers.
- The CSS cascade enables instant zero-cost fallbacks by placing legacy declarations before modern ones.
- Logical operators (`and`, `or`, `not`) test multi-vendor feature support.
- Progressive enhancement guarantees universal functionality across all devices.

## Best Practices

1. **Place Fallback Declarations Immediately Before Modern Ones**: E.g., Hex before OKLCH.
2. **Use `@supports` for Layout Enhancements (Subgrid, Masonry)**: Provide clean Flexbox baselines.
3. **Reference Web Platform Baseline on MDN & Can I Use**: Check readiness before introducing new syntax.
4. **Test in Real iOS Safari Versions**: Catch WebKit-specific rendering quirks early.
