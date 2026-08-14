<script setup lang="ts">
import { ArrowUpRight, Clock, Lock } from 'lucide-vue-next'
import type { TechnologySummary } from '~/types/content'

const props = defineProps<{
  technology: TechnologySummary
  percent?: number
  lessonCount?: number
  totalMinutes?: number
}>()

const isAvailable = computed(() => props.technology.status === 'available')
</script>

<template>
  <NuxtLink
    v-if="isAvailable"
    :to="technologyRoute(technology.slug)"
    class="card card-hover group relative flex h-full flex-col p-6"
  >
    <div class="flex items-start justify-between">
      <TechIcon :icon="technology.icon" :color="technology.color" />
      <ArrowUpRight
        class="size-4.5 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>

    <h3 class="mt-5 font-display text-lg font-bold tracking-tight text-ink">
      {{ technology.title }}
    </h3>
    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
      {{ technology.description }}
    </p>

    <div class="mt-5 space-y-3">
      <div class="flex items-center gap-3">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
          <div
            class="h-full rounded-full transition-all duration-700"
            :style="{ width: `${percent ?? 0}%`, background: technology.color }"
          />
        </div>
        <span class="font-mono text-xs font-medium text-muted tabular-nums">{{ percent ?? 0 }}%</span>
      </div>
      <div class="flex items-center gap-4 text-xs text-muted">
        <span class="flex items-center gap-1.5">
          <span class="font-semibold text-ink-soft">{{ lessonCount ?? 0 }}</span>
          lessons
        </span>
        <span class="flex items-center gap-1.5">
          <Clock class="size-3.5" aria-hidden="true" />
          {{ totalMinutes ? formatDuration(totalMinutes) : `${technology.estimatedHours}h` }}
        </span>
      </div>
    </div>
  </NuxtLink>

  <div
    v-else
    class="card card-hover group pointer-events-none relative flex h-full flex-col p-6 opacity-70"
    role="article"
    :aria-disabled="true"
  >
    <div class="flex items-start justify-between">
      <TechIcon :icon="technology.icon" :color="technology.color" />
      <span class="flex items-center gap-1 text-xs font-medium text-muted">
        <Lock class="size-3.5" aria-hidden="true" />
        Soon
      </span>
    </div>

    <h3 class="mt-5 font-display text-lg font-bold tracking-tight text-ink">
      {{ technology.title }}
    </h3>
    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
      {{ technology.description }}
    </p>

    <div class="mt-5 text-xs text-muted">
      Curriculum being written…
    </div>
  </div>
</template>
