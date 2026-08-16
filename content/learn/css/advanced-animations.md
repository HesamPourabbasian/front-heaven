---
title: 'Advanced Animations & Scroll Timelines'
description: 'Learn scroll-driven animations (scroll-timeline, view-timeline), animation-range, complex keyframe orchestration, and motion design.'
order: 31
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/container-queries
---

## Modern Scroll-Driven Animations

Traditionally, scroll-linked animations required heavy JavaScript scroll event listeners. Today, CSS supports native **Scroll-Driven Animations** running directly on the compositor thread at 120 FPS!

---

## 1. Page Reading Progress Bar

```css
@keyframes growProgress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #0ea5e9;
  transform-origin: left;
  
  /* Link animation timeline to page scroll! */
  animation: growProgress auto linear;
  animation-timeline: scroll();
}
```

---

## 2. Scroll Reveal on Enter (`view-timeline`)

Animate elements as they enter the visible viewport:

```css
@keyframes revealCard {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.scroll-reveal-card {
  view-timeline-name: --card-scroll;
  animation: revealCard linear both;
  animation-timeline: --card-scroll;
  animation-range: entry 10% cover 40%;
}
```

---

## Summary & Key Takeaways

- Native scroll animations require 0 lines of JavaScript.
- Use `animation-timeline: scroll()` for progress bars and parallax.
- Use `view-timeline` for scroll-triggered reveal animations.

---

## Practice Challenge

Build a sticky top reading progress bar that animates from 0% to 100% width as the user scrolls down an article.
