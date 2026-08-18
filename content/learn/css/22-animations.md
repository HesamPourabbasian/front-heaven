---
title: 'CSS Keyframe Animations, Timing & Sequenced Motion'
description: 'Master CSS Keyframe Animations: @keyframes rules, animation-fill-mode (forwards), infinite looping, alternate directions, multi-step sequencing, and GPU-optimized motion.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/21-responsive-architecture
---

# CSS Keyframe Animations, Timing & Sequenced Motion

While CSS transitions require an explicit state change (like `:hover` or adding a class via JavaScript) to interpolate between two values, **CSS Keyframe Animations** can run autonomously, loop infinitely, progress through complex multi-step timelines, and persist final states using **`animation-fill-mode`**.

In this lesson, we explore the **`@keyframes`** rule, animation sub-properties, the critical importance of `animation-fill-mode: forwards`, reversing motion with `alternate`, and choreographing staggered entry sequences.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Keyframe Timeline Model             │
├────────────────────────────────────────────────────────────┤
│ @keyframes pulseGlow {                                     │
│   0%   { transform: scale(1);   opacity: 0.8; }            │
│   50%  { transform: scale(1.08);opacity: 1.0; } (Peak)     │
│   100% { transform: scale(1);   opacity: 0.8; }            │
│ }                                                          │
│                                                            │
│ animation: pulseGlow 2s ease-in-out infinite;              │
└────────────────────────────────────────────────────────────┘
```

## 1. Defining Animation Timelines with `@keyframes`

The `@keyframes` rule defines the sequence of visual states across percentage markers from `0%` (or `from`) to `100%` (or `to`):

```css
@keyframes slideFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

## 2. Animation Properties & Shorthand

Apply the keyframe timeline to any element using the `animation` suite:

```css
.notification-card {
  animation-name: slideFadeIn;
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-delay: 0.1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards; /* Persists 100% state after animation finishes! */
}
```

### The `animation` Shorthand:
```css
/* Syntax: [name] [duration] [timing-func] [delay] [iterations] [direction] [fill-mode] */
.badge-pulse {
  animation: pulseGlow 2s ease-in-out infinite alternate;
}
```

## 3. The Power of `animation-fill-mode`

By default (`animation-fill-mode: none`), an element snaps back to its pre-animation initial CSS values the exact microsecond an animation completes.

- **`forwards`**: The element **retains the computed styles of the final keyframe (`100%`)** after the animation stops.
- **`backwards`**: The element applies the styles of the first keyframe (`0%`) immediately during the `animation-delay` period before the animation starts.
- **`both`**: Combines both `forwards` and `backwards` (the gold standard for entry animations).

```css
/* Smooth Entry Dialog (Never snaps back to invisible!) */
.modal-enter {
  animation: slideFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}
```

## 4. Staggering Multi-Element Sequences with CSS Variables

Choreograph staggered list item entries using inline CSS custom properties:

```html
<ul class="animated-list">
  <li style="--i: 0;">Dashboard Overview</li>
  <li style="--i: 1;">Team Members</li>
  <li style="--i: 2;">API Integrations</li>
  <li style="--i: 3;">Billing History</li>
</ul>
```

```css
.animated-list li {
  opacity: 0;
  /* Multiply base delay by index index variable --i! */
  animation: slideFadeIn 0.4s ease-out calc(var(--i) * 75ms) forwards;
}
```

This single CSS rule creates a cascading ripple animation across any number of items with zero JavaScript loops!

## Summary

- `@keyframes` defines multi-step animation timelines across percentage keyframes.
- `animation-fill-mode: both` applies `0%` styles during delay and retains `100%` styles upon completion.
- `animation-direction: alternate` smoothly reverses animations on alternating iterations.
- Animate only GPU-composited properties (`transform` and `opacity`) to prevent jank.
- Staggered animations can be calculated in CSS via `calc(var(--i) * delay)`.

## Best Practices

1. **Always Set `animation-fill-mode: forwards` (or `both`) on Entrance Animations**: Prevent visual popping at completion.
2. **Never Animate Layout Properties (`margin`, `width`, `height`)**: Preserve 60 FPS frame rates.
3. **Always Respect `prefers-reduced-motion`**: Provide immediate appearance for users sensitive to motion.
4. **Use `animation-play-state: paused` for Interactive Controls**: Allow users to pause spinning carousel animations.
