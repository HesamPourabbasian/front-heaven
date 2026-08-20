---
title: 'Framework Integration: React, Vue, Nuxt & Angular'
description: 'Master Tailwind integration across frameworks: React + shadcn/ui patterns, Vue 3 computed classes, Nuxt @nuxtjs/tailwindcss module, and Angular standalone component styling.'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/20-tailwind-with-javascript']
---

# Framework Integration: React, Vue, Nuxt & Angular

Tailwind CSS operates seamlessly across all major frontend frameworks. However, each framework provides unique templating paradigms, reactivity models, and component encapsulation mechanisms that affect how Tailwind classes are composed.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Framework Styling Paradigms                 │
├─────────────┬───────────────────────────────────────────────┤
│ Framework   │ Dominant Tailwind Pattern                     │
├─────────────┼───────────────────────────────────────────────┤
│ React       │ CVA + tailwind-merge (shadcn/ui model)        │
├─────────────┼───────────────────────────────────────────────┤
│ Vue 3       │ Computed class objects / Template bindings    │
├─────────────┼───────────────────────────────────────────────┤
│ Nuxt        │ @nuxtjs/tailwindcss module with zero config   │
├─────────────┼───────────────────────────────────────────────┤
│ Angular     │ HostBinding & Standalone component templates  │
└─────────────┴───────────────────────────────────────────────┘
```

## 1. Vue 3 & Nuxt Integration

In Vue 3, compose dynamic classes using reactive computed properties:

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}>(), {
  variant: 'primary',
  size: 'md'
});

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg transition',
  {
    'bg-indigo-600 text-white hover:bg-indigo-700': props.variant === 'primary',
    'bg-slate-100 text-slate-900 hover:bg-slate-200': props.variant === 'secondary',
    'bg-rose-600 text-white hover:bg-rose-700': props.variant === 'danger',
    'px-3 py-1.5 text-xs': props.size === 'sm',
    'px-4 py-2 text-sm': props.size === 'md',
    'px-6 py-3 text-base': props.size === 'lg',
  }
]);
</script>

<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>
```

## 2. Angular Standalone Integration

In Angular 19+, apply utility classes directly in standalone component templates and style the component host:

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="badgeClasses()">
      <ng-content></ng-content>
    </span>
  `,
  host: {
    'class': 'inline-block'
  }
})
export class BadgeComponent {
  variant = input<'success' | 'warning' | 'error'>('success');

  badgeClasses() {
    const base = 'px-2.5 py-0.5 rounded-full text-xs font-semibold';
    switch (this.variant()) {
      case 'success': return `${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400`;
      case 'warning': return `${base} bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400`;
      case 'error': return `${base} bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400`;
    }
  }
}
```

## Summary & Key Takeaways

- React leverages CVA and `clsx` for composable primitives.
- Vue/Nuxt binds dynamic classes via computed objects and `@nuxtjs/tailwindcss`.
- Angular integrates Tailwind utilities natively in standalone component templates.

## Best Practices & Senior Guidance

1. **Use the `shadcn/ui` Architecture for React Projects**: Copying and owning accessible, un-styled Radix primitives styled with Tailwind and CVA has become the industry standard.
