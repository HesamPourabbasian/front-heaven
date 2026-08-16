---
title: 'Introduction to Svelte & Compiler Model'
description: 'Discover how Svelte compiles code into surgical vanilla JavaScript with zero virtual DOM runtime overhead.'
order: 1
difficulty: 'intermediate'
category: 'Svelte Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/javascript/functions-and-parameters
---

## The Compiler Approach

Unlike React and Vue which run a virtual DOM diffing engine in the browser, **Svelte is a compiler**. It converts your declarative components into highly efficient imperative JavaScript that directly updates the DOM!

---

## Svelte 5 Component Syntax

```svelte
<script>
  let count = $state(0);
  let double = $derived(count * 2);

  function increment() {
    count++;
  }
</script>

<button on:click={increment}>
  Count: {count} | Double: {double}
</button>

<style>
  button {
    background-color: #f97316;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }
</style>
```

---

## Summary & Key Takeaways

- Svelte eliminates the virtual DOM entirely.
- Svelte 5 introduces universal Runes (`$state`, `$derived`, `$effect`).
