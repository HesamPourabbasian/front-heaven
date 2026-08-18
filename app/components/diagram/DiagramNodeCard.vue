<script setup lang="ts">
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Lock,
} from 'lucide-vue-next'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  node: DiagramNode
  isActive?: boolean
  index: number
  total: number
}>()

const emit = defineEmits<{
  select: [node: DiagramNode]
}>()

const { lessons } = useSiteContent()
const { isCompleted } = useProgress()

const nodeLessons = computed(() => {
  if (!props.node.trackSlug) return []
  return lessons.value.filter(l => l.technology === props.node.trackSlug)
})

const completedCount = computed(() => {
  return nodeLessons.value.filter(l => isCompleted(l.path)).length
})

const progressPercent = computed(() => {
  if (nodeLessons.value.length === 0) return 0
  return Math.round((completedCount.value / nodeLessons.value.length) * 100)
})

const progressStatus = computed(() => {
  if (nodeLessons.value.length === 0) return 'not-started'
  if (progressPercent.value === 100) return 'completed'
  if (progressPercent.value > 0) return 'in-progress'
  return 'not-started'
})

const difficultyVariant = computed(() => {
  switch (props.node.difficulty) {
    case 'beginner':
      return 'beginner'
    case 'intermediate':
      return 'intermediate'
    case 'advanced':
      return 'advanced'
    default:
      return 'default'
  }
})
</script>

<template>
  <div
    role="button"
    tabindex="0"
    :aria-label="`Stage ${node.stepNumber}: ${node.title}`"
    :class="[
      'group relative flex flex-col rounded-2xl border transition-all duration-300 text-left outline-none cursor-pointer h-full justify-between w-full min-w-0',
      isActive
        ? 'border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/20 -translate-y-1 bg-surface'
        : 'border-border bg-surface hover:border-border-strong hover:shadow-lg hover:-translate-y-0.5',
    ]"
    @click="emit('select', node)"
    @keydown.enter="emit('select', node)"
    @keydown.space.prevent="emit('select', node)"
  >
    <!-- Top step indicator strip -->
    <div class="flex items-center justify-between border-b border-border/60 px-4 sm:px-5 py-2.5 sm:py-3 gap-2">
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span
          class="flex size-5 sm:size-6 items-center justify-center rounded-md font-mono text-[11px] sm:text-xs font-bold text-white shadow-sm shrink-0"
          :style="{ backgroundColor: node.color }"
        >
          {{ String(node.stepNumber).padStart(2, '0') }}
        </span>
        <span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted whitespace-nowrap">
          Stage {{ node.stepNumber }}
        </span>
      </div>

      <!-- Status Indicator Pill -->
      <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <span
          v-if="progressStatus === 'completed'"
          class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 whitespace-nowrap"
        >
          <Check class="size-2.5 sm:size-3" />
          Done
        </span>
        <span
          v-else-if="progressStatus === 'in-progress'"
          class="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-sky-600 dark:text-sky-400 font-mono whitespace-nowrap"
        >
          {{ progressPercent }}%
        </span>
        <UiBadge :variant="difficultyVariant" class="capitalize text-[9px] sm:text-[10px] px-1.5 py-0.5">
          {{ node.difficulty }}
        </UiBadge>
      </div>
    </div>

    <!-- Main Card Body -->
    <div class="flex flex-1 flex-col p-4 sm:p-5 min-w-0">
      <div class="flex items-start gap-3 sm:gap-3.5 min-w-0">
        <!-- Logo / Icon Tile -->
        <TechIcon :icon="node.icon" :color="node.color" size="md" class="shrink-0" />

        <!-- Title & Subtitle -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <h4 class="font-display text-sm sm:text-base font-bold leading-tight text-ink group-hover:text-primary transition-colors break-words">
              {{ node.title }}
            </h4>
            <span
              v-if="node.parentFramework"
              class="rounded bg-surface-3 px-1.5 py-0.2 text-[9px] font-mono text-muted uppercase shrink-0"
            >
              {{ node.parentFramework }}
            </span>
          </div>
          <p class="mt-0.5 text-[11px] sm:text-xs text-muted line-clamp-1">
            {{ node.subtitle }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <p class="mt-2.5 sm:mt-3 text-xs leading-relaxed text-ink-soft line-clamp-2 min-h-[2rem]">
        {{ node.description }}
      </p>

      <!-- Key Topics Preview Tags -->
      <div class="mt-3 sm:mt-3.5 flex flex-wrap gap-1 sm:gap-1.5">
        <span
          v-for="topic in node.topics.slice(0, 3)"
          :key="topic.name"
          class="inline-flex items-center rounded-md bg-surface-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted transition-colors group-hover:bg-surface-3 group-hover:text-ink-soft"
        >
          {{ topic.name }}
        </span>
        <span
          v-if="node.topics.length > 3"
          class="inline-flex items-center rounded-md bg-surface-2/60 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-muted"
        >
          +{{ node.topics.length - 3 }}
        </span>
      </div>

      <!-- Card Footer info -->
      <div class="mt-auto pt-3.5 sm:pt-4 flex items-center justify-between border-t border-border/50 text-[11px] sm:text-xs text-muted gap-2">
        <span class="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] truncate">
          <Clock class="size-3 text-muted shrink-0" />
          {{ nodeLessons.length > 0 ? `${nodeLessons.length} lessons · ` : '' }}{{ node.estimatedWeeks }}
        </span>

        <span class="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
          Explore
          <ArrowRight class="size-3 sm:size-3.5" />
        </span>
      </div>
    </div>
  </div>
</template>
