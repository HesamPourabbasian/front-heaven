---
title: 'HTML & CSS Integration'
description: 'Connect HTML to CSS: external stylesheets, internal styles, class naming conventions (BEM), ID selectors, and structuring HTML for styling.'
order: 38
difficulty: 'beginner'
category: 'Level 12 - HTML in Real Projects'
estimatedMinutes: 20
prerequisites:
  - /learn/html/advanced-browser-apis
---

## How HTML and CSS Connect

CSS applies visual styling to HTML elements using three integration methods:

---

## The 3 Ways to Include CSS

### 1. External Stylesheet (Best Practice)
Linked in the `<head>` of your HTML document. Can be cached by browsers across multiple pages:

```html
<link rel="stylesheet" href="styles.css" />
```

### 2. Internal Styles (`<style>`)
Placed inside the `<head>` for page-specific styles:

```html
<style>
  .hero-banner { background-color: #0f172a; color: #ffffff; }
</style>
```

### 3. Inline Styles (Avoid in Production)
Applied directly to an element via the `style` attribute. Difficult to maintain and cannot use media queries:

```html
<p style="color: red; font-weight: bold;">Error message</p>
```

---

## Class Naming Conventions: BEM (Block Element Modifier)

The **BEM** methodology creates modular, predictable CSS classes:

```html
<!-- Block -->
<article class="card card--featured">
  <!-- Elements -->
  <h2 class="card__title">Card Heading</h2>
  <p class="card__description">Card text body...</p>
  <button class="card__button card__button--primary">Learn More</button>
</article>
```

---

## Summary & Key Takeaways

- Always use external stylesheets for production websites.
- Use classes for styling rather than IDs or tag selectors.
- Adopt naming methodologies like BEM to avoid selector specificity conflicts.

---

## Practice Challenge

Create an HTML product card and structure its classes following BEM convention (`product-card`, `product-card__title`, `product-card__price--discounted`).
