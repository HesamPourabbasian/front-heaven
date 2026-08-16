<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'beginner' | 'intermediate' | 'advanced' | 'essential' | 'optional'
    class?: string
  }>(),
  {
    variant: 'default',
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border-border bg-surface-2 text-ink-soft'
    case 'outline':
      return 'border-border bg-transparent text-ink hover:bg-surface-2'
    case 'success':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'warning':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'destructive':
      return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
    case 'beginner':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    case 'intermediate':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
    case 'advanced':
      return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    case 'essential':
      return 'border-primary/40 bg-primary/10 text-primary font-semibold'
    case 'optional':
      return 'border-border bg-surface-3 text-muted'
    case 'default':
    default:
      return 'border-transparent bg-primary text-white shadow-sm'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors',
      variantClasses,
      $props.class,
    ]"
  >
    <slot />
  </span>
</template>
