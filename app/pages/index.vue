<script setup lang="ts">
import { ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, Compass, FileCode2, Gauge, GraduationCap, Layers3, Lightbulb, Lock, Map, MousePointerClick, Network, PencilRuler, Rocket, Search, Sparkles, Target, Trophy } from 'lucide-vue-next'

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
    { tech: 'html', slug: 'introduction-to-html' },
    { tech: 'css', slug: 'flexbox' },
    { tech: 'javascript', slug: 'functions-and-parameters' },
  ]
  return picks
    .map((p) => {
      let lesson = lessons.value.find(l => l.technology === p.tech && l.slug === p.slug)
      if (!lesson) {
        lesson = lessons.value.find(l => l.technology === p.tech)
      }
      const tech = technologies.value.find(t => t.slug === p.tech)
      return lesson && tech ? { lesson, tech } : null
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
})

const selectedTrack = ref<'all' | 'core' | 'frontend-framework' | 'meta-framework' | 'css-framework'>('all')

const trackTabs = [
  { id: 'all', label: 'All Curricula' },
  { id: 'core', label: 'Core Fundamentals' },
  { id: 'frontend-framework', label: 'Frontend Frameworks' },
  { id: 'meta-framework', label: 'Meta-Frameworks' },
  { id: 'css-framework', label: 'CSS Frameworks' },
]

