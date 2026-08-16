---
title: 'Composition API & Composables'
description: 'Build modular, reusable business logic using Vue Composables (useFetch, useTheme, useLocalStorage).'
order: 4
difficulty: 'intermediate'
category: 'Advanced Patterns'
estimatedMinutes: 25
prerequisites:
  - /learn/vue/reactivity-and-props
---

## Building a Custom Composable

```ts
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

---

## Summary & Key Takeaways

- Composables are the Vue standard for sharing stateful logic cleanly across components.
