<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    class?: string
    multiple?: boolean
  }>(),
  {
    multiple: false,
  },
)

const activeItems = ref<Set<string>>(new Set())

function toggleItem(id: string) {
  if (activeItems.value.has(id)) {
    activeItems.value.delete(id)
  } else {
    if (!props.multiple) {
      activeItems.value.clear()
    }
    activeItems.value.add(id)
  }
}

provide('accordion', {
  activeItems,
  toggleItem,
})
</script>

<template>
  <div :class="['divide-y divide-border rounded-xl border border-border bg-surface', $props.class]">
    <slot />
  </div>
</template>
