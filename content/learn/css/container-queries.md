---
title: 'CSS Container Queries (@container)'
description: 'Build truly modular, component-driven responsive layouts with container-type, container-name, and @container queries.'
order: 30
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/advanced-css-variables
---

## The Limit of Media Queries

Media queries respond to the **entire viewport window**. But in modern component-driven architectures, a Card component might live in:
- A wide 1200px main content area (where it should render horizontally).
- A narrow 300px sidebar (where it should render vertically).

With media queries, the card cannot know where it lives. **Container Queries** solve this by responding to the width of the **parent container**!

---

## Creating a Query Container

```css
/* 1. Define the parent container */
.card-wrapper {
  container-type: inline-size; /* Observes container width */
  container-name: card-box;    /* Optional container identifier */
}

/* 2. Default Card Style (Vertical layout for narrow spaces) */
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 3. Container Query: When the card's parent container is >= 500px */
@container (min-width: 500px) {
  .card {
    flex-direction: row; /* Switches to horizontal layout! */
    align-items: center;
  }

  .card__image {
    width: 150px;
    height: 150px;
  }
}
```

---

## Summary & Key Takeaways

- Use `container-type: inline-size` on wrapper containers.
- Write `@container (min-width: 400px)` to build truly autonomous reusable components.
- Container queries make components reusable in sidebars, modals, and grids simultaneously.

---

## Practice Challenge

Build a self-contained product card that renders vertically when placed in a 300px sidebar, and expands into a horizontal split-pane card when placed in an 800px main content column.
