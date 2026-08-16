---
title: 'CSS Typography'
description: 'Master font-family, font-size, font-weight, line-height, letter-spacing, text-align, text-transform, Google Fonts, and font stacks.'
order: 5
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/units-and-measurements
---

## Core Typography Properties

```css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1rem;       /* 16px base size */
  font-weight: 400;      /* 400 = Regular, 700 = Bold */
  line-height: 1.6;      /* Unitless line-height for proportional scaling */
  letter-spacing: -0.01em;
  color: #1e293b;
}

h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  text-transform: capitalize;
}
```

---

## Font Stacks & System Fallbacks

A font stack ensures a smooth fallback if an external web font fails to load:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
```

---

## Loading Google Fonts & Web Fonts

```html
<!-- In HTML <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
```

---

## Summary & Key Takeaways

- Always use unitless `line-height` (`1.5` to `1.7` for body text, `1.1` to `1.3` for headings).
- Provide robust fallback font stacks ending with generic families (`sans-serif`, `serif`, `monospace`).
- Use `font-display: swap` on web fonts to prevent invisible text during loading.

---

## Practice Challenge

Style a blog post with:
1. Google Font integration for headings and body.
2. Perfect typographic scale with unitless `line-height`.
3. Negative letter spacing (`-0.02em`) on large headings.
