---
title: 'Semantic HTML5 & Structural Landmarks'
description: 'Master Semantic HTML5 elements: header, nav, main, section, article, aside, footer, time, address, figure, and the elimination of generic div-soup architectures.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/html/07-forms
---

# Semantic HTML5 & Structural Landmarks

Before HTML5, web developers built entire layouts using generic `<div>` containers decorated with arbitrary CSS classes (`<div class="header">`, `<div class="content">`, `<div class="footer">`). This "div soup" provided zero machine-readable meaning to search engines and screen readers. HTML5 introduced **Semantic Elements** that carry intrinsic structural meaning.

In this lesson, we explore the core HTML5 semantic landmark elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<time>`, and `<address>`.

```text
┌────────────────────────────────────────────────────────────┐
│                    Semantic HTML5 Page Layout              │
├────────────────────────────────────────────────────────────┤
│ <header>                                                   │
│   <nav> ... Navigation Links ... </nav>                    │
│ </header>                                                  │
├──────────────────────────────┬─────────────────────────────┤
│ <main> (Primary Content)     │ <aside> (Related Sidebar)   │
│   <article>                  │   - Quick Links             │
│     <h2>Article Title</h2>   │   - Author Bio              │
│     <section>Sub-topic</sec> │   - Newsletter Signup       │
│   </article>                 │                             │
│ </main>                      │                             │
├──────────────────────────────┴─────────────────────────────┤
│ <footer> ... Copyright & Legal Links ... </footer>         │
└────────────────────────────────────────────────────────────┘
```

## 1. Page Landmark Elements: `<header>`, `<nav>`, `<main>`, `<footer>`

- **`<header>`**: Represents introductory content, branding logos, search bars, and top-level navigation.
- **`<nav>`**: Designates major navigational blocks containing links to other pages or internal sections. (Do not wrap every single link in `<nav>`; reserve it for primary menus, pagination, and breadcrumbs).
- **`<main>`**: The primary, non-repeating body content of the document. A page must have **exactly one visible `<main>` element**, and it must not contain content repeated across pages (like headers or footers).
- **`<footer>`**: Contains copyright notices, privacy policy links, sitemaps, and author contact details.

## 2. Content Sectioning: `<section>` vs `<article>` vs `<aside>`

- **`<article>`**: Represents a complete, self-contained piece of content that could theoretically be syndicated, distributed, or republished independently (e.g., a blog post, news story, forum comment, or product card). An `<article>` should almost always contain a heading (`<h2>`–`<h6>`).
- **`<section>`**: Represents a thematic grouping of content, typically with a heading. Use `<section>` to divide long articles into distinct chapters or to represent distinct panels on a landing page (e.g., Features, Pricing, Testimonials).
- **`<aside>`**: Represents secondary content indirectly related to the main content (e.g., related articles, glossaries, author callouts, or advertising banners).

```html
<main>
  <article>
    <header>
      <h2>Deep Dive: Web Performance in 2026</h2>
      <p>Published on <time datetime="2026-04-12">April 12, 2026</time></p>
    </header>

    <section>
      <h3>The Importance of Core Web Vitals</h3>
      <p>Interaction to Next Paint (INP) measures real-time responsiveness...</p>
    </section>

    <section>
      <h3>Eliminating Main Thread Bottlenecks</h3>
      <p>By scheduling long tasks with modern APIs...</p>
    </section>
  </article>

  <aside>
    <h3>About the Author</h3>
    <address>
      Written by <a href="mailto:author@front-heaven.dev">Hesam Pourabbasian</a>
    </address>
  </aside>
</main>
```

## 3. Micro-Semantics: `<time>` & `<address>`

- **`<time>`**: Encodes human-readable dates and times alongside machine-readable ISO-8601 formatting via the `datetime` attribute:
  ```html
  <time datetime="2026-08-18T14:30:00Z">August 18, 2026 at 2:30 PM</time>
  ```
  Search engines and calendar applications use this machine-readable string to index events and publish dates accurately.
- **`<address>`**: Encodes contact information for the author or owner of the document or enclosing `<article>` (e.g., email links, physical address, phone numbers).

## Summary

- Semantic HTML replaces meaningless `<div>` tags with elements that carry intrinsic structural meaning.
- `<header>`, `<nav>`, `<main>`, and `<footer>` define top-level accessibility landmarks.
- `<article>` represents self-contained reusable content; `<section>` groups thematic sub-sections.
- `<aside>` hosts secondary sidebars and tangential callouts.
- `<time datetime="...">` and `<address>` provide machine-readable metadata.

## Best Practices

1. **Keep Exactly One `<main>` per Document**: Provide screen readers with a direct jump landmark to the primary page content.
2. **Include a Heading Inside Every `<section>` and `<article>`**: Maintain an accessible document outline.
3. **Use `<time datetime="...">` for All Visible Dates**: Enable search engines to display rich publication dates in search results.
4. **Reserve `<nav>` for Major Navigation**: Do not wrap utility links or single buttons in `<nav>`.
