---
title: 'Lists in HTML'
description: 'Master unordered (ul), ordered (ol), and description (dl, dt, dd) lists, nested lists, and custom numbering schemes.'
order: 6
difficulty: 'beginner'
category: 'Level 2 - Text & Content'
estimatedMinutes: 20
prerequisites:
  - /learn/html/text-formatting
---

## Types of HTML Lists

HTML provides three distinct list types to present items clearly:

1. **Unordered Lists (`<ul>`)**: Collection of items where order does not matter (bulleted).
2. **Ordered Lists (`<ol>`)**: Sequential items where order is meaningful (numbered).
3. **Description Lists (`<dl>`)**: Pairs of terms and definitions (glossaries, metadata).

---

## 1. Unordered Lists (`<ul>` & `<li>`)

Use `<ul>` when rearranging items does not change the core meaning:

```html
<h2>Shopping List</h2>
<ul>
  <li>Fresh Apples</li>
  <li>Oat Milk</li>
  <li>Whole Wheat Bread</li>
</ul>
```

---

## 2. Ordered Lists (`<ol>` & `<li>`)

Use `<ol>` for recipes, step-by-step instructions, or rankings:

```html
<h2>How to Deploy a Website</h2>
<ol>
  <li>Write and test your HTML code.</li>
  <li>Commit changes with Git.</li>
  <li>Push to GitHub and trigger hosting deployment.</li>
</ol>
```

### Attributes for Ordered Lists
- `start="5"`: Starts numbering at 5 instead of 1.
- `reversed`: Counts backwards (e.g. Top 10 countdown).
- `type="A"`: Uses letters (A, B, C) or Roman numerals (`type="I"`).

```html
<ol start="3" type="1">
  <li>Third step</li>
  <li>Fourth step</li>
</ol>
```

---

## 3. Description Lists (`<dl>`, `<dt>`, `<dd>`)

A description list groups terms (`<dt>`) with their corresponding descriptions (`<dd>`):

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language — structures web content.</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — formats and styles visual layout.</dd>
</dl>
```

---

## Nested Lists

Lists can be nested inside an `<li>` element to create hierarchical trees or multi-level navigation menus:

```html
<ul>
  <li>Frontend Technologies
    <ul>
      <li>HTML5</li>
      <li>CSS3</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend Technologies
    <ul>
      <li>Node.js</li>
      <li>Python</li>
    </ul>
  </li>
</ul>
```

> **Crucial Rule**: Nested `<ul>` or `<ol>` lists must always sit **inside** an `<li>` element, never directly as a child of a parent `<ul>`.

---

## Summary & Key Takeaways

- Use `<ul>` for non-sequential items; use `<ol>` for numbered workflows.
- Use `<dl>` for key-value pairs, metadata, or glossaries.
- Only `<li>` elements are permitted as direct children of `<ul>` and `<ol>`.
- Nested lists must always reside inside a parent `<li>`.

---

## Practice Challenge

Create an HTML file with:
1. An ordered list of your top 3 favorite movies.
2. An unordered list of ingredients for a recipe.
3. A description list defining three web terms (DOM, API, CSS).
4. A nested list showing your computer folder structure.
