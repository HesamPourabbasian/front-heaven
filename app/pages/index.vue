<script setup lang="ts">
import { ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, Compass, FileCode2, Gauge, GraduationCap, Layers3, Lightbulb, Lock, Map, MousePointerClick, PencilRuler, Rocket, Search, Sparkles, Target, Trophy } from 'lucide-vue-next'

const { technologies, lessons, sequence, totalMinutes } = useSiteContent()
const { completed, isCompleted } = useProgress()

useSeoMeta({
  title: 'Front-Heaven — Learn Front-End Development. The Right Way.',
  description: 'Follow a structured, beginner-friendly path from HTML and CSS fundamentals to modern front-end development. Track your progress, one lesson at a time.',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://front-heaven.dev/' }],
})

const available = computed(() => availableTechnologies(technologies.value))

const overallPercent = computed(() => computeOverallProgress(sequence.value, completed.value))
const completedCount = computed(() => sequence.value.filter(s => isCompleted(s.lesson.path)).length)

const nextLesson = computed(() => {
  const found = findNextLesson(sequence.value, completed.value)
  return found ? { ...found, path: lessonRoute(found.lesson) } : null
})

const startHref = computed(() => nextLesson.value?.path ?? '/roadmap')
const startLabel = computed(() => nextLesson.value ? 'Continue learning' : 'Start learning')

const stats = computed(() => [
  { icon: BookOpenCheck, value: lessons.value.length.toString(), label: 'Lessons' },
  { icon: GraduationCap, value: available.value.length.toString(), label: 'Technologies' },
  { icon: Gauge, value: Math.max(1, Math.round(totalMinutes.value / 60)).toString(), label: 'Hours of content' },
  { icon: Trophy, value: `${overallPercent.value}%`, label: 'Your progress' },
])

