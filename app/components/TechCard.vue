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
      <div class="flex items-center gap-1.5">
        <span
          v-if="technology.parentFramework"
          class="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted"
        >
          {{ technology.parentFramework === 'react' ? 'React Eco' : technology.parentFramework === 'vue' ? 'Vue Eco' : technology.parentFramework }}
        </span>
        <ArrowUpRight
          class="size-4.5 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </div>

    <div class="mt-5 flex items-center gap-2">
      <h3 class="font-display text-lg font-bold tracking-tight text-ink">
        {{ technology.title }}
      </h3>
    </div>
    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
      {{ technology.description }}
    </p>

    <div class="mt-5 space-y-3">
      <div class="flex items-center gap-3">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-surface-3" role="progressbar" :aria-valuenow="percent ?? 0" aria-valuemin="0" aria-valuemax="100" :aria-label="`${technology.title} progress ${percent ?? 0}%`">
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
