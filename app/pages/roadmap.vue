<script setup lang="ts">
import { ArrowRight, Flag, Map } from 'lucide-vue-next'

const { technologies, lessons, sequence } = useSiteContent()
const { completed } = useProgress()

useSeoMeta({
  title: 'Front-End Roadmap — Front-Heaven',
  description: 'The complete front-end learning roadmap: HTML, CSS, JavaScript and beyond. See the journey, your progress and what to learn next.',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://front-heaven.dev/roadmap' }],
})

const stages = computed(() => technologies.value
  .sort((a, b) => a.order - b.order)
  .map(t => computeTechnologyProgress(t, lessons.value, completed.value)))

const overallPercent = computed(() => computeOverallProgress(sequence.value, completed.value))

const nextIndex = computed(() => {
  const idx = stages.value.findIndex(s => s.technology.status === 'available' && s.percent < 100)
  return idx
})

const completedCount = computed(() => sequence.value.filter(s => completed.value[s.lesson.path]).length)
</script>

<template>
  <div class="relative overflow-clip">
    <div class="relative mx-auto max-w-5xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24 lg:px-8">
      <div class="text-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-semibold text-muted">
          <Map class="size-3.5 text-primary" aria-hidden="true" />
          The learning journey
        </p>
        <h1 class="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          The Front-End <span class="gradient-text">Roadmap</span>
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          Ten stages. One direction. Follow the journey in order — each technology unlocks the next, and every lesson moves you forward.
        </p>

        <div class="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <span class="flex items-center gap-2 text-muted">
            <span class="flex size-4 items-center justify-center rounded-md border border-primary bg-primary font-mono text-[9px] font-bold text-white" aria-hidden="true">1</span>
            Start here
          </span>
          <span class="flex items-center gap-2 text-muted">
            <Flag class="size-4 text-muted" aria-hidden="true" />
            {{ stages.length }} stages ahead
          </span>
          <span class="flex items-center gap-2 text-muted">
            <span class="font-mono text-xs font-semibold text-primary tabular-nums">{{ overallPercent }}%</span>
            complete
          </span>
        </div>

        <div class="mx-auto mt-6 max-w-md">
          <div class="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-muted">
            <span>Overall progress</span>
            <span class="font-mono tabular-nums">{{ completedCount }}/{{ sequence.length }} lessons</span>
          </div>
          <ProgressBar :value="overallPercent" class="mt-2" :aria-label="`Overall progress ${overallPercent} percent`" />
        </div>
      </div>

      <ol class="mt-16" aria-label="Learning roadmap stages">
        <RoadmapStage
          v-for="(stage, i) in stages"
          :key="stage.technology.slug"
          :stage="stage"
          :index="i"
          :total="stages.length"
          :is-next="i === nextIndex"
        />
      </ol>

      <div class="mt-4 flex justify-center pb-8">
        <NuxtLink
          v-if="nextIndex !== -1"
          :to="technologyRoute(stages[nextIndex]!.technology.slug)"
          class="btn-primary px-6 py-3 text-sm"
        >
          {{ stages[nextIndex]!.percent === 0 ? 'Start stage ' : 'Continue with stage ' }}{{ nextIndex + 1 }}
          <ArrowRight class="size-4" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink v-else to="/" class="btn-secondary px-6 py-3 text-sm">
          <Flag class="size-4" aria-hidden="true" />
          Roadmap complete — you made it!
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
