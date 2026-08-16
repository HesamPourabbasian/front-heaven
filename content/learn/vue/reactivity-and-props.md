---
title: 'Reactivity: ref, reactive & Props'
description: 'Learn ref vs reactive, computed getters, defineProps, and defineEmits in Vue 3 Composition API.'
order: 3
difficulty: 'intermediate'
category: 'Vue Reactivity'
estimatedMinutes: 25
prerequisites:
  - /learn/vue/single-file-components
---

## `ref()` vs `computed()`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }} (Double: {{ double }})</button>
</template>
```

---

## Summary & Key Takeaways

- Use `ref()` for primitives and objects.
- `computed()` automatically caches values until dependencies update.
