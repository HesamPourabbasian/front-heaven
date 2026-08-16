---
title: 'Components, Props & Slots'
description: 'Learn component composition, passing props with $props(), snippets, and event dispatching in Svelte.'
order: 3
difficulty: 'intermediate'
category: 'Component Architecture'
estimatedMinutes: 20
prerequisites:
  - /learn/svelte/reactivity-and-runes
---

## Svelte 5 Component Props

```svelte
<!-- Card.svelte -->
<script>
  let { title, children } = $props();
</script>

<div class="card">
  <h2>{title}</h2>
  {@render children()}
</div>
```

---

## Summary & Key Takeaways

- Snippets (`{@render snippet()}`) provide flexible template slots in Svelte 5.
