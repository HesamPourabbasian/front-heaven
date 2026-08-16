<script setup lang="ts">
import {
  ArrowLeft,
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
  Lightbulb,
  Palette,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  node: DiagramNode | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  navigateNode: [nodeId: string]
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

const nodeIcon = computed(() => (props.node ? iconMap[props.node.icon] ?? Code : Code))

// Local readiness checklist state
const checkedItems = ref<Record<string, boolean>>({})

function toggleChecklist(index: number) {
  if (!props.node) return
  const key = `${props.node.id}-${index}`
  checkedItems.value[key] = !checkedItems.value[key]
}

function isChecked(index: number): boolean {
  if (!props.node) return false
  return Boolean(checkedItems.value[`${props.node.id}-${index}`])
}

const readinessCount = computed(() => {
  if (!props.node) return 0
  return props.node.readinessChecklist.filter((_, i) => isChecked(i)).length
})

const readinessPercent = computed(() => {
  if (!props.node || props.node.readinessChecklist.length === 0) return 0
  return Math.round((readinessCount.value / props.node.readinessChecklist.length) * 100)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="open && node"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${node.id}`"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="emit('close')"
      />

      <!-- Modal Card -->
      <div
        class="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden animate-fade-up z-10"
      >
        <!-- Header banner -->
        <div
          class="relative border-b border-border/80 p-6 sm:p-8"
          :style="{
            background: `linear-gradient(135deg, color-mix(in srgb, ${node.color} 14%, var(--surface)) 0%, var(--surface) 100%)`,
          }"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <div
                class="flex size-13 items-center justify-center rounded-2xl text-white shadow-md"
                :style="{
                  background: `linear-gradient(135deg, ${node.color} 0%, color-mix(in srgb, ${node.color} 60%, var(--surface)) 100%)`,
                }"
              >
                <component :is="nodeIcon" class="size-6.5" :stroke-width="2.2" />
              </div>

              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="rounded-md font-mono text-xs font-bold text-white px-2 py-0.5"
                    :style="{ backgroundColor: node.color }"
                  >
                    Stage {{ String(node.stepNumber).padStart(2, '0') }}
                  </span>
                  <UiBadge :variant="node.difficulty === 'beginner' ? 'beginner' : node.difficulty === 'intermediate' ? 'intermediate' : 'advanced'" class="capitalize">
                    {{ node.difficulty }}
                  </UiBadge>
                  <UiBadge v-if="node.importance === 'essential'" variant="essential">
                    Essential Foundation
                  </UiBadge>
                  <UiBadge v-else-if="node.importance === 'milestone'" variant="success">
                    Major Milestone
                  </UiBadge>
                </div>

                <h2
                  :id="`modal-title-${node.id}`"
                  class="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
                >
                  {{ node.title }}
                </h2>
                <p class="text-sm text-muted">
                  {{ node.subtitle }}
                </p>
              </div>
            </div>

            <!-- Close button -->
            <button
              type="button"
              class="icon-btn shrink-0 rounded-xl hover:bg-surface-2"
              aria-label="Close dialog"
              @click="emit('close')"
            >
              <X class="size-5" />
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <!-- Overview & Why it matters -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-border/80 bg-surface-2/60 p-4.5">
              <h4 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <BookOpen class="size-3.5 text-primary" />
                Stage Overview
              </h4>
              <p class="mt-2 text-sm leading-relaxed text-ink">
                {{ node.description }}
              </p>
            </div>

            <div class="rounded-2xl border border-border/80 bg-surface-2/60 p-4.5">
              <h4 class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <Lightbulb class="size-3.5 text-amber-500" />
                Why This Matters
              </h4>
              <p class="mt-2 text-sm leading-relaxed text-ink">
                {{ node.whyItMatters }}
              </p>
            </div>
          </div>

          <!-- Prerequisites & Next Step Flow -->
          <div class="rounded-2xl border border-border bg-surface-2/40 p-5">
            <div class="grid gap-6 sm:grid-cols-2">
              <!-- Prerequisites -->
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-muted">
                  What You Need First (Prerequisites)
                </span>
                <ul class="mt-2.5 space-y-2">
                  <li
                    v-for="prereq in node.prerequisites"
                    :key="prereq.id"
                    class="rounded-xl border border-border bg-surface p-3 text-xs"
                  >
                    <div class="font-semibold text-ink">
                      {{ prereq.title }}
                    </div>
                    <div class="mt-0.5 text-muted">
                      {{ prereq.reason }}
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Next Step -->
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-muted">
                  Where This Leads (Next Step)
                </span>
                <div class="mt-2.5 rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs">
                  <div class="flex items-center justify-between font-semibold text-primary">
                    <span>{{ node.nextStep.title }}</span>
                    <ArrowRight class="size-3.5" />
                  </div>
                  <p class="mt-1 text-ink-soft">
                    {{ node.nextStep.reason }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Topics Checklist -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-display text-base font-bold text-ink">
                Key Topics to Master
              </h4>
              <span class="text-xs text-muted">
                {{ node.topics.filter(t => t.isEssential).length }} essential topics
              </span>
            </div>

            <div class="grid gap-2.5 sm:grid-cols-2">
              <div
                v-for="topic in node.topics"
                :key="topic.name"
                class="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-3.5"
              >
                <span
                  class="mt-0.5 size-2 rounded-full shrink-0"
                  :style="{ backgroundColor: node.color }"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-semibold text-ink">{{ topic.name }}</span>
                    <UiBadge v-if="topic.isEssential" variant="essential" class="text-[9px] py-0 px-1.5">
                      Essential
                    </UiBadge>
                  </div>
                  <p v-if="topic.description" class="mt-0.5 text-[11px] text-muted leading-normal">
                    {{ topic.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Practice Project Ideas -->
          <div>
            <h4 class="font-display text-base font-bold text-ink mb-3">
              What to Build (Practice Projects)
            </h4>

            <div class="space-y-3">
              <div
                v-for="project in node.practiceProjects"
                :key="project.title"
                class="rounded-2xl border border-border bg-surface p-4.5"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h5 class="text-sm font-bold text-ink">
                      {{ project.title }}
                    </h5>
                    <p class="mt-1 text-xs text-muted leading-relaxed">
                      {{ project.description }}
                    </p>
                  </div>
                  <UiBadge :variant="project.difficulty === 'beginner' ? 'beginner' : project.difficulty === 'intermediate' ? 'intermediate' : 'advanced'" class="capitalize text-[10px]">
                    {{ project.difficulty }}
                  </UiBadge>
                </div>

                <div class="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                  <span class="text-[11px] font-medium text-muted mr-1">Deliverables:</span>
                  <span
                    v-for="deliv in project.deliverables"
                    :key="deliv"
                    class="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-ink-soft"
                  >
                    <CheckCircle2 class="size-3 text-emerald-500" />
                    {{ deliv }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Self-Assessment Readiness Checklist -->
          <div class="rounded-2xl border border-border bg-surface-2/50 p-5">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="text-sm font-bold text-ink">
                  Readiness Self-Assessment
                </h4>
                <p class="text-xs text-muted">
                  Check off the statements you can confidently verify:
                </p>
              </div>
              <span class="font-mono text-xs font-bold text-primary">
                {{ readinessCount }}/{{ node.readinessChecklist.length }} Ready
              </span>
            </div>

            <UiProgress :value="readinessPercent" class="mb-4" />

            <div class="space-y-2">
              <label
                v-for="(item, i) in node.readinessChecklist"
                :key="i"
                class="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 text-xs text-ink-soft cursor-pointer hover:bg-surface-2 transition-colors select-none"
              >
                <input
                  type="checkbox"
                  :checked="isChecked(i)"
                  class="mt-0.5 size-4 rounded text-primary focus:ring-primary"
                  @change="toggleChecklist(i)"
                />
                <span :class="isChecked(i) ? 'line-through text-muted' : 'text-ink font-medium'">
                  {{ item }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2 px-6 py-4">
          <div class="flex items-center gap-2 text-xs text-muted">
            <Clock class="size-3.5" />
            Estimated: <strong class="text-ink">{{ node.estimatedWeeks }}</strong>
          </div>

          <div class="flex items-center gap-2 ml-auto">
            <UiButton variant="outline" size="sm" @click="emit('close')">
              Close
            </UiButton>
            <UiButton
              v-if="node.learnRoute"
              :to="node.learnRoute"
              variant="primary"
              size="sm"
            >
              Start Learning Stage
              <ArrowRight class="size-3.5" />
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
