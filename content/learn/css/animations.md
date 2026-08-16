---
title: 'CSS Keyframe Animations'
description: 'Master @keyframes rules, animation-name, duration, iteration-count, direction, fill-mode, timing functions, and combining animations.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/transforms
---

## Defining Keyframes with `@keyframes`

While transitions require user interaction (like hover), keyframe animations can run automatically on page load, loop infinitely, or follow complex multi-step sequences.

```css
/* Define keyframe timeline */
@keyframes pulseGlow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 12px rgba(14, 165, 233, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
  }
}

/* Apply animation */
.live-badge {
  animation: pulseGlow 2s infinite ease-in-out;
}
```

---

## Animation Properties Reference

| Property | Purpose | Values |
| :--- | :--- | :--- |
| `animation-name` | References the `@keyframes` identifier | `pulseGlow` |
| `animation-duration` | Time to complete one cycle | `2s`, `500ms` |
| `animation-iteration-count` | Number of times to loop | `1`, `3`, `infinite` |
| `animation-direction` | Direction of replay | `normal`, `reverse`, `alternate` |
| `animation-fill-mode` | State before/after animation | `none`, `forwards`, `backwards`, `both` |
| `animation-play-state` | Pause or resume playback | `running`, `paused` |

---

## Summary & Key Takeaways

- Use `animation-fill-mode: forwards` so the element retains its final keyframe styles.
- Use `animation-direction: alternate` for smooth back-and-forth oscillating loops.
- Pause animations on user hover with `animation-play-state: paused`.

---

## Practice Challenge

Build a continuous loading spinner using `@keyframes spin { 100% { transform: rotate(360deg); } }`.
