<script setup lang="ts">
import { CheckCircle2, Clock, ListOrdered, Menu } from 'lucide-vue-next'
import type { LessonSummary } from '~/types/content'

const route = useRoute()
const { technologies, lessons, sequence } = useSiteContent()
const { completed, isCompleted } = useProgress()

const techSlug = computed(() => String(route.params.technology))
const lessonSlug = computed(() => String(route.params.lesson))
const lessonPath = computed(() => `/learn/${techSlug.value}/${lessonSlug.value}`)

const { data: doc, error } = await useAsyncData(
  () => `lesson-${lessonPath.value}`,
  () => queryCollection('learn').where('path', '=', lessonPath.value).first(),
)

if (error.value) {
  throw createError({ statusCode: 500, statusMessage: `Failed to load lesson: ${error.value.message}`, fatal: true })
}

const lesson = computed<LessonSummary | null>(() => doc.value ? toLessonSummary(doc.value as unknown as LessonSummary) : null)

const technology = computed(() => technologies.value.find(t => t.slug === techSlug.value))
const sequenceIndex = computed(() => sequence.value.findIndex(s => s.lesson.path === lessonPath.value))
const previous = computed(() => sequenceIndex.value > 0 ? sequence.value[sequenceIndex.value - 1] : null)
const next = computed(() => sequenceIndex.value >= 0 && sequenceIndex.value < sequence.value.length - 1 ? sequence.value[sequenceIndex.value + 1] : null)

const toc = computed(() => (doc.value?.body?.toc?.links ?? []) as Array<{ id: string; text: string; depth: number }>)

const techLessons = computed(() => lessons.value
  .filter(l => l.technology === techSlug.value)
  .sort((a, b) => a.order - b.order))

const techPercent = computed(() => {
  if (techLessons.value.length === 0) return 0
  const done = techLessons.value.filter(l => isCompleted(l.path)).length
  return Math.round((done / techLessons.value.length) * 100)
})

const done = computed(() => isCompleted(lessonPath.value))

const prereqLessons = computed(() => (lesson.value?.prerequisites ?? [])
  .map(path => lessons.value.find(l => l.path === path))
  .filter((l): l is NonNullable<typeof l> => Boolean(l)))

if (!lesson.value || !technology.value) {
  throw createError({ statusCode: 404, statusMessage: `Lesson "${lessonSlug.value}" not found`, fatal: true })
}

useSeoMeta({
  title: () => lesson.value ? `${lesson.value.title} — Learn ${technology.value?.title ?? ''} | Front-Heaven` : 'Front-Heaven',
  description: () => lesson.value?.description ?? '',
  ogTitle: () => lesson.value ? `${lesson.value.title} — Front-Heaven` : 'Front-Heaven',
  ogDescription: () => lesson.value?.description ?? '',
  ogType: 'article',
})

useHead(() => ({
  link: lesson.value ? [{ rel: 'canonical', href: `https://front-heaven.dev/learn/${techSlug.value}/${lessonSlug.value}` }] : [],
}))

const { sidebarOpen } = useUiState()
</script>

<template>
  <div v-if="lesson && technology" class="mx-auto max-w-7xl lg:flex">
    <DocsSidebar :active-tech="technology.slug" :active-lesson="lesson.slug" />

    <div class="min-w-0 flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div class="flex items-center justify-between gap-3">
        <Breadcrumbs :items="[
          { label: technology.title, to: technologyRoute(technology.slug) },
          { label: lesson.title },
        ]" />
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

      <header class="mt-8 max-w-3xl">
        <div class="flex flex-wrap items-center gap-2.5">
          <span class="chip">{{ lesson.category }}</span>
          <DifficultyBadge :difficulty="lesson.difficulty" />
          <span class="chip">
            <Clock class="size-3" aria-hidden="true" />
            {{ lesson.estimatedMinutes }} min read
          </span>
          <span v-if="done" class="chip !border-success/40 !bg-success/10 !text-success">
            <CheckCircle2 class="size-3.5" aria-hidden="true" />
            Completed
          </span>
        </div>

        <h1 class="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {{ lesson.title }}
        </h1>
        <p class="mt-4 text-base leading-relaxed text-muted">
          {{ lesson.description }}
        </p>

        <div v-if="prereqLessons.length" class="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span class="flex items-center gap-1.5 font-medium text-muted">
            <ListOrdered class="size-4" aria-hidden="true" />
            Recommended before:
          </span>
          <NuxtLink
            v-for="prereq in prereqLessons"
            :key="prereq.path"
            :to="lessonRoute(prereq)"
            class="chip transition-colors hover:border-primary/50 hover:text-primary"
          >
            {{ prereq.title }}
          </NuxtLink>
        </div>

        <div class="mt-7 flex flex-wrap items-center gap-4">
          <MarkComplete :path="lessonPath" />
          <div class="min-w-[160px] flex-1 sm:max-w-[260px]">
            <div class="flex items-center justify-between text-xs font-medium text-muted">
              <span>{{ technology.title }} progress</span>
              <span class="font-mono tabular-nums">{{ techPercent }}%</span>
            </div>
            <ProgressBar :value="techPercent" class="mt-1.5" :label="`${technology.title} progress`" />
          </div>
        </div>
      </header>

      <div class="mt-12 max-w-3xl xl:max-w-none xl:grid xl:grid-cols-[minmax(0,760px)_240px] xl:gap-12">
        <article class="prose-content min-w-0">
          <ContentRenderer v-if="doc" :value="doc" />
        </article>

        <aside class="hidden xl:block" aria-label="Table of contents">
          <div class="sticky top-24">
            <TableOfContents :items="toc" />
          </div>
        </aside>
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface-2/60 p-6">
        <div>
          <p class="text-sm font-semibold text-ink">
            {{ done ? 'Lesson completed — great work!' : 'Finished studying? Lock it in.' }}
          </p>
          <p class="mt-1 text-xs leading-relaxed text-muted">
            {{ done ? 'Your progress is saved. Move on to the next lesson.' : 'Mark this lesson as completed to track your journey.' }}
          </p>
        </div>
        <MarkComplete :path="lessonPath" size="sm" />
      </div>

      <PrevNextNav :previous="previous" :next="next" />

      <div v-if="doc" class="mt-16 max-w-3xl xl:hidden">
        <TableOfContents :items="toc" title="Lesson sections" />
      </div>
    </div>
  </div>
</template>
