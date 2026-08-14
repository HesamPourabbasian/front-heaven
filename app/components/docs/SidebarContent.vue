<script setup lang="ts">
import { Check, ChevronRight, Clock, Lock, PlayCircle } from 'lucide-vue-next'

defineProps<{
  activeTech?: string
  activeLesson?: string
}>()

const { technologies, lessons, sequence } = useSiteContent()
const { completed, isCompleted } = useProgress()

const nextLesson = computed(() => {
  const found = findNextLesson(sequence.value, completed.value)
  return found ? { ...found, path: lessonRoute(found.lesson) } : null
})

const available = computed(() => availableTechnologies(technologies.value))
const comingSoon = computed(() => technologies.value
  .filter(t => t.status === 'coming-soon')
  .sort((a, b) => a.order - b.order))

function techLessons(slug: string) {
  return lessons.value
    .filter(l => l.technology === slug)
    .sort((a, b) => a.order - b.order)
}

function techPercent(slug: string) {
  const list = techLessons(slug)
  if (list.length === 0) return 0
  const done = list.filter(l => isCompleted(l.path)).length
  return Math.round((done / list.length) * 100)
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-6 p-4">
    <NuxtLink
      v-if="nextLesson"
      :to="nextLesson.path"
      class="group rounded-2xl border border-border bg-surface-2/70 p-4 transition-all duration-200 hover:border-primary/50"
    >
      <span class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
        <PlayCircle class="size-3.5" aria-hidden="true" />
        Continue learning
      </span>
      <span class="mt-2.5 block text-sm font-semibold text-ink transition-colors group-hover:text-primary">
        {{ nextLesson.lesson.title }}
      </span>
      <span class="mt-1 flex items-center gap-1.5 text-xs text-muted">
        <Clock class="size-3" aria-hidden="true" />
        {{ nextLesson.lesson.estimatedMinutes }} min · {{ nextLesson.technology.title }}
      </span>
    </NuxtLink>

    <nav class="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable]" aria-label="Curriculum navigation">
      <section v-for="tech in available" :key="tech.slug">
        <NuxtLink
          :to="technologyRoute(tech.slug)"
          class="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
          :aria-current="activeTech === tech.slug ? 'page' : undefined"
        >
          <span class="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-ink">
            <span
              class="size-2 shrink-0 rounded-full"
              :style="{ background: tech.color }"
              aria-hidden="true"
            />
            <span class="truncate">{{ tech.title }}</span>
          </span>
          <span v-if="techPercent(tech.slug) > 0" class="font-mono text-[11px] font-medium text-muted tabular-nums">
            {{ techPercent(tech.slug) }}%
          </span>
        </NuxtLink>

        <ul v-if="activeTech === tech.slug" class="mt-1.5 space-y-0.5 border-l border-border pl-3 ml-2">
          <li v-for="lesson in techLessons(tech.slug)" :key="lesson.path">
            <NuxtLink
              :to="lessonRoute(lesson)"
              class="sidebar-link"
              :class="{
                'is-active': activeLesson === lesson.slug,
                'is-done': isCompleted(lesson.path),
              }"
              :aria-current="activeLesson === lesson.slug ? 'page' : undefined"
            >
              <span class="dot size-1.5 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
              <span class="min-w-0 flex-1 truncate">{{ lesson.title }}</span>
              <Check v-if="isCompleted(lesson.path)" class="size-3.5 shrink-0 text-success" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section>
        <p class="px-2 text-[11px] font-semibold uppercase tracking-widest text-muted">Coming next</p>
        <ul class="mt-1.5 space-y-0.5">
          <li v-for="tech in comingSoon" :key="tech.slug">
            <span class="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted/70">
              <Lock class="size-3.5 shrink-0" aria-hidden="true" />
              <span class="truncate">{{ tech.title }}</span>
            </span>
          </li>
        </ul>
      </section>
    </nav>

    <NuxtLink to="/roadmap" class="btn-secondary !w-full text-sm">
      View roadmap
      <ChevronRight class="size-4" aria-hidden="true" />
    </NuxtLink>
  </div>
</template>
