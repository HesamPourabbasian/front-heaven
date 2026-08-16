---
title: 'Basic CSS Functions'
description: 'Learn dynamic math functions in CSS: calc(), min(), max(), clamp(), and url() for fluid responsive calculations.'
order: 10
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/borders-and-shadows
---

## Dynamic Math in CSS

CSS functions perform runtime calculations directly in stylesheets without requiring JavaScript.

---

## 1. `calc()`
Performs basic arithmetic (`+`, `-`, `*`, `/`) mixing different units:

```css
/* Full width minus 40px sidebar */
.content {
  width: calc(100% - 40px);
}

/* Centering with absolute coordinates */
.modal {
  left: calc(50% - 200px);
}
```

> **Crucial Rule**: Always include spaces around `+` and `-` operators inside `calc()` (`calc(100% - 20px)`, not `calc(100%-20px)`).

---

## 2. `min()` and `max()`
- `min(val1, val2)`: Chooses the **smallest** computed value (sets an upper ceiling).
- `max(val1, val2)`: Chooses the **largest** computed value (sets a minimum floor).

```css
/* Container is 800px wide, but shrinks on small mobile screens */
.container {
  width: min(100% - 2rem, 800px);
}

/* Font never drops below 16px */
p {
  font-size: max(1rem, 2vw);
}
```

---

## 3. `clamp()` — The Holy Grail of Fluid Sizing
Combines minimum, preferred, and maximum values:

```text
clamp(MIN, PREFERRED, MAX)
```

```css
/* Fluid heading: scales smoothly between 1.75rem and 3.5rem based on viewport */
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
}
```

---

## Summary & Key Takeaways

- Use `calc()` to combine percentages with fixed pixel offsets.
- Use `clamp()` for fluid responsive headings without writing dozens of media queries.
- Use `min(100% - 2rem, 1200px)` to build self-centering responsive containers.

---

## Practice Challenge

Implement fluid responsive typography using `clamp()` on an `<h1>` that scales smoothly from mobile to 4K desktop screens.
