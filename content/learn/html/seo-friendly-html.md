---
title: 'SEO-Friendly HTML Architecture'
description: 'Learn SEO best practices: structured content, crawlable links, descriptive anchor texts, and structured data with JSON-LD schema.'
order: 30
difficulty: 'intermediate'
category: 'Level 9 - SEO'
estimatedMinutes: 20
prerequisites:
  - /learn/html/metadata
---

## Writing HTML That Search Engines Love

### 1. Descriptive Anchor Links
Never write generic anchor text like "click here" or "read more". Search engines use anchor text to determine the topic of the linked page:

```html
<!-- BAD -->
<p>To learn more about flexbox, <a href="/css/flexbox">click here</a>.</p>

<!-- GOOD -->
<p>Read our comprehensive <a href="/css/flexbox">guide to CSS Flexbox layouts</a>.</p>
```

---

## 2. Structured Data with JSON-LD

**JSON-LD (JavaScript Object Notation for Linked Data)** provides machine-readable structured schema directly in your HTML. Search engines use it to generate **Rich Snippets** (star ratings, event dates, pricing, recipe cooking times):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "HTML Fundamentals",
  "description": "Learn HTML from scratch with interactive lessons.",
  "provider": {
    "@type": "Organization",
    "name": "Front-Heaven",
    "sameAs": "https://front-heaven.dev"
  }
}
</script>
```

---

## Summary & Key Takeaways

- Use descriptive anchor text for internal and external links.
- Structure content with clear heading hierarchy and semantic layout tags.
- Embed JSON-LD structured data for Google rich snippets.

---

## Practice Challenge

Create an article page with:
1. Three descriptive contextual hyperlinks.
2. An embedded JSON-LD script defining an `Article` schema.
