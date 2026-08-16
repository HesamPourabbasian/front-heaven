<script setup lang="ts">
import {
  Accessibility,
  Code2,
  FileCode,
  Layers,
  MonitorSmartphone,
  Network,
  Rocket,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  icon: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  color: '#6366f1',
  size: 'md',
})

const sizes = {
  sm: 'h-8 px-1.5 py-1 rounded-lg',
  md: 'h-10 px-2 py-1.5 rounded-xl',
  lg: 'h-12 px-3 py-2 rounded-2xl',
}

const imgSizes = {
  sm: 'h-5 w-auto max-w-none',
  md: 'h-6.5 w-auto max-w-none',
  lg: 'h-8 w-auto max-w-none',
}

const iconSizes = {
  sm: 'size-4.5',
  md: 'size-5.5',
  lg: 'size-7',
}

const SHIELDS_BADGES: Record<string, string> = {
  // Core
  html: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white',
  code: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white',
  css: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white',
  palette: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white',
  javascript: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
  braces: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
  typescript: 'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
  shield: 'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
  git: 'https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white',

  // Frontend Frameworks
  react: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
  atom: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
  vue: 'https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D',
  component: 'https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D',
  angular: 'https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white',
  triangle: 'https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white',
  svelte: 'https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00',
  flame: 'https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00',
  solidjs: 'https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solid&logoColor=c8c9cb',
  zap: 'https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solid&logoColor=c8c9cb',
  preact: 'https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white',
  sparkles: 'https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white',
  astro: 'https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FF5D01',
  htmx: 'https://img.shields.io/badge/HTMX-3366CC?style=for-the-badge&logo=htmx&logoColor=white',
  send: 'https://img.shields.io/badge/HTMX-3366CC?style=for-the-badge&logo=htmx&logoColor=white',

  // Meta-Frameworks
  nextjs: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
  server: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
  nuxtjs: 'https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=00DC82',
  cpu: 'https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=00DC82',

  // CSS Frameworks
  tailwindcss: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white',
  paintbrush: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white',
  bootstrap: 'https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white',
  box: 'https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white',
}

const normalizedIcon = computed(() => (props.icon || '').toLowerCase().trim())
const shieldUrl = computed(() => SHIELDS_BADGES[normalizedIcon.value])
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center select-none border border-border/70 bg-surface dark:bg-surface-2 shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:border-border-strong group-hover:shadow-md overflow-hidden"
    :class="sizes[size]"
    aria-hidden="true"
  >
    <!-- Shields.io Official Badge -->
    <img
      v-if="shieldUrl"
      :src="shieldUrl"
      :alt="icon"
      :class="imgSizes[size]"
      loading="lazy"
      class="rounded-sm object-contain"
    >

    <!-- Fallbacks for Conceptual Topics -->
    <component
      :is="MonitorSmartphone"
      v-else-if="normalizedIcon === 'responsive'"
      :stroke-width="2"
      :class="iconSizes[size]"
      class="text-cyan-500"
    />
    <component
      :is="Accessibility"
      v-else-if="normalizedIcon === 'accessibility'"
      :stroke-width="2"
      :class="iconSizes[size]"
      class="text-emerald-500"
    />
    <component
      :is="Network"
      v-else-if="normalizedIcon === 'network' || normalizedIcon === 'http-and-apis'"
      :stroke-width="2"
      :class="iconSizes[size]"
      class="text-purple-500"
    />
    <component
      :is="Rocket"
      v-else-if="normalizedIcon === 'rocket'"
      :stroke-width="2"
      :class="iconSizes[size]"
      class="text-rose-500"
    />
    <component
      :is="Code2"
      v-else
      :stroke-width="2"
      :class="iconSizes[size]"
      class="text-primary"
    />
  </span>
</template>