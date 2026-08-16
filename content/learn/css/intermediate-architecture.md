---
title: 'CSS Architecture & BEM'
description: 'Learn scalable CSS organization: BEM methodology, utility classes, CSS resets, design tokens, and avoiding specificity wars.'
order: 24
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/modern-css
---

## The Problem with Unstructured CSS

As codebases grow, disorganized stylesheets suffer from:
- **Specificity wars**: Needing increasingly complex selectors or `!important` to override styles.
- **Dead code**: Fear of deleting old CSS rules because no one knows what might break.
- **Naming collisions**: Generic class names like `.title` overriding each other.

---

## The BEM Naming Methodology

**BEM** stands for **Block Element Modifier**:

1. **Block**: Standalone entity that is meaningful on its own (`.card`, `.navbar`, `.btn`).
2. **Element**: A component part of the block tied to its parent (`.card__title`, `.card__avatar`, `.navbar__item`).
3. **Modifier**: A flag that changes the appearance or state (`.card--featured`, `.btn--primary`, `.btn--disabled`).

```html
<article class="product-card product-card--sale">
  <img src="shoe.jpg" alt="Running Shoes" class="product-card__image" />
  <h3 class="product-card__title">Nike Air Max</h3>
  <span class="product-card__price product-card__price--discounted">$120</span>
  <button class="product-card__button btn btn--primary">Add to Cart</button>
</article>
```

---

## Modern CSS Reset

Every project should start with a clean baseline CSS reset:

```css
/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}
```

---

## Summary & Key Takeaways

- BEM creates low-specificity, self-documenting CSS classes.
- Start every project with a modern CSS reset.
- Store theme values in design tokens using CSS custom properties.

---

## Practice Challenge

Structure a complete navigation bar and hero section using strict BEM naming conventions.
