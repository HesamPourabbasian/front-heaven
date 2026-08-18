---
title: 'Lists, Hierarchy & Description Data Structures'
description: 'Master HTML lists: Unordered lists (<ul>), ordered lists (<ol>), list items (<li>), description lists (<dl>, <dt>, <dd>), nested multi-level lists, and navigation menus.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/html/04-images
---

# Lists, Hierarchy & Description Data Structures

Lists are among the most versatile structural elements in HTML. They organize related items, represent step-by-step procedural instructions, power navigation menus, and define key-value metadata glossaries.

In this lesson, we explore the three major types of HTML lists: **Unordered Lists (`<ul>`)**, **Ordered Lists (`<ol>`)**, and **Description Lists (`<dl>`)**, along with nesting techniques and accessible navigation markup.

```text
┌────────────────────────────────────────────────────────────┐
│                    The 3 Types of HTML Lists               │
├──────────────┬───────────────────────────────┬─────────────┤
│ List Type    │ Tags                          │ Use Case    │
├──────────────┼───────────────────────────────┼─────────────┤
│ Unordered    │ `<ul>` + `<li>`               │ Bullet items│
│ Ordered      │ `<ol>` + `<li>`               │ Sequential  │
│ Description  │ `<dl>` + `<dt>` + `<dd>`      │ Key-Value   │
└──────────────┴───────────────────────────────┴─────────────┘
```

## 1. Unordered Lists (`<ul>`)

An **Unordered List** is used when the sequence of items does not alter the fundamental meaning or logic of the collection:

```html
<h3>Required Software Tools:</h3>
<ul>
  <li>Visual Studio Code</li>
  <li>Node.js (v22+)</li>
  <li>Git Version Control</li>
  <li>Google Chrome or Firefox Developer Edition</li>
</ul>
```

Screen readers announce unordered lists by stating the total item count (e.g., *"List, 4 items"*), allowing visually impaired users to understand the breadth of information before navigating through each `<li>`.

## 2. Ordered Lists (`<ol>`)

An **Ordered List** represents a numbered sequence where order matters (such as recipes, step-by-step installation guides, or ranked leaderboard rankings):

```html
<h3>Git Release Workflow:</h3>
<ol start="1" type="1">
  <li>Review pending pull requests in staging.</li>
  <li>Run the automated test suite and lint checks.</li>
  <li>Create a new release tag following Semantic Versioning.</li>
  <li>Deploy the production build to the edge CDN.</li>
</ol>
```

### Useful `<ol>` Attributes:
- **`start`**: Specifies the starting numerical index (e.g., `start="5"`).
- **`reversed`**: Reverses the numerical numbering (e.g., for countdowns or top 10 rankings).
- **`type`**: Changes the marker style (`1`, `a`, `A`, `i`, `I`), though styling is usually handled via CSS `list-style-type`.

## 3. Description Lists (`<dl>`, `<dt>`, `<dd>`)

A **Description List** groups terms (**`<dt>` - Description Term**) with their corresponding definitions or data values (**`<dd>` - Description Details**). It is the ideal semantic structure for glossaries, metadata sidebars, and key-value configuration tables:

```html
<dl class="meta-grid">
  <dt>Author</dt>
  <dd>Hesam Pourabbasian</dd>

  <dt>License</dt>
  <dd>MIT Open Source</dd>

  <dt>Release Version</dt>
  <dd>v2.4.0</dd>

  <dt>Supported Frameworks</dt>
  <dd>Vue.js</dd>
  <dd>React</dd>
  <dd>Svelte</dd>
</dl>
```

Notice that a single `<dt>` can be paired with multiple `<dd>` values (e.g., one topic with multiple frameworks).

## 4. Multi-Level Nested Lists

Lists can be nested to represent sub-categories, multi-level outlines, and folder directory trees. The nested `<ul>` or `<ol>` must be placed **inside the parent `<li>` element**, never directly between sibling `<li>` tags:

```html
<!-- ✅ Good: Nested list properly placed inside parent <li> -->
<ul>
  <li>
    Front-End Fundamentals
    <ul>
      <li>HTML5 Semantics</li>
      <li>CSS3 Flexbox & Grid</li>
      <li>JavaScript ES6+</li>
    </ul>
  </li>
  <li>
    Modern Frameworks
    <ul>
      <li>Vue 3 Composition API</li>
      <li>React 19 Server Components</li>
    </ul>
  </li>
</ul>
```

## Summary

- `<ul>` represents bulleted collections where sequence does not impact meaning.
- `<ol>` represents sequential or ranked procedural steps.
- `<dl>`, `<dt>`, and `<dd>` structure semantic key-value pairs and metadata glossaries.
- Nested lists must always be placed directly inside a parent `<li>` element.
- Assistive technologies announce list lengths and item numbers to aid navigation.

## Best Practices

1. **Only Place `<li>` Directly Inside `<ul>` or `<ol>`**: Never put `<div>` or `<p>` tags directly as children of `<ul>`.
2. **Use Description Lists for Metadata**: Structure product specs and author metadata with `<dl>` rather than arbitrary `<div>` containers.
3. **Always Nest Lists Inside `<li>`**: Prevent broken DOM hierarchies in multi-level menus.
4. **Use `<ul>` for Website Navigation Menus**: Wrap navigation links in `<nav><ul><li><a>...` for accessible navigation landmarking.
