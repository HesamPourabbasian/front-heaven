<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="[
      'rounded-2xl border border-border bg-surface text-ink shadow-sm transition-all duration-200',
      $props.class,
    ]"
  >
    <slot />
  </div>
</template>
