---
title: 'Transitions & Custom Keyframe Animations'
description: 'Master animation in Tailwind: transition properties, durations, timing curves, transform utilities (scale, rotate, translate), custom @keyframes in Tailwind config, and motion-safe accessibility.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/08-visual-effects']
---

# Transitions & Custom Keyframe Animations

Delightful, responsive user interfaces leverage purposeful animation to guide user attention, communicate loading states, and provide spatial continuity during navigation.

Tailwind CSS combines hardware-accelerated **Transitions**, 2D/3D **Transforms**, built-in **Animation Utilities (`animate-spin`, `animate-pulse`, `animate-bounce`)**, and extensible **Custom Keyframes**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Tailwind Built-in Animation Utilities       │
├───────────────────┬─────────────────────────────────────────┤
│ Class             │ Default Animation Effect                │
├───────────────────┼─────────────────────────────────────────┤
│ animate-spin      │ Continuous 360° rotation (Loading icon) │
├───────────────────┼─────────────────────────────────────────┤
│ animate-ping      │ Radar pulse effect (Live notification)  │
├───────────────────┼─────────────────────────────────────────┤
│ animate-pulse     │ Soft opacity pulse (Skeleton loader)    │
├───────────────────┼─────────────────────────────────────────┤
│ animate-bounce    │ Playful vertical bounce (Scroll pointer)│
└───────────────────┴─────────────────────────────────────────┘
```

## 1. Skeleton Loading Card with `animate-pulse`

```html
<div class="p-6 bg-white rounded-2xl shadow animate-pulse space-y-4">
  <div class="w-12 h-12 bg-slate-200 rounded-xl"></div>
  <div class="h-4 bg-slate-200 rounded w-3/4"></div>
  <div class="space-y-2">
    <div class="h-3 bg-slate-200 rounded"></div>
    <div class="h-3 bg-slate-200 rounded w-5/6"></div>
  </div>
</div>
```

## 2. Defining Custom Keyframe Animations in Config

Extend `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      }
    }
  }
}
```

Use directly in markup: `class="animate-float"`.

## 3. Reduced Motion Accessibility (`motion-safe:` & `motion-reduce:`)

Users with vestibular disorders can enable "Reduce Motion" in their operating system. Respect this preference:

```html
<!-- Only animates if the user has NOT requested reduced motion -->
<div class="motion-safe:animate-bounce">
  Scroll Down
</div>
```

## Summary & Key Takeaways

- Built-in animations (`animate-pulse`, `animate-spin`) power loading states.
- Extend `keyframes` and `animation` in `tailwind.config.js` for custom motion.
- `motion-safe:` respects OS-level reduced motion accessibility preferences.

## Best Practices & Senior Guidance

1. **Always Keep Interaction Durations Under 300ms**: Button and modal transitions should be quick (`duration-150` to `duration-200`) to keep the UI feeling snappy.
