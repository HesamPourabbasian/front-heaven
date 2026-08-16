---
title: 'CSS Pseudo-Classes'
description: 'Master interactive states (:hover, :focus-visible, :active), structural pseudo-classes (:nth-child, :first-child), and logical selectors (:is, :where, :has).'
order: 16
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/advanced-responsive-design
---

## What is a Pseudo-Class?

A **pseudo-class** is a keyword added to a selector that specifies a special state of the targeted element (prefixed with a single colon `:`).

---

## Interactive & Focus States

```css
/* Mouse hover state */
.btn:hover {
  background-color: #0284c7;
}

/* Active click state */
.btn:active {
  transform: scale(0.98);
}

/* Keyboard focus (Accessible focus ring for keyboard tab navigation) */
.btn:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Focus within parent container */
.search-form:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}
```

---

## Structural Pseudo-Classes

- `:first-child`, `:last-child`: First or last sibling.
- `:nth-child(even)` / `:nth-child(odd)`: Striped table rows.
- `:nth-child(3n + 1)`: Formula-based intervals.
- `:not(.disabled)`: Negation selector.

```css
/* Zebra striping table rows */
tbody tr:nth-child(even) {
  background-color: #f8fafc;
}
```

---

## The Modern Super-Selectors: `:is()`, `:where()`, and `:has()`

### 1. `:is()` and `:where()`
Combine repetitive selectors. `:where()` has **zero specificity**, making it ideal for base styles:

```css
/* Targets all headings inside article, section, and aside */
:is(article, section, aside) :is(h1, h2, h3) {
  color: #0f172a;
}
```

### 2. `:has()` — The CSS Parent Selector
Selects a parent element based on its children or descendants:

```css
/* Style a card differently if it contains an image */
.card:has(img) {
  grid-template-columns: 120px 1fr;
}

/* Style form label if its associated input is invalid */
.form-group:has(:invalid) label {
  color: #ef4444;
}
```

---

## Summary & Key Takeaways

- Use `:focus-visible` instead of `:focus` to provide accessible keyboard rings without mouse focus rings.
- Use `:has()` to style parent elements based on child state.
- Use `:where()` to write zero-specificity utility defaults.

---

## Practice Challenge

Build a form input group that changes its container border to red when the input inside is `:invalid` using `:has(:invalid)`.
