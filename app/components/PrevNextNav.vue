<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import type { SequenceItem } from '~/types/content'

defineProps<{
  previous?: SequenceItem | null
  next?: SequenceItem | null
}>()
</script>

<template>
  <nav class="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Lesson navigation">
    <NuxtLink
      v-if="previous"
      :to="lessonRoute(previous.lesson)"
      class="card card-hover group flex items-center gap-3 p-5"
    >
      <ArrowLeft class="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
      <span class="min-w-0">
        <span class="block text-[11px] font-semibold uppercase tracking-widest text-muted">Previous</span>
        <span class="mt-1 block truncate text-sm font-semibold text-ink transition-colors group-hover:text-primary">
          {{ previous.lesson.title }}
        </span>
        <span class="mt-0.5 block text-xs text-muted">{{ previous.technology.title }}</span>
      </span>
    </NuxtLink>
    <span v-else class="hidden sm:block" />

    <NuxtLink
      v-if="next"
      :to="lessonRoute(next.lesson)"
      class="card card-hover group flex items-center justify-end gap-3 p-5 text-right sm:col-start-2"
    >
      <span class="min-w-0">
        <span class="block text-[11px] font-semibold uppercase tracking-widest text-muted">Next</span>
        <span class="mt-1 block truncate text-sm font-semibold text-ink transition-colors group-hover:text-primary">
          {{ next.lesson.title }}
        </span>
        <span class="mt-0.5 block text-xs text-muted">{{ next.technology.title }}</span>
      </span>
      <ArrowRight class="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
    </NuxtLink>
  </nav>
</template>