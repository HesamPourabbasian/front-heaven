---
title: 'CSS Pseudo-Elements'
description: 'Learn ::before, ::after, ::first-letter, ::first-line, ::selection, ::placeholder, and ::marker for generated content and cosmetic styling.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/pseudo-classes
---

## What is a Pseudo-Element?

A **pseudo-element** is a keyword added to a selector that styles a specific part of an element or generates cosmetic virtual DOM nodes (prefixed with double colons `::`).

---

## Generated Content: `::before` and `::after`

The `::before` and `::after` pseudo-elements create inline cosmetic boxes inside the element:

> **Mandatory Rule**: `::before` and `::after` **require** the `content: ''` property to be defined; otherwise, they will not render at all!

```css
/* Custom quote marks */
blockquote::before {
  content: "“";
  font-size: 3rem;
  color: #0ea5e9;
  line-height: 0;
  vertical-align: -0.4em;
}

/* Decorative animated underline */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #0ea5e9;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

---

## Typography & Selection Pseudo-Elements

```css
/* Drop cap first letter */
article p:first-of-type::first-letter {
  font-size: 3.5rem;
  float: left;
  line-height: 0.8;
  margin-right: 0.5rem;
  color: #0ea5e9;
}

/* Custom text selection highlight */
::selection {
  background-color: #0ea5e9;
  color: #ffffff;
}

/* Custom bullet styling in lists */
li::marker {
  color: #0ea5e9;
  font-size: 1.2em;
}
```

---

## Summary & Key Takeaways

- Pseudo-classes use a single colon (`:hover`); pseudo-elements use double colons (`::before`).
- Always specify `content: ''` when creating `::before` and `::after` decorations.
- Customize user text selection highlighting with `::selection`.

---

## Practice Challenge

Build an interactive button with an animated shimmer or underline effect generated entirely via `::after`.
