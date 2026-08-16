---
title: 'CSS Selectors'
description: 'Master universal, element, class, ID, attribute, combinator, descendant, child, sibling selectors, pseudo-classes, and pseudo-elements.'
order: 2
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/css-fundamentals
---

## Basic Selectors

```css
/* Universal selector: matches every single element */
* {
  box-sizing: border-box;
}

/* Element selector: matches by HTML tag name */
p {
  color: #334155;
}

/* Class selector: reusable styling hook */
.card {
  border-radius: 12px;
}

/* ID selector: unique single element hook (high specificity) */
#main-header {
  position: sticky;
}
```

---

## Combinator Selectors

Combinators express spatial and structural relationships between elements:

| Combinator | Name | Matches | Example |
| :--- | :--- | :--- | :--- |
| ` ` (space) | Descendant | Any descendant at any nested depth | `article p` |
| `>` | Direct Child | Only immediate direct children | `ul > li` |
| `+` | Adjacent Sibling | The immediately following sibling element | `h2 + p` |
| `~` | General Sibling | Any sibling following after the element | `h2 ~ p` |

```css
/* Only style <p> tags that directly follow an <h2> */
h2 + p {
  font-size: 1.25rem;
  font-weight: 500;
}
```

---

## Attribute Selectors

Target elements based on HTML attributes and attribute values:

```css
/* Matches inputs with type="email" */
input[type="email"] {
  border-color: #0ea5e9;
}

/* Matches links starting with https:// */
a[href^="https://"] {
  color: #10b981;
}

/* Matches image files ending in .png */
img[src$=".png"] {
  border-radius: 8px;
}
```

---

## Grouping Selectors

Combine multiple selectors with a comma to share identical styles without duplicating code:

```css
h1, h2, h3, h4 {
  font-family: 'Space Grotesk', sans-serif;
  color: #0f172a;
}
```

---

## Summary & Key Takeaways

- Prefer class selectors (`.btn`) for scalable, reusable component styling.
- Use direct child (`>`) when styling strictly immediate children.
- Use adjacent sibling (`+`) for contextual spacing (like lead paragraphs after headings).
- Group selectors with commas to eliminate duplicated CSS declarations.

---

## Practice Challenge

Write CSS selectors for:
1. All `<input>` elements with `type="password"`.
2. Direct child `<li>` elements inside a `<nav>`.
3. The first paragraph immediately following an `<h1>`.
