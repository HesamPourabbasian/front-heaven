---
title: 'Semantic Layout Elements'
description: 'Master HTML5 landmark layout elements: header, nav, main, section, article, aside, footer, and address.'
order: 22
difficulty: 'beginner'
category: 'Level 7 - Semantic HTML'
estimatedMinutes: 25
prerequisites:
  - /learn/html/semantic-html
---

## The Modern Semantic Page Blueprint

HTML5 introduced dedicated landmark elements to structure page layouts:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Blog Post — Front-Heaven</title>
  </head>
  <body>
    <!-- Top Site Header -->
    <header>
      <h1>Front-Heaven</h1>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/roadmap">Roadmap</a></li>
        </ul>
      </nav>
    </header>

    <!-- Primary Document Content (Only ONE per page) -->
    <main>
      <article>
        <header>
          <h2>Mastering Semantic Layouts</h2>
          <p>Published on <time datetime="2026-08-16">Aug 16, 2026</time></p>
        </header>

        <section>
          <h3>Introduction</h3>
          <p>Semantic markup provides structural clarity...</p>
        </section>

        <section>
          <h3>Benefits</h3>
          <p>Enhanced accessibility and search rankings...</p>
        </section>
      </article>

      <!-- Sidebar / Related content -->
      <aside aria-label="Related articles">
        <h3>Related Topics</h3>
        <ul>
          <li><a href="/learn/css">Learn CSS Grid</a></li>
        </ul>
      </aside>
    </main>

    <!-- Site Footer -->
    <footer>
      <p>&copy; 2026 Front-Heaven</p>
      <address>
        Contact: <a href="mailto:info@front-heaven.dev">info@front-heaven.dev</a>
      </address>
    </footer>
  </body>
</html>
```

---

## Landmark Elements Explained

| Element | Description |
| :--- | :--- |
| `<header>` | Introductory content or navigational aids for the page or section |
| `<nav>` | Major navigational block containing links |
| `<main>` | The central, unique content of the document (must only appear once) |
| `<article>` | Self-contained, independently distributable composition (blog post, product card) |
| `<section>` | Standalone thematic grouping of content (typically with a heading) |
| `<aside>` | Content tangentially related to surrounding content (sidebars, callout boxes) |
| `<footer>` | Concluding footer info (copyright, legal links, author metadata) |
| `<address>` | Contact information for the author or organization |

---

## Summary & Key Takeaways

- Exactly one `<main>` element should exist per HTML page.
- An `<article>` is reusable and could stand alone in an RSS feed or newspaper.
- A `<section>` is a thematic grouping that should almost always have an `<h2>`-`<h6>` heading.
- Use `<aside>` for sidebars and related link boxes.

---

## Practice Challenge

Build a full blog homepage layout containing:
1. A site `<header>` with a `<nav>`.
2. A `<main>` container featuring two distinct `<article>` blog posts.
3. An `<aside>` sidebar with author biography.
4. A site `<footer>` with contact info in an `<address>` tag.
