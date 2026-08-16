<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    class?: string
  }>(),
  {
    orientation: 'horizontal',
  },
)
</script>

<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :class="[
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      $props.class,
    ]"
  />
</template>
