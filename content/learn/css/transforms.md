---
title: 'CSS Transforms (2D & 3D)'
description: 'Learn translate, scale, rotate, skew, transform-origin, 2D transforms, and 3D card flips with hardware acceleration.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/transitions
---

## 2D Transform Functions

Transforms modify the coordinate space of an element without disrupting surrounding layout flow:

```css
.element {
  /* Move 20px right and 10px up */
  transform: translate(20px, -10px);

  /* Scale to 110% size */
  transform: scale(1.1);

  /* Rotate 45 degrees clockwise */
  transform: rotate(45deg);

  /* Skew along X axis */
  transform: skewX(10deg);

  /* Combine multiple transforms */
  transform: translateY(-4px) scale(1.02) rotate(1deg);
}
```

---

## Transform Origin (`transform-origin`)

Controls the focal pivot point where rotation or scaling occurs (default is `50% 50%` center):

```css
/* Pin pivot point to top-left corner */
.menu-toggle {
  transform-origin: top left;
  transform: rotate(90deg);
}
```

---

## 3D Transforms & Perspectives

```css
.card-container {
  perspective: 1000px; /* Gives 3D depth perception */
}

.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg); /* 3D flip */
}
```

---

## Summary & Key Takeaways

- Transforms run directly on the GPU without triggering browser reflow.
- Combine functions in order: `transform: translate() scale() rotate()`.
- Use `transform-origin` to change the pivot point of rotations.

---

## Practice Challenge

Create an interactive badge with an icon that rotates 360 degrees when hovered.
