<script setup lang="ts">
import type { Difficulty } from '~/types/content'
import { DIFFICULTY_LABELS } from '~/utils/content'

const props = withDefaults(defineProps<{
  difficulty: Difficulty
  size?: 'sm' | 'md'
}>(), {
  size: 'sm',
})

const palette: Record<Difficulty, { dot: string; text: string }> = {
  beginner: { dot: 'bg-success', text: 'text-success' },
  intermediate: { dot: 'bg-warning', text: 'text-warning' },
  advanced: { dot: 'bg-danger', text: 'text-danger' },
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5" :title="`Difficulty: ${DIFFICULTY_LABELS[props.difficulty]}`">
    <span class="size-1.5 rounded-full" :class="palette[difficulty].dot" />
    <span class="text-xs font-medium" :class="[palette[difficulty].text, size === 'sm' ? 'text-[11px]' : 'text-xs']">
      {{ DIFFICULTY_LABELS[difficulty] }}
    </span>
  </span>
</template>