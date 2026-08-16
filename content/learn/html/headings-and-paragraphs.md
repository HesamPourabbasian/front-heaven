---
title: 'Headings & Paragraphs'
description: 'Master content structure: the h1-h6 heading hierarchy, paragraph flow, text formatting, and avoiding common structural mistakes.'
order: 4
difficulty: 'beginner'
category: 'Level 2 - Text & Content'
estimatedMinutes: 15
prerequisites:
  - /learn/html/html-elements
---

## The Heading Hierarchy (H1 to H6)

HTML provides six levels of section headings, from `<h1>` (highest importance) to `<h6>` (lowest importance):

```html
<h1>Document Main Title</h1>
<h2>Major Section Heading</h2>
<h3>Subsection Heading</h3>
<h4>Minor Topic Heading</h4>
<h5>Sub-minor Heading</h5>
<h6>Deep Detail Heading</h6>
```

---

## Golden Rules for Heading Hierarchy

1. **Only ONE `<h1>` per page**: The `<h1>` represents the primary topic of the document. Search engines and screen readers use it to understand the page's core subject.
2. **Never skip levels**: Move sequentially from `<h1>` to `<h2>` to `<h3>`. Never jump from `<h1>` directly to `<h4>` just because you want smaller text size.
3. **Use CSS for visual sizing**: Headings define **semantic importance**, not font size. If an `<h2>` needs to look smaller or larger, change its CSS `font-size`, do not change the HTML tag.

```html
<!-- Correct Heading Structure -->
<h1>Front-End Development Guide</h1>
  <h2>1. HTML Fundamentals</h2>
    <h3>Document Structure</h3>
    <h3>HTML Elements</h3>
  <h2>2. CSS Styling</h2>
    <h3>Flexbox</h3>
    <h3>CSS Grid</h3>
```

---

## Paragraphs (`<p>`)

The `<p>` element represents a paragraph of text. Browsers automatically add vertical margin before and after paragraphs:

```html
<p>
  HTML is the foundation of the modern web. Every website starts with structured markup.
</p>
<p>
  Paragraphs automatically wrap text onto multiple lines based on the width of the screen.
</p>
```

### Whitespace Collapsing in HTML
HTML collapses multiple spaces, tabs, and newlines into a **single space**:

```html
<!-- This renders as: "Line one. Line two." with only one space -->
<p>
  Line one.
  
  Line two.
</p>
```

If you need a line break without creating a new paragraph, use the void `<br>` element.

---

## Summary & Key Takeaways

- Use headings `<h1>` through `<h6>` to create a logical outline of your page.
- Exactly one `<h1>` should exist on every standard webpage.
- Always use `<p>` tags for blocks of text rather than consecutive `<br>` tags.
- Use CSS to adjust visual font sizes—choose HTML tags for semantic meaning.

---

## Practice Challenge

Create an article outline with:
1. One main title using `<h1>`.
2. Three major chapters using `<h2>`.
3. At least two subsections per chapter using `<h3>`.
4. Informative `<p>` paragraphs under each subsection.
