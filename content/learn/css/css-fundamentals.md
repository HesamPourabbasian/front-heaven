---
title: 'CSS Fundamentals'
description: 'Learn what CSS is, how browsers compute styles, CSS syntax rules, selectors, properties, values, comments, cascading, inheritance, and specificity.'
order: 1
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-and-css
---

## What is CSS?

**CSS** stands for **Cascading Style Sheets**. It is the stylesheet language used to describe the presentation, visual aesthetics, and formatting of an HTML document across desktop screens, tablets, smartphones, and print.

---

## How CSS Works in the Browser

When a browser loads a web page:
1. **DOM Construction**: The browser parses HTML into the Document Object Model (DOM).
2. **CSSOM Construction**: The browser parses CSS rules into the CSS Object Model (CSSOM).
3. **Render Tree**: The DOM and CSSOM combine into the Render Tree, computing computed styles for each element.
4. **Layout (Reflow)**: The browser calculates exact pixel coordinates and dimensions for every box.
5. **Paint & Composite**: Pixels are drawn to the screen layer-by-layer.

---

## CSS Syntax Anatomy

A CSS rule consists of a **selector** and a **declaration block**:

```css
/* Selector targeting all <h1> elements */
h1 {
  color: #0ea5e9;        /* Property: Value */
  font-size: 2.5rem;     /* Property: Value */
  line-height: 1.2;      /* Property: Value */
}
```

---

## The Three Ways to Include CSS

1. **External Stylesheet (Recommended)**: Linked in HTML `<head>` via `<link rel="stylesheet" href="styles.css">`. Cached across pages for maximum performance.
2. **Internal Stylesheet**: Written inside an HTML `<style>` tag in the `<head>`. Useful for single-page email templates or critical above-the-fold CSS.
3. **Inline Styles (Avoid)**: Declared directly on elements using the `style="..."` attribute. Impossible to reuse, cannot use pseudo-classes or media queries, and pollutes HTML structure.

---

## The Core Pillars of CSS

### 1. The Cascade
When multiple conflicting rules match the same element, the cascade resolves the conflict based on:
1. **Origin & Importance** (`!important`, user styles, developer styles)
2. **Cascade Layers** (`@layer`)
3. **Specificity** (IDs > Classes > Elements)
4. **Source Order** (The last declared rule wins)

### 2. Inheritance
Certain CSS properties (primarily typography properties like `color`, `font-family`, `line-height`, `text-align`) automatically pass down from parent elements to their children. Layout properties (like `margin`, `padding`, `border`, `background`) do **not** inherit by default.

### 3. Specificity
A scoring system browsers use to determine which rule takes precedence:
- **Inline styles**: 1,0,0,0
- **ID selectors** (`#nav`): 0,1,0,0
- **Class / Attribute / Pseudo-class selectors** (`.btn`, `[type="text"]`, `:hover`): 0,0,1,0
- **Element / Pseudo-element selectors** (`p`, `h1`, `::before`): 0,0,0,1

---

## Summary & Key Takeaways

- CSS controls layout, typography, colors, and responsive visual design.
- Always use external stylesheets linked in the HTML `<head>`.
- The cascade resolves conflicting rules using specificity, origin, and source order.
- Typography properties inherit automatically from ancestors down to children.

---

## Practice Challenge

Create an external CSS stylesheet:
1. Target the `<body>` with global font families and base colors.
2. Style an `<h1>` with custom font size and color.
3. Observe how font color inherits from `<body>` to a child `<p>`.
