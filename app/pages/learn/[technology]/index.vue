<script setup lang="ts">
import { ArrowRight, BookOpen, Clock, GraduationCap, Lock, Menu, PlayCircle } from 'lucide-vue-next'
import { DIFFICULTY_LABELS } from '~/utils/content'
import type { TechnologySummary } from '~/types/content'

const route = useRoute()
const { technologies, lessons, sequence } = useSiteContent()
const { completed } = useProgress()
const { sidebarOpen } = useUiState()

const techSlug = computed(() => String(route.params.technology))
const technology = computed<TechnologySummary | undefined>(() =>
  technologies.value.find(t => t.slug === techSlug.value))

const techLessons = computed(() => lessons.value
  .filter(l => l.technology === techSlug.value)
  .sort((a, b) => a.order - b.order))

const techMinutes = computed(() => techLessons.value.reduce((sum, l) => sum + l.estimatedMinutes, 0))
const completedCount = computed(() => techLessons.value.filter(l => completed.value[l.path]).length)
const percent = computed(() => techLessons.value.length === 0
  ? 0
  : Math.round((completedCount.value / techLessons.value.length) * 100))

const nextLesson = computed(() => {
  const found = findNextLesson(sequence.value, completed.value)
  return found && found.technology.slug === technology.value?.slug ? found : null
})

const difficultyLabel = computed(() => technology.value ? DIFFICULTY_LABELS[technology.value.difficulty] : '')

const startLabel = computed(() => {
  if (!technology.value?.status) return 'Start learning'
  if (completedCount.value === techLessons.value.length && techLessons.value.length > 0) return 'Review lessons'
  if (completedCount.value > 0) return 'Continue learning'
  return 'Start learning'
})

const prerequisiteTechs = computed(() => (technology.value?.prerequisites ?? [])
  .map(slug => technologies.value.find(t => t.slug === slug))
  .filter((t): t is NonNullable<typeof t> => Boolean(t)))

useSeoMeta({
  title: () => technology.value ? `${technology.value.title} — Learn ${technology.value.title} | Front-Heaven` : 'Front-Heaven',
  description: () => technology.value?.description ?? '',
  ogTitle: () => technology.value ? `Learn ${technology.value.title} | Front-Heaven` : 'Front-Heaven',
  ogDescription: () => technology.value?.description ?? '',
  ogType: 'article',
})

const { data: introDoc, error: introError } = await useAsyncData(
  () => `tech-intro-${techSlug.value}`,
  () => queryCollection('technologies').where('path', '=', `/technologies/${techSlug.value}`).first(),
)

if (introError.value) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to load technology', fatal: true })
}

if (!introDoc.value || !technology.value) {
  throw createError({ statusCode: 404, statusMessage: `Technology "${techSlug.value}" not found`, fatal: true })
}
</script>

