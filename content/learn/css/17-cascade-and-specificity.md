---
title: 'The Cascade Algorithm, Specificity & Cascade Layers (@layer)'
description: 'Master the CSS Cascade engine: Cascade origins, specificity calculations, source order, modern Cascade Layers (@layer), scoped styles with @scope, and eliminating specificity wars.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/16-advanced-selectors
---

# The Cascade Algorithm, Specificity & Cascade Layers (@layer)

The **Cascade** is the foundational reconciliation engine of CSS. In large codebases with multiple external libraries, design systems, utility frameworks, and component styles, conflicting declarations are inevitable. Understanding the exact 6-step Cascade resolution order—and leveraging modern **Cascade Layers (`@layer`)**—allows senior engineers to completely eliminate specificity wars.

In this lesson, we explore the Cascade precedence algorithm, specificity mathematical scores, Cascade Layers with **`@layer`**, Scoped styling with **`@scope`**, and how `!important` fundamentally reverses layer priority.

```text
┌────────────────────────────────────────────────────────────┐
│                    The 6-Step Cascade Precedence Engine    │
├────────────────────────────────────────────────────────────┤
│ 1. Origin & Importance (Author !important > Author Normal) │
│       │                                                    │
│       ▼                                                    │
│ 2. Context (Shadow DOM vs Light DOM)                       │
│       │                                                    │
│       ▼                                                    │
│ 3. Cascade Layers (`@layer utilities > @layer components`) │
│       │                                                    │
│       ▼                                                    │
│ 4. Specificity Score (IDs > Classes > Elements)            │
│       │                                                    │
│       ▼                                                    │
│ 5. Scope Proximity (`@scope`)                              │
│       │                                                    │
│       ▼                                                    │
│ 6. Source Order (Last declared in stylesheet wins)         │
└────────────────────────────────────────────────────────────┘
```

## 1. The Cascade Resolution Steps Explained

When multiple rules declare the same property on an element, the browser evaluates them in strict order:
1. **Origin & Importance**: User-Agent styles < User styles < Author (Developer) styles < Author `!important` < User-Agent `!important`.
2. **Cascade Layers (`@layer`)**: Unlayered styles beat layered styles; higher-order layers beat lower-order layers.
3. **Specificity**: Higher numeric tuple `(Inline, ID, Class, Type)` wins.
4. **Scope Proximity**: Closest scoping root wins.
5. **Source Order**: If all previous criteria are tied, the declaration that appears latest in the stylesheet wins.

## 2. Solving Specificity Wars with Cascade Layers (`@layer`)

Before Cascade Layers, overriding a third-party UI library required hacking high-specificity selectors like `body #app .modal .btn.btn-primary`.

**`@layer`** introduces explicit precedence tiers where **Layer Order trumps Specificity**:

```css
/* 1. Define explicit Layer Priority (Left to Right = Low to High Priority) */
@layer reset, base, components, utilities;

/* Reset Layer (Lowest Priority) */
@layer reset {
  h1 { font-size: 2rem; margin: 0; }
}

/* Components Layer */
@layer components {
  /* High specificity class chain: (0, 2, 0) */
  .card .card-title {
    font-size: 1.5rem;
    color: #0f172a;
  }
}

/* Utilities Layer (Highest Priority) */
@layer utilities {
  /* Low specificity single class: (0, 1, 0) */
  .text-danger {
    color: #ef4444; /* WINS over .card .card-title because utilities layer is higher! */
  }
}
```

A single class in `@layer utilities` effortlessly overrides a 3-class selector in `@layer components` because layer precedence is evaluated **before** specificity.

## 3. Scoped Styles with `@scope`

Modern CSS supports native scoping via **`@scope`**, styling elements within a specific DOM subtree without leaking styles to outer elements or nested sub-components:

```css
/* Styles apply only within .media-card, but stop at nested .comment-box boundary! */
@scope (.media-card) to (.comment-box) {
  img {
    border-radius: 0.5rem;
  }
  p {
    font-size: 0.875rem;
    color: #64748b;
  }
}
```

## 4. The `!important` Layer Reversal Paradox

In normal declarations, higher layers beat lower layers. However, when `!important` is used, **layer priority is inverted**: an `!important` declaration in a lower layer (like `@layer reset`) beats an `!important` declaration in a higher layer (`@layer utilities`)!

For this reason, never use `!important` inside layer definitions.

## Summary

- The Cascade reconciles conflicting declarations across Origin, Layers, Specificity, and Source Order.
- `@layer` establishes explicit priority tiers, allowing low-specificity utilities to override complex components.
- Unlayered CSS styles always have higher priority than layered styles for backward compatibility.
- `@scope (root) to (limit)` isolates styles to specific DOM subtrees with donut-hole boundaries.
- Never use `!important` within Cascade Layers due to the inverted layer priority paradox.

## Best Practices

1. **Establish a Layer Manifest at the Top of Your Stylesheet**: `@layer reset, base, components, utilities;`.
2. **Place Third-Party CSS in a Dedicated Layer**: `@import "bootstrap.css" layer(vendor);`.
3. **Use Single-Class Specificity for Components**: Avoid deep descendant chaining.
4. **Use `@scope` for Micro-Component Encapsulation**: Prevent style leakage without CSS-in-JS runtimes.
