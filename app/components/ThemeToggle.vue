<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const { theme, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="icon-btn"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Sun class="hidden size-[18px] dark:block" aria-hidden="true" />
    <Moon class="size-[18px] dark:hidden" aria-hidden="true" />
  </button>
  <span class="sr-only" aria-live="polite">
    {{ theme === 'dark' ? 'Dark mode' : 'Light mode' }}
  </span>
</template>