const featuredLessons = computed(() => {
  const picks = [
    { tech: 'html', slug: 'what-is-html' },
    { tech: 'css', slug: 'flexbox' },
    { tech: 'javascript', slug: 'functions' },
  ]
  return picks
    .map((p) => {
      const lesson = lessons.value.find(l => l.technology === p.tech && l.slug === p.slug)
      const tech = technologies.value.find(t => t.slug === p.tech)
      return lesson && tech ? { lesson, tech } : null
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
})

const methodology = [
  {
    icon: Map,
    title: 'Follow the roadmap',
    text: 'No guesswork. Each technology builds on the last, so you always know what to learn and when.',
  },
  {
    icon: BookOpenCheck,
    title: 'Study one lesson at a time',
    text: 'Every lesson is beginner-friendly, practical and self-contained — with real code and clear explanations.',
  },
  {
    icon: PencilRuler,
    title: 'Practice what you learn',
    text: 'Each lesson ends with a hands-on challenge that turns knowledge into skill.',
  },
  {
    icon: BarChart3,
    title: 'Track your progress',
    text: 'Mark lessons complete, watch your percentages grow, and pick up exactly where you left off.',
  },
]

const features = [
  {
    icon: Compass,
    title: 'A clear, structured path',
    text: 'From “what is HTML?” to modern frameworks — every step is planned, ordered and explained.',
  },
  {
    icon: Sparkles,
    title: 'Written for beginners',
    text: 'No assumed knowledge. Concepts are explained from the ground up, with real-world context.',
  },
  {
    icon: CheckCircle2,
    title: 'Learn by doing',
    text: 'Working code examples and challenges in every lesson — because reading alone is not enough.',
  },
  {
    icon: Target,
    title: 'Progress that persists',
    text: 'Your completed lessons are saved locally, so you always know where you stand.',
  },
  {
    icon: MousePointerClick,
    title: 'Fast, focused learning',
    text: 'Short, focused lessons you can finish in one sitting — designed to respect your time.',
  },
  {
    icon: Search,
    title: 'Find anything instantly',
    text: 'Search the entire curriculum with one keystroke (⌘K) to jump straight to any topic.',
  },
]

function techPercent(slug: string) {
  const list = lessons.value.filter(l => l.technology === slug)
  if (list.length === 0) return 0
  const done = list.filter(l => isCompleted(l.path)).length
  return Math.round((done / list.length) * 100)
}

function techMinutes(slug: string) {
  return lessons.value
    .filter(l => l.technology === slug)
    .reduce((sum, l) => sum + l.estimatedMinutes, 0)
}
</script>

<template>
  <div class="overflow-clip">
    <!-- Hero -->
    <section class="relative" aria-labelledby="hero-heading">
        <div class="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <p class="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-semibold text-muted">
            <Sparkles class="size-3.5 text-primary" aria-hidden="true" />
            A structured path from zero to front-end developer
          </p>

          <h1 id="hero-heading" class="animate-fade-up mt-7 font-display text-[2.6rem] leading-[1.08] font-bold tracking-tight text-ink sm:text-6xl" style="animation-delay: 60ms">
            Learn Front-End Development.
            <span class="gradient-text">The Right Way.</span>
          </h1>

          <p class="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted" style="animation-delay: 120ms">
            Follow a structured path from HTML and CSS fundamentals to modern front-end development — with progress tracking, practical lessons and a roadmap you can trust.
          </p>

          <div class="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style="animation-delay: 180ms">
            <NuxtLink :to="startHref" class="btn-primary px-6 py-3 text-sm">
              {{ startLabel }}
              <ArrowRight class="size-4" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink to="/roadmap" class="btn-secondary px-6 py-3 text-sm">
              <Map class="size-4" aria-hidden="true" />
              Explore the roadmap
            </NuxtLink>
          </div>

          <dl class="animate-fade-up mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" style="animation-delay: 240ms">
            <div v-for="stat in stats" :key="stat.label" class="group flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-border bg-surface/70 px-4 py-5 text-center transition-all duration-200 hover:border-border-strong hover:shadow-lg hover:shadow-primary/5 sm:min-h-28">
              <dt class="flex flex-col items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                <span class="flex size-8 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
                  <component :is="stat.icon" class="size-4 text-primary" aria-hidden="true" />
                </span>
                {{ stat.label }}
              </dt>
              <dd class="mt-auto font-display text-2xl font-bold text-ink tabular-nums sm:text-3xl">
                {{ stat.value }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Roadmap preview strip -->
        <div class="animate-fade-up mt-16" style="animation-delay: 300ms" aria-label="Roadmap preview">
          <!-- Mobile: grid layout -->
          <div class="grid grid-cols-3 gap-4 sm:hidden">
            <template v-for="(tech, i) in technologies" :key="tech.slug">
              <div
                class="flex flex-col items-center"
                :class="tech.status === 'available' ? 'cursor-pointer' : 'opacity-45'"
              >
                <NuxtLink
                  v-if="tech.status === 'available'"
                  :to="technologyRoute(tech.slug)"
                  class="group flex flex-col items-center gap-2"
                >
                  <span class="transition-transform duration-200 group-hover:scale-110" :aria-label="`Open ${tech.title} lessons`">
                    <TechIcon :icon="tech.icon" :color="tech.color" />
                  </span>
                  <span class="text-[10px] font-semibold tracking-wide text-muted group-hover:text-ink">{{ tech.title }}</span>
                  <span class="h-1 w-10 overflow-hidden rounded-full bg-surface-3">
                    <span class="block h-full rounded-full" :style="{ width: `${techPercent(tech.slug)}%`, background: tech.color }" />
                  </span>
                </NuxtLink>
                <span v-else class="flex flex-col items-center gap-2">
                  <span class="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-2" aria-hidden="true">
                    <Lock class="size-4 text-muted" />
                  </span>
                  <span class="text-[10px] font-semibold tracking-wide text-muted">{{ tech.title }}</span>
                </span>
              </div>
            </template>
          </div>

          <!-- Desktop: horizontal strip -->
          <div class="hidden items-center justify-center gap-0 overflow-x-auto pb-3 [scrollbar-width:none] sm:flex [&::-webkit-scrollbar]:hidden">
            <template v-for="(tech, i) in technologies" :key="tech.slug">
              <div
                class="flex min-w-fit items-center"
                :class="tech.status === 'available' ? 'cursor-pointer' : 'opacity-45'"
              >
                <NuxtLink
                  v-if="tech.status === 'available'"
                  :to="technologyRoute(tech.slug)"
                  class="group flex flex-col items-center gap-2 px-3"
                >
                  <span class="transition-transform duration-200 group-hover:scale-110" :aria-label="`Open ${tech.title} lessons`">
                    <TechIcon :icon="tech.icon" :color="tech.color" />
                  </span>
                  <span class="text-[10px] font-semibold tracking-wide text-muted group-hover:text-ink">{{ tech.title }}</span>
                  <span class="h-1 w-10 overflow-hidden rounded-full bg-surface-3">
                    <span class="block h-full rounded-full" :style="{ width: `${techPercent(tech.slug)}%`, background: tech.color }" />
                  </span>
                </NuxtLink>
                <span v-else class="flex flex-col items-center gap-2 px-3">
                  <span class="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-2" aria-hidden="true">
                    <Lock class="size-4 text-muted" />
                  </span>
                  <span class="text-[10px] font-semibold tracking-wide text-muted">{{ tech.title }}</span>
                </span>
              </div>
              <span v-if="i < technologies.length - 1" class="mx-0.5 mb-7 h-px w-4 shrink-0 bg-gradient-to-r from-primary/60 to-accent/60 sm:w-8" aria-hidden="true" />
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Technologies -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="technologies-heading">
      <Reveal>
        <SectionHeading
          id="technologies-heading"
          eyebrow="The curriculum"
          title="Everything you need, in the right order"
          description="Each technology is a stage on your journey. Master the fundamentals first, then progress toward modern front-end engineering."
        />
      </Reveal>

      <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Reveal v-for="(tech, i) in technologies" :key="tech.slug">
          <div style="animation-delay: 0ms">
            <TechCard
              :technology="tech"
              :percent="techPercent(tech.slug)"
              :lesson-count="lessons.filter(l => l.technology === tech.slug).length"
              :total-minutes="techMinutes(tech.slug) || undefined"
            />
          </div>
        </Reveal>
      </div>
    </section>

    <!-- Methodology -->
    <section class="border-y border-border bg-surface/50" aria-labelledby="methodology-heading">
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            id="methodology-heading"
            eyebrow="How it works"
            title="A learning method that actually works"
            description="Front-Heaven is built around a simple loop: know where you are, learn one thing well, practice it, and move forward."
            align="center"
          />
        </Reveal>

        <ol class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal v-for="(step, i) in methodology" :key="step.title">
            <li class="card card-hover relative h-full p-6">
              <span class="absolute top-5 right-5 font-mono text-xs font-bold text-muted/40" aria-hidden="true">
                0{{ i + 1 }}
              </span>
              <span class="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary" aria-hidden="true">
                <component :is="step.icon" class="size-5" />
              </span>
              <h3 class="mt-5 font-display text-base font-bold text-ink">{{ step.title }}</h3>
              <p class="mt-2.5 text-sm leading-relaxed text-muted">{{ step.text }}</p>
            </li>
          </Reveal>
        </ol>
      </div>
    </section>

    <!-- Why Front-Heaven -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="why-heading">
      <Reveal>
        <SectionHeading
          id="why-heading"
          eyebrow="Why Front-Heaven"
          title="Built for the way beginners actually learn"
          description="Most tutorials leave you lost. Front-Heaven gives you direction, structure and proof of progress at every step."
        />
      </Reveal>

      <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="feature in features" :key="feature.title">
          <div class="card card-hover h-full p-6">
            <component :is="feature.icon" class="size-5 text-primary" aria-hidden="true" />
            <h3 class="mt-4 font-display text-base font-bold text-ink">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">{{ feature.text }}</p>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- Featured lessons -->
    <section class="border-y border-border bg-surface/50" aria-labelledby="featured-heading">
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div class="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="featured-heading"
              eyebrow="Start here"
              title="Featured lessons"
              description="Not sure where to begin? These three lessons open the door to everything else."
            />
            <NuxtLink to="/roadmap" class="btn-secondary group shrink-0 whitespace-nowrap px-5 py-2.5 text-sm">
              View full roadmap
              <ArrowRight class="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </NuxtLink>
          </div>
        </Reveal>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal v-for="({ lesson, tech }) in featuredLessons" :key="lesson.path">
            <NuxtLink :to="lessonRoute(lesson)" class="card card-hover group flex h-full flex-col p-6">
              <div class="flex items-center gap-3">
                <TechIcon :icon="tech.icon" :color="tech.color" size="sm" />
                <span class="text-xs font-semibold tracking-wide text-muted">{{ tech.title }}</span>
              </div>
              <h3 class="mt-4 font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-primary">
                {{ lesson.title }}
              </h3>
              <p class="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                {{ lesson.description }}
              </p>
              <div class="mt-5 flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs text-muted">
                  <DifficultyBadge :difficulty="lesson.difficulty" />
                  <span>{{ lesson.estimatedMinutes }} min</span>
                </div>
                <ArrowRight class="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </div>
            </NuxtLink>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <Reveal>
        <div class="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/12 via-surface to-accent/10 px-6 py-16 text-center sm:px-16">
          <div class="relative">
            <Layers3 class="mx-auto size-8 text-primary" aria-hidden="true" />
            <h2 id="cta-heading" class="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Your journey starts with one lesson.
            </h2>
            <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
              Every expert front-end developer was once a beginner who simply started. Open the first lesson and take that step today.
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <NuxtLink :to="startHref" class="btn-primary px-7 py-3 text-sm">
                <Rocket class="size-4" aria-hidden="true" />
                {{ startLabel }}
              </NuxtLink>
              <NuxtLink to="/learn/html" class="btn-secondary px-7 py-3 text-sm">
                Start with HTML
              </NuxtLink>
            </div>
            <p v-if="completedCount > 0" class="mt-6 text-xs font-medium text-muted">
              You have completed {{ completedCount }} of {{ sequence.length }} lessons · {{ overallPercent }}% of the curriculum
            </p>
            <p v-else class="mt-6 text-xs font-medium text-muted">
              Free forever · Works offline · No sign-up required
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
</template>
