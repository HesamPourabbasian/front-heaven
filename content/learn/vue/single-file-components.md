---
title: 'Single-File Components (SFCs)'
description: 'Master Vue Single-File Components (.vue) encapsulating <script setup>, <template>, and <style scoped>.'
order: 2
difficulty: 'intermediate'
category: 'Vue Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/vue/introduction-to-vue
---

## SFC Structure

Vue components live in `.vue` files organizing structure, logic, and styling in one place:

```vue
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--surface);
}
</style>
```

---

## Summary & Key Takeaways

- SFCs keep component code cohesive.
- `<style scoped>` automatically prevents style leakage with unique attribute selectors.
