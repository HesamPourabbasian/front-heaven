<script setup lang="ts">
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  HelpCircle,
  Lightbulb,
  Network,
  Rocket,
} from 'lucide-vue-next'
import { DIAGRAM_STAGES, ROADMAP_FAQ } from '~/data/diagramData'
import type { Difficulty } from '~/types/content'
import type { DiagramCategory, DiagramNode } from '~/types/diagram'

useSeoMeta({
  title: 'Front-End Learning Diagram & Step-by-Step Architecture — Front-Heaven',
  description: 'Interactive visual front-end learning roadmap. Understand where to start, what to learn next, framework relationships, and how to progress from beginner to job-ready software engineer.',
  ogTitle: 'Front-End Development Diagram — Front-Heaven',
  ogDescription: 'Step-by-step interactive visual diagram for learning modern front-end development.',
  ogType: 'website',
  ogUrl: 'https://front-heaven.dev/diagram',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://front-heaven.dev/diagram' }],
})

const stages = ref<DiagramNode[]>(DIAGRAM_STAGES)
const selectedNode = ref<DiagramNode | null>(null)
const isModalOpen = ref(false)

const activeCategory = ref<DiagramCategory | 'all'>('all')
const activeDifficulty = ref<Difficulty | 'all'>('all')
const searchQuery = ref('')
const viewMode = ref<'path' | 'grid'>('path')

const filteredStages = computed(() => {
  return stages.value.filter((stage) => {
    // Category filter
    if (activeCategory.value !== 'all' && stage.category !== activeCategory.value) {
      return false
    }

    // Difficulty filter
    if (activeDifficulty.value !== 'all' && stage.difficulty !== activeDifficulty.value) {
      return false
    }

    // Search query filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = stage.title.toLowerCase().includes(q)
      const matchDesc = stage.description.toLowerCase().includes(q)
      const matchTopics = stage.topics.some(t => t.name.toLowerCase().includes(q))
      const matchProjects = stage.practiceProjects.some(p => p.title.toLowerCase().includes(q))
      return matchTitle || matchDesc || matchTopics || matchProjects
    }

    return true
  })
})

function openNodeDetails(node: DiagramNode) {
  selectedNode.value = node
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleNavigateNode(nodeId: string) {
  const target = stages.value.find(s => s.id === nodeId)
  if (target) {
    selectedNode.value = target
  }
}
</script>

<template>
  <div class="relative overflow-clip">
    <!-- Ambient Background Glows -->
    <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/10 blur-3xl" />
    <div class="pointer-events-none absolute top-1/3 -right-20 size-80 rounded-full bg-accent/10 blur-3xl" />

    <div class="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16 lg:px-8">
      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-muted shadow-xs">
          <Network class="size-3.5 text-primary" aria-hidden="true" />
          Interactive Learning Diagram
        </div>

        <h1 class="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
          The Front-End <span class="gradient-text">Learning Diagram</span>
        </h1>

        <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          A visual, step-by-step roadmap from absolute zero to professional frontend engineer. Understand relationships, master prerequisites, and build real-world software.
        </p>
      </div>

      <!-- Controls & Filter Bar -->
      <div class="mt-12 max-w-5xl mx-auto">
        <DiagramSummaryBar
          v-model:active-category="activeCategory"
          v-model:active-difficulty="activeDifficulty"
          v-model:search-query="searchQuery"
          v-model:view-mode="viewMode"
          :total-stages="stages.length"
          :filtered-count="filteredStages.length"
        />
      </div>

      <!-- Main Diagram Display -->
      <div class="mt-10 max-w-5xl mx-auto">
        <!-- 1. Step-by-Step Connected Flow View (Spine) -->
        <div v-if="viewMode === 'path'">
          <DiagramPathFlow
            :stages="filteredStages"
            :selected-node="selectedNode"
            @select="openNodeDetails"
          />
        </div>

        <!-- 2. Categorized Grid View Mode -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <DiagramNodeCard
            v-for="(node, i) in filteredStages"
            :key="node.id"
            :node="node"
            :is-active="selectedNode?.id === node.id"
            :index="i"
            :total="filteredStages.length"
            @select="openNodeDetails"
          />
        </div>

        <!-- Empty state when search/filter has no matches -->
        <div
          v-if="filteredStages.length === 0"
          class="rounded-3xl border border-dashed border-border p-12 text-center"
        >
          <Compass class="mx-auto size-10 text-muted" />
          <h3 class="mt-4 font-display text-lg font-bold text-ink">
            No roadmap stages found
          </h3>
          <p class="mt-1 text-sm text-muted">
            No stages match your selected filters. Try clearing your search or category filter.
          </p>
          <UiButton
            variant="secondary"
            size="sm"
            class="mt-4"
            @click="searchQuery = ''; activeCategory = 'all'; activeDifficulty = 'all'"
          >
            Reset all filters
          </UiButton>
        </div>
      </div>

      <!-- Guided FAQ & Beginner Compass -->
      <div class="mt-24 max-w-4xl mx-auto border-t border-border pt-16">
        <div class="text-center max-w-xl mx-auto mb-10">
          <p class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <HelpCircle class="size-3.5" />
            Beginner's Guide & Compass
          </p>
          <h2 class="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p class="mt-2 text-sm text-muted">
            Clear answers to common questions about starting out, choosing frameworks, and landing a job.
          </p>
        </div>

        <UiAccordion multiple class="shadow-sm">
          <UiAccordionItem
            v-for="(faq, i) in ROADMAP_FAQ"
            :key="i"
            :value="`faq-${i}`"
            :title="faq.question"
            :default-open="i === 0"
          >
            <p class="text-ink leading-relaxed">
              {{ faq.answer }}
            </p>
          </UiAccordionItem>
        </UiAccordion>
      </div>

      <!-- Bottom Call to Action Banner -->
      <div class="mt-20 max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-surface to-accent/10 p-8 sm:p-12 text-center shadow-lg">
        <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
          <Rocket class="size-7" />
        </div>
        <h2 class="mt-5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Ready to Start Your Journey?
        </h2>
        <p class="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Begin with Web Fundamentals & HTTP or explore all structured lesson tracks available for free on Front-Heaven.
        </p>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <UiButton to="/learn/http-and-apis" variant="primary" size="lg">
            Start Stage 1: Web Fundamentals
            <ArrowRight class="size-4" />
          </UiButton>
          <UiButton to="/roadmap" variant="secondary" size="lg">
            <Compass class="size-4" />
            View Full Curriculum
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Interactive Stage Details Slide-Over / Modal -->
    <DiagramDetailModal
      :node="selectedNode"
      :open="isModalOpen"
      @close="closeModal"
      @navigate-node="handleNavigateNode"
    />
  </div>
</template>
