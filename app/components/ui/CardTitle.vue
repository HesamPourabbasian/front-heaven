<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <h3 :class="['font-display text-lg font-semibold leading-tight tracking-tight text-ink', $props.class]">
    <slot />
  </h3>
</template>
