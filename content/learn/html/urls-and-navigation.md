---
title: 'URLs & Navigation'
description: 'Understand URL structures, fragment navigation (#id), target attributes, security rules (rel=noopener), and accessible navigation patterns.'
order: 9
difficulty: 'beginner'
category: 'Level 3 - Links & Navigation'
estimatedMinutes: 20
prerequisites:
  - /learn/html/links
---

## Anatomy of a URL

A **Uniform Resource Locator (URL)** specifies where a resource lives on the web:

```text
https://front-heaven.dev:443/learn/html?search=forms#validation
──┬──   ─────────┬──────── ─┬─ ────┬───── ──────┬────── ────┬─────
Scheme        Host        Port   Path    Query Params   Fragment
```

- **Scheme**: Protocol (`https://`, `http://`).
- **Host**: Domain name (`front-heaven.dev`).
- **Path**: Location of the resource (`/learn/html`).
- **Query Parameters**: Key-value data (`?search=forms`).
- **Fragment**: Specific section identifier (`#validation`).

---

## Fragment Navigation (In-Page Anchors)

You can link directly to any HTML element on the page using its unique `id`:

```html
<!-- Navigation Links -->
<nav>
  <a href="#introduction">Intro</a>
  <a href="#features">Features</a>
  <a href="#contact">Contact</a>
</nav>

<!-- Target Sections -->
<section id="introduction">
  <h2>Introduction</h2>
</section>

<section id="features">
  <h2>Features</h2>
</section>

<section id="contact">
  <h2>Contact</h2>
</section>
```

---

## Opening Links in New Tabs (`target="_blank"`)

When opening links in a new browser tab, **always** include `rel="noopener noreferrer"` to prevent security vulnerabilities (tabnabbing):

```html
<a href="https://github.com" target="_blank" rel="noopener noreferrer">
  Open GitHub in New Tab
</a>
```

- `noopener`: Prevents the new page from accessing `window.opener` in JavaScript.
- `noreferrer`: Prevents the browser from leaking the referrer header to the destination site.

---

## Summary & Key Takeaways

- URLs consist of scheme, host, path, query parameters, and fragments.
- Fragments (`#id`) enable smooth jump navigation to elements with matching IDs.
- Always pair `target="_blank"` with `rel="noopener noreferrer"`.
- Write descriptive link text (avoid "click here").

---

## Practice Challenge

Build a table of contents on a long HTML page:
1. Create a top `<nav>` with 3 fragment links.
2. Create 3 content sections with matching `id` attributes.
3. Add a "Back to Top" fragment link (`href="#top"`) at the bottom of each section.
