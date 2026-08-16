---
title: 'Vue Directives & Event Handling'
description: 'Master v-if, v-for, v-show, v-bind, v-on (@event), event modifiers, and custom directives.'
order: 5
difficulty: 'intermediate'
category: 'Vue Directives'
estimatedMinutes: 20
prerequisites:
  - /learn/vue/composition-api
---

## Essential Vue Directives

- `v-if` / `v-else`: Conditional DOM insertion/removal.
- `v-show`: Toggles CSS `display: none` without destroying DOM nodes.
- `v-for`: Renders lists (requires `:key`).
- `v-on` (`@`): Listens to DOM events with modifiers like `@submit.prevent`.

---

## Summary & Key Takeaways

- Use `v-show` for frequently toggled UI elements; use `v-if` for conditional trees.
