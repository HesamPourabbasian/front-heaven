---
title: 'Introduction to Vue.js'
description: 'Discover Vue.js, the progressive framework philosophy, declarative templates, and the Vue reactivity system.'
order: 1
difficulty: 'intermediate'
category: 'Vue Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/javascript/functions-and-parameters
---

## What is Vue.js?

**Vue.js** is a progressive JavaScript framework for building user interfaces. It scales incrementally between a lightweight library and a full-featured enterprise framework.

---

## Declarative Template Syntax

```vue
<script setup>
import { ref } from 'vue'

const message = ref('Hello, Vue 3!')
</script>

<template>
  <div class="banner">
    <h1>{{ message }}</h1>
    <input v-model="message" class="input" />
  </div>
</template>
```

---

## Summary & Key Takeaways

- Vue uses intuitive HTML-based templates with two-way data binding (`v-model`).
- Vue 3 reactivity is powered by JavaScript Proxies.
