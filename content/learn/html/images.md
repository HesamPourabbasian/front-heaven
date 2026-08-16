---
title: 'Images in HTML'
description: 'Master the img element, src, alt attributes, responsive image formats, width/height dimensioning to prevent CLS, and image accessibility.'
order: 10
difficulty: 'beginner'
category: 'Level 4 - Images & Media'
estimatedMinutes: 20
prerequisites:
  - /learn/html/urls-and-navigation
---

## The Image Element (`<img>`)

The `<img>` tag embeds bitmap and vector images. It is a void element with two required attributes:

```html
<img src="images/sunset.jpg" alt="Vibrant orange sunset over mountain horizon" width="800" height="500" />
```

---

## The Critical Rules of `alt` Text

The `alt` (alternative text) attribute is vital for web accessibility and search engines:

1. **Informative Images**: Describe the visual information concisely.
   ```html
   <img src="chart.png" alt="Bar chart showing 35% revenue growth in Q3 2026" />
   ```
2. **Decorative Images**: Use an **empty** `alt=""` attribute so screen readers skip it without distraction.
   ```html
   <img src="decorative-divider.svg" alt="" aria-hidden="true" />
   ```
3. **Never omit `alt` entirely**: If `alt` is missing, screen readers read the ugly raw filename aloud!

---

## Preventing Layout Shifts (Cumulative Layout Shift - CLS)

Always specify `width` and `height` attributes on `<img>` tags. This allows the browser to compute the aspect ratio and reserve the exact space *before* the image file finishes downloading:

```html
<!-- Browser reserves 1200x800 space immediately -->
<img src="banner.webp" alt="Front-End Bootcamp" width="1200" height="800" loading="lazy" />
```

---

## Modern Image Formats

| Format | Best For | Transparency | Compression |
| :--- | :--- | :--- | :--- |
| **WebP** | Modern web photos and illustrations | Yes | Superior to JPEG & PNG |
| **AVIF** | Next-generation ultra-compressed photos | Yes | Best in class |
| **SVG** | Logos, icons, vector graphics | Yes | Infinite scaling (XML) |
| **PNG** | Screenshots requiring lossless quality | Yes | Large file size |
| **JPEG** | Legacy photographs | No | Standard lossy |

---

## Summary & Key Takeaways

- Every `<img>` tag must have a `src` and an `alt` attribute.
- Use empty `alt=""` for purely decorative graphics.
- Always include `width` and `height` to prevent Cumulative Layout Shift (CLS).
- Add `loading="lazy"` to off-screen images to improve initial page load speed.

---

## Practice Challenge

Create an HTML image gallery snippet with:
1. A hero image with explicit `width`, `height`, and descriptive `alt` text.
2. A decorative icon with empty `alt=""`.
3. Two thumbnail images with `loading="lazy"`.
