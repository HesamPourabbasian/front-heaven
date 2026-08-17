<script setup lang="ts">
import {
  Compass,
  LayoutGrid,
  Search,
} from 'lucide-vue-next'
import type { Difficulty } from '~/types/content'
import type { DiagramCategory } from '~/types/diagram'

const props = defineProps<{
  activeCategory: DiagramCategory | 'all'
  activeDifficulty: Difficulty | 'all'
  searchQuery: string
  totalStages: number
  filteredCount: number
  viewMode: 'path' | 'grid'
}>()

const emit = defineEmits<{
  'update:activeCategory': [cat: DiagramCategory | 'all']
  'update:activeDifficulty': [difficulty: Difficulty | 'all']
  'update:searchQuery': [query: string]
  'update:viewMode': [mode: 'path' | 'grid']
}>()

const categoryTabs: { label: string, value: DiagramCategory | 'all' }[] = [
  { label: 'All Tracks', value: 'all' },
  { label: 'Fundamentals', value: 'fundamentals' },
  { label: 'JavaScript & TS', value: 'javascript' },
  { label: 'Frameworks', value: 'frameworks' },
  { label: 'Meta-Frameworks', value: 'meta-frameworks' },
  { label: 'CSS Frameworks', value: 'css-frameworks' },
  { label: 'Quality & Testing', value: 'tools' },
  { label: 'Projects & Career', value: 'projects' },
]

const difficultyTabs = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
] as const
</script>

<template>
  <div class="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
    <!-- Top Row: Search & View Mode Switcher -->
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
        <input
          type="text"
          :value="searchQuery"
          placeholder="Search technologies, concepts, or projects..."
          class="w-full rounded-xl border border-border bg-surface-2 pl-10 pr-4 py-2 text-xs text-ink placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none transition-colors"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
          @click="emit('update:searchQuery', '')"
        >
          Clear
        </button>
      </div>

      <!-- Right Controls: View Mode Switcher -->
      <div class="flex items-center gap-0.5 rounded-xl border border-border bg-surface-2 p-1">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
          :class="viewMode === 'path'
            ? 'bg-surface text-ink shadow-xs font-semibold'
            : 'text-muted hover:text-ink'"
          title="Step-by-Step Connected Spine View"
          @click="emit('update:viewMode', 'path')"
        >
          <Compass class="size-3.5" />
          <span>Flow</span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
          :class="viewMode === 'grid'
            ? 'bg-surface text-ink shadow-xs font-semibold'
            : 'text-muted hover:text-ink'"
          title="Category Grid View"
          @click="emit('update:viewMode', 'grid')"
        >
          <LayoutGrid class="size-3.5" />
          <span>Grid</span>
        </button>
      </div>
    </div>

    <!-- Category Tabs Filter Row -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
      <button
        v-for="tab in categoryTabs"
        :key="tab.value"
        type="button"
        class="rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none cursor-pointer"
        :class="activeCategory === tab.value
          ? 'bg-primary text-white shadow-sm'
          : 'text-muted hover:bg-surface-2 hover:text-ink'"
        @click="emit('update:activeCategory', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Filter Result Count Banner (if filtering active) -->
    <div
      v-if="searchQuery || activeCategory !== 'all' || activeDifficulty !== 'all'"
      class="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs text-muted"
    >
      <span>
        Showing <strong class="text-ink">{{ filteredCount }}</strong> of {{ totalStages }} roadmap stages
      </span>
      <button
        type="button"
        class="font-semibold text-primary hover:underline"
        @click="emit('update:activeCategory', 'all'); emit('update:activeDifficulty', 'all'); emit('update:searchQuery', '')"
      >
        Reset filters
      </button>
    </div>
  </div>
</template>
