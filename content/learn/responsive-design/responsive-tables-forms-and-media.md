---
title: 'Responsive tables, forms and media'
description: 'Tame the web''s hardest elements — horizontal-scrolling tables, stacked card tables, forms that reflow, and images and video that serve the right size to every device.'
order: 7
difficulty: 'beginner'
category: 'Components'
estimatedMinutes: 35
prerequisites:
  - learn/html/lists-and-tables
  - learn/html/forms
  - learn/responsive-design/media-queries
---

## Introduction

Some elements are naturally responsive: text reflows, flex wraps, grids reflow. Others fight you. Tables are wide by nature and overflow anything narrower than them. Forms cram their labels and inputs into columns that only suit desktop. Images and video must serve *different sizes* to different devices, not just scale. This lesson tames all three — the hard elements of responsive design — with the patterns professionals actually use.

## Tables: the overflow problem

A table with six columns cannot reflow — it is a grid of related cells, and breaking it destroys the data's meaning. The universal solution is to let the table keep its width and scroll inside its container:

```html
<div class="table-scroll" tabindex="0" role="region" aria-label="Transactions table">
  <table>
    <!-- ... -->
  </table>
</div>
```

```css
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;  /* smooth momentum on iOS */
  max-width: 100%;
}

.table-scroll table { min-width: 640px; }
```

The table keeps its comfortable 640px minimum; the *container* scrolls horizontally when the viewport is narrower. The `min-width` on the table is what makes the scroll happen — without it, the browser would squash the table to fit. The `role="region"` and `aria-label` give screen reader users a named, focusable region, and `tabindex="0"` lets keyboard users scroll it with arrow keys. On touch, horizontal swiping scrolls it naturally. This is the pragmatic default for data tables — and it is exactly what every dashboard, bank and admin panel ships.

## Tables: the stacked-card alternative

For a handful of columns, a more elegant mobile treatment exists: restructure the table into stacked cards. Each row becomes a card, and each cell becomes a labelled value. The technique — hiding the header row and labelling each cell with its header text via a data attribute:

```html
<table class="stack-table">
  <thead>
    <tr><th>Name</th><th>Status</th><th>Price</th></tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Name">Wireless headset</td>
      <td data-label="Status">In stock</td>
      <td data-label="Price">$89</td>
    </tr>
  </tbody>
</table>
```

```css
@media (max-width: 640px) {
  .stack-table thead { display: none; }

  .stack-table tr {
    display: block;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.75rem;
  }

  .stack-table td {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.35rem 0;
  }

  .stack-table td::before {
    content: attr(data-label);
    font-weight: 600;
  }
}
```

Each row becomes a self-contained card, each cell becomes a label–value pair, and the semantic table markup stays intact for screen readers. The trade-off: it is more CSS to maintain and only worth it for small tables. The professional rule of thumb: data-dense tables scroll; content-light tables stack.

## Forms: reflowing fields

Forms are two problems: layout (labels and inputs in columns) and sizing (inputs that must be tappable on mobile). The layout problem is solved by the same `minmax` grid you use for cards:

```css
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .form-grid { grid-template-columns: 1fr 1fr; }
  .form-grid .full { grid-column: 1 / -1; }
}
```

```html
<form class="form-grid">
  <div class="field">
    <label for="first">First name</label>
    <input id="first" name="first" autocomplete="given-name">
  </div>
  <div class="field">
    <label for="last">Last name</label>
    <input id="last" name="last" autocomplete="family-name">
  </div>
  <div class="field full">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email">
  </div>
</form>
```

One column on mobile, two on desktop, with `full`-spanning fields for anything that needs the whole width. The sizing problem is a mobile baseline:

```css
input, select, textarea {
  width: 100%;
  font-size: 1rem;           /* prevents iOS zoom-on-focus */
  padding: 0.75rem;
  min-height: 44px;          /* tappable, always */
}
```

Three details matter on phones. `width: 100%` makes inputs fill their column instead of their default intrinsic width. `font-size: 1rem` (16px) prevents the infamous iOS behaviour of zooming the page when an input focuses — anything smaller triggers it. And `min-height: 44px` gives thumbs a real target, which also helps accessibility.

## Images: serving the right size, not just scaling it

`max-width: 100%` scales an image down, but the *download* still transfers the full file. A 1200px hero image shown at 375px wastes megabytes on every phone load. Two attributes solve this: `srcset` tells the browser which files exist, and `sizes` tells it how wide the image will actually be displayed:

