---
title: 'Responsive Breakpoints & Pseudo-Classes in Tailwind'
description: 'Master modifier prefixes in Tailwind: sm:, md:, lg:, hover:, focus-visible:, and dark:.'
order: 2
difficulty: 'intermediate'
category: 'Tailwind Modifiers'
estimatedMinutes: 20
prerequisites:
  - /learn/tailwindcss/introduction-to-tailwindcss
---

## Responsive & State Modifiers

```html
<!-- 1 column on mobile, 2 on tablet (md:), 3 on desktop (lg:) -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <div class="p-4 transition hover:scale-105 focus-visible:ring-2">Card</div>
</div>
```

---

## Summary & Key Takeaways

- Prefix classes with modifiers like `md:` or `hover:` to control states conditionally.
