<script setup lang="ts">
import { Check, CheckCircle2 } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  path: string
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})

const { isCompleted, toggle } = useProgress()

const done = computed(() => isCompleted(props.path))

function onClick() {
  toggle(props.path)
}
</script>

<template>
  <button
    type="button"
    class="btn shrink-0 whitespace-nowrap transition-all"
    :class="[
      done
        ? 'btn-secondary !border-success/50 !text-success hover:!bg-success/10'
        : 'btn-primary',
      size === 'sm'
        ? 'min-h-10 px-4 py-2 text-xs'
        : 'min-h-11 px-5 py-2.5 text-sm',
    ]"
    :aria-pressed="done"
    @click="onClick"
  >
    <Check v-if="done" class="size-4 shrink-0" aria-hidden="true" />
    <CheckCircle2 v-else class="size-4 shrink-0" aria-hidden="true" />
    <span class="font-semibold leading-none">{{ done ? 'Completed' : 'Mark as completed' }}</span>
  </button>
</template>
