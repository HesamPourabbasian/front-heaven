---
title: 'Advanced Variants: Group, Peer, Has & ARIA'
description: 'Master advanced Tailwind CSS variants: group and group-hover with custom names, sibling peer variants (peer-checked, peer-focus), the :has() parent selector, ARIA attributes, and RTL/LTR directionality.'
order: 12
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/06-states']
---

# Advanced Variants: Group, Peer, Has & ARIA

Modern CSS specifications provide powerful relational and structural selectors. Tailwind CSS surfaces these cutting-edge capabilities through advanced variant modifiers: **`group`** for parent-child styling, **`peer`** for sibling-driven styling, **`has-*`** for parent-selection based on child state, and **`aria-*`** for accessibility-driven UI styling.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Advanced Variant Relational Patterns        │
├─────────────┬──────────────────────────┬────────────────────┤
│ Variant     │ Relationship Target      │ Example            │
├─────────────┼──────────────────────────┼────────────────────┤
│ group-*     │ Style child when parent  │ group-hover:scale  │
│             │ state changes            │                    │
├─────────────┼──────────────────────────┼────────────────────┤
│ peer-*      │ Style sibling when prior │ peer-checked:block │
│             │ sibling changes          │                    │
├─────────────┼──────────────────────────┼────────────────────┤
│ has-*       │ Style parent when child  │ has-[:checked]:bg- │
│             │ matches condition        │ indigo-50          │
├─────────────┼──────────────────────────┼────────────────────┤
│ aria-*      │ Style based on ARIA state│ aria-expanded:block│
└─────────────┴──────────────────────────┴────────────────────┘
```

## 1. Sibling Reactivity with `peer`

Create zero-JavaScript custom interactive toggles, floating labels, or input validations using `peer`:

```html
<!-- Custom Animated Toggle Switch -->
<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer">
  <!-- Track -->
  <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full
              peer-checked:bg-indigo-600 transition-colors"></div>
  <!-- Thumb -->
  <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform
              peer-checked:translate-x-5"></div>
</label>
```

## 2. Parent Selection with `has-*` (`:has()`)

The CSS `:has()` relational selector allows a parent element to react to the state of its descendants:

```html
<!-- Card highlights with indigo border whenever its inner radio button is selected! -->
<div class="p-6 bg-white border-2 border-slate-200 rounded-2xl
            has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/50 transition">
  <label class="flex items-center justify-between cursor-pointer">
    <div>
      <h4 class="font-bold text-slate-900">Enterprise Plan</h4>
      <p class="text-sm text-slate-500">Unlimited API requests and 24/7 support.</p>
    </div>
    <input type="radio" name="plan" class="w-5 h-5 text-indigo-600">
  </label>
</div>
```

## 3. Accessible State Styling with `aria-*`

Instead of toggling custom CSS classes like `.is-open`, style elements directly from semantic ARIA attributes:

```html
<button aria-expanded="true" class="aria-expanded:rotate-180 transition-transform">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>
</button>
```

## Summary & Key Takeaways

- `peer` styles following siblings based on prior element state (`peer-checked:`).
- `has-*` styles parent containers based on descendant conditions.
- `aria-*` binds component visual styling directly to accessibility attributes.

## Best Practices & Senior Guidance

1. **Use `aria-expanded` and `aria-selected` for State Styling**: Binds visual appearance to accessibility metadata, ensuring screen readers and visual UI remain in sync.
