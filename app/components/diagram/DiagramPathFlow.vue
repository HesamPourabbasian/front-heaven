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
    <!-- Desktop Connected Flow View -->
    <div class="hidden lg:block relative">
      <!-- Background Connecting Spine Effect -->
      <div class="absolute left-1/2 top-12 bottom-12 w-1 -translate-x-1/2 bg-gradient-to-b from-sky-500 via-primary to-pink-500 opacity-20 rounded-full pointer-events-none" />

      <div class="grid grid-cols-2 gap-x-16 gap-y-10 relative">
        <template v-for="(node, i) in stages" :key="node.id">
          <!-- Left or Right Column placement based on alternating index -->
          <div
            :class="[
              'relative flex flex-col justify-center',
              i % 2 === 0 ? 'col-start-1 pr-4' : 'col-start-2 pl-4',
            ]"
          >
            <!-- Connecting Arrow / Pin to Center Spine -->
            <div
              :class="[
                'absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10',
                i % 2 === 0 ? '-right-12 left-auto' : '-left-12 right-auto',
              ]"
            >
              <div
                class="size-7 rounded-full border-2 border-surface flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                :style="{ backgroundColor: node.color }"
              >
                {{ node.stepNumber }}
              </div>
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
        </template>
      </div>
    </div>

    <!-- Mobile / Tablet Connected Vertical Spine -->
    <div class="lg:hidden relative pl-8 sm:pl-10 space-y-6">
      <!-- Vertical Continuous Line -->
      <div
        class="absolute left-3.5 sm:left-4.5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-sky-500 via-primary to-pink-500 opacity-30 rounded-full"
      />

      <div
        v-for="(node, i) in stages"
        :key="node.id"
        class="relative"
      >
        <!-- Spine Node Bullet Pin -->
        <div
          class="absolute -left-8 sm:-left-10 top-6 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-surface font-mono text-[10px] font-bold text-white shadow-sm"
          :style="{ backgroundColor: node.color }"
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
