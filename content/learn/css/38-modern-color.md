---
title: 'Modern CSS Color Spaces, OKLCH & Wide-Gamut Display-P3'
description: 'Master modern CSS color science: OKLCH and OKLab perceptually uniform color spaces, Relative Color Syntax (from keyword), color-mix(), Wide-Gamut Display-P3 screens, and accessible contrast palettes.'
order: 38
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/css/37-advanced-visual-effects
---

# Modern CSS Color Spaces, OKLCH & Wide-Gamut Display-P3

For decades, the web was restricted to the legacy **sRGB color space** (HEX, `rgb()`, `hsl()`), designed in the 1990s for bulky CRT monitors. Today, modern iPhone, MacBook, and OLED displays can render up to 50% more vibrant colors via **Wide-Gamut Display-P3**. Furthermore, legacy HSL suffers from severe non-uniform lightness flaws (e.g., pure blue and pure yellow at $50\%$ lightness have wildly different human perceived brightness).

In this lesson, we explore **OKLCH** (the perceptually uniform color model), **Relative Color Syntax (`oklch(from ...)`)**, **Wide-Gamut P3 color spaces**, and building guaranteed accessible contrast systems.

```text
┌────────────────────────────────────────────────────────────┐
│                    Why OKLCH Beats Legacy HSL              │
├────────────────────────────────────────────────────────────┤
│ In HSL:                                                    │
│   `hsl(60, 100%, 50%)` (Yellow) ──► Perceived as VERY BRIGHT
│   `hsl(240, 100%, 50%)` (Blue)  ──► Perceived as VERY DARK   │
│   (Lightness 50% does NOT mean equal perceived brightness!)│
│                                                            │
│ In OKLCH (Perceptually Uniform):                           │
│   `oklch(0.65 0.25 100)` (Yellow) and                      │
│   `oklch(0.65 0.25 260)` (Blue)                            │
│   Have EXACTLY identical human perceived luminance!        │
└────────────────────────────────────────────────────────────┘
```

## 1. The Power of OKLCH: Perceptual Uniformity

**OKLCH** stands for **Lightness, Chroma, Hue**:
- **Lightness ($0.0$ to $1.0$ / $0\%$ to $100\%$)**: True human perceived brightness. Two colors with the same lightness value are guaranteed to have identical contrast against white or black text!
- **Chroma ($0.0$ to $0.4+$)**: Color saturation/vibrancy. (0 = neutral gray, 0.3+ = vibrant neon).
- **Hue ($0^\circ$ to $360^\circ$)**: The color wheel angle ($25^\circ = \text{red}$, $145^\circ = \text{green}$, $260^\circ = \text{blue}$).

```css
:root {
  /* Vibrant, wide-gamut OKLCH design tokens */
  --brand-primary: oklch(0.62 0.24 260); /* Radiant Blue */
  --brand-success: oklch(0.72 0.20 145); /* Crisp Emerald */
  --brand-danger:  oklch(0.62 0.24 25);  /* Vivid Crimson */
}
```

## 2. Relative Color Syntax: The `from` Keyword

Modern CSS allows you to take any existing color variable and dynamically modify its lightness, chroma, or alpha channel using **Relative Color Syntax**:

```css
:root {
  --theme-color: #2563eb;
}

.button {
  background-color: var(--theme-color);
}

.button:hover {
  /* Take --theme-color, keep hue and chroma, but increase lightness by 10%! */
  background-color: oklch(from var(--theme-color) calc(l + 0.1) c h);
}

.button-tint {
  /* Reduce chroma to 20% and add 50% alpha transparency */
  background-color: oklch(from var(--theme-color) l calc(c * 0.2) h / 0.5);
}
```

This eliminates the need for Sass `lighten()` or `darken()` mixins—everything happens live in native browser CSS!

## 3. Wide-Gamut Display-P3 & `@media (color-gamut: p3)`

Take advantage of ultra-vibrant colors on modern high-end displays while providing safe sRGB fallbacks:

```css
.hero-glow {
  /* Standard sRGB Fallback */
  background: rgb(0, 150, 255);
}

@media (color-gamut: p3) {
  .hero-glow {
    /* Ultra-vibrant Wide Gamut Display-P3 on modern Apple / OLED screens */
    background: color(display-p3 0.1 0.65 1);
  }
}
```

## 4. Programmatic Palette Generation with `color-mix()`

Generate an entire 10-step design token palette dynamically from a single primary brand color:

```css
:root {
  --primary: oklch(0.6 0.22 250);

  /* Dynamic tints */
  --primary-100: color-mix(in oklch, var(--primary) 10%, white);
  --primary-300: color-mix(in oklch, var(--primary) 30%, white);
  --primary-500: var(--primary);
  --primary-700: color-mix(in oklch, var(--primary) 70%, black);
  --primary-900: color-mix(in oklch, var(--primary) 90%, black);
}
```

## Summary

- OKLCH is a perceptually uniform color space that guarantees predictable contrast and brightness across all hues.
- Relative Color Syntax (`oklch(from var(--color) ... )`) dynamically adjusts lightness and saturation in native CSS.
- Display-P3 unlocks up to 50% more vibrant colors on modern mobile and desktop monitors.
- `color-mix(in oklch, ...)` generates scalable design token palettes from a single source color.
- OKLCH solves the legacy color accessibility flaws of HSL.

## Best Practices

1. **Adopt OKLCH for New Design Token Systems**: Ensure predictable WCAG contrast calculations across themes.
2. **Use Relative Color Syntax for Hover and Active States**: Eliminate hardcoded color modifier variables.
3. **Always Specify the Color Space in `color-mix()`**: Use `color-mix(in oklch, ...)` for natural perceptual blending.
4. **Use P3 Colors with sRGB Fallbacks**: Deliver vibrant visuals on modern screens while preserving compatibility.
