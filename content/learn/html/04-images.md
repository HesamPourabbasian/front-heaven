---
title: 'Images, Media Paths & Semantic Figures'
description: 'Master HTML images: The img element, alt text accessibility decision trees, intrinsic aspect ratios (width & height), image paths, responsive basics, and semantic figure & figcaption.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/html/03-links
---

# Images, Media Paths & Semantic Figures

Images enrich web content, communicate visual ideas, and reinforce user interfaces. However, improperly implemented images are the number one cause of web performance degradation, layout shifts, and accessibility failures across the internet.

In this lesson, we explore the `<img>` void element, mandatory `alt` text accessibility rules, preventing Cumulative Layout Shift (CLS) with intrinsic `width` and `height` attributes, asset file paths, and semantic `<figure>` and `<figcaption>` markup.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Anatomy of an Image Tag             │
├────────────────────────────────────────────────────────────┤
│ <img                                                       │
│   src="/images/architecture-diagram.avif"                  │
│   alt="High-level feature sliced architecture diagram"     │
│   width="800"                                              │
│   height="450"                                             │
│   loading="lazy"                                           │
│ />                                                         │
├────────────────────────────────────────────────────────────┤
│ Golden Rule: ALWAYS provide explicit `alt`, width & height!│
└────────────────────────────────────────────────────────────┘
```

## 1. The `<img>` Element & Mandatory Attributes

The `<img>` tag is a void (self-closing) element that embeds raster or vector graphics into the document:

```html
<img src="/img/logo.svg" alt="Front-Heaven Logo" width="160" height="40" />
```

### Key Attributes:
1. **`src` (Source)**: The URL path to the image file (relative or absolute).
2. **`alt` (Alternative Text)**: A descriptive text alternative read aloud by screen readers when images cannot be seen, and rendered by browsers if the image fails to download.
3. **`width` and `height`**: The intrinsic aspect ratio pixel dimensions of the image asset.

## 2. The `alt` Text Decision Tree for Accessibility

Writing effective `alt` text is critical for WCAG compliance:

- **Informative Images**: Describe the content and context of the image concisely.
  ```html
  <img src="chart.png" alt="Bar chart showing a 40% increase in website speed after caching" />
  ```
- **Functional Images** (e.g., inside an `<a>` or `<button>` without text): The `alt` text must describe the *action* performed, not the visual pixels!
  ```html
  <a href="/print">
    <img src="printer-icon.svg" alt="Print this invoice" />
  </a>
  ```
- **Decorative Images** (e.g., background flourishes, abstract divider lines): Provide an **empty `alt=""`** attribute so screen readers cleanly skip the element rather than reading out the raw file path.

## 3. Preventing Cumulative Layout Shift (CLS) with Width & Height

When an image loads without `width` and `height` attributes, the browser has zero knowledge of the image's dimensions until the entire image file finishes downloading over the network. As the image suddenly appears, all content below it abruptly jumps downward, causing a jarring **Cumulative Layout Shift (CLS)** violation.

```html
<!-- ✅ Zero Layout Shift: Browser computes aspect-ratio (16:9) immediately! -->
<img
  src="/img/hero-banner.jpg"
  alt="Front-end developers collaborating in modern office"
  width="1280"
  height="720"
  class="w-full h-auto"
/>
```

Providing `width="1280"` and `height="720"` allows the browser engine to calculate `aspect-ratio: 1280 / 720` before the image finishes downloading, reserving the exact layout box in advance.

## 4. Semantic Figures with `<figure>` & `<figcaption>`

When an image, code snippet, or diagram is referenced in the text and requires an explanatory caption, wrap it in a `<figure>` and `<figcaption>`:

```html
<figure class="editorial-diagram">
  <img
    src="/diagrams/event-loop.svg"
    alt="Flowchart illustrating the browser call stack, microtask queue, and event loop"
    width="900"
    height="500"
  />
  <figcaption>
    Figure 1.2: The Chromium Event Loop execution cycle and microtask draining order.
  </figcaption>
</figure>
```

Assistive technologies treat `<figure>` and `<figcaption>` as an integrated semantic unit, associating the caption directly with the graphic.

## Summary

- The `<img>` element embeds visual graphics via the `src` attribute.
- Every image must have an `alt` attribute (descriptive for informative images, empty `alt=""` for decorative ones).
- Specifying intrinsic `width` and `height` attributes eliminates visual Cumulative Layout Shift (CLS).
- `<figure>` and `<figcaption>` semantically pair images, diagrams, and charts with their explanatory captions.

## Best Practices

1. **Never Omit the `alt` Attribute**: Omitting `alt` causes screen readers to read out the full cryptic filename URL.
2. **Always Provide `width` and `height` Attributes**: Reserve layout space to maintain excellent Core Web Vitals.
3. **Use Vector SVG for Logos & Icons**: Ensure crisp resolution at all screen zoom levels with minimal file size.
4. **Use `<figure>` for Numbered Diagrams and Photos**: Provide clear semantic context with `<figcaption>`.
