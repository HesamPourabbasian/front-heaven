---
title: 'Design Systems & Token Architecture with Bootstrap'
description: 'Master building enterprise design systems with Bootstrap 5: design token synchronization from Figma (Style Dictionary), semantic color tokens, component variant matrices, dark mode tokens, and multi-brand white-label architecture.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/bootstrap/28-bootstrap-architecture
  - /learn/bootstrap/29-bootstrap-customization
---

# Design Systems & Token Architecture with Bootstrap

An enterprise **Design System** is a unified collection of reusable components, design tokens, and engineering guidelines that ensure visual and functional consistency across dozens of applications. By marrying Bootstrap 5's resilient component primitives with automated **Design Tokens** (exported from Figma via Style Dictionary), organizations build scalable, multi-brand design systems with zero stylistic drift.

In this lesson, you will master design token hierarchies, semantic token abstraction, component variant matrices, and multi-brand theming pipelines.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Design Token Architecture Hierarchy                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Global / Primitive Tokens (Raw values)                                  │
│     color-indigo-500: #6366f1, spacing-4: 16px, radius-md: 8px              │
│                                │                                            │
│                                ▼                                            │
│  2. Semantic / Intent Tokens (Contextual meaning)                           │
│     color-interactive-primary: var(--color-indigo-500)                      │
│     color-surface-elevated: var(--color-slate-900)                          │
│                                │                                            │
│                                ▼                                            │
│  3. Component-Scoped Tokens (Bootstrap mappings)                            │
│     --bs-btn-bg: var(--color-interactive-primary)                           │
│     --bs-card-bg: var(--color-surface-elevated)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. 3-Tier Design Token Architecture

Modern design systems decouple raw color values from component usage using a 3-tier abstraction model:

1. **Primitive Tokens**: The absolute palette (e.g. `color.blue.500 = #3b82f6`).
2. **Semantic Tokens**: Meaning-assigned aliases (e.g. `color.action.primary = {color.blue.500}`).
3. **Component Tokens**: Mapped directly to Bootstrap CSS custom properties (e.g. `--bs-primary = var(--color-action-primary)`).

---

## 2. Synchronizing Tokens with Style Dictionary

Export tokens from Figma as JSON and compile them into Bootstrap-ready SCSS and CSS custom properties:

```json
{
  "color": {
    "brand": {
      "primary": { "value": "#4f46e5" },
      "secondary": { "value": "#64748b" }
    },
    "surface": {
      "background": {
        "light": { "value": "#ffffff" },
        "dark": { "value": "#0f172a" }
      }
    }
  }
}
```

### Style Dictionary Output (`tokens.scss`):
```scss
// Auto-generated design tokens
:root {
  --token-color-brand-primary: #4f46e5;
  --token-color-brand-secondary: #64748b;
  --token-radius-sm: 4px;
  --token-radius-md: 8px;
  --token-radius-lg: 16px;
}
```

---

## 3. Mapping Tokens to Bootstrap CSS Variables

Map your design tokens into Bootstrap 5's root and theme variables:

```scss
@import "tokens";

:root {
  --bs-primary: var(--token-color-brand-primary);
  --bs-primary-rgb: 79, 70, 229;
  --bs-border-radius: var(--token-radius-md);
  --bs-border-radius-lg: var(--token-radius-lg);
}

[data-bs-theme="dark"] {
  --bs-body-bg: #0f172a;
  --bs-body-color: #f8fafc;
  --bs-card-bg: #1e293b;
  --bs-border-color: #334155;
}
```

---

## 4. Building Component Variants & States Matrix

In an enterprise design system, components support predefined variants (Primary, Subtle, Ghost, Destructive) and sizes (SM, MD, LG):

```scss
// Enterprise Button Variant System
.btn-ghost {
  --bs-btn-color: var(--bs-primary);
  --bs-btn-bg: transparent;
  --bs-btn-border-color: transparent;
  --bs-btn-hover-color: var(--bs-primary);
  --bs-btn-hover-bg: var(--bs-primary-subtle);
  --bs-btn-active-bg: var(--bs-primary-subtle);
  --bs-btn-active-border-color: transparent;
}

.btn-destructive {
  --bs-btn-color: #ffffff;
  --bs-btn-bg: var(--bs-danger);
  --bs-btn-border-color: var(--bs-danger);
  --bs-btn-hover-bg: #b91c1c;
  --bs-btn-hover-border-color: #b91c1c;
}
```

---

## Summary & Key Takeaways

- 3-tier design tokens (Primitive -> Semantic -> Component) decouple UI code from arbitrary hex colors.
- Figma design tokens export via Style Dictionary directly into SCSS/CSS variables.
- Mapping semantic tokens to `--bs-*` custom properties ensures full Bootstrap component theme coverage.
- Custom component variants (`.btn-ghost`, `.btn-destructive`) extend Bootstrap's core components cleanly.

## Best Practices & Senior Guidance

1. **Never Allow Hardcoded Hex Codes in Component Code**: Always require developers to use CSS variables or utility classes referencing approved design tokens.
2. **Automate Token Synchronization via GitHub Actions**: Whenever designers push token updates to Figma, run an automated CI action that recompiles `tokens.scss` and opens a pull request.
