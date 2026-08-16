<script setup lang="ts">
import { ArrowDown, ArrowRight, Check, Compass, Sparkles } from 'lucide-vue-next'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  stages: DiagramNode[]
  selectedNode: DiagramNode | null
}>()

const emit = defineEmits<{
  select: [node: DiagramNode]
}>()
</script>

<template>
  <div class="relative w-full">
    <!-- Desktop Connected Zig-Zag Flow (Alternating rows with central spine) -->
    <div class="hidden lg:block relative py-6">
      <!-- Central Continuous Spine Line -->
      <div class="absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-sky-500 via-primary to-pink-500 opacity-25 rounded-full pointer-events-none" />

      <div class="space-y-12 relative">
        <div
          v-for="(node, i) in stages"
          :key="node.id"
          class="relative grid grid-cols-2 items-center"
        >
          <!-- Center Spine Step Pin Marker -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
            <div
              class="flex size-10 items-center justify-center rounded-full border-4 border-surface font-mono text-xs font-bold text-white shadow-lg transition-transform duration-300 hover:scale-110"
              :style="{
                backgroundColor: node.color,
                boxShadow: `0 0 16px -2px ${node.color}66`,
              }"
            >
              {{ node.stepNumber }}
            </div>
          </div>

          <!-- Left Column Card (when i is even) -->
          <div
            v-if="i % 2 === 0"
            class="col-start-1 pr-14 relative"
          >
            <!-- Horizontal connector branch to center pin -->
            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-0.5 pointer-events-none"
              :style="{
                background: `linear-gradient(to right, color-mix(in srgb, ${node.color} 30%, var(--border)), ${node.color})`,
              }"
            />
            <DiagramNodeCard
              :node="node"
              :is-active="selectedNode?.id === node.id"
              :index="i"
              :total="stages.length"
              @select="emit('select', $event)"
            />
          </div>

          <!-- Right Column Spacer / Context Card (when i is even) -->
          <div
            v-if="i % 2 === 0"
            class="col-start-2 pl-14 hidden lg:flex items-center text-xs text-muted"
          >
            <div class="rounded-2xl border border-dashed border-border/80 bg-surface/50 p-4 max-w-sm shadow-xs">
              <span class="font-semibold text-primary uppercase tracking-wider text-[10px]">What Unlocks Next</span>
              <p class="mt-1 text-ink font-medium">{{ node.nextStep.title }}</p>
              <p class="mt-0.5 text-muted leading-relaxed text-[11px]">{{ node.nextStep.reason }}</p>
            </div>
          </div>

          <!-- Left Column Spacer / Context Card (when i is odd) -->
          <div
            v-if="i % 2 !== 0"
            class="col-start-1 pr-14 hidden lg:flex items-center justify-end text-xs text-muted"
          >
            <div class="rounded-2xl border border-dashed border-border/80 bg-surface/50 p-4 max-w-sm text-right shadow-xs">
              <span class="font-semibold text-primary uppercase tracking-wider text-[10px]">Required Prerequisite</span>
              <p class="mt-1 text-ink font-medium">{{ node.prerequisites[0]?.title ?? 'Previous Stage' }}</p>
              <p class="mt-0.5 text-muted leading-relaxed text-[11px]">{{ node.prerequisites[0]?.reason ?? 'Builds on foundation' }}</p>
            </div>
          </div>

          <!-- Right Column Card (when i is odd) -->
          <div
            v-if="i % 2 !== 0"
            class="col-start-2 pl-14 relative"
          >
            <!-- Horizontal connector branch to center pin -->
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-0.5 pointer-events-none"
              :style="{
                background: `linear-gradient(to left, color-mix(in srgb, ${node.color} 30%, var(--border)), ${node.color})`,
              }"
            />
            <DiagramNodeCard
              :node="node"
              :is-active="selectedNode?.id === node.id"
              :index="i"
              :total="stages.length"
              @select="emit('select', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile / Tablet Connected Vertical Spine -->
    <div class="lg:hidden relative pl-12 sm:pl-14 space-y-6 py-4">
      <!-- Vertical Continuous Line -->
      <div
        class="absolute left-4 sm:left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-sky-500 via-primary to-pink-500 opacity-30 rounded-full"
      />

      <div
        v-for="(node, i) in stages"
        :key="node.id"
        class="relative"
      >
        <!-- Spine Node Bullet Pin (perfectly centered on line) -->
        <div
          class="absolute -left-8 sm:-left-9 top-6 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-surface font-mono text-xs font-bold text-white shadow-md z-10"
          :style="{
            backgroundColor: node.color,
            boxShadow: `0 0 12px -2px ${node.color}66`,
          }"
        >
          {{ node.stepNumber }}
        </div>

        <!-- Stage Card -->
        <DiagramNodeCard
          :node="node"
          :is-active="selectedNode?.id === node.id"
          :index="i"
          :total="stages.length"
          @select="emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>
