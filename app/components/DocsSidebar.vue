<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  activeTech?: string
  activeLesson?: string
}>()

const { sidebarOpen } = useUiState()
const route = useRoute()
const drawerRef = ref<HTMLElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)

watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

function getFocusableElements(): HTMLElement[] {
  if (!drawerRef.value) return []
  return Array.from(drawerRef.value.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && sidebarOpen.value) {
    sidebarOpen.value = false
    return
  }
  if (e.key === 'Tab' && sidebarOpen.value) {
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

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(sidebarOpen, (open) => {
  if (open) {
    previousFocus.value = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const focusable = getFocusableElements()
      focusable[0]?.focus()
    })
  } else {
    document.body.style.overflow = ''
    if (previousFocus.value?.isConnected) previousFocus.value.focus()
    previousFocus.value = null
  }
})
</script>

<template>
  <div>
    <Teleport to="body">
      <Transition name="drawer-fade">
        <div id="curriculum-drawer" v-if="sidebarOpen" class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Curriculum navigation">
          <div class="absolute inset-0 bg-black/50" aria-hidden="true" @click="sidebarOpen = false" />
          <div ref="drawerRef" class="absolute inset-y-0 left-0 flex min-h-0 w-[300px] max-w-[85vw] flex-col border-r border-border bg-surface shadow-2xl drawer-panel">
            <div class="flex items-center justify-between border-b border-border px-4 py-3">
              <span class="font-display text-sm font-bold text-ink">Curriculum</span>
              <button type="button" class="inline-flex size-11 items-center justify-center rounded-xl border border-transparent text-muted transition-all duration-200" aria-label="Close navigation" @click="sidebarOpen = false">
                <X class="size-4.5" />
              </button>
            </div>
            <DocsSidebarContent :active-tech="activeTech" :active-lesson="activeLesson" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <aside
      class="sticky top-16 hidden h-[calc(100dvh-4rem)] min-h-0 w-72 shrink-0 overflow-hidden border-r border-border lg:flex lg:flex-col"
      aria-label="Curriculum navigation"
    >
      <DocsSidebarContent :active-tech="activeTech" :active-lesson="activeLesson" />
    </aside>
  </div>
</template>

<style scoped>
.drawer-fade-enter-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-active .drawer-panel {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-fade-leave-active {
  transition: opacity 0.15s ease;
}
.drawer-fade-leave-active .drawer-panel {
  transition: transform 0.15s ease;
}
.drawer-fade-enter-from {
  opacity: 0;
}
.drawer-fade-enter-from .drawer-panel {
  transform: translateX(-100%);
}
.drawer-fade-leave-to {
  opacity: 0;
}
.drawer-fade-leave-to .drawer-panel {
  transform: translateX(-100%);
}
</style>
