<script setup lang="ts">
import {
  ArrowRight,
  BookOpen,
  Braces,
  Briefcase,
  CheckCircle2,
  Clock,
  Code,
  FolderGit2,
  Globe,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  node: DiagramNode
  isActive?: boolean
  isCompleted?: boolean
  index: number
  total: number
}>()

const emit = defineEmits<{
  select: [node: DiagramNode]
}>()

const iconMap: Record<string, Component> = {
  globe: Globe,
  code: Code,
  palette: Palette,
  braces: Braces,
  terminal: Terminal,
  zap: Zap,
  layers: Layers,
  'shield-check': ShieldCheck,
  'folder-git': FolderGit2,
  briefcase: Briefcase,
}

const nodeIcon = computed(() => iconMap[props.node.icon] ?? Code)

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

const importanceLabel = computed(() => {
  switch (props.node.importance) {
    case 'essential':
      return 'Essential Core'
    case 'core':
      return 'Core Track'
    case 'specialization':
      return 'Specialization'
    case 'milestone':
      return 'Milestone Project'
  }
})

const cardGradientStyle = computed(() => ({
  background: `linear-gradient(135deg, color-mix(in srgb, ${props.node.color} 8%, var(--surface)) 0%, var(--surface) 100%)`,
}))

const iconTileStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.node.color} 0%, color-mix(in srgb, ${props.node.color} 60%, var(--surface)) 100%)`,
  boxShadow: `0 6px 18px -4px color-mix(in srgb, ${props.node.color} 40%, transparent)`,
}))
</script>

<template>
  <div
    role="button"
    tabindex="0"
    :aria-label="`Stage ${node.stepNumber}: ${node.title}`"
    :class="[
      'group relative flex flex-col rounded-2xl border transition-all duration-300 text-left outline-none cursor-pointer',
      isActive
        ? 'border-primary shadow-xl shadow-primary/10 ring-2 ring-primary/20 -translate-y-1'
        : 'border-border bg-surface hover:border-border-strong hover:shadow-lg hover:-translate-y-0.5',
    ]"
    :style="cardGradientStyle"
    @click="emit('select', node)"
    @keydown.enter="emit('select', node)"
    @keydown.space.prevent="emit('select', node)"
  >
    <!-- Top step indicator strip -->
    <div class="flex items-center justify-between border-b border-border/60 px-5 py-3">
      <div class="flex items-center gap-2">
        <span
          class="flex size-6 items-center justify-center rounded-md font-mono text-xs font-bold text-white shadow-sm"
          :style="{ backgroundColor: node.color }"
        >
          {{ String(node.stepNumber).padStart(2, '0') }}
        </span>
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">
          Stage {{ node.stepNumber }}
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <UiBadge :variant="difficultyVariant" class="capitalize">
          {{ node.difficulty }}
        </UiBadge>
        <span v-if="node.importance === 'essential'" class="hidden sm:inline-flex">
          <UiBadge variant="essential" class="text-[10px]">
            Essential
          </UiBadge>
        </span>
      </div>
    </div>

    <!-- Main Card Body -->
    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-start gap-3.5">
        <!-- Icon Tile -->
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-200 group-hover:scale-105"
          :style="iconTileStyle"
        >
          <component :is="nodeIcon" class="size-5.5" :stroke-width="2.2" />
        </div>

        <!-- Title & Subtitle -->
        <div class="min-w-0 flex-1">
          <h4 class="font-display text-base font-bold leading-tight text-ink group-hover:text-primary transition-colors">
            {{ node.title }}
          </h4>
          <p class="mt-0.5 text-xs text-muted line-clamp-1">
            {{ node.subtitle }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <p class="mt-3.5 text-xs leading-relaxed text-ink-soft line-clamp-2">
        {{ node.description }}
      </p>

      <!-- Key Topics Preview Tags -->
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span
          v-for="topic in node.topics.slice(0, 3)"
          :key="topic.name"
          class="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted transition-colors group-hover:bg-surface-3 group-hover:text-ink-soft"
        >
          {{ topic.name }}
        </span>
        <span
          v-if="node.topics.length > 3"
          class="inline-flex items-center rounded-md bg-surface-2/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted"
        >
          +{{ node.topics.length - 3 }} more
        </span>
      </div>

      <!-- Card Footer info -->
      <div class="mt-auto pt-4 flex items-center justify-between border-t border-border/50 text-xs text-muted">
        <span class="flex items-center gap-1">
          <Clock class="size-3 text-muted" />
          {{ node.estimatedWeeks }}
        </span>

        <span class="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
          View details
          <ArrowRight class="size-3.5" />
        </span>
      </div>
    </div>
  </div>
</template>
