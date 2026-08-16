<script setup lang="ts">
import {
  ArrowRight,
  Atom,
  Braces,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  FileCode,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Palette,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
import type { TechnologySummary } from '~/types/content'

const { technologies, lessons, sequence } = useSiteContent()
const { completed, isCompleted } = useProgress()

const activeTab = ref<'pathfinder' | 'sandbox' | 'quiz'>('pathfinder')

// --- 1. Career Pathfinder State ---
interface CareerPath {
  id: string
  title: string
  subtitle: string
  badge: string
  color: string
  icon: any
  techSlugs: string[]
  description: string
  primaryRoute: string
}

const careerPaths: CareerPath[] = [
  {
    id: 'core-mastery',
    title: 'Web Platform Core',
    subtitle: 'HTML5, Modern CSS & JavaScript ES6+',
    badge: 'Beginner to Intermediate',
    color: '#0ea5e9',
    icon: FileCode,
    techSlugs: ['html', 'css', 'javascript', 'responsive-design'],
    description: 'Master the fundamental triad of the web. Build pixel-perfect, responsive websites without needing frameworks.',
    primaryRoute: '/learn/html',
  },
  {
    id: 'react-engineer',
    title: 'React & Next.js Ecosystem',
    subtitle: 'Component architecture & Full-Stack SSR',
    badge: 'High Industry Demand',
    color: '#06b6d4',
    icon: Atom,
    techSlugs: ['javascript', 'typescript', 'react', 'nextjs', 'tailwindcss'],
    description: 'Master declarative UI, React hooks, state management, Next.js Server Components (RSC), and Tailwind utility styling.',
    primaryRoute: '/learn/react',
  },
  {
    id: 'vue-engineer',
    title: 'Vue & Nuxt Specialist',
    subtitle: 'Composition API, Reactivity & Nuxt 4',
    badge: 'Fast & Intuitive DX',
    color: '#10b981',
    icon: Cpu,
    techSlugs: ['javascript', 'typescript', 'vue', 'nuxtjs', 'tailwindcss'],
    description: 'Build robust single-page and universal SSR applications with Vue 3 Composition API, reactive stores, and Nuxt Nitro engine.',
    primaryRoute: '/learn/vue',
  },
  {
    id: 'full-stack-frontend',
    title: 'Full-Stack Front-End Engineer',
    subtitle: 'From fundamentals to enterprise architecture',
    badge: 'Comprehensive Mastery',
    color: '#8b5cf6',
    icon: Sparkles,
    techSlugs: ['html', 'css', 'javascript', 'typescript', 'git', 'responsive-design', 'http-and-apis', 'accessibility', 'react', 'vue', 'nextjs', 'nuxtjs', 'tailwindcss'],
    description: 'The complete frontend mastery roadmap: typing, networking, accessibility, multiple framework paradigms, and production tooling.',
    primaryRoute: '/roadmap',
  },
]

const selectedPathId = ref<string>('core-mastery')
const selectedPath = computed(() => careerPaths.find(p => p.id === selectedPathId.value) ?? careerPaths[0]!)

const selectedPathStats = computed(() => {
  const pathTechs = technologies.value.filter(t => selectedPath.value.techSlugs.includes(t.slug))
  const pathLessons = lessons.value.filter(l => selectedPath.value.techSlugs.includes(l.technology))
  const totalMinutes = pathLessons.reduce((sum, l) => sum + l.estimatedMinutes, 0)
  const completedLessons = pathLessons.filter(l => isCompleted(l.path)).length
  const percent = pathLessons.length > 0 ? Math.round((completedLessons / pathLessons.length) * 100) : 0

  return {
    technologies: pathTechs,
    lessonCount: pathLessons.length,
    estimatedHours: Math.max(1, Math.round(totalMinutes / 60)),
    completedLessons,
    percent,
  }
})

// --- 2. Live Sandbox State ---
interface SandboxSnippet {
  id: string
  title: string
  category: string
  codeHtml: string
  codeCss: string
  codeJs: string
  buttonText: string
  accentColor: string
}

const sandboxPresets: SandboxSnippet[] = [
  {
    id: 'reactive-card',
    title: 'Glassmorphic Interactive Card',
    category: 'CSS & Modern Reactivity',
    codeHtml: `<div class="glass-card">
  <div class="badge">PRO</div>
  <h3>Front-End Mastery</h3>
  <p>Learn once, build anything on the web.</p>
  <button id="counterBtn" class="btn">
    Clapped <span id="clapCount">0</span> times ✨
  </button>
</div>`,
    codeCss: `.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 1.5rem;
}`,
    codeJs: `const btn = document.querySelector('#counterBtn');
const count = document.querySelector('#clapCount');
let claps = 0;
btn.addEventListener('click', () => {
  claps++;
  count.textContent = claps;
});`,
    buttonText: 'Clap for Front-Heaven ✨',
    accentColor: '#0ea5e9',
  },
  {
    id: 'theme-toggle',
    title: 'Reactive State & Transitions',
    category: 'DOM Events & Animation',
    codeHtml: `<div class="interactive-switch">
  <span class="label">Live Mode: Active</span>
  <div class="pill-indicator"></div>
</div>`,
    codeCss: `.pill-indicator {
  width: 48px;
  height: 24px;
  border-radius: 9999px;
  background: #10b981;
  transition: all 0.3s ease;
}`,
    codeJs: `// Instant reactive updates with zero build step`,
    buttonText: 'Toggle Active State ⚡',
    accentColor: '#10b981',
  },
]

const selectedPresetIndex = ref(0)
const selectedPreset = computed(() => sandboxPresets[selectedPresetIndex.value]!)
const liveClapCount = ref(12)
const liveIsToggled = ref(false)

function handleSandboxClick() {
  if (selectedPreset.value.id === 'reactive-card') {
    liveClapCount.value++
  }
  else {
    liveIsToggled.value = !liveIsToggled.value
  }
}

// --- 3. Daily Quick Quiz State ---
const quizQuestion = {
  question: 'Which CSS property allows hardware-accelerated 60 FPS animations without triggering layout reflow?',
  options: [
    { text: 'width and height', isCorrect: false },
    { text: 'transform and opacity', isCorrect: true },
    { text: 'top and left', isCorrect: false },
    { text: 'margin and padding', isCorrect: false },
  ],
  explanation: 'Properties like transform and opacity are handled directly on the GPU compositor thread, skipping the expensive Style Recalculation, Layout (reflow), and Paint steps!',
  relatedLesson: '/learn/css/css-performance',
}

const selectedOption = ref<number | null>(null)
const answered = ref(false)

function selectQuizOption(index: number) {
  if (answered.value) return
  selectedOption.value = index
  answered.value = true
}

function resetQuiz() {
  selectedOption.value = null
  answered.value = false
}
</script>

<template>
  <div class="animate-fade-up mt-14" style="animation-delay: 280ms">
    <div class="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface/90 shadow-2xl shadow-primary/5 backdrop-blur-xl">
      <!-- Top Navigation Tabs -->
      <div class="flex flex-wrap items-center justify-between border-b border-border bg-surface-2/60 px-4 py-2.5 sm:px-6">
        <div class="flex items-center gap-1.5 py-1">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200"
            :class="activeTab === 'pathfinder'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:bg-surface hover:text-ink'"
            @click="activeTab = 'pathfinder'"
          >
            <Compass class="size-3.5" aria-hidden="true" />
            <span>Pathfinder</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200"
            :class="activeTab === 'sandbox'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:bg-surface hover:text-ink'"
            @click="activeTab = 'sandbox'"
          >
            <Code2 class="size-3.5" aria-hidden="true" />
            <span>Live Lab</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200"
            :class="activeTab === 'quiz'
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:bg-surface hover:text-ink'"
            @click="activeTab = 'quiz'"
          >
            <HelpCircle class="size-3.5" aria-hidden="true" />
            <span>Daily Challenge</span>
          </button>
        </div>

        <div class="hidden items-center gap-2 text-[11px] font-medium text-muted sm:flex">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          Interactive Studio
        </div>
      </div>

      <!-- Tab 1: Pathfinder (Career Path Simulator) -->
      <div v-if="activeTab === 'pathfinder'" class="p-5 sm:p-7">
        <div class="grid gap-6 lg:grid-cols-12">
          <!-- Left: Path Selection Pills -->
          <div class="space-y-2.5 lg:col-span-5">
            <p class="text-xs font-bold uppercase tracking-wider text-muted">Select Your Learning Goal</p>
            <div class="space-y-2">
              <button
                v-for="path in careerPaths"
                :key="path.id"
                type="button"
                class="group flex w-full flex-col rounded-2xl border p-3.5 text-left transition-all duration-200"
                :class="selectedPathId === path.id
                  ? 'border-primary/50 bg-primary/10 shadow-sm'
                  : 'border-border bg-surface/50 hover:border-border-strong hover:bg-surface-2'"
                @click="selectedPathId = path.id"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="flex size-7 items-center justify-center rounded-lg text-white"
                      :style="{ background: path.color }"
                      aria-hidden="true"
                    >
                      <component :is="path.icon" class="size-4" />
                    </span>
                    <span class="font-display text-sm font-bold text-ink">{{ path.title }}</span>
                  </div>
                  <span
                    v-if="selectedPathId === path.id"
                    class="size-2 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                </div>
                <span class="mt-1.5 text-xs text-muted">{{ path.subtitle }}</span>
              </button>
            </div>
          </div>

          <!-- Right: Dynamic Path Roadmap Preview -->
          <div class="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-2/40 p-5 lg:col-span-7">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span
                  class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  :style="{ background: selectedPath.color }"
                >
                  {{ selectedPath.badge }}
                </span>
                <span class="font-mono text-xs text-muted">
                  {{ selectedPathStats.lessonCount }} lessons · ~{{ selectedPathStats.estimatedHours }} hours
                </span>
              </div>

              <h4 class="mt-3 font-display text-lg font-bold text-ink">
                {{ selectedPath.title }}
              </h4>
              <p class="mt-1 text-xs leading-relaxed text-muted">
                {{ selectedPath.description }}
              </p>

              <!-- Sequence Milestones -->
              <div class="mt-5">
                <p class="text-[11px] font-bold uppercase tracking-wider text-muted">Milestone Technologies</p>
                <div class="mt-2.5 flex flex-wrap items-center gap-2">
                  <span
                    v-for="tech in selectedPathStats.technologies"
                    :key="tech.slug"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink"
                  >
                    <TechIcon :icon="tech.icon" :color="tech.color" size="sm" class="!size-5 !rounded-md text-[10px]" />
                    <span>{{ tech.title }}</span>
                  </span>
                </div>
              </div>

              <!-- Progress bar if user has completed lessons -->
              <div v-if="selectedPathStats.completedLessons > 0" class="mt-5 space-y-1.5">
                <div class="flex items-center justify-between text-xs text-muted">
                  <span>Your Progress</span>
                  <span class="font-mono font-semibold text-primary">{{ selectedPathStats.percent }}%</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-surface-3">
                  <div
                    class="h-full rounded-full bg-primary transition-all duration-500"
                    :style="{ width: `${selectedPathStats.percent}%` }"
                  />
                </div>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between border-t border-border pt-4">
              <NuxtLink
                :to="selectedPath.primaryRoute"
                class="btn-primary group w-full justify-center px-5 py-2.5 text-xs font-bold sm:w-auto"
              >
                <span>Launch This Learning Path</span>
                <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Live Code Lab Sandbox -->
      <div v-else-if="activeTab === 'sandbox'" class="p-5 sm:p-7">
        <div class="grid gap-6 lg:grid-cols-12">
          <!-- Left: Code snippet preview -->
          <div class="overflow-hidden rounded-2xl border border-border bg-surface-3/60 font-mono text-xs lg:col-span-7">
            <div class="flex items-center justify-between border-b border-border/80 bg-surface-2 px-4 py-2">
              <div class="flex items-center gap-1.5">
                <span class="size-2.5 rounded-full bg-red-500/80" />
                <span class="size-2.5 rounded-full bg-amber-500/80" />
                <span class="size-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span class="text-[11px] text-muted">{{ selectedPreset.title }}</span>
            </div>

            <div class="p-4 space-y-3">
              <div>
                <span class="text-primary font-semibold">// HTML Markup</span>
                <pre class="mt-1 overflow-x-auto text-[11px] text-ink-soft leading-relaxed"><code>{{ selectedPreset.codeHtml }}</code></pre>
              </div>
              <div class="border-t border-border/50 pt-2">
                <span class="text-emerald-500 font-semibold">/* CSS Styling */</span>
                <pre class="mt-1 overflow-x-auto text-[11px] text-ink-soft leading-relaxed"><code>{{ selectedPreset.codeCss }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Right: Live Render Box -->
          <div class="flex flex-col justify-between rounded-2xl border border-border bg-surface-2/40 p-5 lg:col-span-5">
            <div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <Play class="size-3" /> Live Render Preview
              </span>
              <h4 class="mt-3 font-display text-base font-bold text-ink">{{ selectedPreset.category }}</h4>
              <p class="mt-1 text-xs text-muted">Test interactive reactive state in real time below:</p>

              <!-- Interactive Demo Widget -->
              <div class="mt-5 rounded-2xl border border-border/80 bg-surface p-5 text-center shadow-inner">
                <div class="mx-auto size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <Sparkles class="size-5" />
                </div>
                <h5 class="font-display text-sm font-bold text-ink">Front-Heaven Studio</h5>
                <p class="mt-1 text-xs text-muted">Click to trigger interactive DOM mutation</p>

                <button
                  type="button"
                  class="btn-primary mt-4 w-full justify-center px-4 py-2.5 text-xs font-bold transition-transform active:scale-95"
                  :style="{ background: selectedPreset.accentColor }"
                  @click="handleSandboxClick"
                >
                  {{ selectedPreset.id === 'reactive-card' ? `Clapped ${liveClapCount} Times ✨` : (liveIsToggled ? 'Active ⚡' : 'Inactive (Click to Toggle)') }}
                </button>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
              <span>Preset:</span>
              <div class="flex gap-1.5">
                <button
                  v-for="(preset, i) in sandboxPresets"
                  :key="preset.id"
                  type="button"
                  class="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors"
                  :class="selectedPresetIndex === i ? 'bg-primary text-white' : 'bg-surface-3 text-muted hover:text-ink'"
                  @click="selectedPresetIndex = i"
                >
                  0{{ i + 1 }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Daily Front-End Quiz -->
      <div v-else class="p-5 sm:p-7">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Lightbulb class="size-3.5" /> 1-Minute Front-End Quiz
            </span>
            <button
              v-if="answered"
              type="button"
              class="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
              @click="resetQuiz"
            >
              <RotateCcw class="size-3" /> Try Again
            </button>
          </div>

          <h4 class="font-display text-base font-bold text-ink sm:text-lg">
            {{ quizQuestion.question }}
          </h4>

          <div class="grid gap-2.5 sm:grid-cols-2">
            <button
              v-for="(option, idx) in quizQuestion.options"
              :key="idx"
              type="button"
              class="flex items-center justify-between rounded-xl border p-3.5 text-left text-xs font-medium transition-all"
              :class="[
                answered && option.isCorrect
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'
                  : answered && selectedOption === idx && !option.isCorrect
                    ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300'
                    : selectedOption === idx
                      ? 'border-primary bg-primary/10 text-ink'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-2 text-ink',
              ]"
              @click="selectQuizOption(idx)"
            >
              <span>{{ option.text }}</span>
              <CheckCircle2 v-if="answered && option.isCorrect" class="size-4 text-emerald-500" />
            </button>
          </div>

          <!-- Explanation box -->
          <div v-if="answered" class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
            <p class="font-bold text-emerald-600 dark:text-emerald-400">
              {{ quizQuestion.options[selectedOption!]?.isCorrect ? '🎉 Correct!' : '💡 Explanation:' }}
            </p>
            <p class="mt-1 text-muted leading-relaxed">
              {{ quizQuestion.explanation }}
            </p>
            <div class="mt-3">
              <NuxtLink :to="quizQuestion.relatedLesson" class="text-xs font-bold text-primary hover:underline">
                Read the CSS Performance Lesson →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
