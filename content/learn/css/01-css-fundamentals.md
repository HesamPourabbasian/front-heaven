---
title: 'CSS Fundamentals, Syntax & The Cascade Engine'
description: 'Master core CSS foundations: Syntax rules, selectors, properties, values, comments, inline vs internal vs external stylesheets, the Cascade algorithm, Specificity calculations, Inheritance, and !important.'
order: 1
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/html/01-html-fundamentals
---

# CSS Fundamentals, Syntax & The Cascade Engine

Cascading Style Sheets (**CSS**) is the presentation language of the open web. While HTML establishes semantic document structure and JavaScript drives dynamic application logic, CSS controls layout geometry, responsive viewport adaptation, typography scales, color harmony, and visual animations.

In this lesson, we explore the core foundations of CSS: rule syntax anatomy, selector mechanics, the three ways to attach CSS to HTML documents, the browser **Cascade Algorithm**, **Specificity Calculations**, CSS **Inheritance**, and the strategic use of `!important`.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Anatomy of a CSS Rule Set           │
├────────────────────────────────────────────────────────────┤
│   Selector         Declaration Block                       │
│   ┌──────┐         ┌─────────────────────────────────────┐ │
│   .btn-primary     { background-color: #2563eb; color: #fff; }│
│                    └─────────┬───────────────┘             │
│                              │                             │
│                  Property ───┴─── Value                    │
└────────────────────────────────────────────────────────────┘
```

## 1. What is CSS and How Does it Work?

CSS is a declarative rule-based language. Developers specify **rules** targeting elements in the Document Object Model (DOM), instructing the browser engine how to compute visual styles during the styling and layout phases of the rendering pipeline.

The browser executes CSS through a multi-pass process:
1. Parses stylesheets and resolves imported URLs.
2. Identifies all matching CSS selectors for each DOM element.
3. Applies the **Cascade Algorithm** to resolve conflicting rules based on origin, layers, and specificity.
4. Computes inherited property values from parent elements.
5. Produces the final computed styles used for Layout and Paint.

## 2. CSS Syntax Anatomy: Selectors, Properties & Values

A CSS stylesheet consists of one or more **Rule Sets**:
- **Selector**: Targets the HTML element(s) to style (e.g., `h1`, `.card`, `#hero`).
- **Declaration Block**: Enclosed in curly braces `{ ... }`, containing one or more semicolon-separated declarations.
- **Property**: The stylistic feature being adjusted (e.g., `font-size`, `margin`, `display`).
- **Value**: The specific setting assigned to the property (e.g., `1.5rem`, `20px`, `flex`).
- **Comments**: Written using `/* comment text */` to document code logic without affecting rendering.

```css
/* Styling button components with modern CSS */
.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}
```

## 3. The 3 Methods of Applying CSS to HTML

CSS can be attached to HTML documents through three distinct methods:

### 1. External Stylesheet (Recommended Standard)
Linked in the HTML `<head>` via `<link rel="stylesheet">`. Enables browser caching, separation of concerns, and site-wide reusability:
```html
<link rel="stylesheet" href="/css/main.css" />
```

### 2. Internal `<style>` Block
Placed inside the `<head>` of an individual HTML document. Useful for single-page applications or inlining critical above-the-fold path CSS for high performance:
```html
<style>
  body { background-color: #0f172a; color: #f8fafc; }
</style>
```

### 3. Inline `style` Attribute (Anti-Pattern for general styling)
Applied directly to an HTML tag via `style="..."`. Hard to maintain, prevents caching, and bloats HTML payload:
```html
<p style="color: #ef4444; font-weight: bold;">Error message</p>
```

## 4. The Cascade Algorithm & Specificity

When multiple CSS rules target the exact same element and declare the same property, the browser resolves the conflict using the **Cascade Algorithm**:

```text
┌────────────────────────────────────────────────────────────┐
│              The CSS Specificity Hierarchy Score           │
├──────────────────┬─────────────────────────────┬───────────┤
│ Selector Type    │ Example                     │ Weight    │
├──────────────────┼─────────────────────────────┼───────────┤
│ Inline Styles    │ `style="color: red"`        │ (1,0,0,0) │
│ ID Selectors     │ `#header-nav`               │ (0,1,0,0) │
│ Classes / Pseudo │ `.btn`, `[type="text"]`, `:hover`│ (0,0,1,0) │
│ Elements / Pseudo│ `p`, `h1`, `::before`       │ (0,0,0,1) │
│ Universal / *    │ `*`                         │ (0,0,0,0) │
└──────────────────┴─────────────────────────────┴───────────┘
```

When specificities are equal, **Source Order** wins: the rule written later in the stylesheet takes precedence.

## 5. CSS Inheritance & `!important`

- **Inherited Properties**: Typographic properties (`color`, `font-family`, `line-height`, `letter-spacing`) naturally inherit from ancestor containers down to child elements. Box-model properties (`margin`, `padding`, `border`, `width`) do **not** inherit by default.
- **`!important`**: An override flag (`color: red !important;`) that bypasses normal specificity. Overusing `!important` creates fragile codebases that are impossible to refactor.

```css
/* Forcing inheritance on non-inherited properties */
.child-box {
  border: inherit; /* Copies parent border style */
}
```

## Summary

- CSS is a declarative language defining visual presentation, typography, and responsive layouts.
- External stylesheets (`<link rel="stylesheet">`) provide optimal caching and maintainability.
- The Cascade Algorithm resolves property collisions using Origin, Specificity, and Source Order.
- Specificity is calculated across 4 columns: (Inline, IDs, Classes/Attributes, Elements).
- Typographic properties inherit by default; box-model dimensions do not.
- Avoid `!important` for normal styling; reserve it exclusively for utility overrides.

## Best Practices

1. **Always Use External Stylesheets**: Enable browser caching and maintain modular code.
2. **Favor Flat Class-Based Specificity**: Style using single classes (`.card-title`) rather than deeply nested chains (`div.sidebar ul li a`).
3. **Never Style with ID Selectors (`#id`)**: High specificity makes IDs impossible to override in component design systems.
4. **Rely on Natural Inheritance**: Set `font-family` and base `color` once on `body` or `:root`.
