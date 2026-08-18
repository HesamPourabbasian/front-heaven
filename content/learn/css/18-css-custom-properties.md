---
title: 'CSS Custom Properties (Variables), Theming & Design Tokens'
description: 'Master CSS Custom Properties (CSS Variables): var() function, fallback hierarchies, dynamic scoping, multi-theme architecture (Dark Mode), and JavaScript runtime integration.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/17-cascade-and-specificity
---

# CSS Custom Properties (Variables), Theming & Design Tokens

CSS Custom Properties (commonly referred to as **CSS Variables**) are live, reactive values defined with the `--custom-name` syntax and consumed via `var()`. Unlike compile-time preprocessor variables (Sass/Less), CSS custom properties live in the browser DOM, inherit down the element tree, participate in the Cascade, and can be read or mutated dynamically at runtime with JavaScript.

In this lesson, we explore CSS custom properties syntax, fallback values, two-tier **Design Token Architectures**, multi-theme dark mode switching, and two-way JavaScript DOM manipulation.

```text
┌────────────────────────────────────────────────────────────┐
│                    Two-Tier Design Token Architecture      │
├────────────────────────────────────────────────────────────┤
│ Tier 1: Global Primitive Tokens (Raw Colors & Scales)      │
│   `--blue-500: #3b82f6;`  `--slate-900: #0f172a;`          │
│       │                                                    │
│       ▼                                                    │
│ Tier 2: Contextual Semantic Tokens (Purpose-Driven)        │
│   Light Mode: `--bg-surface: #ffffff;` `--text-main: #0f;` │
│   Dark Mode : `--bg-surface: #0f172a;` `--text-main: #f8;` │
│       │                                                    │
│       ▼                                                    │
│ UI Components consume ONLY Semantic Tokens:                │
│   `.card { background: var(--bg-surface); }`               │
└────────────────────────────────────────────────────────────┘
```

## 1. Syntax, Scope & The `var()` Function

Declare custom properties on any selector (conventionally `:root` for global application-wide variables):

```css
:root {
  --brand-primary: #2563eb;
  --spacing-md: 1rem;
  --radius-lg: 0.75rem;
}

.card {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  /* var() with fallback value if property is undefined: */
  background-color: var(--card-bg, #ffffff);
}
```

## 2. Dynamic Component-Level Scoping & Overrides

Because custom properties inherit down the DOM tree, you can override variables on a specific component or container without writing new component CSS rules:

```css
.btn {
  /* Button uses contextual button color variables */
  background-color: var(--btn-bg, #2563eb);
  color: var(--btn-text, #ffffff);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

/* Modifier classes simply reassign the local variable! */
.btn-danger {
  --btn-bg: #ef4444;
  --btn-text: #ffffff;
}

.btn-ghost {
  --btn-bg: transparent;
  --btn-text: #2563eb;
}
```

## 3. Dark Mode & Theme Architecture

Implement seamless dark mode by switching semantic tokens on a parent class or `data-theme` attribute:

```css
:root {
  /* Light theme default */
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --text-primary: #0f172a;
  --border-subtle: #e2e8f0;
}

[data-theme="dark"] {
  /* Dark theme override */
  --bg-app: #090d16;
  --bg-surface: #0f172a;
  --text-primary: #f8fafc;
  --border-subtle: #1e293b;
}

/* Also support operating system prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-app: #090d16;
    --bg-surface: #0f172a;
    --text-primary: #f8fafc;
    --border-subtle: #1e293b;
  }
}
```

## 4. JavaScript Runtime Integration

Read and write custom properties with zero reflow overhead to drive interactive animations or track mouse coordinates:

```typescript
// 1. Set a global CSS variable from JavaScript
document.documentElement.style.setProperty("--brand-primary", "#8b5cf6");

// 2. Track mouse position for dynamic spotlight glow effect
window.addEventListener("pointermove", (e) => {
  document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
});

// 3. Read computed CSS variable value
const computedStyle = getComputedStyle(document.documentElement);
const primaryColor = computedStyle.getPropertyValue("--brand-primary").trim();
```

## Summary

- CSS custom properties (`--var`) are reactive DOM values resolved dynamically at runtime.
- The `var(--name, fallback)` function retrieves variables with safe default fallbacks.
- Two-tier token systems separate raw Primitive values from contextual Semantic tokens.
- Dark mode is implemented cleanly by reassigning semantic tokens on `[data-theme="dark"]`.
- JavaScript can read and write custom properties instantly using `style.setProperty()`.

## Best Practices

1. **Adopt a 2-Tier Token Hierarchy**: Never use raw primitive colors (`--blue-500`) directly inside components; alias them through semantic tokens (`--bg-action-primary`).
2. **Always Provide Fallbacks in `var()`**: Protect critical layouts if a variable is accidentally missing.
3. **Use Local Variable Overrides for Component Variants**: Keep modifier classes lean.
4. **Use CSS Variables for Mouse/Scroll-Driven Animations**: Pass coordinates via `style.setProperty()` rather than manipulating DOM elements directly.
