---
title: 'The Cascade & Specificity Deep Dive'
description: 'Understand the cascade algorithm in depth: origin and importance, cascade layers (@layer), specificity calculations, and computed values.'
order: 28
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/advanced-selectors
---

## The Modern 2026 Cascade Order

When multiple CSS rules target an element, the browser evaluates them in this strict order:

1. **Origin and Importance**: User-agent `!important` > Developer `!important` > Developer regular > User-agent regular
2. **Cascade Layers (`@layer`)**: Later declared layers override earlier layers (un-layered CSS beats layered CSS)
3. **Specificity**: Inline (1,0,0,0) > ID (0,1,0,0) > Class/Attribute (0,0,1,0) > Element (0,0,0,1)
4. **Source Order**: The last declared rule in the stylesheet wins

---

## Mastering Cascade Layers (`@layer`)

Cascade layers allow you to group CSS rules into explicit priority tiers:

```css
/* Declare layer priority order upfront */
@layer reset, base, components, utilities;

@layer reset {
  * { box-sizing: border-box; margin: 0; }
}

@layer components {
  .btn {
    padding: 0.5rem 1rem;
    background: #0ea5e9;
    color: white;
  }
}

@layer utilities {
  /* Utilities automatically win over components without needing !important! */
  .p-0 { padding: 0; }
  .hidden { display: none; }
}
```

---

## Summary & Key Takeaways

- Cascade layers (`@layer`) solve specificity wars permanently.
- Un-layered styles always override layered styles (unless `!important` is used).
- Avoid using `!important` by organizing CSS into logical cascade layers.

---

## Practice Challenge

Set up a 4-tier cascade layer system (`reset`, `base`, `components`, `utilities`) and demonstrate how a utility class overrides a high-specificity component selector.
