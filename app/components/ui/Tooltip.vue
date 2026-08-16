<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    position: 'top',
  },
)

const visible = ref(false)
</script>

<template>
  <div
    class="relative inline-flex items-center"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <slot />
    <Transition name="tooltip-fade">
      <div
        v-if="visible"
        role="tooltip"
        :class="[
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink shadow-lg ring-1 ring-black/5 dark:ring-white/5',
          position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
          position === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
          position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
          position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2',
        ]"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
