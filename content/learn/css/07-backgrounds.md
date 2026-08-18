---
title: 'CSS Backgrounds, Gradients & Multi-Layer Styling'
description: 'Master CSS backgrounds: background-color, background-image, background-size (cover, contain), background-position, gradients (linear, radial, conic), and multiple background layering.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/css/06-display
---

# CSS Backgrounds, Gradients & Multi-Layer Styling

Backgrounds provide visual depth, brand identity, and texture to user interfaces. CSS offers powerful declarative tools for manipulating background colors, responsive raster images, high-performance mathematical CSS gradients, and multi-layered compositions.

In this lesson, we explore the `background` suite of properties: `background-color`, `background-image`, `background-size` (`cover`, `contain`), `background-position`, `background-repeat`, CSS gradients (`linear`, `radial`, `conic`), and layering multiple background images.

```text
┌────────────────────────────────────────────────────────────┐
│                    Background Size Behavior                │
├──────────────┬─────────────────────────────────────────────┤
│ `cover`      │ Scales image to fill entire box (crops edges│
│ `contain`    │ Scales image to fit completely (letterboxes)│
│ `auto`       │ Keeps image at intrinsic original dimensions│
│ `100% 100%`  │ Stretches image distorting aspect ratio     │
└──────────────┴─────────────────────────────────────────────┘
```

## 1. Background Image Properties & Responsive Scaling

Embedding and scaling background images requires fine-tuning multiple interrelated properties:

```css
.hero-banner {
  /* 1. Base fallback color if image fails to load */
  background-color: #0f172a;

  /* 2. Image URL */
  background-image: url('/img/hero-pattern.svg');

  /* 3. Prevent tiling repetition */
  background-repeat: no-repeat;

  /* 4. Anchor image to center */
  background-position: center center;

  /* 5. Scale to fill entire container without distortion */
  background-size: cover;

  /* 6. Fixed parallax effect on desktop scroll */
  background-attachment: scroll;
}
```

- **`background-size: cover`**: Scales the image proportionally so that the background area is completely covered. If aspect ratios differ, edges are cropped cleanly.
- **`background-size: contain`**: Scales the image proportionally so that the entire image is visible within the container without cropping.

## 2. CSS Gradients: Linear, Radial & Conic

CSS gradients are rendered dynamically by the GPU as synthetic images, consuming zero network bandwidth:

### 1. Linear Gradient:
```css
.card-gradient {
  background-image: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
}
```

### 2. Radial Gradient (Circular / Elliptical):
```css
.spotlight-glow {
  background-image: radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.4), transparent 70%);
}
```

### 3. Conic Gradient (Color wheels & Pie charts):
```css
.pie-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: conic-gradient(#3b82f6 0% 65%, #e2e8f0 65% 100%);
}
```

## 3. Multiple Background Layering

CSS allows you to layer multiple background images and gradients on a single element, separated by commas. Layers are stacked **from top to bottom** (the first listed layer renders on top):

```css
.hero-composite {
  background-image:
    /* Top Layer: Dark translucent gradient overlay for text readability */
    linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9)),
    /* Bottom Layer: Photographic background image */
    url('/img/office-workspace.jpg');
  background-position: center center;
  background-size: cover;
}
```

## 4. Modern Shorthand Syntax

Combine all background properties into a single concise declaration:

```css
.banner {
  /* Syntax: [color] [image] [position] / [size] [repeat] [attachment] */
  background: #0f172a url('/img/stars.png') center / cover no-repeat fixed;
}
```

## Summary

- `background-size: cover` scales images to fill the container without aspect ratio distortion.
- CSS Gradients (`linear-gradient`, `radial-gradient`, `conic-gradient`) generate zero-bandwidth GPU graphics.
- Multiple background images are comma-separated and rendered top-to-bottom in listed order.
- Always provide a solid fallback `background-color` when using background images to maintain text contrast during asset loading.

## Best Practices

1. **Always Set a Fallback `background-color`**: Prevent unreadable white text on white backgrounds while images load.
2. **Use Translucent Gradient Overlays for Text Legibility**: Ensure minimum 4.5:1 WCAG contrast over photos.
3. **Use CSS Gradients Over Heavy PNG Assets**: Save hundreds of kilobytes of network transfer.
4. **Avoid `background-attachment: fixed` on Mobile**: Causes severe scrolling jank on mobile Safari/Chrome.
