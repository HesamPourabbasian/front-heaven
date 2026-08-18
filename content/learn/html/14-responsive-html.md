---
title: 'Responsive Images, Media & Art Direction'
description: 'Master responsive HTML media: The picture element, resolution switching with srcset and sizes, art direction crops, responsive video and audio, and WebVTT caption tracks.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 25
prerequisites:
  - /learn/html/13-accessibility
---

# Responsive Images, Media & Art Direction

Users access websites across a vast range of device viewports and screen pixel densities—from small 375px mobile smartphones on slow 3G networks to ultra-wide 4K desktop displays. Sending a massive 4K desktop image to a mobile phone wastes user bandwidth and slows down page loading.

In this lesson, we explore **Resolution Switching** via `srcset` and `sizes`, **Art Direction** with the `<picture>` element, next-gen format negotiation (AVIF, WebP), and accessible HTML5 `<video>` and `<audio>` with `<track>` captions.

```text
┌────────────────────────────────────────────────────────────┐
│                    Responsive Image Strategies             │
├──────────────────┬─────────────────────────────┬───────────┤
│ Use Case         │ Optimal HTML Syntax         │ Mechanism │
├──────────────────┼─────────────────────────────┼───────────┤
│ Resolution Switch│ `<img srcset="..." sizes>`  │ Bandwidth │
│ Art Direction    │ `<picture><source media>`   │ Viewport  │
│ Format Fallback  │ `<picture><source type>`    │ AVIF/WebP │
│ Video Captions   │ `<video><track kind>`       │ a11y VTT  │
└──────────────────┴─────────────────────────────┴───────────┘
```

## 1. Resolution Switching: `srcset` & `sizes`

When you want to serve the same visual image at different pixel dimensions based on the user's screen width and device pixel density (1x vs 2x Retina), use `srcset` with width descriptors (`w`):

```html
<img
  src="/img/hero-800.jpg"
  srcset="
    /img/hero-400.jpg   400w,
    /img/hero-800.jpg   800w,
    /img/hero-1200.jpg 1200w,
    /img/hero-1600.jpg 1600w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
  alt="Front-end developers collaborating on user interface design"
  width="800"
  height="450"
  loading="lazy"
/>
```

### How the Browser Chooses:
1. The browser checks `sizes`: On a 500px mobile screen, `(max-width: 640px)` matches, meaning the image will occupy `100vw` (500px).
2. On a 2x Retina screen, the browser needs $500 \times 2 = 1000\text{px}$ of image detail.
3. The browser automatically selects `/img/hero-1200.jpg` from the `srcset` list—delivering crisp visuals without downloading the unnecessary 1600px desktop version!

## 2. Art Direction & Next-Gen Formats with `<picture>`

**Art Direction** refers to changing the visual cropping or aspect ratio of an image across different viewports (e.g., a square close-up crop on mobile vs a panoramic landscape banner on desktop):

```html
<picture>
  <!-- 1. Next-Gen AVIF Format for Mobile Viewports (Square Crop) -->
  <source
    media="(max-width: 768px)"
    srcset="/img/hero-square.avif"
    type="image/avif"
  />

  <!-- 2. Next-Gen AVIF Format for Desktop (Wide Crop) -->
  <source
    srcset="/img/hero-wide.avif"
    type="image/avif"
  />

  <!-- 3. Modern WebP Fallback -->
  <source
    srcset="/img/hero-wide.webp"
    type="image/webp"
  />

  <!-- 4. Default JPEG Fallback -->
  <img
    src="/img/hero-wide.jpg"
    alt="Developer workspace with code and design mockups"
    width="1200"
    height="600"
    class="w-full h-auto"
  />
</picture>
```

The browser evaluates `<source>` tags from top to bottom, picking the first supported format and media condition.

## 3. Accessible HTML5 Video & Audio with Captions

Embedding video and audio requires multiple format codecs and accessible WebVTT caption tracks:

```html
<video controls width="800" height="450" poster="/video/poster.jpg" preload="metadata">
  <!-- Modern VP9/AV1 WebM format -->
  <source src="/video/tutorial.webm" type="video/webm" />
  <!-- Standard MP4 format -->
  <source src="/video/tutorial.mp4" type="video/mp4" />

  <!-- Accessible Subtitles & Closed Captions (WebVTT format) -->
  <track
    kind="captions"
    src="/video/captions-en.vtt"
    srclang="en"
    label="English Captions"
    default
  />
  <track
    kind="subtitles"
    src="/video/subtitles-es.vtt"
    srclang="es"
    label="Español"
  />

  <p>Your browser does not support HTML5 video. <a href="/video/tutorial.mp4">Download video</a>.</p>
</video>
```

## Summary

- `srcset` and `sizes` allow browsers to download optimal image resolutions based on viewport size and device pixel density.
- The `<picture>` element enables Art Direction cropping and next-generation format negotiation (AVIF/WebP).
- `<video>` and `<audio>` provide native media playback without third-party plugins.
- `<track kind="captions">` attaches accessible WebVTT subtitle files for hearing-impaired users.

## Best Practices

1. **Serve AVIF First with WebP and JPEG Fallbacks**: Cut image bandwidth in half with next-generation compression.
2. **Always Include `sizes` When Using `srcset` Width Descriptors**: Prevent browsers from defaulting to assuming images take 100% of viewport width.
3. **Always Include Closed Captions with `<track>`**: Ensure multimedia compliance with WCAG standards.
4. **Always Provide a `poster` Image on `<video>`**: Reserve layout space and avoid black placeholder boxes before video playback starts.
