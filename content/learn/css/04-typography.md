---
title: 'Typography, Font Stacks & Web Font Optimization'
description: 'Master CSS typography: font-family stacks, font-size scales, line-height, letter-spacing, text alignment and transforms, loading Google Fonts, and @font-face performance.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/css/03-colors-and-units
---

# Typography, Font Stacks & Web Font Optimization

Typography represents more than 90% of the visual information consumed on the web. Clean typographical scales, proportional line heights, balanced letter spacing, and robust font fallbacks determine whether your application feels polished and effortless to read or fatiguing and disjointed.

In this lesson, we explore CSS typography properties: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`, loading Google Fonts, and optimizing custom fonts with `@font-face`.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Typography System Pyramid           │
├────────────────────────────────────────────────────────────┤
│ 1. `font-family`: System Fallback Stack + Web Font         │
│ 2. `font-size`  : Modular Rem Scale (1rem, 1.25rem, 2rem)  │
│ 3. `line-height`: Unitless Multiplier (1.2 for H1, 1.6 for P)
│ 4. `letter-spacing`: Tracking (-0.02em for headings)      │
│ 5. `@font-face` : Performance WOFF2 with font-display      │
└────────────────────────────────────────────────────────────┘
```

## 1. Font Families & Robust Font Stacks

The `font-family` property defines a prioritized list of fonts. If the first choice is not installed on the user's system or fails to download, the browser falls back to the next font in the stack:

```css
/* Modern High-Performance System Font Stack */
body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji';
}

/* Monospaced Code Stack */
code, pre {
  font-family:
    'Fira Code',
    'JetBrains Mono',
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
}
```

Always end your font stack with a generic family keyword (`sans-serif`, `serif`, `monospace`, or `cursive`).

## 2. Typographic Scale, Weights & Line Heights

- **`font-size`**: Defined in `rem` units to preserve accessibility.
- **`font-weight`**: Numerical weights from 100 (Thin) to 900 (Black):
  - `400`: Regular / Normal text
  - `500`: Medium
  - `600`: Semi-Bold
  - `700`: Bold
- **`line-height`**: Controls vertical spacing between text lines. **Always use unitless numbers** (e.g., `1.5` instead of `24px` or `150%`) so line-height automatically scales proportionally when child elements change font sizes:
  ```css
  /* Unitless line-height scaling rule: */
  h1 { font-size: 2.5rem; line-height: 1.15; } /* Tighter for large headings */
  p  { font-size: 1rem;   line-height: 1.6; }  /* Generous for body reading */
  ```

## 3. Letter-Spacing, Text Alignments & Transforms

```css
/* 1. Letter Spacing (Tracking) */
h1, h2 {
  letter-spacing: -0.025em; /* Subtle negative tracking tightens large headlines */
}
.eyebrow-badge {
  text-transform: uppercase;
  letter-spacing: 0.08em;   /* Wide tracking aids uppercase readability */
  font-size: 0.75rem;
  font-weight: 700;
}

/* 2. Text Alignment & Decoration */
.center-cta {
  text-align: center;
}
.nav-link {
  text-decoration: none;
}
.nav-link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

## 4. Custom Web Fonts with `@font-face`

Embed custom web font files with maximum loading performance:

```css
@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Instantly displays fallback font, swapping when loaded */
}

@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Using `font-display: swap` prevents invisible text flashes (FOIT) on slow mobile connections.

## Summary

- Robust font stacks provide fallback safety when custom web fonts fail or load slowly.
- Always use unitless `line-height` (`1.5`) to allow natural proportional inheritance.
- Large headings benefit from negative letter-spacing (`-0.02em`); uppercase tags require wide tracking (`0.08em`).
- `@font-face` loads modern WOFF2 fonts with `font-display: swap` for optimal Web Vitals performance.
- End every `font-family` declaration with a generic fallback (`sans-serif`, `serif`, `monospace`).

## Best Practices

1. **Always Use Unitless `line-height`**: Prevent unexpected text clipping and overflow bugs.
2. **Use Modern WOFF2 Web Fonts**: WOFF2 achieves up to 30% better compression than WOFF.
3. **Always Add `font-display: swap` to `@font-face`**: Ensure text remains readable while fonts download.
4. **Limit Custom Font Weights**: Load only the weights you actually use (e.g., 400 and 700) to save bandwidth.
