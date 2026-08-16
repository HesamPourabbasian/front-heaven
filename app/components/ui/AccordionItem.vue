<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps<{
  value: string
  title: string
  subtitle?: string
  defaultOpen?: boolean
  class?: string
}>()

const accordion = inject<{
  activeItems: Ref<Set<string>>
  toggleItem: (id: string) => void
}>('accordion')

const localOpen = ref(props.defaultOpen ?? false)

onMounted(() => {
  if (props.defaultOpen && accordion) {
    accordion.toggleItem(props.value)
  }
})

const isOpen = computed(() => {
  if (accordion) {
    return accordion.activeItems.value.has(props.value)
  }
  return localOpen.value
})

function handleToggle() {
  if (accordion) {
    accordion.toggleItem(props.value)
  } else {
    localOpen.value = !localOpen.value
  }
}
</script>

<template>
  <div :class="['overflow-hidden transition-colors', $props.class]">
    <button
      type="button"
      :aria-expanded="isOpen"
      class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none"
      @click="handleToggle"
    >
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-ink">{{ title }}</span>
        <span v-if="subtitle" class="text-xs text-muted mt-0.5">{{ subtitle }}</span>
      </div>
      <ChevronDown
        class="size-4 shrink-0 text-muted transition-transform duration-200"
        :class="isOpen ? 'rotate-180 text-primary' : ''"
      />
    </button>
    <div
      v-show="isOpen"
      class="px-5 pb-5 pt-1 text-sm text-ink-soft"
    >
      <slot />
    </div>
  </div>
</template>
