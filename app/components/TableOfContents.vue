<script setup lang="ts">
import type { TocItem } from '~/types/content'

const props = defineProps<{
  items: TocItem[]
  title?: string
}>()

const activeId = ref('')
const visible = computed(() => props.items.filter(item => item.depth === 2))

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    }
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 })

  for (const item of visible.value) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav v-if="visible.length > 0" aria-label="On this page" class="space-y-1 border-l border-border pl-4">
    <p class="text-[11px] font-semibold uppercase tracking-widest text-muted">
      {{ title ?? 'On this page' }}
    </p>
    <ul class="mt-2 space-y-1">
      <li v-for="item in visible" :key="item.id">
        <a
          :href="`#${item.id}`"
          class="block border-l-2 py-2 pl-3 text-[13px] leading-snug transition-all"
          :class="activeId === item.id
            ? '-ml-[18px] border-primary font-medium text-primary'
            : '-ml-[18px] border-transparent text-muted hover:text-ink'"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>