<template>
  <div v-if="technology" class="mx-auto max-w-7xl lg:flex">
    <DocsSidebar :active-tech="technology.slug" />

    <div class="min-w-0 flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div class="flex items-center justify-between gap-3">
        <Breadcrumbs :items="[{ label: technology.title }]" />
        <button
          type="button"
          class="icon-btn lg:hidden"
          aria-label="Open curriculum navigation"
          aria-controls="curriculum-drawer"
          :aria-expanded="sidebarOpen"
          @click="sidebarOpen = true"
        >
          <Menu class="size-4.5" aria-hidden="true" />
        </button>
      </div>

      <div class="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div class="max-w-2xl">
          <div class="flex flex-wrap items-center gap-3">
            <TechIcon :icon="technology.icon" :color="technology.color" size="lg" />
            <div>
              <h1 class="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {{ technology.title }}
              </h1>
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <DifficultyBadge :difficulty="technology.difficulty" size="md" />
                <span v-if="technology.status === 'coming-soon'" class="flex items-center gap-1 text-xs font-medium text-muted">
                  <Lock class="size-3.5" aria-hidden="true" />
                  Coming soon
                </span>
              </div>
            </div>
          </div>
          <p class="mt-5 text-base leading-relaxed text-muted">
            {{ technology.description }}
          </p>

          <div v-if="prerequisiteTechs.length" class="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span class="text-muted">Requires:</span>
            <NuxtLink
              v-for="prereq in prerequisiteTechs"
              :key="prereq.slug"
              :to="technologyRoute(prereq.slug)"
              class="chip transition-colors hover:border-primary/50 hover:text-primary"
            >
              {{ prereq.title }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex shrink-0 flex-col items-center gap-4">
          <ProgressRing
            :value="percent"
            :size="96"
            :stroke-width="7"
            :label="`${technology.title} progress`"
          />
          <span class="font-mono text-xs text-muted tabular-nums">{{ completedCount }} / {{ techLessons.length }} lessons</span>
        </div>
      </div>

      <div class="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div class="card p-5">
          <div class="flex items-center gap-2.5">
            <BookOpen class="size-4.5 text-primary" aria-hidden="true" />
            <span class="text-xs font-semibold uppercase tracking-widest text-muted">Lessons</span>
          </div>
          <p class="mt-2 font-display text-2xl font-bold text-ink tabular-nums">{{ techLessons.length }}</p>
          <p class="mt-0.5 text-xs text-muted">{{ techLessons.length === 0 ? 'In production…' : 'Complete to finish this stage' }}</p>
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2.5">
            <Clock class="size-4.5 text-primary" aria-hidden="true" />
            <span class="text-xs font-semibold uppercase tracking-widest text-muted">Est. time</span>
          </div>
          <p class="mt-2 font-display text-2xl font-bold text-ink tabular-nums">{{ techLessons.length ? formatDuration(techMinutes) : `${technology.estimatedHours}h` }}</p>
          <p class="mt-0.5 text-xs text-muted">At a comfortable pace</p>
        </div>
        <div class="card p-5">
          <div class="flex items-center gap-2.5">
            <GraduationCap class="size-4.5 text-primary" aria-hidden="true" />
            <span class="text-xs font-semibold uppercase tracking-widest text-muted">Difficulty</span>
          </div>
          <p class="mt-2 font-display text-2xl font-bold text-ink">{{ difficultyLabel }}</p>
          <p class="mt-0.5 text-xs text-muted">For complete beginners</p>
        </div>
      </div>

      <div v-if="introDoc" class="prose-content mt-10 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
        <ContentRenderer :value="introDoc" />
      </div>

      <div class="mt-10 flex flex-wrap items-center gap-4">
        <NuxtLink
          v-if="techLessons.length > 0"
          :to="nextLesson ? lessonRoute(nextLesson.lesson) : lessonRoute(techLessons[0]!)"
          class="btn-primary px-6 py-3 text-sm"
        >
          <PlayCircle class="size-4.5" aria-hidden="true" />
          {{ startLabel }}
          <ArrowRight class="size-4" aria-hidden="true" />
        </NuxtLink>
        <div class="min-w-0 flex-1 sm:max-w-xs">
          <div class="flex items-center justify-between text-xs font-medium text-muted">
            <span>Stage progress</span>
            <span class="font-mono tabular-nums">{{ percent }}%</span>
          </div>
          <ProgressBar :value="percent" class="mt-1.5" :label="`${technology.title} progress`" />
        </div>
      </div>

      <section class="mt-12" aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" class="font-display text-xl font-bold tracking-tight text-ink">
          {{ technology.title }} lessons
        </h2>
        <p class="mt-2 text-sm text-muted">
          {{ techLessons.length }} {{ techLessons.length === 1 ? 'lesson' : 'lessons' }} · follow them in order for best results.
        </p>

        <div v-if="techLessons.length" class="mt-6 space-y-3">
          <LessonCard
            v-for="(lesson, i) in techLessons"
            :key="lesson.path"
            :lesson="lesson"
            :index="i"
            :completed="Boolean(completed[lesson.path])"
            :current="nextLesson?.lesson.path === lesson.path"
          />
        </div>

        <div v-else class="card mt-6 flex flex-col items-center gap-4 p-12 text-center">
          <span class="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
            <Lock class="size-6" />
          </span>
          <div>
            <h3 class="font-display text-lg font-bold text-ink">Lessons are on the way</h3>
            <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              This stage of the roadmap is still being written. Finish the earlier stages first — they will prepare you perfectly for {{ technology.title }}.
            </p>
          </div>
          <NuxtLink to="/roadmap" class="btn-secondary text-sm">
            Back to roadmap
            <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
