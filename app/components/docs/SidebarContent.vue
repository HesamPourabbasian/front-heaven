<script setup lang="ts">
import {
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Layers,
  Lock,
  Paintbrush,
  PlayCircle,
  Sparkles,
} from 'lucide-vue-next'
import type { TechnologySummary } from '~/types/content'

const props = defineProps<{
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

interface SidebarCategory {
  id: string
  title: string
  icon: any
  technologies: TechnologySummary[]
}

const categories = computed<SidebarCategory[]>(() => {
  const groups = [
    {
      id: 'core',
      title: 'Web Fundamentals',
      icon: Code2,
      technologies: available.value.filter(t => !t.track || t.track === 'core'),
    },
    {
      id: 'frontend-framework',
      title: 'Frontend Frameworks',
      icon: Layers,
      technologies: available.value.filter(t => t.track === 'frontend-framework'),
    },
    {
      id: 'meta-framework',
      title: 'Meta-Frameworks',
      icon: Cpu,
      technologies: available.value.filter(t => t.track === 'meta-framework'),
    },
    {
      id: 'css-framework',
      title: 'CSS Frameworks',
      icon: Paintbrush,
      technologies: available.value.filter(t => t.track === 'css-framework'),
    },
    {
      id: 'advanced',
      title: 'Advanced Topics',
      icon: Sparkles,
      technologies: available.value.filter(t => t.track === 'advanced'),
    },
  ]

  return groups.filter(g => g.technologies.length > 0)
})

// Track expanded state for each category
const openCategories = ref<Record<string, boolean>>({
  'core': true,
  'frontend-framework': true,
  'meta-framework': true,
  'css-framework': true,
  'advanced': true,
})

// Ensure active technology's category is always open
watch(() => props.activeTech, (tech) => {
  if (!tech) return
  const match = categories.value.find(c => c.technologies.some(t => t.slug === tech))
  if (match) {
    openCategories.value[match.id] = true
  }
}, { immediate: true })

function toggleCategory(catId: string) {
  openCategories.value[catId] = !openCategories.value[catId]
}

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
  <div class="flex min-h-0 flex-1 flex-col gap-4 p-4">
    <!-- Next/Resume Lesson Card -->
    <NuxtLink
      v-if="nextLesson"
      :to="nextLesson.path"
      class="group rounded-2xl border border-border bg-surface-2/70 p-3.5 transition-all duration-200 hover:border-primary/50 hover:bg-surface-2"
    >
      <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
        <PlayCircle class="size-3.5" aria-hidden="true" />
        Resume Learning
      </span>
      <span class="mt-1.5 block text-xs font-bold text-ink transition-colors group-hover:text-primary line-clamp-1">
        {{ nextLesson.lesson.title }}
      </span>
      <span class="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
        <Clock class="size-3" aria-hidden="true" />
        {{ nextLesson.lesson.estimatedMinutes }} min · {{ nextLesson.technology.title }}
      </span>
    </NuxtLink>

    <!-- Grouped Sidebar Navigation -->
    <nav class="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pr-1.5 [scrollbar-gutter:stable]" aria-label="Curriculum navigation">
      <div v-for="cat in categories" :key="cat.id" class="space-y-1.5">
        <!-- Category Header / Accordion Button -->
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
          @click="toggleCategory(cat.id)"
        >
          <span class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            <component :is="cat.icon" class="size-3.5 text-primary/80" aria-hidden="true" />
            <span>{{ cat.title }}</span>
          </span>
          <div class="flex items-center gap-1.5">
            <span class="rounded-full bg-surface-3 px-1.5 py-0.2 text-[9px] font-semibold text-muted">
              {{ cat.technologies.length }}
            </span>
            <ChevronDown
              class="size-3.5 text-muted transition-transform duration-200"
              :class="{ '-rotate-90': !openCategories[cat.id] }"
              aria-hidden="true"
            />
          </div>
        </button>

        <!-- Technology List for this category -->
        <div v-show="openCategories[cat.id]" class="space-y-0.5 pl-1">
          <section v-for="tech in cat.technologies" :key="tech.slug">
            <NuxtLink
              :to="technologyRoute(tech.slug)"
              class="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors"
              :class="activeTech === tech.slug
                ? 'bg-primary/10 font-semibold text-primary'
                : 'text-ink-soft hover:bg-surface-2 hover:text-ink'"
              :aria-current="activeTech === tech.slug ? 'page' : undefined"
            >
              <span class="flex min-w-0 items-center gap-2 text-xs font-medium">
                <span
                  class="size-2 shrink-0 rounded-full"
                  :style="{ background: tech.color }"
                  aria-hidden="true"
                />
                <span class="truncate">{{ tech.title }}</span>
                <span
                  v-if="tech.parentFramework"
                  class="rounded bg-surface-3 px-1 py-0.2 text-[9px] font-mono text-muted uppercase"
                >
                  {{ tech.parentFramework === 'react' ? 'React' : tech.parentFramework === 'vue' ? 'Vue' : tech.parentFramework }}
                </span>
              </span>

              <span v-if="techPercent(tech.slug) > 0" class="font-mono text-[10px] font-semibold text-muted tabular-nums">
                {{ techPercent(tech.slug) }}%
              </span>
            </NuxtLink>

            <!-- Nested Lesson List when Technology is Active -->
            <ul v-if="activeTech === tech.slug" class="mt-1 space-y-0.5 border-l border-border/80 pl-3 ml-3 py-1">
              <li v-for="lesson in techLessons(tech.slug)" :key="lesson.path">
                <NuxtLink
                  :to="lessonRoute(lesson)"
                  class="sidebar-link text-xs py-1"
                  :class="{
                    'is-active': activeLesson === lesson.slug,
                    'is-done': isCompleted(lesson.path),
                  }"
                  :aria-current="activeLesson === lesson.slug ? 'page' : undefined"
                >
                  <span class="dot size-1.5 shrink-0 rounded-full bg-border-strong" aria-hidden="true" />
                  <span class="min-w-0 flex-1 truncate">{{ lesson.title }}</span>
                  <Check v-if="isCompleted(lesson.path)" class="size-3 shrink-0 text-success" aria-hidden="true" />
                </NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <!-- Coming Soon Section -->
      <div v-if="comingSoon.length > 0" class="border-t border-border/60 pt-3">
        <p class="px-2 text-[10px] font-bold uppercase tracking-widest text-muted/70">Coming Next</p>
        <ul class="mt-1 space-y-0.5 pl-1">
          <li v-for="tech in comingSoon" :key="tech.slug">
            <span class="flex cursor-not-allowed items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted/60">
              <Lock class="size-3 shrink-0" aria-hidden="true" />
              <span class="truncate">{{ tech.title }}</span>
            </span>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Bottom Roadmap CTA -->
    <div class="border-t border-border/60 pt-2">
      <NuxtLink to="/roadmap" class="btn-secondary !w-full text-xs font-semibold py-2">
        <span>View full roadmap</span>
        <ChevronRight class="size-3.5" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>
