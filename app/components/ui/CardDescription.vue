<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <p :class="['text-sm leading-relaxed text-muted', $props.class]">
    <slot />
  </p>
</template>
