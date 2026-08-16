---
title: 'HTML Performance & Core Web Vitals'
description: 'Optimize HTML performance: reducing DOM depth, native lazy loading, image dimensioning, and resource hints (preload, prefetch, preconnect).'
order: 34
difficulty: 'advanced'
category: 'Level 10 - HTML Best Practices'
estimatedMinutes: 25
prerequisites:
  - /learn/html/progressive-enhancement
---

## Why HTML Performance Matters

Fast-loading web pages improve user engagement, conversion rates, and Google Core Web Vitals scores (LCP, CLS, INP).

---

## Performance Optimizations in HTML

### 1. Resource Hints in `<head>`
Inform the browser about high-priority network connections and critical assets:

```html
<!-- Preconnect to external font CDN to save DNS/TLS handshake time -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload critical above-the-fold hero image (improves LCP) -->
<link rel="preload" href="/hero.webp" as="image" type="image/webp" />
```

### 2. Native Lazy Loading (`loading="lazy"`)
Defers loading of off-screen images and iframes until the user scrolls near them:

```html
<img src="feature-1.webp" alt="Feature screenshot" width="600" height="400" loading="lazy" />
<iframe src="https://example.com" title="Map" loading="lazy"></iframe>
```

### 3. Explicit Dimensions to Prevent Layout Shift (CLS)
Always provide `width` and `height` on media to prevent annoying content jumping while images load.

---

## Summary & Key Takeaways

- Use `<link rel="preload">` for critical LCP hero images and web fonts.
- Use `<link rel="preconnect">` for third-party API and asset CDNs.
- Add `loading="lazy"` to all images below the fold.
- Keep DOM depth shallow (under 32 levels deep).

---

## Practice Challenge

Optimize a slow landing page by adding resource preconnects, preloading the hero image, and configuring native lazy loading on gallery images.
