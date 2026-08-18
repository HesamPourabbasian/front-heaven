---
title: 'CSS Selectors, Combinators & Pseudo-Elements'
description: 'Master CSS selectors: Universal, element, class, ID, attribute selectors, combinators (descendant, child, adjacent sibling, general sibling), pseudo-classes, and pseudo-elements.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/css/01-css-fundamentals
---

# CSS Selectors, Combinators & Pseudo-Elements

Selectors are the foundational queries of CSS, determining precisely which elements in the Document Object Model receive visual declarations. Mastering selectors allows you to write lean, declarative stylesheets without cluttering your HTML markup with redundant helper classes.

In this lesson, we explore basic selectors, attribute matching patterns, relational **Combinators**, interactive **Pseudo-Classes**, and structural **Pseudo-Elements** (`::before` and `::after`).

```text
┌────────────────────────────────────────────────────────────┐
│                    CSS Combinators Reference               │
├──────────────┬───────────────────────────────┬─────────────┤
│ Combinator   │ Syntax Example                │ Matches     │
├──────────────┼───────────────────────────────┼─────────────┤
│ Descendant   │ `article p`                   │ Any child   │
│ Child        │ `ul > li`                     │ Direct child│
│ Adjacent Sib │ `h2 + p`                      │ Next imm. sib
│ General Sib  │ `h2 ~ p`                      │ Any foll. sib
└──────────────┴───────────────────────────────┴─────────────┘
```

## 1. Basic Selectors & The Universal Selector

- **Universal Selector (`*`)**: Matches every single element in the DOM. Most commonly used in modern box-sizing resets:
  ```css
  *, *::before, *::after {
    box-sizing: border-box;
  }
  ```
- **Element / Type Selector (`p`, `h1`, `button`)**: Targets elements by their raw HTML tag name.
- **Class Selector (`.card`, `.btn`)**: Targets elements bearing a matching `class` attribute. Classes are reusable across any number of elements.
- **ID Selector (`#header`)**: Targets an element with a unique `id`. Has high specificity; avoid for general styling.
- **Grouping Selector (`,`)**: Applies identical rules to multiple selectors without code repetition:
  ```css
  h1, h2, h3, h4 {
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.02em;
  }
  ```

## 2. Attribute Selectors

Attribute selectors match elements based on the presence or specific value of their HTML attributes:

```css
/* 1. Has specific attribute */
input[required] {
  border-left: 3px solid #ef4444;
}

/* 2. Exact match */
input[type="email"] {
  background-image: url('/icons/mail.svg');
}

/* 3. Starts with (^) */
a[href^="https://"] {
  color: #2563eb;
}

/* 4. Ends with ($) */
a[href$=".pdf"]::after {
  content: " 📄";
}

/* 5. Contains substring (*) */
div[class*="icon-"] {
  display: inline-block;
}
```

## 3. Relational Combinators

Combinators express relational conditions between two or more selectors:

- **Descendant Combinator (`A B` - space)**: Matches any element `B` that is a descendant of `A` at any nesting depth.
- **Child Combinator (`A > B`)**: Matches element `B` only if it is a **direct immediate child** of `A`:
  ```css
  /* Only styles direct children li, not nested submenu lis! */
  nav > ul > li {
    display: inline-block;
  }
  ```
- **Adjacent Sibling Combinator (`A + B`)**: Matches element `B` only if it immediately follows `A` sharing the same parent:
  ```css
  /* Adds top margin to paragraphs that immediately follow a heading */
  h2 + p {
    margin-top: 0.5rem;
  }
  ```
- **General Sibling Combinator (`A ~ B`)**: Matches any element `B` that follows `A` as a sibling, even if other elements intervene.

## 4. Foundational Pseudo-Classes & Pseudo-Elements

- **Pseudo-Classes (`:`)**: Target elements based on user interaction or dynamic state:
  - `:hover`: Cursor hovers over the element.
  - `:active`: Element is actively being clicked.
  - `:focus-visible`: Element has keyboard focus.
  - `:disabled`: Form control is currently disabled.
- **Pseudo-Elements (`::`)**: Create virtual elements in the DOM without modifying HTML markup:
  - `::before` & `::after`: Inject decorative shapes or badges before or after element content (must include `content: ""`).
  - `::placeholder`: Styles form input placeholder text.

```css
/* Decorative badge using ::before */
.badge-live::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  margin-right: 6px;
}
```

## Summary

- Universal (`*`), Type, Class (`.`), and ID (`#`) selectors form the core targeting grammar.
- Attribute selectors (`[attr^="val"]`, `[attr$="val"]`) match dynamic HTML properties.
- Relational combinators (`>`, `+`, `~`) target child and sibling structural relationships.
- Pseudo-classes (`:hover`, `:focus-visible`) respond to user input and states.
- Pseudo-elements (`::before`, `::after`) insert decorative sub-nodes without HTML clutter.

## Best Practices

1. **Prefer Child Combinator (`>`) Over Deep Descendant Chains**: Improve CSS selector matching performance and prevent style leaking.
2. **Always Supply `content: ""` on `::before` and `::after`**: Without `content`, pseudo-elements fail to render.
3. **Use Attribute Selectors for Links**: Identify external URLs and file downloads declaratively.
4. **Style `:focus-visible` for Accessible Keyboard Rings**: Never remove focus rings without replacing them.
