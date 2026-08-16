---
title: 'Advanced Typography & Variable Fonts'
description: 'Master variable fonts (font-variation-settings), font loading optimization (font-display), text-wrap: balance, and multi-line clamping.'
order: 34
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/3d-css
---

## 1. Variable Fonts

Variable fonts contain multiple weights, widths, and slants in a **single compact font file**:

```css
@font-face {
  font-family: 'InterVariable';
  src: url('Inter-VariableFont.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

h1 {
  font-family: 'InterVariable', sans-serif;
  font-variation-settings: 'wght' 750, 'slnt' -5;
}
```

---

## 2. Modern Text Wrapping (`text-wrap: balance` & `pretty`)

Prevent awkward single-word typographic orphans automatically:

```css
/* Balances line lengths across headline rows */
h1, h2, h3 {
  text-wrap: balance;
}

/* Prevents lone orphan words at the end of body paragraphs */
p {
  text-wrap: pretty;
}
```

---

## 3. Multi-Line Text Clamping

```css
/* Truncates text cleanly with ellipsis (...) after 3 lines */
.card-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Summary & Key Takeaways

- Use variable fonts to reduce HTTP font requests while unlocking granular weight control.
- Apply `text-wrap: balance` to all headings.
- Use `-webkit-line-clamp` for card excerpts.

---

## Practice Challenge

Build an article headline card that balances headings with `text-wrap: balance` and clamps long description paragraphs to 2 lines.
