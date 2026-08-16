<script setup lang="ts">
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Lock,
  Minus,
  Maximize2,
  Move,
  Plus,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  stages: DiagramNode[]
  selectedNode: DiagramNode | null
  highlightRecommended?: boolean
}>()

const emit = defineEmits<{
  select: [node: DiagramNode]
}>()

const { lessons } = useSiteContent()
const { completed, isCompleted } = useProgress()

// Canvas Zoom & Pan State
const zoomLevel = ref(1)
const isFullscreen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function zoomIn() {
  zoomLevel.value = Math.min(1.4, Number((zoomLevel.value + 0.1).toFixed(1)))
}

function zoomOut() {
  zoomLevel.value = Math.max(0.7, Number((zoomLevel.value - 0.1).toFixed(1)))
}

function resetZoom() {
  zoomLevel.value = 1
}

// Node Progress Helper
function getNodeProgress(node: DiagramNode) {
  if (!node.trackSlug) {
    return { percent: 0, completedCount: 0, totalCount: 0, status: 'not-started' as const }
  }

  const nodeLessons = lessons.value.filter(l => l.technology === node.trackSlug)
  if (nodeLessons.length === 0) {
    return { percent: 0, completedCount: 0, totalCount: 0, status: 'not-started' as const }
  }

  const done = nodeLessons.filter(l => isCompleted(l.path)).length
  const percent = Math.round((done / nodeLessons.length) * 100)

  let status: 'completed' | 'in-progress' | 'not-started' = 'not-started'
  if (percent === 100) status = 'completed'
  else if (percent > 0) status = 'in-progress'

  return {
    percent,
    completedCount: done,
    totalCount: nodeLessons.length,
    status,
  }
}

// Check if a stage is on the recommended primary path
const RECOMMENDED_SLUGS = [
  'web-fundamentals',
  'html',
  'css',
  'javascript',
  'git',
  'advanced-javascript',
  'typescript',
  'react',
  'nextjs',
  'tailwindcss',
  'quality-and-testing',
  'portfolio-projects',
  'job-ready',
]

function isRecommended(nodeId: string) {
  return RECOMMENDED_SLUGS.includes(nodeId)
}

