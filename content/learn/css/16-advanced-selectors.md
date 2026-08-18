---
title: 'Advanced Selectors, :has() & Functional Pseudo-Classes'
description: 'Master advanced CSS selectors: :has() the parent selector, :is() vs :where(), :not(), structural :nth-child(An+B) formulas, :focus-within, and state-driven styling.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/15-beginner-projects
---

# Advanced Selectors, :has() & Functional Pseudo-Classes

CSS selectors have evolved dramatically from simple class matchers into a powerful, functional querying language. With modern functional pseudo-classes like **`:has()`** (the long-awaited "parent selector"), **`:is()`**, **`:where()`**, and **`:focus-within`**, developers can express complex interactive state logic directly in CSS without relying on JavaScript state toggling.

In this lesson, we explore the revolutionary **`:has()`** relational selector, forgiveness grouping with **`:is()`** and **`:where()`**, negation with **`:not()`**, advanced **`:nth-child(An+B)`** formulas, and composite focus tracking.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Functional Selectors Matrix         │
├──────────────┬───────────────────────────────┬─────────────┤
│ Selector     │ Core Purpose                  │ Specificity │
├──────────────┼───────────────────────────────┼─────────────┤
│ `:has()`     │ Relational / Parent selector  │ Most specific
│ `:is()`      │ Compact OR-grouping           │ Most specific
│ `:where()`   │ Zero-specificity reset styling│ ZERO (0,0,0)│
│ `:not()`     │ Negation filter               │ Argument sp.│
│ `:focus-with`│ Focuses parent when child foc.│ Single class│
└──────────────┴───────────────────────────────┴─────────────┘
```

## 1. The Game-Changer: The `:has()` Parent & Relational Selector

For decades, CSS could only select children, never parents. The **`:has()`** pseudo-class allows an element to style itself based on its descendants or subsequent siblings:

```css
/* 1. Style a card parent ONLY if it contains an image */
.card:has(img) {
  grid-template-columns: 200px 1fr;
}

/* 2. Style a form field container when its inner input is invalid */
.form-group:has(input:user-invalid) {
  border-color: #ef4444;
  background-color: #fef2f2;
}

/* 3. Darken the body background when any modal is open! */
body:has(dialog[open]) {
  overflow: hidden; /* Prevents background scrolling! */
}

/* 4. Sibling proximity styling: Style previous heading if paragraph is empty */
h2:has(+ p:empty) {
  margin-bottom: 2rem;
}
```

## 2. Compact Grouping: `:is()` vs `:where()`

Both `:is()` and `:where()` take a list of selectors and apply rules if any item matches. However, their **specificity behavior** differs critically:

- **`:is()`**: Adopts the specificity of its **most specific argument** in the list.
- **`:where()`**: Always has **zero specificity `(0,0,0)`**, making it the ultimate tool for design system base resets that consumers can override with a single class:

```css
/* :where() Reset: Zero specificity! Easily overridden anywhere. */
:where(h1, h2, h3, h4, h5, h6) {
  margin-block: 0;
  font-family: inherit;
  font-weight: 700;
}

/* Single class easily overrides :where() reset */
.special-title {
  margin-block: 2rem; /* Wins effortlessly! */
}
```

## 3. Structural Formulas: `:nth-child(An + B of selector)`

The `:nth-child()` formula selects elements based on cyclical arithmetic patterns ($An + B$):

```css
/* 1. Zebra striping on table rows */
tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

/* 2. Select every 3rd card starting from card 1 (1, 4, 7, 10...) */
.card:nth-child(3n + 1) {
  border-left: 4px solid #3b82f6;
}

/* 3. Modern: :nth-child of selector (filters before counting!) */
li:nth-child(2 of .featured) {
  /* Targets the 2nd element that has class .featured */
  background-color: #fef08a;
}
```

## 4. State & Proximity: `:focus-within` & `:empty`

- **`:focus-within`**: Matches an element if the element itself **or any of its descendants** currently has keyboard or mouse focus:
  ```css
  /* Highlight entire search bar container when input is focused */
  .search-box:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
  ```
- **`:empty`**: Matches elements that have zero child nodes or text (useful for hiding empty notification containers).

## Summary

- `:has()` enables parent and sibling relational styling without JavaScript DOM listeners.
- `:where()` applies styles with zero specificity `(0,0,0)`, ideal for design system resets.
- `:is()` groups complex selector chains while preserving maximum argument specificity.
- `:nth-child(An+B of .class)` filters matching elements before computing numerical indices.
- `:focus-within` tracks descendant focus on parent wrapper cards and navigation menus.

## Best Practices

1. **Use `:where()` for Base CSS Resets**: Allow team members to override default styles without specificity conflicts.
2. **Use `:has()` for Interactive Form Field Wrappers**: Style outer containers based on inner input validation states.
3. **Use `:focus-within` for Accessible Dropdowns**: Keep submenus open while keyboard focus traverses child links.
4. **Avoid Overly Broad `:has()` Queries on `*`**: Keep `:has()` targets scoped to specific component classes to maintain fast rendering performance.
