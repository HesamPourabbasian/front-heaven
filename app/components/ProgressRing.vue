<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  size?: number
  strokeWidth?: number
  label?: string
}>(), {
  size: 44,
  strokeWidth: 4,
  label: '',
})

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.value ?? 0))))
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - clamped.value / 100))
const gradientId = useId()
</script>

<template>
  <div
    class="relative inline-flex shrink-0 items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label || 'Progress'"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        stroke="var(--surface-3)"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="`url(#${gradientId})`"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="transition-all duration-700 ease-out"
      />
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--primary)" />
          <stop offset="100%" stop-color="var(--accent)" />
        </linearGradient>
      </defs>
    </svg>
    <span v-if="clamped > 0" class="absolute font-mono text-xs font-semibold text-ink tabular-nums">
      {{ clamped }}<span class="text-[9px] text-muted">%</span>
    </span>
  </div>
</template>
