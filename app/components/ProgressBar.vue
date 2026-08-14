<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  size?: 'sm' | 'md'
  showLabel?: boolean
  label?: string
}>(), {
  size: 'md',
  showLabel: false,
  label: '',
})

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.value ?? 0))))
</script>

<template>
  <div
    class="flex items-center gap-3"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label || 'Progress'"
  >
    <div
      class="relative flex-1 overflow-hidden rounded-full bg-surface-3"
      :class="size === 'sm' ? 'h-1' : 'h-1.5'"
    >
      <div
        class="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
        :style="{ width: `${clamped}%` }"
      />
    </div>
    <span v-if="showLabel" class="font-mono text-xs font-medium text-muted tabular-nums">{{ clamped }}%</span>
  </div>
</template>
