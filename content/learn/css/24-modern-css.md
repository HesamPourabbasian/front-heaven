---
title: 'Modern CSS Features, Logical Properties & Dynamic Viewport Units'
description: 'Master modern CSS capabilities: Native CSS nesting, aspect-ratio, logical properties (margin-inline, padding-block), modern mobile viewport units (dvh, svh, lvh), and color-mix().'
order: 24
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 25
prerequisites:
  - /learn/css/23-transforms-and-3d
---

# Modern CSS Features, Logical Properties & Dynamic Viewport Units

The CSS specification has evolved faster in recent years than in the previous two decades combined. Modern CSS eliminates the need for CSS preprocessors (Sass) for nesting, provides native **Logical Properties** that automatically adapt to international Right-to-Left (RTL) languages, solves the mobile URL-bar jump defect with **Dynamic Viewport Units (`dvh`)**, and enables intrinsic aspect-ratio reservation with **`aspect-ratio`**.

In this lesson, we explore **Native CSS Nesting**, **Logical Properties**, **Modern Mobile Viewport Units (`dvh`, `svh`, `lvh`)**, **`aspect-ratio`**, and **`color-mix()`**.

```text
┌────────────────────────────────────────────────────────────┐
│                    Physical vs Logical Properties          │
├──────────────────────┬─────────────────────────────────────┤
│ Physical (Left/Right)│ Modern Logical (Inline / Block)     │
├──────────────────────┼─────────────────────────────────────┤
│ `margin-left` / `-right` │ `margin-inline: 1rem;`          │
│ `padding-top` / `-bottom`│ `padding-block: 2rem;`          │
│ `width` / `height`   │ `inline-size` / `block-size`        │
│ `top/right/bottom/left`│ `inset-inline` / `inset-block`    │
├──────────────────────┴─────────────────────────────────────┤
│ Benefit: Automatically mirrors in RTL (Arabic, Hebrew, Farsi)!│
└────────────────────────────────────────────────────────────┘
```

## 1. Native CSS Nesting

Modern browsers natively support nesting without requiring build-step preprocessors (like Sass or PostCSS):

```css
.card {
  background-color: var(--bg-surface);
  border-radius: 0.75rem;
  padding: 1.5rem;

  /* Direct nested descendant */
  h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
  }

  /* Ampersand (&) represents the parent selector */
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  /* Nested modifier class */
  &.card-featured {
    border: 2px solid #3b82f6;
  }

  /* Nested media query */
  @media (min-width: 768px) {
    padding: 2.5rem;
  }
}
```

## 2. Logical Properties for Global Internationalization (i18n & RTL)

Physical properties (`margin-left`, `left: 0`) assume left-to-right (LTR) English text. When an application switches to Right-to-Left (RTL) languages like Arabic, Persian, or Hebrew, physical layouts break.

**Logical Properties** automatically flip direction based on writing mode:

```css
.badge {
  /* Physical (Breaks in RTL): */
  /* margin-left: 10px; padding: 4px 12px; text-align: left; */

  /* Modern Logical (Flips automatically in RTL!): */
  margin-inline-start: 10px; /* Start = Left in LTR, Right in RTL! */
  padding-block: 4px;        /* Top & Bottom */
  padding-inline: 12px;      /* Left & Right */
  text-align: start;         /* Aligns to Start edge */
}
```

## 3. Modern Mobile Viewport Units: `dvh`, `svh` & `lvh`

On mobile browsers (iOS Safari, Android Chrome), the address bar dynamically expands and shrinks during scrolling. Traditional `100vh` ignores this dynamic toolbar, causing full-height hero sections to be partially hidden behind the URL bar!

Modern CSS provides three adaptive viewport units:
- **`svh` (Small Viewport Height)**: The viewport height when the browser address bar is **fully expanded** (safest minimum visible area).
- **`lvh` (Large Viewport Height)**: The viewport height when the address bar is **completely retracted** into minimal mode.
- **`dvh` (Dynamic Viewport Height)**: **Live reactive unit** that automatically adjusts as the user scrolls and the address bar expands/contracts:

```css
/* Perfect Full-Screen Mobile App Shell (Never clipped by address bar!) */
.mobile-app-shell {
  min-height: 100dvh; /* Dynamic adaptation on mobile devices! */
  display: flex;
  flex-direction: column;
}
```

## 4. `aspect-ratio` & `color-mix()`

- **`aspect-ratio`**: Forces elements to maintain an exact proportional aspect ratio (e.g., `16 / 9` or `1 / 1`) even before images finish downloading:
  ```css
  .video-container {
    width: 100%;
    aspect-ratio: 16 / 9; /* Eliminates layout shifts for dynamic videos! */
  }
  ```
- **`color-mix()`**: Blends two colors together dynamically directly in CSS:
  ```css
  :root {
    --brand-primary: #2563eb;
    /* Create a 15% tinted hover state dynamically without hardcoding new hex codes! */
    --brand-hover: color-mix(in srgb, var(--brand-primary) 85%, black);
    --brand-tint: color-mix(in srgb, var(--brand-primary) 20%, white);
  }
  ```

## Summary

- Native CSS nesting allows clean, hierarchical rule authoring without preprocessor tooling.
- Logical properties (`margin-inline`, `padding-block`, `start`/`end`) automatically adapt to RTL languages.
- `100dvh` dynamically tracks expanding and retracting mobile browser address bars.
- `aspect-ratio: 16 / 9` reserves exact proportional layout boxes, eliminating Cumulative Layout Shifts.
- `color-mix()` blends color tokens dynamically inside CSS stylesheets.

## Best Practices

1. **Use `100dvh` for Full-Height Mobile Layouts**: Prevent address bar clipping bugs on iOS Safari.
2. **Adopt Logical Properties for All New UI Components**: Ensure immediate multi-lingual RTL compatibility.
3. **Use `aspect-ratio` on Responsive Media Containers**: Prevent CLS layout shifts during loading.
4. **Use `color-mix()` for Dynamic Hover and Focus States**: Derive tints programmatically from base tokens.
