<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    class?: string
    color?: string
  }>(),
  {
    value: 0,
    max: 100,
  },
)

const clamped = computed(() => Math.min(Math.max(props.value ?? 0, 0), props.max))
const percent = computed(() => Math.round((clamped.value / props.max) * 100))
</script>

<template>
  <div
    role="progressbar"
    :aria-valuenow="clamped"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :class="[
      'relative h-2 w-full overflow-hidden rounded-full bg-surface-3',
      $props.class,
    ]"
  >
    <div
      class="h-full rounded-full transition-all duration-500 ease-out"
      :style="{
        width: `${percent}%`,
        background: color ?? 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
      }"
    />
  </div>
</template>
