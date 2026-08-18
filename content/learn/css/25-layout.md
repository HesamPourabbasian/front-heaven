---
title: 'Multi-Column Layouts, CSS Masonry & Complex Positioning'
description: 'Master specialized CSS layout architectures: Multi-column newspaper text flow (columns, break-inside), CSS Masonry grid patterns, sticky sidebar viewports, and split-screen layouts.'
order: 25
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 25
prerequisites:
  - /learn/css/24-modern-css
---

# Multi-Column Layouts, CSS Masonry & Complex Positioning

Beyond standard Flexbox and Grid paradigms, real-world editorial websites, dashboard interfaces, and photo galleries require specialized layout architectures—such as **Multi-Column Text Flow**, **Masonry Pinboards** (Pinterest-style staggered height cards), and **Split-Screen Sticky Layouts**.

In this lesson, we explore the **CSS Multi-Column Layout Module**, column-break controls (`break-inside: avoid`), creating pure CSS Masonry photo feeds, and architectural patterns for sticky multi-panel layouts.

```text
┌────────────────────────────────────────────────────────────┐
│                    CSS Multi-Column Text Flow              │
├────────────────────────────────────────────────────────────┤
│ columns: 2 300px; gap: 2rem; column-rule: 1px solid #ccc;  │
│                                                            │
│ ┌── Column 1 ────────────┐   │   ┌── Column 2 ────────────┐│
│ │ Text flows down this   │   │   │ ...and automatically   ││
│ │ column continuously    │   │   │ continues seamlessly   ││
│ │ until the bottom...    │   │   │ into column 2!         ││
│ └────────────────────────┘   │   └────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

## 1. CSS Multi-Column Layout: Editorial Text Flow

The Multi-Column Layout module flows content continuously across multiple vertical columns like a newspaper:

```css
.editorial-article {
  /* Syntax: columns: [ideal-column-count] [minimum-column-width] */
  columns: 3 280px;
  column-gap: 2.5rem;
  column-rule: 1px solid #e2e8f0; /* Vertical dividing line between columns */
}

/* Span a headline across all columns */
.editorial-article h2.full-span {
  column-span: all;
  margin-block: 2rem;
}

/* Prevent cards or figures from splitting awkwardly across column breaks */
.editorial-article figure,
.editorial-article blockquote {
  break-inside: avoid; /* Keeps element intact within a single column! */
}
```

The browser automatically calculates how many 280px columns fit on screen: 1 column on mobile, 2 on tablet, and 3 on desktop.

## 2. Pure CSS Masonry Layouts with Multi-Column

Create an irregular, staggered-height Pinterest-style card pinboard without heavy JavaScript layout calculation libraries (like Isotope or Masonry.js):

```html
<div class="masonry-feed">
  <div class="masonry-item"><img src="/img/1.jpg" alt="..." /><h3>Card 1</h3></div>
  <div class="masonry-item"><img src="/img/2.jpg" alt="..." /><h3>Tall Card 2 with lots of text</h3></div>
  <div class="masonry-item"><img src="/img/3.jpg" alt="..." /><h3>Short Card 3</h3></div>
</div>
```

```css
.masonry-feed {
  columns: 4 260px;
  column-gap: 1.5rem;
}

.masonry-item {
  break-inside: avoid; /* Essential: Prevents cards from slicing across columns */
  margin-bottom: 1.5rem;
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
```

## 3. Split-Screen Sticky Scroll Layouts

A popular modern marketing pattern features a sticky left panel displaying an interactive phone mockup or product summary that stays pinned while a right panel scrolls through features:

```css
.split-screen-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start; /* Crucial for sticky alignment! */
}

/* Left panel pins to viewport while right panel scrolls past */
.sticky-showcase {
  position: sticky;
  top: 100px;
  height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.scrolling-features {
  display: flex;
  flex-direction: column;
  gap: 8rem;
  padding-block: 4rem;
}
```

## Summary

- The Multi-Column module (`columns`) flows editorial text continuously across columns.
- `column-span: all` allows headings and hero quotes to span across all active columns.
- `break-inside: avoid` prevents cards, images, and quotes from tearing across column breaks.
- Multi-column CSS powers pure CSS Masonry feeds without JavaScript performance overhead.
- Split-screen sticky layouts pair CSS Grid with `position: sticky` and `align-items: start`.

## Best Practices

1. **Always Add `break-inside: avoid` on Masonry Cards**: Prevent card boxes from splitting horizontally.
2. **Use `columns: [count] [width]` Shorthand**: Provide an automatic responsive column fallback.
3. **Set `align-items: start` on Sticky Grid Parents**: Ensure sticky children have room to travel within their track.
4. **Use `column-rule` for Crisp Dividing Borders**: Create clean magazine layout dividers.
