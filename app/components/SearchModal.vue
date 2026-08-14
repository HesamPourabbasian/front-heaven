<script setup lang="ts">
import { CornerDownLeft, Search, SearchX } from 'lucide-vue-next'

interface SearchResult {
  type: 'lesson' | 'technology'
  title: string
  description: string
  path: string
  meta?: string
  color?: string
}

const { searchOpen } = useUiState()
const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const selectedIndex = ref(0)
const modalRef = ref<HTMLElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)

const index = useSearchIndex()

const results = computed<SearchResult[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  if (!index.value) return []

  const lessons: SearchResult[] = (index.value.lessons as Array<{ path: string; title: string; description: string; category: string }>)
    .filter(l => `${l.title} ${l.description} ${l.category} ${l.path}`.toLowerCase().includes(q))
    .map(l => ({
      type: 'lesson',
      title: l.title,
      description: l.description,
      path: `/${l.path.replace(/^\//, '')}`,
      meta: l.category,
    }))

  const technologies: SearchResult[] = (index.value.technologies as Array<{ path: string; title: string; description: string; color: string }>)
    .filter(t => `${t.title} ${t.description}`.toLowerCase().includes(q))
    .map(t => ({
      type: 'technology',
      title: t.title,
      description: t.description,
      path: `/${t.path.replace(/^\//, '')}`,
      meta: 'Technology',
      color: t.color,
    }))

  return [...lessons, ...technologies].slice(0, 20)
})

function close() {
  searchOpen.value = false
  query.value = ''
}

function go(index: number) {
  const item = results.value[index]
  if (!item) return
  close()
  navigateTo(item.path)
}

function getFocusableElements(): HTMLElement[] {
  if (!modalRef.value) return []
  const panel = modalRef.value.querySelector<HTMLElement>('.relative')
  if (!panel) return []
  return Array.from(panel.querySelectorAll<HTMLElement>('input, button, a[href], [tabindex]:not([tabindex="-1"])'))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
    return
  }
  if (!searchOpen.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, Math.max(results.value.length - 1, 0))
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go(selectedIndex.value)
  } else if (e.key === 'Tab') {
    const focusable = getFocusableElements()
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }
}

onMounted(() => {
  previousFocus.value = document.activeElement as HTMLElement | null
  window.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
  nextTick(() => input.value?.focus())
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  if (previousFocus.value?.isConnected) previousFocus.value.focus()
})

watch(query, () => {
  selectedIndex.value = 0
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="modalRef"
      class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search lessons and technologies"
    >
      <div
        class="absolute inset-0 bg-black/55"
        aria-hidden="true"
        @click="close"
      />
      <div class="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40">
        <div class="flex items-center gap-3 border-b border-border px-4">
          <Search class="size-4.5 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref="input"
            v-model="query"
            type="search"
            class="h-12 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted sm:h-13"
            placeholder="Search lessons, technologies, concepts…"
            aria-label="Search query"
          />
          <kbd class="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted sm:inline" aria-hidden="true">
            ESC
          </kbd>
        </div>

        <div class="max-h-[50vh] overflow-y-auto p-2 sm:max-h-[55vh]">
          <p v-if="query && results.length === 0" class="flex flex-col items-center gap-2 px-3 py-10 text-center">
            <SearchX class="size-6 text-muted" aria-hidden="true" />
            <span class="text-sm text-muted">
              No results for "{{ query }}".
            </span>
          </p>

          <p v-else-if="!query" class="px-3 py-10 text-center text-sm text-muted">
            Type to search across the entire curriculum.
          </p>

          <ul v-else>
            <li v-for="(item, i) in results" :key="item.path">
              <button
                type="button"
                class="group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                :class="i === selectedIndex ? 'bg-surface-2' : ''"
                @mouseenter="selectedIndex = i"
                @click="go(i)"
              >
                <span
                  v-if="item.type === 'technology'"
                  class="mt-1 size-2.5 shrink-0 rounded-full"
                  :style="{ background: item.color }"
                  aria-hidden="true"
                />
                <span v-else class="mt-1 size-2.5 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-2">
                    <span class="truncate text-sm font-semibold text-ink">{{ item.title }}</span>
                    <span class="chip shrink-0 !px-2 !py-0.5 !text-[10px]">{{ item.meta }}</span>
                  </span>
                  <span class="mt-0.5 block truncate text-xs text-muted">{{ item.description }}</span>
                </span>
                <CornerDownLeft
                  v-if="i === selectedIndex"
                  class="mt-1 size-3.5 shrink-0 text-muted"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </div>

        <div class="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-muted">
          <span aria-live="polite">{{ results.length }} results</span>
          <span class="hidden sm:inline">↑↓ navigate · ↵ open</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
