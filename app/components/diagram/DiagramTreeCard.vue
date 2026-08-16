<script setup lang="ts">
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-vue-next'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  node: DiagramNode
  isActive: boolean
  progress: {
    percent: number
    completedCount: number
    totalCount: number
    status: 'completed' | 'in-progress' | 'not-started'
  }
  isRecommended?: boolean
}>()

const emit = defineEmits<{
  select: [node: DiagramNode]
}>()
</script>

<template>
  <button
    type="button"
    class="group relative flex w-full flex-col justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer select-none"
    :class="[
      isActive
        ? 'border-primary ring-2 ring-primary/20 bg-surface shadow-md'
        : 'border-border/80 bg-surface hover:border-border-strong hover:bg-surface-2/90 hover:shadow-sm',
      isRecommended ? 'border-l-4 border-l-primary' : '',
    ]"
    @click="emit('select', node)"
  >
    <div>
      <div class="flex items-start justify-between gap-2">
        <TechIcon :icon="node.icon" :color="node.color" size="sm" />

        <!-- Status & Step Badges -->
        <div class="flex items-center gap-1.5">
          <!-- Progress Status Badge -->
          <span
            v-if="progress.status === 'completed'"
            class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
          >
            <Check class="size-2.5" />
            Done
          </span>
          <span
            v-else-if="progress.status === 'in-progress'"
            class="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-[9px] font-bold text-sky-600 dark:text-sky-400 font-mono"
          >
            {{ progress.percent }}%
          </span>
          <span
            v-else
            class="rounded-full bg-surface-3 px-2 py-0.5 font-mono text-[9px] font-semibold text-muted"
          >
            Step {{ node.stepNumber }}
          </span>
        </div>
      </div>

      <div class="mt-2.5">
        <h4 class="font-display text-sm font-bold text-ink group-hover:text-primary transition-colors line-clamp-1">
          {{ node.title }}
        </h4>
        <p class="mt-0.5 text-[11px] text-muted line-clamp-1">
          {{ node.subtitle }}
        </p>
      </div>
    </div>

    <!-- Progress Line or Prerequisites count -->
    <div class="mt-3 border-t border-border/50 pt-2 flex items-center justify-between text-[10px] text-muted">
      <span class="font-mono">
        {{ progress.totalCount > 0 ? `${progress.completedCount}/${progress.totalCount} lessons` : `${node.estimatedWeeks}` }}
      </span>

      <span class="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
        Explore
        <ArrowRight class="size-3" />
      </span>
    </div>
  </button>
</template>
