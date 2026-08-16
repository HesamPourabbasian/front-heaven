<script setup lang="ts">
import { Filter, Layers, LayoutGrid, Network, Search, Sparkles } from 'lucide-vue-next'
import type { Difficulty } from '~/types/content'

const props = defineProps<{
  activeDifficulty: Difficulty | 'all'
  searchQuery: string
  totalStages: number
  filteredCount: number
  viewMode: 'path' | 'grid'
}>()

const emit = defineEmits<{
  'update:activeDifficulty': [difficulty: Difficulty | 'all']
  'update:searchQuery': [query: string]
  'update:viewMode': [mode: 'path' | 'grid']
}>()

const difficultyTabs = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner (1-4)', value: 'beginner' },
  { label: 'Intermediate (5-7)', value: 'intermediate' },
  { label: 'Advanced (8-10)', value: 'advanced' },
] as const
</script>

<template>
  <div class="rounded-2xl border border-border bg-surface p-4 shadow-sm">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <!-- Search Field -->
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
        <input
          type="text"
          :value="searchQuery"
          placeholder="Search stages, topics, or keywords..."
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

      <!-- Difficulty Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          v-for="tab in difficultyTabs"
          :key="tab.value"
          type="button"
          :class="[
            'rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 select-none cursor-pointer',
            activeDifficulty === tab.value
              ? 'bg-primary text-white shadow-sm'
              : 'text-muted hover:bg-surface-2 hover:text-ink',
          ]"
          @click="emit('update:activeDifficulty', tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- View Mode Switcher -->
      <div class="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-surface-2 p-1">
        <button
          type="button"
          :class="[
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer',
            viewMode === 'path'
              ? 'bg-surface text-ink shadow-xs font-semibold'
              : 'text-muted hover:text-ink',
          ]"
          aria-label="Connected Flow Path View"
          @click="emit('update:viewMode', 'path')"
        >
          <Network class="size-3.5" />
          Flow
        </button>
        <button
          type="button"
          :class="[
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer',
            viewMode === 'grid'
              ? 'bg-surface text-ink shadow-xs font-semibold'
              : 'text-muted hover:text-ink',
          ]"
          aria-label="Grid View"
          @click="emit('update:viewMode', 'grid')"
        >
          <LayoutGrid class="size-3.5" />
          Grid
        </button>
      </div>
    </div>

    <!-- Filter Result Count Banner (if filtering active) -->
    <div
      v-if="searchQuery || activeDifficulty !== 'all'"
      class="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted"
    >
      <span>
        Showing <strong class="text-ink">{{ filteredCount }}</strong> of {{ totalStages }} stages
      </span>
      <button
        type="button"
        class="font-semibold text-primary hover:underline"
        @click="emit('update:activeDifficulty', 'all'); emit('update:searchQuery', '')"
      >
        Reset filters
      </button>
    </div>
  </div>
</template>
