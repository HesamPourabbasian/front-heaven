---
title: 'Introduction to Astro & Islands Architecture'
description: 'Understand Astro: zero JavaScript by default, multi-page applications, and component islands.'
order: 1
difficulty: 'intermediate'
category: 'Astro Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/html/introduction-to-html
---

## What is Astro?

**Astro** is the all-in-one web framework designed for content-driven websites (marketing, blogs, docs, portfolios).

---

## Islands Architecture (Client Directives)

Astro renders static HTML by default. Interactive React, Vue, or Svelte components are hydrated only when needed:

```astro
---
// Component Frontmatter (Server-only JS)
import InteractiveCarousel from '../components/Carousel.jsx';
---

<h1>Welcome to My Fast Site</h1>
<InteractiveCarousel client:visible />
```

---

## Summary & Key Takeaways

- Astro ships 0kb client JS by default until you add a `client:*` directive.