function getNode(id: string): DiagramNode | undefined {
  return props.stages.find(s => s.id === id)
}
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full rounded-3xl border border-border bg-surface/90 shadow-xl backdrop-blur-xl overflow-hidden"
    :class="{ 'fixed inset-4 z-50 rounded-2xl': isFullscreen }"
  >
    <!-- Canvas Header Toolbar -->
    <div class="flex flex-wrap items-center justify-between border-b border-border bg-surface-2/60 px-4 py-3 sm:px-6">
      <div class="flex items-center gap-3">
        <span class="flex size-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
        <span class="font-display text-sm font-bold text-ink">Interactive Roadmap Architecture</span>
        <span class="hidden sm:inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          8 Core Tiers
        </span>
      </div>

      <!-- Controls: Zoom & Toggle Recommended Path -->
      <div class="flex items-center gap-2">
        <div class="flex items-center rounded-xl border border-border bg-surface p-0.5 shadow-xs">
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink transition-colors"
            title="Zoom Out"
            @click="zoomOut"
          >
            <Minus class="size-3.5" />
          </button>
          <span class="px-2 font-mono text-[11px] font-semibold text-muted select-none">
            {{ Math.round(zoomLevel * 100) }}%
          </span>
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink transition-colors"
            title="Zoom In"
            @click="zoomIn"
          >
            <Plus class="size-3.5" />
          </button>
          <button
            type="button"
            class="flex size-7 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink transition-colors"
            title="Reset Zoom"
            @click="resetZoom"
          >
            <RotateCcw class="size-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Visual Canvas Area -->
    <div class="relative overflow-x-auto overflow-y-hidden p-6 sm:p-10 [scrollbar-gutter:stable] min-h-[700px] flex justify-center items-start">
      <div
        class="transition-transform duration-300 origin-top flex flex-col items-center gap-12 w-full max-w-4xl py-6"
        :style="{ transform: `scale(${zoomLevel})` }"
      >
        <!-- ============================================== -->
        <!-- START: TIER 1 — FUNDAMENTALS -->
        <!-- ============================================== -->
        <div class="flex flex-col items-center w-full">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <span class="size-2 rounded-full bg-sky-500" />
            Tier 1: Web Fundamentals
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <DiagramTreeCard
              v-if="getNode('web-fundamentals')"
              :node="getNode('web-fundamentals')!"
              :is-active="selectedNode?.id === 'web-fundamentals'"
              :progress="getNodeProgress(getNode('web-fundamentals')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('html')"
              :node="getNode('html')!"
              :is-active="selectedNode?.id === 'html'"
              :progress="getNodeProgress(getNode('html')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('css')"
              :node="getNode('css')!"
              :is-active="selectedNode?.id === 'css'"
              :progress="getNodeProgress(getNode('css')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />
          </div>
        </div>

        <!-- Connecting Line -->
        <div class="flex flex-col items-center text-muted/40">
          <div class="h-8 w-0.5 bg-gradient-to-b from-sky-500 to-amber-500" />
          <ChevronRight class="size-4 rotate-90 text-amber-500 -mt-1.5" />
        </div>

        <!-- ============================================== -->
        <!-- TIER 2 — JAVASCRIPT & TOOLING -->
        <!-- ============================================== -->
        <div class="flex flex-col items-center w-full">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span class="size-2 rounded-full bg-amber-500" />
            Tier 2: JavaScript & TypeScript
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <DiagramTreeCard
              v-if="getNode('javascript')"
              :node="getNode('javascript')!"
              :is-active="selectedNode?.id === 'javascript'"
              :progress="getNodeProgress(getNode('javascript')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('git')"
              :node="getNode('git')!"
              :is-active="selectedNode?.id === 'git'"
              :progress="getNodeProgress(getNode('git')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('advanced-javascript')"
              :node="getNode('advanced-javascript')!"
              :is-active="selectedNode?.id === 'advanced-javascript'"
              :progress="getNodeProgress(getNode('advanced-javascript')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('typescript')"
              :node="getNode('typescript')!"
              :is-active="selectedNode?.id === 'typescript'"
              :progress="getNodeProgress(getNode('typescript')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />
          </div>
        </div>

        <!-- Connecting Branching Line -->
        <div class="flex flex-col items-center text-muted/40">
          <div class="h-8 w-0.5 bg-gradient-to-b from-amber-500 to-primary" />
          <div class="text-[10px] font-bold uppercase tracking-widest text-primary my-1">
            Choose Your Component Framework
          </div>
          <ChevronRight class="size-4 rotate-90 text-primary -mt-1" />
        </div>

        <!-- ============================================== -->
        <!-- TIER 3 & 4 — FRONTEND & META-FRAMEWORKS -->
        <!-- ============================================== -->
        <div class="flex flex-col items-center w-full">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <span class="size-2 rounded-full bg-primary" />
            Tier 3 & 4: Frameworks & Meta-Frameworks
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <!-- React Column (React -> Next.js) -->
            <div class="flex flex-col gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">React Ecosystem</span>
              <DiagramTreeCard
                v-if="getNode('react')"
                :node="getNode('react')!"
                :is-active="selectedNode?.id === 'react'"
                :progress="getNodeProgress(getNode('react')!)"
                :is-recommended="highlightRecommended"
                @select="emit('select', $event)"
              />
              <div class="flex justify-center text-cyan-500">
                <ChevronRight class="size-4 rotate-90" />
              </div>
              <DiagramTreeCard
                v-if="getNode('nextjs')"
                :node="getNode('nextjs')!"
                :is-active="selectedNode?.id === 'nextjs'"
                :progress="getNodeProgress(getNode('nextjs')!)"
                :is-recommended="highlightRecommended"
                @select="emit('select', $event)"
              />
            </div>

            <!-- Vue Column (Vue -> Nuxt) -->
            <div class="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Vue Ecosystem</span>
              <DiagramTreeCard
                v-if="getNode('vue')"
                :node="getNode('vue')!"
                :is-active="selectedNode?.id === 'vue'"
                :progress="getNodeProgress(getNode('vue')!)"
                :is-recommended="highlightRecommended"
                @select="emit('select', $event)"
              />
              <div class="flex justify-center text-emerald-500">
                <ChevronRight class="size-4 rotate-90" />
              </div>
              <DiagramTreeCard
                v-if="getNode('nuxtjs')"
                :node="getNode('nuxtjs')!"
                :is-active="selectedNode?.id === 'nuxtjs'"
                :progress="getNodeProgress(getNode('nuxtjs')!)"
                :is-recommended="highlightRecommended"
                @select="emit('select', $event)"
              />
            </div>

            <!-- Svelte Column -->
            <div class="flex flex-col gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-3.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Svelte Ecosystem</span>
              <DiagramTreeCard
                v-if="getNode('svelte')"
                :node="getNode('svelte')!"
                :is-active="selectedNode?.id === 'svelte'"
                :progress="getNodeProgress(getNode('svelte')!)"
                :is-recommended="highlightRecommended"
                @select="emit('select', $event)"
              />
              <div class="flex justify-center text-orange-500">
                <ChevronRight class="size-4 rotate-90" />
              </div>
              <div class="rounded-xl border border-dashed border-border bg-surface p-3 text-center text-xs text-muted">
                <span class="font-bold text-ink block text-[11px]">SvelteKit</span>
                <span class="text-[10px]">SSR & Full-Stack Svelte</span>
              </div>
            </div>

            <!-- Angular Column -->
            <div class="flex flex-col gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-3.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Enterprise Angular</span>
              <DiagramTreeCard
                v-if="getNode('angular')"
                :node="getNode('angular')!"
                :is-active="selectedNode?.id === 'angular'"
                :progress="getNodeProgress(getNode('angular')!)"
                :is-recommended="highlightRecommended"
                @select="emit('select', $event)"
              />
              <div class="flex justify-center text-red-500">
                <ChevronRight class="size-4 rotate-90" />
              </div>
              <div class="rounded-xl border border-dashed border-border bg-surface p-3 text-center text-xs text-muted">
                <span class="font-bold text-ink block text-[11px]">Angular SSR</span>
                <span class="text-[10px]">Hydration & Server Routing</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Connecting Line -->
        <div class="flex flex-col items-center text-muted/40">
          <div class="h-8 w-0.5 bg-gradient-to-b from-primary to-purple-500" />
          <ChevronRight class="size-4 rotate-90 text-purple-500 -mt-1.5" />
        </div>

        <!-- ============================================== -->
        <!-- TIER 5 & 6 — CSS TOOLKITS & QUALITY -->
        <!-- ============================================== -->
        <div class="flex flex-col items-center w-full">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <span class="size-2 rounded-full bg-purple-500" />
            Tier 5 & 6: CSS Toolkits & Engineering Quality
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <DiagramTreeCard
              v-if="getNode('tailwindcss')"
              :node="getNode('tailwindcss')!"
              :is-active="selectedNode?.id === 'tailwindcss'"
              :progress="getNodeProgress(getNode('tailwindcss')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('bootstrap')"
              :node="getNode('bootstrap')!"
              :is-active="selectedNode?.id === 'bootstrap'"
              :progress="getNodeProgress(getNode('bootstrap')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('quality-and-testing')"
              :node="getNode('quality-and-testing')!"
              :is-active="selectedNode?.id === 'quality-and-testing'"
              :progress="getNodeProgress(getNode('quality-and-testing')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />
          </div>
        </div>

        <!-- Connecting Line -->
        <div class="flex flex-col items-center text-muted/40">
          <div class="h-8 w-0.5 bg-gradient-to-b from-purple-500 to-emerald-500" />
          <ChevronRight class="size-4 rotate-90 text-emerald-500 -mt-1.5" />
        </div>

        <!-- ============================================== -->
        <!-- TIER 7 & 8 — PROJECTS & CAREER READY -->
        <!-- ============================================== -->
        <div class="flex flex-col items-center w-full">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span class="size-2 rounded-full bg-emerald-500" />
            Tier 7 & 8: Projects & Job Ready
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <DiagramTreeCard
              v-if="getNode('portfolio-projects')"
              :node="getNode('portfolio-projects')!"
              :is-active="selectedNode?.id === 'portfolio-projects'"
              :progress="getNodeProgress(getNode('portfolio-projects')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />

            <DiagramTreeCard
              v-if="getNode('job-ready')"
              :node="getNode('job-ready')!"
              :is-active="selectedNode?.id === 'job-ready'"
              :progress="getNodeProgress(getNode('job-ready')!)"
              :is-recommended="highlightRecommended"
              @select="emit('select', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
