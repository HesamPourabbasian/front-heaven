---
title: 'CSS Transitions, Timing Curves & Smooth Micro-Interactions'
description: 'Master CSS transitions: Transition properties, durations, delays, timing functions (ease, cubic-bezier), shorthand syntax, and 60 FPS GPU-accelerated micro-interactions.'
order: 14
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/css/13-basic-effects
---

# CSS Transitions, Timing Curves & Smooth Micro-Interactions

Micro-interactions provide the subtle tactile feedback that transforms static web pages into alive, responsive applications. When a button smoothly elevates on hover, or a navigation dropdown fades into view, **CSS Transitions** interpolate CSS property values over time at a buttery-smooth 60 or 120 frames per second.

In this lesson, we explore the `transition` suite of properties: `transition-property`, `transition-duration`, `transition-timing-function` (`ease-out`, `cubic-bezier`), `transition-delay`, and the critical performance distinction between GPU-composited vs layout-thrashing properties.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Anatomy of CSS Transition           │
├────────────────────────────────────────────────────────────┤
│ transition: [property] [duration] [timing-func] [delay]    │
│                                                            │
│ Example:                                                   │
│   transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),│
│               opacity 0.2s ease-out;                       │
│                                                            │
│ Rule: NEVER animate `all`! Explicitly list properties!     │
└────────────────────────────────────────────────────────────┘
```

## 1. The 4 Transition Sub-Properties

- **`transition-property`**: The specific CSS property to animate (e.g., `transform`, `opacity`, `background-color`).
- **`transition-duration`**: The length of time the animation takes (e.g., `0.2s` or `150ms`). Micro-interactions feel best between **150ms and 300ms**; anything over 400ms feels sluggish.
- **`transition-delay`**: Waiting time before the transition begins (e.g., `0.05s`).
- **`transition-timing-function`**: Mathematical velocity curve dictating acceleration and deceleration throughout the animation.

## 2. Timing Functions & Custom Cubic Beziers

- **`ease` (Default)**: Slow start, fast middle, slow end.
- **`linear`**: Constant speed. (Only appropriate for spinning loaders or progress meters).
- **`ease-out`**: Starts fast and decelerates gracefully. (The optimal curve for entering elements and UI hover responses).
- **`cubic-bezier(x1, y1, x2, y2)`**: Custom bezier curve. A custom spring or snappy curve makes UI elements feel premium:

```css
:root {
  /* Snappy, modern spring ease-out curve */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-interactive {
  background-color: #2563eb;
  color: white;
  transform: translateY(0);
  transition:
    transform 0.2s var(--ease-spring),
    background-color 0.2s ease-out,
    box-shadow 0.2s ease-out;
}

.btn-interactive:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px); /* Smooth GPU lift */
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

.btn-interactive:active {
  transform: translateY(0); /* Tactile press state */
}
```

## 3. The 60 FPS Performance Golden Rule

Only two CSS properties can be animated completely on the GPU Compositor thread with **zero Layout reflows or Paint draw calls**:
1. **`transform`** (`translate`, `scale`, `rotate`)
2. **`opacity`**

```css
/* ❌ Bad / Layout-Thrashing (Triggers CPU reflow on every frame!) */
.modal-bad {
  top: -500px;
  transition: top 0.3s ease;
}
.modal-bad.open {
  top: 50px;
}

/* ✅ Good / 60 FPS GPU-Accelerated */
.modal-good {
  transform: translateY(-100%);
  opacity: 0;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease;
}
.modal-good.open {
  transform: translateY(0);
  opacity: 1;
}
```

## Summary

- CSS transitions interpolate property changes over a specified duration and timing curve.
- Keep UI micro-interaction durations between 150ms and 300ms for optimal responsiveness.
- Use `ease-out` or custom `cubic-bezier()` curves for snappy, organic UI feel.
- Never use `transition: all`; explicitly declare each transitioning property.
- Animate `transform` and `opacity` to guarantee 60 FPS GPU-composited performance.

## Best Practices

1. **Explicitly Specify `transition-property`**: Prevent unintended layout animations on page resize.
2. **Animate `transform` Instead of `top`, `left`, `width`, or `height`**: Avoid layout thrashing.
3. **Respect `prefers-reduced-motion`**:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       transition-duration: 0.01ms !important;
     }
   }
   ```
4. **Use Sub-300ms Durations for Hover States**: Maintain instantaneous tactile responsiveness.
