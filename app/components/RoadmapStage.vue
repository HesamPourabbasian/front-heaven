<script setup lang="ts">
import { ArrowRight, Check, Clock, Lock, Play } from 'lucide-vue-next'
import type { TechnologyProgress } from '~/types/content'

const props = defineProps<{
  stage: TechnologyProgress
  index: number
  isNext?: boolean
  total: number
}>()

const tech = computed(() => props.stage.technology)
const isAvailable = computed(() => tech.value.status === 'available')
const allDone = computed(() => props.stage.total > 0 && props.stage.percent === 100)

const totalMinutes = computed(() => props.stage.lessons
  .reduce((sum, l) => sum + l.estimatedMinutes, 0))

const buttonLabel = computed(() => {
  if (!isAvailable.value) return 'Coming soon'
  if (props.stage.percent === 0) return 'Start learning'
  if (allDone.value) return 'Review lessons'
  return 'Continue learning'
})
</script>

<template>
  <li class="relative">
    <div class="relative flex items-start gap-3 sm:gap-6">
      <div class="relative z-10 flex h-full flex-col items-center">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-2xl border font-mono text-sm font-bold transition-all duration-300 sm:size-11"
          :class="allDone
            ? 'border-success/40 bg-success/15 text-success'
            : isNext
              ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
              : isAvailable
                ? 'border-border bg-surface text-muted'
                : 'border-border bg-surface-2 text-muted/60'"
          aria-hidden="true"
        >
          <Check v-if="allDone" class="size-5" />
          <template v-else>{{ index + 1 }}</template>
        </span>
        <span
          v-if="index < props.total - 1"
          class="roadmap-connector my-1 w-px flex-1"
          aria-hidden="true"
        />
      </div>

      <div class="min-w-0 flex-1 pb-12">
        <article
          class="card card-hover group relative overflow-hidden p-5 sm:p-7"
          :class="{ 'border-primary/40': isNext, '!border-success/30': allDone }"
        >
          <div
            v-if="isNext"
            class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            aria-hidden="true"
          />
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex min-w-0 items-start gap-4">
              <TechIcon :icon="tech.icon" :color="tech.color" size="md" />
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2.5">
                  <h2 class="font-display text-xl font-bold tracking-tight text-ink">
                    {{ tech.title }}
                  </h2>
                  <span
                    v-if="isNext && isAvailable"
                    class="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary"
                  >
                    You are here
                  </span>
                  <span
                    v-else-if="!isAvailable"
                    class="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted"
                  >
                    <Lock class="size-3" aria-hidden="true" />
                    Coming soon
                  </span>
                </div>
                <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {{ tech.description }}
                </p>
              </div>
            </div>

            <div class="flex shrink-0 flex-col items-end gap-1.5">
              <div class="flex items-center gap-2">
                <DifficultyBadge :difficulty="tech.difficulty" />
                <span class="flex items-center gap-1 text-xs text-muted">
                  <Clock class="size-3" aria-hidden="true" />
                  {{ formatDuration(totalMinutes) }}
                </span>
              </div>
              <p class="text-xs text-muted">
                {{ stage.total }} {{ stage.total === 1 ? 'lesson' : 'lessons' }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-4">
            <div class="min-w-[180px] flex-1">
              <div class="flex items-center justify-between text-xs font-medium">
                <span class="text-muted">Progress</span>
                <span class="font-mono text-muted tabular-nums">{{ stage.percent }}%</span>
              </div>
              <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: `${stage.percent}%`, background: tech.color }"
                />
              </div>
            </div>

            <NuxtLink
              v-if="isAvailable"
              :to="technologyRoute(tech.slug)"
              class="btn min-h-11 shrink-0 whitespace-nowrap px-5 py-2.5 text-sm"
              :class="stage.percent > 0 ? 'btn-secondary' : 'btn-primary'"
            >
              <Play v-if="stage.percent === 0" class="size-4 shrink-0" aria-hidden="true" />
              <ArrowRight v-else class="size-4 shrink-0" aria-hidden="true" />
              <span class="font-semibold leading-none">{{ buttonLabel }}</span>
            </NuxtLink>
            <span v-else class="btn-secondary min-h-11 shrink-0 cursor-not-allowed whitespace-nowrap px-5 py-2.5 text-sm opacity-60">
              {{ buttonLabel }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </li>
</template>
