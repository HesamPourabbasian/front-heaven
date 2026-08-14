<script setup lang="ts">
import { Check, ChevronRight, Clock } from 'lucide-vue-next'
import type { LessonSummary } from '~/types/content'

defineProps<{
  lesson: LessonSummary
  index: number
  completed?: boolean
  current?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="lessonRoute(lesson)"
    class="card card-hover group relative flex items-center gap-4 p-5"
    :class="{ 'border-primary/60 ring-1 ring-primary/30': current }"
    :aria-current="current ? 'step' : undefined"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold transition-colors"
      :class="completed
        ? 'bg-success/15 text-success'
        : current
          ? 'bg-primary/15 text-primary'
          : 'bg-surface-2 text-muted group-hover:text-primary'"
      aria-hidden="true"
    >
      <Check v-if="completed" class="size-4.5" />
      <template v-else>{{ index + 1 }}</template>
    </span>

    <span class="min-w-0 flex-1">
      <span class="block truncate text-[15px] font-semibold text-ink transition-colors group-hover:text-primary">
        {{ lesson.title }}
      </span>
      <span class="mt-0.5 line-clamp-2 block text-[13px] leading-relaxed text-muted">
        {{ lesson.description }}
      </span>
      <span class="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
        <DifficultyBadge :difficulty="lesson.difficulty" />
        <span class="flex items-center gap-1">
          <Clock class="size-3" aria-hidden="true" />
          {{ lesson.estimatedMinutes }} min
        </span>
        <span class="text-muted/70">{{ lesson.category }}</span>
      </span>
    </span>

    <ChevronRight class="size-4.5 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
  </NuxtLink>
</template>