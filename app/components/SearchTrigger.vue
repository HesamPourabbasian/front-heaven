<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const { searchOpen } = useUiState()

function open() {
  searchOpen.value = true
}
</script>

<template>
  <button
    type="button"
    class="group flex h-11 items-center gap-2.5 rounded-xl border border-border bg-surface-2/60 px-3 text-sm text-muted transition-all duration-200 hover:border-border-strong hover:text-ink-soft md:w-56"
    :aria-label="`Open search`"
    @click="open"
  >
    <Search class="size-4 shrink-0 transition-colors group-hover:text-primary" aria-hidden="true" />
    <span class="hidden truncate md:inline">Search lessons…</span>
    <span class="ml-auto hidden items-center gap-0.5 md:inline-flex" aria-hidden="true">
      <kbd class="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">⌘</kbd>
      <kbd class="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">K</kbd>
    </span>
  </button>
</template>