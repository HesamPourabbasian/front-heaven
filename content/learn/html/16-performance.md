---
title: 'HTML Performance, Resource Hints & Script Loading'
description: 'Master HTML loading performance: Script execution models (async, defer, type=module), resource hints (preload, prefetch, preconnect), native lazy loading, and fetchpriority optimization.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 25
prerequisites:
  - /learn/html/15-seo
---

# HTML Performance, Resource Hints & Script Loading

When a browser downloads an HTML document, every `<script>`, `<link rel="stylesheet">`, font, and image referenced in the markup impacts the **Critical Rendering Path**. Unoptimized script tags pause HTML parsing completely, freezing the screen and delaying First Contentful Paint (**FCP**).

In this lesson, we explore the mechanics of script loading attributes (`async`, `defer`, `type="module"`), network resource hints (`preload`, `prefetch`, `preconnect`), native media lazy loading (`loading="lazy"`), and `fetchpriority`.

```text
┌────────────────────────────────────────────────────────────┐
│                    Script Loading Execution Models         │
├────────────────────────────────────────────────────────────┤
│ 1. Regular `<script>`: Blocks HTML parsing while fetching  │
│    HTML: ───[ PARSE ]───( PAUSED )───[ PARSE RESUMES ]──►  │
│    JS:                 [ FETCH ][ RUN ]                    │
├────────────────────────────────────────────────────────────┤
│ 2. `<script defer>`: Fetches in parallel, runs AFTER HTML  │
│    HTML: ───[ PARSE HTML TO COMPLETION ]────────────────►  │
│    JS:   [ FETCH IN BG ]              [ RUN SCRIPTS ]      │
├────────────────────────────────────────────────────────────┤
│ 3. `<script async>`: Fetches in parallel, runs IMMEDIATELY │
│    HTML: ───[ PARSE ]───( PAUSED )───[ PARSE RESUMES ]──►  │
│    JS:   [ FETCH IN BG ][ RUN NOW ]                        │
└────────────────────────────────────────────────────────────┘
```

## 1. Script Loading Strategies: `defer` vs `async` vs `type="module"`

- **Regular `<script src="...">`**: **Parser-blocking!** The browser immediately halts HTML parsing, downloads the script over the network, executes it, and only then resumes parsing the rest of the HTML.
- **`<script src="..." defer>`**: The browser downloads the script in the background while continuing to parse the HTML document. Scripts execute **in exact document order** only after HTML parsing is completely finished, right before the `DOMContentLoaded` event fires.
- **`<script src="..." async>`**: The browser downloads the script in the background, but executes it the **microsecond it finishes downloading**, pausing HTML parsing. (Use `async` only for independent third-party analytics scripts like Google Analytics).
- **`<script type="module">`**: Modern ES Modules are automatically **deferred by default** and execute in strict mode.

## 2. Resource Hints: `preload`, `prefetch` & `preconnect`

Instruct the browser network engine on the urgency of upcoming assets:

```html
<!-- 1. Preconnect: Warms up DNS lookup and TLS handshake for external APIs/CDNs -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- 2. Preload: High-priority download for critical fonts or hero images needed immediately -->
<link
  rel="preload"
  href="/fonts/inter-bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- 3. Prefetch: Low-priority download for assets needed on the NEXT page navigation -->
<link rel="prefetch" href="/js/checkout-page.js" />
```

## 3. Optimizing Hero Images with `fetchpriority="high"`

The Largest Contentful Paint (**LCP**) element is typically a large hero image at the top of the viewport. By default, browsers assign medium network priority to images. Boost the LCP image priority:

```html
<!-- High-priority hero image: Downloads before deferred scripts -->
<img
  src="/img/hero-cover.avif"
  alt="Front-end architecture dashboard preview"
  width="1200"
  height="600"
  fetchpriority="high"
  decoding="async"
/>
```

## 4. Native Lazy Loading with `loading="lazy"`

Offscreen images and iframes below the fold should not consume mobile network data on initial page load. Add `loading="lazy"`:

```html
<!-- Browser defers download until image is scrolled near the viewport -->
<img
  src="/img/footer-testimonial.jpg"
  alt="Customer review portrait"
  width="400"
  height="400"
  loading="lazy"
/>
```

**Golden Rule**: Never apply `loading="lazy"` to the LCP hero image above the fold! Doing so delays image discovery and degrades your Core Web Vitals score.

## Summary

- Regular `<script>` tags block HTML parsing; use `defer` or `type="module"` for application scripts.
- `async` downloads in parallel and executes immediately upon arrival; ideal for independent analytics.
- `preconnect` establishes early network sockets; `preload` forces high-priority discovery of critical fonts.
- `fetchpriority="high"` accelerates Largest Contentful Paint (LCP) hero images.
- Native `loading="lazy"` defers offscreen images until they scroll near the viewport.

## Best Practices

1. **Always Defer Non-Critical JavaScript**: Prevent white-screen parsing delays during initial page load.
2. **Never Lazy-Load Above-the-Fold LCP Images**: Keep hero images eager and set `fetchpriority="high"`.
3. **Preload Critical Custom Web Fonts with `crossorigin`**: Prevent Invisible Text (FOIT) flashes on startup.
4. **Preconnect to Critical CDN Domains**: Eliminate 200–500ms of DNS and TLS connection latency.
