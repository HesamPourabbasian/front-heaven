---
title: 'HTML & Search Engine Optimization (SEO)'
description: 'Understand the role of HTML in SEO: search engine bots, indexing, crawl budgets, semantic ranking factors, and document architecture.'
order: 28
difficulty: 'intermediate'
category: 'Level 9 - SEO'
estimatedMinutes: 20
prerequisites:
  - /learn/html/aria
---

## What is SEO?

**Search Engine Optimization (SEO)** is the practice of optimizing web pages to maximize their visibility, rankings, and organic traffic in search engines like Google and Bing.

---

## How Search Engines Process HTML

1. **Crawling**: Automated bots (like Googlebot) traverse web pages by following hyperlinks (`<a>`).
2. **Parsing & Rendering**: The crawler parses HTML markup and executes JavaScript to construct the page DOM.
3. **Indexing**: The search engine analyzes headings, metadata, body text, and images to determine what the page is about and stores it in a massive distributed database.
4. **Ranking**: When a user queries a keyword, ranking algorithms evaluate content relevance, page speed, mobile usability, and backlinks to determine search position.

---

## HTML Ranking Factors

| HTML Element | SEO Value |
| :--- | :--- |
| `<title>` | Highest priority single factor for search snippets and relevance |
| `<meta name="description">` | Dictates the search result snippet preview |
| `<h1>`-`<h6>` | Outlines topic hierarchy and keyword relevance |
| `<a href="...">` | Enables link equity flow and crawler discovery |
| `<img alt="...">` | Enables Google Images discovery and context |
| `<link rel="canonical">` | Prevents duplicate content penalties |

---

## Summary & Key Takeaways

- Clean, semantic HTML is the foundation of technical SEO.
- Crawlers depend on valid hyperlinks to discover new pages.
- Accurate headings and metadata help search engines index your pages correctly.

---

## Practice Challenge

Audit an HTML document for SEO:
1. Ensure there is exactly one `<h1>` matching page intent.
2. Check all links have descriptive anchor text.
3. Add descriptive `alt` tags to all images.
