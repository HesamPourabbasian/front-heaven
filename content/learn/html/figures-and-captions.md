---
title: 'Figures & Captions'
description: 'Learn the semantic figure and figcaption elements for structuring photos, illustrations, code snippets, and diagrams with captions.'
order: 11
difficulty: 'beginner'
category: 'Level 4 - Images & Media'
estimatedMinutes: 15
prerequisites:
  - /learn/html/images
---

## The `<figure>` and `<figcaption>` Elements

The `<figure>` element represents self-contained content (frequently an image, diagram, chart, or code listing) that is referenced from the main document flow.

The `<figcaption>` element provides a semantic caption or legend for the figure:

```html
<figure>
  <img src="architecture-diagram.png" alt="Microservices diagram showing API Gateway connected to auth and user services" width="600" height="400" />
  <figcaption>Figure 1.1: Frontend-to-backend API gateway routing architecture.</figcaption>
</figure>
```

---

## Best Practices for Figures

1. **Self-contained**: You should be able to move the `<figure>` to an appendix or another part of the page without destroying the reader's comprehension.
2. **Placement of `<figcaption>`**: `<figcaption>` must be either the **first** or the **last** direct child of `<figure>`.
3. **Figures are not just for images**: You can use `<figure>` for code snippets, poetry, and quotes:

```html
<figure>
  <pre><code>const greeting = "Hello, World!";
console.log(greeting);</code></pre>
  <figcaption>Listing 2.4: Basic string variable assignment in JavaScript.</figcaption>
</figure>
```

---

## Summary & Key Takeaways

- Use `<figure>` for self-contained illustrations, charts, or code listings.
- Use `<figcaption>` inside `<figure>` to supply a descriptive title or caption.
- A `<figure>` can contain multiple images under a single shared caption.

---

## Practice Challenge

Create an educational card with:
1. A `<figure>` wrapping a technical image and a `<figcaption>`.
2. A second `<figure>` wrapping an HTML code example and its accompanying caption.
