<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Layers,
  Lightbulb,
  Lock,
  PlayCircle,
  Sparkles,
  X,
} from 'lucide-vue-next'
import type { DiagramNode } from '~/types/diagram'

const props = defineProps<{
  node: DiagramNode | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  navigateNode: [nodeId: string]
}>()

const { lessons } = useSiteContent()
const { completed, isCompleted } = useProgress()

const nodeLessons = computed(() => {
  if (!props.node?.trackSlug) return []
  return lessons.value.filter(l => l.technology === props.node!.trackSlug)
})

const completedLessonsCount = computed(() => {
  return nodeLessons.value.filter(l => isCompleted(l.path)).length
})

const progressPercent = computed(() => {
  if (nodeLessons.value.length === 0) return 0
  return Math.round((completedLessonsCount.value / nodeLessons.value.length) * 100)
})

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
        aria-hidden="true"
        @click="emit('close')"
      />

      <!-- Modal Panel Container -->
      <div
        class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl z-10 animate-fade-in"
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-border/80 bg-surface-2/60 px-6 py-5">
          <div class="flex items-start gap-4">
            <TechIcon :icon="node.icon" :color="node.color" size="lg" />

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-md bg-surface-3 px-2 py-0.5 font-mono text-[10px] font-bold text-muted uppercase">
                  Stage {{ node.stepNumber }}
                </span>
                <span class="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                  {{ node.category }}
                </span>
                <UiBadge variant="default" class="capitalize text-[10px]">
                  {{ node.difficulty }}
                </UiBadge>
              </div>

              <h2
                :id="`modal-title-${node.id}`"
                class="mt-1.5 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
              >
                {{ node.title }}
              </h2>
              <p class="text-xs text-muted">
                {{ node.subtitle }}
              </p>
            </div>
          </div>

          <!-- Close Button -->
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:bg-surface-3 hover:text-ink"
            aria-label="Close details"
            @click="emit('close')"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Scrollable Modal Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-gutter:stable]">
          <!-- Progress Banner (if lessons available) -->
          <div v-if="nodeLessons.length > 0" class="rounded-2xl border border-border bg-surface-2/40 p-4">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-ink">Your Learning Progress</span>
              <span class="font-mono font-semibold text-primary">
                {{ completedLessonsCount }}/{{ nodeLessons.length }} lessons ({{ progressPercent }}%)
              </span>
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-surface-3">
              <div
                class="h-full rounded-full bg-primary transition-all duration-500"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>
          </div>

          <!-- Why it matters -->
          <div class="rounded-2xl border border-primary/20 bg-primary/5 p-4.5">
            <span class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Lightbulb class="size-3.5" />
              Why You Should Learn It
            </span>
            <p class="mt-1.5 text-xs sm:text-sm leading-relaxed text-ink font-medium">
              {{ node.whyItMatters }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Overview</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {{ node.description }}
            </p>
          </div>

          <!-- Prerequisites & Unlocks Grid -->
          <div class="grid gap-3.5 sm:grid-cols-2">
            <!-- Prerequisites -->
            <div class="rounded-2xl border border-border bg-surface-2/30 p-4">
              <span class="text-[11px] font-bold uppercase tracking-wider text-muted">Required Prerequisites</span>
              <ul class="mt-2 space-y-2">
                <li v-for="prereq in node.prerequisites" :key="prereq.id" class="text-xs">
                  <div class="flex items-center gap-1.5 font-bold text-ink">
                    <CheckCircle2 class="size-3.5 text-emerald-500 shrink-0" />
                    <span>{{ prereq.title }}</span>
                  </div>
                  <p class="text-[11px] text-muted pl-5">{{ prereq.reason }}</p>
                </li>
              </ul>
            </div>

            <!-- What Unlocks Next -->
            <div class="rounded-2xl border border-border bg-surface-2/30 p-4">
              <span class="text-[11px] font-bold uppercase tracking-wider text-muted">What Unlocks Next</span>
              <div class="mt-2 text-xs">
                <div class="flex items-center gap-1.5 font-bold text-primary">
                  <Sparkles class="size-3.5 shrink-0" />
                  <span>{{ node.nextStep.title }}</span>
                </div>
                <p class="text-[11px] text-muted pl-5 mt-0.5">{{ node.nextStep.reason }}</p>
              </div>
            </div>
          </div>

          <!-- Key Topics Breakdown -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Key Topics Covered</h3>
            <div class="mt-2.5 grid gap-2 sm:grid-cols-2">
              <div
                v-for="topic in node.topics"
                :key="topic.name"
                class="rounded-xl border border-border/80 bg-surface-2/40 p-3 text-xs"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-ink">{{ topic.name }}</span>
                  <span
                    v-if="topic.isEssential"
                    class="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase"
                  >
                    Core
                  </span>
                </div>
                <p v-if="topic.description" class="mt-1 text-[11px] text-muted leading-relaxed">
                  {{ topic.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Practice Projects -->
          <div v-if="node.practiceProjects.length > 0">
            <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Practice Projects</h3>
            <div class="mt-2 space-y-2">
              <div
                v-for="project in node.practiceProjects"
                :key="project.title"
                class="rounded-2xl border border-border bg-surface-2/50 p-4 text-xs"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-ink text-sm">{{ project.title }}</span>
                  <UiBadge variant="default" class="text-[10px] capitalize">
                    {{ project.difficulty }}
                  </UiBadge>
                </div>
                <p class="mt-1 text-muted leading-relaxed">
                  {{ project.description }}
                </p>
                <div class="mt-2.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="deliv in project.deliverables"
                    :key="deliv"
                    class="rounded-md bg-surface px-2 py-0.5 text-[10px] font-mono text-muted border border-border"
                  >
                    ✓ {{ deliv }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Readiness Checklist -->
          <div>
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-muted">
                Are You Ready to Advance?
              </h3>
              <span class="font-mono text-xs font-semibold text-primary">
                {{ readinessCount }}/{{ node.readinessChecklist.length }} checked
              </span>
            </div>

            <div class="mt-2 space-y-1.5">
              <button
                v-for="(item, idx) in node.readinessChecklist"
                :key="idx"
                type="button"
                class="flex w-full items-start gap-3 rounded-xl border p-3 text-left text-xs transition-all cursor-pointer select-none"
                :class="isChecked(idx)
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-medium'
                  : 'border-border bg-surface hover:bg-surface-2 text-ink'"
                @click="toggleChecklist(idx)"
              >
                <span
                  class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-md border text-white transition-colors"
                  :class="isChecked(idx) ? 'border-emerald-500 bg-emerald-500' : 'border-border bg-surface-2'"
                >
                  <Check v-if="isChecked(idx)" class="size-3" />
                </span>
                <span class="leading-relaxed">{{ item }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer CTA -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2/60 px-6 py-4">
          <div class="flex items-center gap-2 text-xs text-muted">
            <Clock class="size-3.5" />
            <span>Estimated time: <strong>{{ node.estimatedWeeks }}</strong></span>
          </div>

          <div class="flex items-center gap-2">
            <UiButton variant="secondary" size="sm" @click="emit('close')">
              Close
            </UiButton>
            <UiButton
              v-if="node.learnRoute"
              :to="node.learnRoute"
              variant="primary"
              size="sm"
              class="gap-1.5"
            >
              <span>{{ progressPercent > 0 ? 'Continue Stage' : 'Start Stage' }}</span>
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
