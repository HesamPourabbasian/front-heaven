<script setup lang="ts">
import { ChevronRight, Home } from 'lucide-vue-next'

const props = defineProps<{
  items: Array<{ label: string; to?: string }>
}>()

const visibleItems = computed(() => props.items.filter(item => item.to !== '/'))
</script>

<template>
  <nav class="flex flex-wrap items-center gap-1.5 text-[13px]" aria-label="Breadcrumb">
    <NuxtLink to="/" class="flex items-center gap-1 text-muted transition-colors hover:text-primary">
      <Home class="size-3.5" aria-hidden="true" />
      <span class="sr-only">Home</span>
    </NuxtLink>
    <template v-for="(item, i) in visibleItems" :key="`${item.label}-${i}`">
      <ChevronRight class="size-3.5 text-muted/50" aria-hidden="true" />
      <span
        :class="i === visibleItems.length - 1
          ? 'font-medium text-ink'
          : 'text-muted transition-colors hover:text-primary'"
      >
        <NuxtLink v-if="item.to && i < visibleItems.length - 1" :to="item.to" class="text-muted transition-colors hover:text-primary">
          {{ item.label }}
        </NuxtLink>
        <template v-else>{{ item.label }}</template>
      </span>
    </template>
  </nav>
</template>