```html
<img
  src="hero-1200.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(min-width: 1024px) 1200px, 100vw"
  alt="Product hero"
  width="1200" height="675"
  fetchpriority="high"
>
```

The browser does the arithmetic: it knows the viewport, knows `sizes`, and picks the smallest file that serves the pixel density it needs. The `w` descriptors and `sizes` attribute are the syntax; the payoff is that phones download the 400px file and desktops the 1200px one. Note the `width` and `height` attributes — they reserve space and prevent layout shift while the image loads, a mobile performance concern in its own right.

## The picture element: art direction

Sometimes the same image should be *different*, not just smaller — a wide landscape crop on desktop, a square product shot on a phone, a WebP where supported and a JPEG fallback elsewhere. That is art direction, and it is the `<picture>` element's job:

```html
<picture>
  <source srcset="hero-crop-wide.webp" media="(min-width: 1024px)" type="image/webp">
  <source srcset="hero-crop-mobile.webp" media="(max-width: 1023px)" type="image/webp">
  <img src="hero-crop.jpg" alt="Team at work">
</picture>
```

Each `<source>` carries its own `media` condition and format; the browser uses the first matching source and falls back to the `<img>` if none match or the format is unsupported. The `<img>` inside is not a fallback decoration — it is the actual element that gets rendered, so it must carry the `alt`, `width`/`height`, and the base `src`. Use `srcset` for resizing, `<picture>` for changing the image itself.

## Video and embedded content

Video follows the image rule — never wider than its container:

```css
video, iframe, embed {
  max-width: 100%;
  display: block;
}
```

Modern HTML video with `srcset`-style choices uses a similar pattern to images:

```html
<video controls preload="metadata" width="1280" height="720">
  <source src="movie-480.mp4" media="(max-width: 640px)">
  <source src="movie-1080.mp4">
</video>
```

The `preload="metadata"` attribute matters on mobile: it fetches only the frame data and controls, not the whole file, until the user presses play. Embedded players (YouTube, Vimeo) are iframes with fixed aspect ratios — the classic pattern wraps them so the iframe fills its container while preserving 16:9:

```css
.video-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
}
.video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

## Common mistakes

Forgetting `min-width` on the table inside a scroll container, so the table gets crushed instead of scrolling. Removing the `<thead>` on mobile without providing `data-label` fallbacks, leaving screen reader users with unlabelled cells. Inputs smaller than 16px font-size, triggering iOS zoom-on-focus. Shipping one full-size image to all devices instead of `srcset`. Using `<picture>` for mere resizing (that is `srcset`'s job). And letting a video's fixed `width` attribute overflow its container because no `max-width: 100%` exists.

## Best practices

- Scroll data-dense tables in `overflow-x: auto` containers with a `min-width` table and a named, focusable region.
- Stack content-light tables into cards at small widths, labelling each cell from its header.
- Build forms as one-column-by-default grids that widen at a breakpoint; mark full-width fields.
- Keep inputs `width: 100%`, `font-size: 1rem`, `min-height: 44px` — always tappable, never zoom-triggering.
- Serve images with `srcset` + `sizes` (resizing) and `<picture>` (art direction), with explicit `width`/`height` to prevent shift.
- Cap video and iframes with `max-width: 100%`; preserve aspect ratios with `aspect-ratio` wrappers.

## Summary

Tables, forms and media are the hard elements of responsive design, and each has a proven pattern. Tables either scroll inside a named container or restructure into labelled stacked cards. Forms reflow through the same `minmax` grid logic as cards, with inputs that never trigger iOS zoom and always offer a 44px target. Media stops being "scale the same file" and becomes "serve the right file": `srcset` + `sizes` for resizing, `<picture>` for art direction, and aspect-ratio wrappers for embedded video. Master these three and there is almost nothing left on a page that can defeat you.

## Practice

Build a page with three sections. First, a 5-column data table inside a scroll container, plus a second copy stacked into cards below 640px using `data-label`. Second, a registration form — first/last name, email, password — one column on mobile, two on desktop, all inputs `1rem` font-size and 44px minimum height; open it on a real phone and confirm focusing an input does not zoom the page. Third, a gallery with three images served via `srcset`/`sizes` and one art-directed with `<picture>`; open DevTools' network tab on mobile emulation and confirm the small file downloads, then on desktop emulation and confirm the large one does. Finally, embed a 16:9 video that never overflows at 320px.