<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const { searchOpen } = useUiState()
const mobileOpen = ref(false)
const scrolled = ref(false)
const route = useRoute()

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

let onScroll: (() => void) | null = null

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  onScroll = () => {
    scrolled.value = window.scrollY > 8
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Roadmap', to: '/roadmap' },
]
</script>

<template>
  <header
    class="sticky top-0 z-40 transition-all duration-300"
    :class="scrolled ? 'glass border-b border-border' : 'border-b border-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <Brand />

      <nav class="ml-6 hidden items-center gap-1 md:flex" aria-label="Main navigation">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          exact-active-class="!text-primary bg-primary/10"
          :aria-current="$route.path === link.to ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <SearchTrigger />
        <ThemeToggle />
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-xl border border-transparent text-muted transition-all duration-200 md:hidden"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </button>
      </div>
    </div>

    <Transition name="mobile-nav">
      <nav
        v-if="mobileOpen"
        class="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-surface px-4 py-3 md:hidden"
        aria-label="Mobile navigation"
      >
        <div class="flex flex-col gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2"
            exact-active-class="!text-primary bg-primary/10"
            :aria-current="$route.path === link.to ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink
            to="/learn/html"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2"
            :aria-current="$route.path === '/learn/html' ? 'page' : undefined"
          >
            Learn HTML
          </NuxtLink>
          <NuxtLink
            to="/learn/css"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2"
            :aria-current="$route.path === '/learn/css' ? 'page' : undefined"
          >
            Learn CSS
          </NuxtLink>
          <NuxtLink
            to="/learn/javascript"
            class="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2"
            :aria-current="$route.path === '/learn/javascript' ? 'page' : undefined"
          >
            Learn JavaScript
          </NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
