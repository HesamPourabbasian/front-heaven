---
title: 'HTML Elements'
description: 'Understand block vs inline elements, void tags, nesting rules, parent-child hierarchies, and global HTML attributes.'
order: 3
difficulty: 'beginner'
category: 'Level 1 - HTML Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-document-structure
---

## Block-Level vs. Inline Elements

HTML elements traditionally fall into two primary display categories:

### 1. Block-Level Elements
- Always start on a new line.
- Take up the full available width of their parent container.
- Can contain other block-level or inline elements.
- **Common Examples**: `<div>`, `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>`, `<li>`, `<section>`, `<header>`, `<footer>`, `<form>`, `<table>`.

### 2. Inline Elements
- Do **not** start on a new line; they flow horizontally alongside neighboring text.
- Take up only as much width as necessary for their content.
- Cannot contain block-level elements.
- **Common Examples**: `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<code>`, `<button>`, `<input>`, `<label>`.

---

## Void (Self-Closing) Elements

Most HTML elements have an opening tag and a closing tag. **Void elements** (also called self-closing elements) cannot have child nodes or textual content; they only carry attributes.

| Void Tag | Purpose |
| :--- | :--- |
| `<img>` | Embeds an image |
| `<br>` | Inserts a single line break |
| `<hr>` | Inserts a thematic horizontal rule |
| `<input>` | Renders a form input control |
| `<meta>` | Declares document metadata in `<head>` |
| `<link>` | Links external stylesheets or fonts |

```html
<!-- Valid void elements (closing slash is optional in HTML5) -->
<img src="profile.jpg" alt="Profile photo" />
<input type="text" name="username" />
<br>
```

---

## Element Nesting & Hierarchy

Elements can be nested inside one another to form a parent-child hierarchy:

```html
<article class="card">              <!-- Parent -->
  <h2>Mastering HTML Elements</h2>  <!-- Child (sibling of p) -->
  <p>                               <!-- Child -->
    Learn how to nest <strong>cleanly</strong>. <!-- strong is grandchild -->
  </p>
</article>
```

### Nesting Rules to Remember:
1. **Proper overlap**: Close tags in the reverse order they were opened (`<p><strong>Text</strong></p>`, not `<p><strong>Text</p></strong>`).
2. **Inline cannot contain block**: Do not place a `<div>` or `<p>` inside an inline `<span>` or `<a>`.

---

## Global Attributes

Global attributes are attributes that can be used on **any** valid HTML element:

- `id`: Unique identifier across the entire document.
- `class`: Space-separated list of CSS classes for styling and JS targeting.
- `style`: Inline CSS styles (use sparingly).
- `title`: Advisory tooltip text displayed on mouse hover.
- `hidden`: Boolean attribute hiding the element from rendering.
- `tabindex`: Controls keyboard focus order.
- `data-*`: Custom data attributes for storing application state in HTML.

```html
<div id="featured-product" class="card highlight" data-category="electronics" title="Hover info">
  Product Card
</div>
```

---

## Summary & Key Takeaways

- Block elements start on new lines and fill full width; inline elements flow within text.
- Void elements have no closing tag and cannot contain child content.
- Always close nested tags in proper first-in, last-out order.
- Global attributes like `id`, `class`, and `data-*` work on every HTML element.

---

## Practice Challenge

Build an HTML snippet containing:
1. A parent block-level container.
2. Two sibling paragraphs inside the container.
3. Use inline elements (`<strong>`, `<em>`, `<code>`) inside the paragraphs.
4. Add global attributes (`id`, `class`, and a custom `data-role`) to the elements.
