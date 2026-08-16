---
title: 'HTML Metadata & Open Graph'
description: 'Master meta tags: title, meta description, viewport, robots, Open Graph social sharing tags, Twitter cards, and canonical URLs.'
order: 29
difficulty: 'intermediate'
category: 'Level 9 - SEO'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-and-seo
---

## The Power of the `<head>`

Metadata gives search engines, social media platforms (Twitter, LinkedIn, Facebook, Slack, Discord), and browsers critical information about how to display your page.

---

## Essential SEO & Social Metadata

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO Metadata -->
  <title>Learn Front-End Development — Front-Heaven</title>
  <meta name="description" content="Step-by-step interactive front-end development roadmaps and lessons for beginners." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://front-heaven.dev/learn/html" />

  <!-- Open Graph (Facebook, LinkedIn, Discord) -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://front-heaven.dev/learn/html" />
  <meta property="og:title" content="Learn Front-End Development — Front-Heaven" />
  <meta property="og:description" content="Interactive front-end development lessons." />
  <meta property="og:image" content="https://front-heaven.dev/og-image.jpg" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Learn Front-End Development — Front-Heaven" />
  <meta name="twitter:description" content="Interactive front-end development lessons." />
  <meta name="twitter:image" content="https://front-heaven.dev/og-image.jpg" />
</head>
```

---

## Canonical URLs (`<link rel="canonical">`)

If your site has content accessible via multiple URLs (e.g., `https://example.com/item` and `https://example.com/item?source=newsletter`), the canonical tag tells Google which URL is the master version, preventing duplicate content ranking penalties.

---

## Summary & Key Takeaways

- Always set a unique `<title>` and `<meta name="description">` on every page.
- Use Open Graph (`og:*`) and Twitter cards to control social sharing rich previews.
- Use `<link rel="canonical">` to specify the primary source URL.

---

## Practice Challenge

Build a complete `<head>` metadata block for a portfolio project with Open Graph social preview tags and canonical links.
