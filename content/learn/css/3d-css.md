---
title: '3D CSS Transforms & Interactions'
description: 'Explore 3D space: perspective, perspective-origin, transform-style: preserve-3d, translateZ, rotateX/Y/Z, and 3D card flips.'
order: 33
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/advanced-visual-effects
---

## Understanding 3D Space in CSS

In 3D CSS:
- **X axis**: Horizontal (left / right)
- **Y axis**: Vertical (up / down)
- **Z axis**: Depth (toward / away from viewer screen)

---

## The 3D Flip Card Pattern

```html
<div class="card-scene">
  <div class="card-object">
    <div class="card-face card-face--front">Front Content</div>
    <div class="card-face card-face--back">Back Content</div>
  </div>
</div>
```

```css
.card-scene {
  width: 300px;
  height: 400px;
  perspective: 1000px; /* 3D focal depth */
}

.card-object {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-scene:hover .card-object {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden; /* Hides reverse side when flipped */
  border-radius: 1rem;
  padding: 2rem;
}

.card-face--back {
  transform: rotateY(180deg);
  background-color: #0ea5e9;
  color: white;
}
```

---

## Summary & Key Takeaways

- Set `perspective: 1000px` on the parent scene container.
- Use `transform-style: preserve-3d` on the animated container.
- Set `backface-visibility: hidden` to hide the rear of flipped faces.

---

## Practice Challenge

Build a realistic 3D credit card flip interaction displaying card numbers on the front and CVV on the back.
