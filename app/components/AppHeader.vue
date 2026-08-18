<script setup lang="ts">
import { ArrowRight, Home, Info, Map, Menu, Network, X } from 'lucide-vue-next'

const { searchOpen } = useUiState()
const mobileOpen = ref(false)
const scrolled = ref(false)
const route = useRoute()

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  } else if (e.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
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
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

watch(mobileOpen, (isOpen) => {
  if (import.meta.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

const navLinks = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Roadmap', to: '/roadmap', icon: Map },
  { label: 'Diagram', to: '/diagram', icon: Network },
  { label: 'About ME', to: '/about', icon: Info },
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
          class="inline-flex size-11 items-center justify-center rounded-xl border border-border/70 bg-surface text-muted transition-all duration-200 hover:border-border-strong hover:text-ink md:hidden"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <Menu class="size-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer & Backdrop -->
    <Teleport to="body">
      <!-- Backdrop Overlay -->
      <Transition name="drawer-fade">
        <div
          v-if="mobileOpen"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          aria-hidden="true"
          @click="mobileOpen = false"
        />
      </Transition>

      <!-- Right-Sliding Sidebar Drawer -->
      <Transition name="drawer-slide">
        <aside
          v-if="mobileOpen"
          class="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col border-l border-border bg-surface shadow-2xl md:hidden"
          aria-label="Mobile navigation drawer"
          role="dialog"
          aria-modal="true"
        >
          <!-- Drawer Header -->
          <div class="flex h-16 items-center justify-between border-b border-border px-5">
            <Brand />
            <button
              type="button"
              class="inline-flex size-10 items-center justify-center rounded-xl border border-border/80 bg-surface-2 text-ink-soft transition-colors hover:border-border-strong hover:bg-surface hover:text-ink"
              aria-label="Close navigation menu"
              @click="mobileOpen = false"
            >
              <X class="size-5" />
            </button>
          </div>

          <!-- Drawer Navigation Links -->
          <nav class="flex-1 overflow-y-auto px-4 py-6">
            <ul class="flex flex-col gap-1.5">
              <li v-for="link in navLinks" :key="link.to">
                <NuxtLink
                  :to="link.to"
                  class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-ink-soft transition-all hover:bg-surface-2 hover:text-ink"
                  exact-active-class="!bg-primary/10 !text-primary shadow-xs"
                  :aria-current="$route.path === link.to ? 'page' : undefined"
                  @click="mobileOpen = false"
                >
                  <component :is="link.icon" class="size-5 shrink-0 opacity-80" />
                  <span>{{ link.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Drawer Bottom Action -->
          <div class="border-t border-border p-4">
            <NuxtLink
              to="/learn/html"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-hover active:scale-98"
              @click="mobileOpen = false"
            >
              Start Learning
              <ArrowRight class="size-4" />
            </NuxtLink>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease-out;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