const trackSections = computed(() => {
  const all = [
    {
      id: 'core',
      title: 'Core Fundamentals',
      eyebrow: 'The Foundation',
      description: 'HTML, CSS, JavaScript, TypeScript, Git, Responsive Design, HTTP/APIs, and Web Accessibility.',
      technologies: technologies.value.filter(t => !t.track || t.track === 'core' || t.track === 'advanced'),
    },
    {
      id: 'frontend-framework',
      title: 'Frontend Frameworks',
      eyebrow: 'Component Architecture',
      description: 'Dedicated standalone tutorials for the 8 major frontend component libraries and frameworks.',
      technologies: technologies.value.filter(t => t.track === 'frontend-framework'),
    },
    {
      id: 'meta-framework',
      title: 'Meta-Frameworks',
      eyebrow: 'Universal SSR & Full-Stack',
      description: 'Next.js (built on React) and Nuxt (built on Vue) for enterprise hybrid rendering and routing.',
      technologies: technologies.value.filter(t => t.track === 'meta-framework'),
    },
    {
      id: 'css-framework',
      title: 'CSS Frameworks',
      eyebrow: 'Rapid UI Toolkits',
      description: 'Utility-first styling with Tailwind CSS and modular responsive components with Bootstrap.',
      technologies: technologies.value.filter(t => t.track === 'css-framework'),
    },
  ]

  if (selectedTrack.value === 'all') {
    return all.filter(s => s.technologies.length > 0)
  }
  return all.filter(s => s.id === selectedTrack.value && s.technologies.length > 0)
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
    <section class="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24" aria-labelledby="hero-heading">
      <!-- Ambient Image Texture Glow -->
      <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/design.png"
          alt="Front-Heaven Hero Design"
          class="h-full w-full object-cover object-right-top opacity-20 dark:opacity-30 filter blur-xs"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-background/30 via-background/85 to-background" />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-10 lg:grid-cols-12">
          <!-- Left Content Column -->
          <div class="space-y-6 text-center lg:text-left lg:col-span-7">
            <p class="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold text-muted shadow-xs backdrop-blur-md">
              <Sparkles class="size-3.5 text-primary" aria-hidden="true" />
              A structured path from zero to front-end developer
            </p>

            <h1 id="hero-heading" class="animate-fade-up font-display text-4xl leading-[1.08] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl" style="animation-delay: 60ms">
              Learn Front-End Development.
              <span class="gradient-text block mt-1">The Right Way.</span>
            </h1>

            <p class="animate-fade-up max-w-2xl text-base leading-relaxed text-muted sm:text-lg mx-auto lg:mx-0" style="animation-delay: 120ms">
              Follow a structured path from HTML and CSS fundamentals to modern front-end frameworks — with progress tracking, interactive learning diagrams, and a curriculum you can trust.
            </p>

            <div class="animate-fade-up flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2" style="animation-delay: 180ms">
              <NuxtLink :to="startHref" class="btn-primary px-6 py-3 text-sm shadow-md">
                {{ startLabel }}
                <ArrowRight class="size-4" aria-hidden="true" />
              </NuxtLink>
              <NuxtLink to="/roadmap" class="btn-secondary px-6 py-3 text-sm">
                <Map class="size-4" aria-hidden="true" />
                Explore the roadmap
              </NuxtLink>
              <NuxtLink to="/diagram" class="btn-secondary px-6 py-3 text-sm">
                <Network class="size-4" aria-hidden="true" />
                View learning diagram
              </NuxtLink>
            </div>

            <!-- Stats Bar -->
            <dl class="animate-fade-up pt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" style="animation-delay: 240ms">
              <div v-for="stat in stats" :key="stat.label" class="group flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md p-3.5 text-left transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                <dt class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  <component :is="stat.icon" class="size-3.5 text-primary" aria-hidden="true" />
                  {{ stat.label }}
                </dt>
                <dd class="mt-2 font-display text-xl font-bold text-ink tabular-nums sm:text-2xl">
                  {{ stat.value }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Right Showcase Hero Artwork Column -->
          <div class="relative lg:col-span-5 hidden sm:block">
            <div class="relative mx-auto max-w-lg rounded-3xl border border-border/80 bg-surface/50 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-primary/40 group overflow-hidden">
              <img
                src="/design.png"
                alt="Front-End Development Ecosystem & Roadmap"
                class="w-full h-auto rounded-2xl object-cover shadow-inner transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border/80 bg-surface/90 backdrop-blur-md px-3.5 py-2 text-xs shadow-md">
                <div class="flex items-center gap-2 font-semibold text-ink">
                  <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>19 Complete Learning Tracks</span>
                </div>
                <NuxtLink to="/diagram" class="font-bold text-primary hover:underline inline-flex items-center gap-1">
                  View Diagram <ArrowRight class="size-3" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technologies & Frameworks -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="technologies-heading">
      <Reveal>
        <div class="flex flex-col items-center text-center">
          <SectionHeading
            id="technologies-heading"
            eyebrow="The curriculum"
            title="Complete Front-End Learning Tracks"
            description="Master the fundamentals first, then branch into specialized frontend frameworks, full-stack meta-frameworks, and CSS toolkits."
            align="center"
          />

          <!-- Track Tabs -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-surface/80 p-1.5 backdrop-blur-sm">
            <button
              v-for="tab in trackTabs"
              :key="tab.id"
              type="button"
              class="rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200"
              :class="selectedTrack === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:bg-surface-2 hover:text-ink'"
              @click="selectedTrack = tab.id as any"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </Reveal>

      <!-- Grouped Track Sections -->
      <div class="mt-14 space-y-16">
        <div v-for="section in trackSections" :key="section.id" class="space-y-6">
          <Reveal>
            <div class="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-primary">{{ section.eyebrow }}</span>
                <h3 class="mt-1 font-display text-2xl font-bold tracking-tight text-ink">{{ section.title }}</h3>
                <p class="mt-1 text-sm text-muted">{{ section.description }}</p>
              </div>
              <span class="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                {{ section.technologies.length }} {{ section.technologies.length === 1 ? 'Track' : 'Tracks' }}
              </span>
            </div>
          </Reveal>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Reveal v-for="tech in section.technologies" :key="tech.slug" class="h-full">
              <div class="h-full">
                <TechCard
                  :technology="tech"
                  :percent="techPercent(tech.slug)"
                  :lesson-count="lessons.filter(l => l.technology === tech.slug).length"
                  :total-minutes="techMinutes(tech.slug) || undefined"
                />
              </div>
            </Reveal>
          </div>
        </div>
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
