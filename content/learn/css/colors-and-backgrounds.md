---
title: 'Colors & Backgrounds'
description: 'Learn color formats (HEX, RGB, RGBA, HSL, HSLA), opacity, background-color, background-image, background-size, gradients, and multiple backgrounds.'
order: 3
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/selectors
---

## Modern CSS Color Formats

CSS supports multiple notation models for defining color values:

```css
.element {
  /* 1. Hexadecimal (HEX) */
  color: #0ea5e9;
  color: #0ea5e980; /* With 50% alpha channel */

  /* 2. RGB & RGBA */
  color: rgb(14, 165, 233);
  color: rgba(14, 165, 233, 0.5);
  color: rgb(14 165 233 / 50%); /* Modern CSS Color Module 4 syntax */

  /* 3. HSL (Hue, Saturation, Lightness) - highly intuitive for design */
  color: hsl(199, 89%, 48%);
  color: hsl(199deg 89% 48% / 50%);
}
```

---

## Background Properties

```css
.hero-banner {
  background-color: #0f172a;
  background-image: url('hero-pattern.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover; /* or contain, 100% auto */
}

/* Background Shorthand */
.card-header {
  background: #0f172a url('texture.png') no-repeat center / cover;
}
```

### Background Size Values:
- `cover`: Scales the image to fill the entire container, clipping edges if necessary.
- `contain`: Scales the image to be fully visible without clipping, leaving empty space if aspect ratios differ.

---

## Multiple Backgrounds

Layer multiple backgrounds by separating them with commas (the first layer renders on top):

```css
.card {
  background: 
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.15), transparent 70%),
    linear-gradient(to bottom, #ffffff, #f8fafc);
}
```

---

## Summary & Key Takeaways

- HSL (`hsl(hue, sat%, light%)`) is the easiest format for programmatically tweaking color shades.
- Use `background-size: cover` for full-bleed hero banners.
- Layer multiple backgrounds using comma-separated values.
- Modern CSS supports slash alpha notation: `rgb(255 0 0 / 50%)`.

---

## Practice Challenge

Build a hero card with:
1. A base dark background color.
2. A subtle radial gradient overlay.
3. An image pattern using `background-size: cover` and `background-position: center`.
