---
title: 'CSS Images, Gradients & Media'
description: 'Learn object-fit, object-position, aspect-ratio, image cropping, linear gradients, radial gradients, and conic gradients.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/forms
---

## `object-fit` and `object-position`

Controls how an `<img>` or `<video>` responds when forced into specific dimensions:

```css
.avatar-cover {
  width: 200px;
  height: 200px;
  object-fit: cover;        /* Crops image without distorting aspect ratio */
  object-position: center top; /* Centers focal point */
  border-radius: 1rem;
}
```

---

## Native `aspect-ratio`

Enforce consistent aspect ratios on responsive cards without padding hacks:

```css
/* 16:9 Video Ratio */
.video-card {
  aspect-ratio: 16 / 9;
  width: 100%;
}

/* 1:1 Square Instagram card */
.square-card {
  aspect-ratio: 1 / 1;
}
```

---

## CSS Gradients

```css
/* 1. Linear Gradient */
.linear-hero {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%);
}

/* 2. Radial Gradient (Spotlight effect) */
.radial-spotlight {
  background: radial-gradient(circle at top left, #38bdf8, #0f172a 70%);
}

/* 3. Conic Gradient (Color wheels & Pie charts) */
.pie-chart {
  background: conic-gradient(#0ea5e9 0% 60%, #e2e8f0 60% 100%);
  border-radius: 50%;
}
```

---

## Summary & Key Takeaways

- Use `object-fit: cover` to prevent images from looking squished or stretched.
- Use `aspect-ratio: 16/9` to prevent layout shifts on media containers.
- Create multi-color mesh backgrounds with layered gradients.

---

## Practice Challenge

Build a video player card with an enforced `aspect-ratio: 16/9`, `object-fit: cover`, and a subtle gradient overlay.
