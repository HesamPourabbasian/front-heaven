<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="['p-6 pt-0', $props.class]">
    <slot />
  </div>
</template>
