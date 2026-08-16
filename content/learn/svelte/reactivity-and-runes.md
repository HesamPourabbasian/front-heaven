---
title: 'Svelte 5 Runes ($state, $derived, $effect)'
description: 'Master modern Svelte 5 Runes for fine-grained reactivity in and outside components.'
order: 2
difficulty: 'intermediate'
category: 'Reactivity'
estimatedMinutes: 20
prerequisites:
  - /learn/svelte/introduction-to-svelte
---

## Svelte 5 Runes

- `$state(initialValue)`: Declares reactive state.
- `$derived(expression)`: Computes derived values automatically.
- `$effect(() => { ... })`: Runs side effects when dependencies change.
- `$props()`: Declares incoming component props.

---

## Summary & Key Takeaways

- Runes work consistently in `.svelte` and standard `.svelte.js` / `.svelte.ts` files.
