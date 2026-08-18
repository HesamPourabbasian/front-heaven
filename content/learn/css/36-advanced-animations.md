---
title: 'Advanced Animations, Scroll-Driven Timelines & View Transitions'
description: 'Master enterprise CSS animation engineering: Native Scroll-Driven Animations (animation-timeline, view-timeline), the View Transitions API, Web Animations API (WAAPI), and 120 FPS compositor pipelines.'
order: 36
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 35
prerequisites:
  - /learn/css/35-advanced-responsive-design
---

# Advanced Animations, Scroll-Driven Timelines & View Transitions

Modern web applications are expected to deliver native app-quality motion: reading progress indicators linked to page scroll, parallax elements triggered as they enter the viewport, seamless shared-element page transitions, and programmatic control via the **Web Animations API (WAAPI)**. In modern CSS, **Scroll-Driven Animations** and the **View Transitions API** eliminate thousands of lines of heavy scroll listener JavaScript.

In this lesson, we explore **Scroll-Driven Animations (`scroll()`, `view()`)**, declarative view timelines with **`view-timeline`**, the **View Transitions API**, and coordinating animations with **WAAPI**.

```text
┌────────────────────────────────────────────────────────────┐
│                    Native Scroll-Driven Animation Flow     │
├────────────────────────────────────────────────────────────┤
│ User Scrolls Page (Scroll Container)                       │
│       │                                                    │
│       ▼                                                    │
│ [ Compositor Scroll Timeline Engine (Zero Main Thread JS!) ]
│       │                                                    │
│       ▼                                                    │
│ Interpolates @keyframes based on Scroll Percentage (0%-100%│
│ Example: Top Reading Progress Bar expands from 0% to 100%  │
└────────────────────────────────────────────────────────────┘
```

## 1. Pure CSS Scroll-Driven Animations: `animation-timeline: scroll()`

Animate elements based on the scroll progress of the page or scroll container with zero JavaScript scroll event listeners:

```css
/* 1. Global Reading Progress Bar */
@keyframes expandProgressBar {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #3b82f6;
  transform-origin: left;
  z-index: 1000;

  /* Links animation directly to the root page scroll progress! */
  animation: expandProgressBar linear;
  animation-timeline: scroll(root block);
}
```

Because this runs entirely on the GPU Compositor thread, it never stutters or lags even if the main thread is busy executing JavaScript!

## 2. Element View Timelines: `view-timeline` (Reveal on Scroll)

Animate elements as they enter and exit the visible viewport window:

```css
@keyframes revealCard {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.reveal-on-scroll {
  /* Links animation progress to this specific element crossing the viewport */
  animation: revealCard linear both;
  animation-timeline: view();
  /* Animates from the moment it enters viewport until it reaches 35% height */
  animation-range: entry 0% cover 35%;
}
```

## 3. Seamless Multi-Page Morphing with the View Transitions API

The **View Transitions API** enables seamless shared-element animations during navigation (e.g., clicking a thumbnail image on a catalog page smoothly morphs and expands into the full-size hero image on the product detail page):

```typescript
// Client Navigation Handler
function navigateToProduct(productUrl: string) {
  // If browser supports View Transitions:
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      // Update the DOM or navigate to new route!
      await renderProductDetailView(productUrl);
    });
  } else {
    renderProductDetailView(productUrl);
  }
}
```

```css
/* Assign matching view-transition-name to thumbnail and detail hero */
.product-thumbnail-img {
  view-transition-name: product-hero-image;
}

/* Customize transition cross-fade curve */
::view-transition-old(product-hero-image),
::view-transition-new(product-hero-image) {
  animation-duration: 0.35s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

The browser engine automatically screenshots the old state, computes the geometry difference to the new state, and animates the transform smoothly!

## 4. Programmatic Control with Web Animations API (WAAPI)

When animations require dynamic physics or cancellation in JavaScript, use the native **Web Animations API**:

```typescript
const element = document.querySelector(".interactive-box")!;

const animation = element.animate(
  [
    { transform: "translateY(0) scale(1)", opacity: 1 },
    { transform: "translateY(-20px) scale(1.05)", opacity: 0.8 },
  ],
  {
    duration: 300,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    fill: "forwards",
  }
);

// Programmatic playback control
animation.pause();
animation.playbackRate = 1.5;
```

## Summary

- `animation-timeline: scroll()` drives animations based on scroll position on the GPU.
- `view-timeline` triggers entry and exit animations as elements cross the viewport.
- The View Transitions API enables native-app quality shared element morphing across page navigations.
- WAAPI (`element.animate()`) combines CSS animation performance with JavaScript programmatic control.
- All scroll-driven animations run off the main thread with zero frame stutter.

## Best Practices

1. **Use CSS Scroll Timelines Over JS `window.addEventListener('scroll')`**: Eliminate main-thread scroll jank.
2. **Assign Unique `view-transition-name` Properties to Shared Elements**: Create app-like page transitions.
3. **Always Check Feature Support with `@supports(animation-timeline: scroll())`**: Provide graceful fallback.
4. **Disable Motion in `prefers-reduced-motion` Media Queries**: Respect accessibility preferences.
