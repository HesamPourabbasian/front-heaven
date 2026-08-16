---
title: 'Borders & Shadows'
description: 'Master border-radius, outline, ring effects, box-shadow, layered drop shadows, and text-shadow for modern elevation systems.'
order: 9
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/basic-positioning
---

## Border Styling & Rounded Corners

```css
.button {
  /* Border shorthand: width style color */
  border: 1px solid #e2e8f0;
  
  /* Rounded corners */
  border-radius: 0.5rem; /* 8px */
}

/* Pill / Fully rounded badge */
.pill {
  border-radius: 9999px;
}

/* Circle avatar */
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
```

---

## Box Shadows (`box-shadow`)

The `box-shadow` property adds depth and elevation:

```text
box-shadow: [offset-x] [offset-y] [blur-radius] [spread-radius] [color];
```

```css
/* Subtle modern elevation shadow */
.card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

/* Hover elevation lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
}
```

---

## Text Shadows (`text-shadow`)

```css
h1 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

---

## Summary & Key Takeaways

- Use layered multi-part box shadows for realistic, soft elevations.
- Use `border-radius: 9999px` for capsule buttons and pills.
- Add subtle hover lift animations with `transform: translateY(-2px)`.

---

## Practice Challenge

Build an interactive pricing tier card featuring a multi-layer soft drop shadow and an elevated hover state.
