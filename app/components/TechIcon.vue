<script setup lang="ts">
import {
  Accessibility,
  Code2,
  FileCode,
  Layers,
  MonitorSmartphone,
  Network,
  Palette,
  Rocket,
  ShieldCheck,
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
  sm: 'size-9 rounded-xl p-1.5',
  md: 'size-11 rounded-xl p-2',
  lg: 'size-14 rounded-2xl p-2.5',
}

const iconSizes = {
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-8',
}

const normalizedIcon = computed(() => (props.icon || '').toLowerCase().trim())
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center select-none border border-border/70 bg-surface dark:bg-surface-2 shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:border-border-strong group-hover:shadow-md"
    :class="sizes[size]"
    aria-hidden="true"
  >
    <!-- ⚛️ React Official Logo -->
    <svg v-if="normalizedIcon === 'react' || normalizedIcon === 'atom'" viewBox="-11.5 -10.23174 23 20.46348" :class="iconSizes[size]" fill="none" stroke="#00D8FF" stroke-width="1.15">
      <circle cx="0" cy="0" r="2.05" fill="#00D8FF" stroke="none" />
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </svg>

    <!-- 💚 Vue.js Official Logo -->
    <svg v-else-if="normalizedIcon === 'vue' || normalizedIcon === 'component'" viewBox="0 0 261.76 226.69" :class="iconSizes[size]">
      <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883" />
      <path d="M161.096.001l-30.225 52.351L100.647.001H52.846l78.026 135.145 78.04-135.145z" fill="#34495E" />
    </svg>

    <!-- 🔺 Angular Official Logo -->
    <svg v-else-if="normalizedIcon === 'angular' || normalizedIcon === 'triangle'" viewBox="0 0 250 250" :class="iconSizes[size]">
      <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
      <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
      <path d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M142,135h-34l17-40.9L142,135z" fill="#FFFFFF" />
    </svg>

    <!-- 🔥 Svelte Official Logo -->
    <svg v-else-if="normalizedIcon === 'svelte' || normalizedIcon === 'flame'" viewBox="0 0 106.1 128" :class="iconSizes[size]">
      <path fill="#FF3E00" d="M94.6 18.2C81.7 4.9 61.2-1.3 43.1 3.5 28.5 7.3 16.3 17.5 10.3 31.4c-6.8 15.6-5.5 33.7 3.5 48.1l2.4 3.7-3.8 2.2C4 90 0 100.1 0 110.8c0 10.7 7.7 17.2 18.4 17.2 9.6 0 18.9-5.1 24.3-13.3l1.8-2.8 3.1 1.2c5.7 2.2 11.8 3.3 17.9 3.3 14.8 0 28.9-6.9 37.8-18.4 9.8-12.7 12.8-29.4 7.9-44.9-4-12.6-13.6-22.7-26-27.6l-3.3-1.3 2.1-2.9c4.8-6.6 6.8-14.7 5.6-22.7-1.1-7.8-5.7-14.8-15-20.6zm-17.7 82.5c-6.6 8.5-17 13.6-27.9 13.6-4.5 0-9-.9-13.2-2.5l-9.5-3.6 5.5-8.5c3.8-5.8 4.6-13 2.2-19.5-2.4-6.5-7.7-11.2-14.3-12.7L8.6 65.2l-3.7-5.9c-6.7-10.7-7.7-24.1-2.6-35.7C6.7 13.3 15.7 5.7 26.6 2.8c13.4-3.6 28.6 1 38.2 10.9 6.8 4.2 10.2 9.4 11 15.2.9 5.9-.6 11.9-4.1 16.8l-6.4 8.8 10 3.9c9.2 3.6 16.3 11.1 19.3 20.4 3.6 11.5 1.4 23.9-5.9 33.3l-1.9 2.6z" />
    </svg>

    <!-- ⚡ SolidJS Official Logo -->
    <svg v-else-if="normalizedIcon === 'solidjs' || normalizedIcon === 'zap'" viewBox="0 0 166 155.3" :class="iconSizes[size]">
      <path fill="#446B9E" d="M163 35.5c-3.4-5.9-9.8-9.5-16.6-9.5H89.9l22.7 22.7 33.8.3c3.4 0 6.6 1.8 8.3 4.7 1.7 3 1.7 6.6 0 9.6l-30 52-22.7-22.7 19.7-34.1H78.8L56.1 35.8h90.3c6.8 0 13.2 3.6 16.6 9.5 3.4 5.9 3.4 13.2 0 19.1l-43 74.5-22.7-22.7 32.7-56.6H90.3L67.6 36.9h42.7l-43 74.5c-3.4 5.9-3.4 13.2 0 19.1 3.4 5.9 9.8 9.5 16.6 9.5h63.5l-22.7-22.7H67.3c-3.4 0-6.6-1.8-8.3-4.7-1.7-3-1.7-6.6 0-9.6l43-74.5 22.7 22.7-32.7 56.6h42.7c6.8 0 13.2-3.6 16.6-9.5 3.4-5.8 3.4-13.1 0-19l-18.3-31.7 22.7 22.7 18.3 31.7c3.4 5.9 3.4 13.2 0 19.1-3.4 5.9-9.8 9.5-16.6 9.5H3c-6.8 0-13.2-3.6-16.6-9.5-3.4-5.9-3.4-13.2 0-19.1L63.5 5.3c3.4-5.9 9.8-9.5 16.6-9.5s13.2 3.6 16.6 9.5l43.6 75.5-22.7-22.7L80.1 14.8c-1.7-3-4.9-4.7-8.3-4.7s-6.6 1.8-8.3 4.7L6.5 95.3c-1.7 3-1.7 6.6 0 9.6 1.7 3 4.9 4.7 8.3 4.7h30.3L67.8 86.9H37.5L80.1 13.2l22.7 22.7L60.2 109.6h30.1l22.7 22.7H37.5l42.6-73.7 22.7 22.7-29.9 51.8h30.1l22.7 22.7H80.1l42.6-73.7 22.7 22.7-29.9 51.8h42.7c6.8 0 13.2-3.6 16.6-9.5 3.4-5.9 3.4-13.2 0-19.1l-11.8-20.5z" />
      <path fill="#2C4F7C" d="M163 54.6c-3.4-5.9-9.8-9.5-16.6-9.5H90.3l22.7 22.7h33.8c3.4 0 6.6 1.8 8.3 4.7 1.7 3 1.7 6.6 0 9.6l-30 52-22.7-22.7 19.7-34.1H78.8L56.1 53.3h90.3c6.8 0 13.2 3.6 16.6 9.5 3.4 5.9 3.4 13.2 0 19.1l-43 74.5-22.7-22.7 32.7-56.6H90.3L67.6 54.4h42.7l-43 74.5c-3.4 5.9-3.4 13.2 0 19.1 3.4 5.9 9.8 9.5 16.6 9.5h63.5l-22.7-22.7H67.3c-3.4 0-6.6-1.8-8.3-4.7-1.7-3-1.7-6.6 0-9.6l43-74.5 22.7 22.7-32.7 56.6h42.7c6.8 0 13.2-3.6 16.6-9.5 3.4-5.8 3.4-13.1 0-19z" />
    </svg>

    <!-- ✨ Preact Official Logo -->
    <svg v-else-if="normalizedIcon === 'preact' || normalizedIcon === 'sparkles'" viewBox="0 0 512 512" :class="iconSizes[size]">
      <path fill="#673AB8" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm-27.2 384.8h-48.4V146.4h72.6c43.6 0 71.4 23.8 71.4 61.2 0 38.6-29 61.6-73.4 61.6h-22.2v115.6zm0-161.4h19.8c18.6 0 29.4-9.6 29.4-23.8 0-14.6-10.8-23.8-29.4-23.8h-19.8v47.6z" />
    </svg>

    <!-- 🚀 Astro Official Logo -->
    <svg v-else-if="normalizedIcon === 'astro'" viewBox="0 0 24 24" :class="iconSizes[size]" fill="none">
      <path d="M8.5 15.5c-.8 0-1.5-.7-1.5-1.5 0-2.8 2.2-5 5-5s5 2.2 5 5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-1.1-.9-2-2-2s-2 .9-2 2c0 .8-.7 1.5-1.5 1.5z" fill="#FF5D01" />
      <path d="M12 2C7 2 3 6.5 3 12c0 2.5 1 4.8 2.6 6.5.6.6 1.4.3 1.7-.4.5-1.1 1.4-2.1 2.7-2.6.5-.2.7-.8.5-1.3C9.9 13.1 9.5 12 9.5 11c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1-.4 2.1-1 3.2-.3.5-.1 1.1.4 1.3 1.3.5 2.2 1.5 2.7 2.6.3.7 1.1 1 1.7.4 1.6-1.7 2.6-4 2.6-6.5 0-5.5-4-10-9-10z" fill="#BC52EE" />
    </svg>

    <!-- 📨 HTMX Official Logo -->
    <svg v-else-if="normalizedIcon === 'htmx' || normalizedIcon === 'send'" viewBox="0 0 24 24" :class="iconSizes[size]">
      <path fill="#3366CC" d="M2.5 7.5L8 12l-5.5 4.5L1 15l4-3-4-3 1.5-1.5zm19 0L16 12l5.5 4.5L23 15l-4-3 4-3-1.5-1.5zM10.8 17h2.4l3.6-10h-2.4l-3.6 10z" />
    </svg>

    <!-- ▲ Next.js Official Logo -->
    <svg v-else-if="normalizedIcon === 'nextjs' || normalizedIcon === 'server'" viewBox="0 0 180 180" :class="iconSizes[size]" fill="none">
      <circle cx="90" cy="90" r="90" class="fill-neutral-900 dark:fill-white" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" class="fill-white dark:fill-neutral-900" />
      <path d="M115 54H127V126H115V54Z" class="fill-white dark:fill-neutral-900" />
    </svg>

    <!-- 💚 Nuxt Official Logo -->
    <svg v-else-if="normalizedIcon === 'nuxtjs' || normalizedIcon === 'cpu'" viewBox="0 0 333 241" :class="iconSizes[size]" fill="none">
      <path d="M227.124 240.23H322.257C328.665 240.23 333.155 233.918 330.122 228.271L248.814 76.9902C245.719 71.2299 237.406 71.1891 234.254 76.9175L194.887 148.468C202.937 151.782 209.689 157.408 214.288 164.673L234.509 130.655C237.661 125.352 245.343 125.393 248.438 130.727L293.743 208.777C296.776 213.993 293.003 220.518 286.966 220.518H209.771C212.839 226.438 218.966 233.125 227.124 240.23Z" fill="#00DC82" />
      <path d="M107.034 186.257L154.512 105.074C157.664 99.6876 165.429 99.7284 168.524 105.147L207.608 173.49C205.281 179.317 204.607 185.679 205.77 191.905L168.442 127.135C165.347 121.758 157.582 121.718 154.43 127.094L94.0257 230.378C90.9932 235.553 94.7262 242.049 100.723 242.049H228.716C227.234 233.513 227.479 226.046 228.716 221.759H123.633C117.596 221.759 113.823 215.234 116.856 210.018L107.034 186.257Z" fill="#00DC82" />
    </svg>

    <!-- 🌊 Tailwind CSS Official Logo -->
    <svg v-else-if="normalizedIcon === 'tailwindcss' || normalizedIcon === 'paintbrush'" viewBox="0 0 24 24" :class="iconSizes[size]" fill="#38BDF8">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z" />
    </svg>

    <!-- 🅱️ Bootstrap Official Logo -->
    <svg v-else-if="normalizedIcon === 'bootstrap' || normalizedIcon === 'box'" viewBox="0 0 24 24" :class="iconSizes[size]">
      <rect width="24" height="24" rx="5" fill="#7952B3" />
      <path d="M8.5 6h4.2c2.2 0 3.8 1.3 3.8 3.3 0 1.3-.8 2.3-2 2.8 1 .5 1.6 1.4 1.6 2.5 0 1.8-1.5 2.9-3.5 2.9H8.5V6zm2.1 1.8v3.2h2c.9 0 1.5-.5 1.5-1.3 0-.8-.6-1.3-1.5-1.3h-2zm0 4.8v3.6h2.2c1 0 1.7-.6 1.7-1.5s-.7-1.5-1.7-1.5h-2.2z" fill="#FFFFFF" />
    </svg>

    <!-- 🌐 HTML5 Official Logo -->
    <svg v-else-if="normalizedIcon === 'html' || normalizedIcon === 'code'" viewBox="0 0 24 24" :class="iconSizes[size]">
      <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3zm14.6 4.6l-.3 3.2h-7.8l.3 3.2h7.2l-.7 7.2-4.3 1.2-4.3-1.2-.3-3.4h2.5l.1 1.7 1.7.5 1.7-.5.2-2.4H7.3l-.8-9.5h11.1z" fill="#E34F26" />
    </svg>

    <!-- 🎨 CSS3 Official Logo -->
    <svg v-else-if="normalizedIcon === 'css' || normalizedIcon === 'palette'" viewBox="0 0 24 24" :class="iconSizes[size]">
      <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3zm14.8 4.6l-.3 3.2h-9.2l.3 3.2h8.6l-.7 7.2-4.5 1.3-4.5-1.3-.3-3.4h2.5l.1 1.7 1.9.5 1.9-.5.2-2.4H7.1l-.8-9.5h11.5z" fill="#1572B6" />
    </svg>

    <!-- 🟡 JavaScript Official Logo -->
    <svg v-else-if="normalizedIcon === 'javascript' || normalizedIcon === 'braces'" viewBox="0 0 24 24" :class="iconSizes[size]">
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path d="M6 14.8c.2.8.8 1.4 1.8 1.4 1 0 1.6-.5 1.6-1.5V9h1.8v5.8c0 2-1.2 3.1-3.3 3.1-1.8 0-2.9-1-3.3-2.2l1.4-.9zm8.5 3c1.3 0 2.2-.6 2.5-1.5l-1.3-.7c-.2.4-.6.7-1.1.7-.6 0-1-.3-1-1 0-.6.4-.9 1.1-1.2l.6-.2c1.3-.5 1.9-1.2 1.9-2.2 0-1.4-1.1-2.2-2.7-2.2-1.3 0-2.3.6-2.7 1.6l1.3.8c.2-.5.7-.9 1.4-.9.7 0 1.1.4 1.1.9 0 .5-.3.8-.9 1l-.6.2c-1.4.5-2.1 1.2-2.1 2.3-.1 1.5 1.1 2.4 2.5 2.4z" fill="#000000" />
    </svg>

    <!-- 🔵 TypeScript Official Logo -->
    <svg v-else-if="normalizedIcon === 'typescript' || normalizedIcon === 'shield'" viewBox="0 0 24 24" :class="iconSizes[size]">
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path d="M4.5 9h5v1.6H7.8v6.4H6.2v-6.4H4.5V9zm8.2 8c1.3 0 2.2-.6 2.5-1.5l-1.3-.7c-.2.4-.6.7-1.1.7-.6 0-1-.3-1-1 0-.6.4-.9 1.1-1.2l.6-.2c1.3-.5 1.9-1.2 1.9-2.2 0-1.4-1.1-2.2-2.7-2.2-1.3 0-2.3.6-2.7 1.6l1.3.8c.2-.5.7-.9 1.4-.9.7 0 1.1.4 1.1.9 0 .5-.3.8-.9 1l-.6.2c-1.4.5-2.1 1.2-2.1 2.3-.1 1.5 1.1 2.4 2.5 2.4z" fill="#FFFFFF" />
    </svg>

    <!-- 🔴 Git Official Logo -->
    <svg v-else-if="normalizedIcon === 'git'" viewBox="0 0 24 24" :class="iconSizes[size]" fill="#F05032">
      <path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.8 4.6l2.7 2.7c.6-.2 1.4-.1 1.9.5.6.6.7 1.4.4 2.1l2.6 2.6c.7-.3 1.5-.2 2.1.4.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.6-.6-.7-1.4-.4-2.1l-2.4-2.4v5.3c.3.2.5.5.6.8.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1.2-.2.4-.4.7-.5V9.7c-.3-.1-.5-.3-.7-.5-.6-.6-.7-1.4-.4-2.1L6.1 4.4 2.4 8.1c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.6.6-1.5.1-2.1z" />
    </svg>

    <!-- 📱 Responsive Viewport SVG -->
    <component :is="MonitorSmartphone" v-else-if="normalizedIcon === 'responsive'" :stroke-width="2" :class="iconSizes[size]" class="text-cyan-500" />

    <!-- ♿ Accessibility SVG -->
    <component :is="Accessibility" v-else-if="normalizedIcon === 'accessibility'" :stroke-width="2" :class="iconSizes[size]" class="text-emerald-500" />

    <!-- 🌐 Network / HTTP SVG -->
    <component :is="Network" v-else-if="normalizedIcon === 'network' || normalizedIcon === 'http-and-apis'" :stroke-width="2" :class="iconSizes[size]" class="text-purple-500" />

    <!-- 🚀 Advanced Topics SVG -->
    <component :is="Rocket" v-else-if="normalizedIcon === 'rocket'" :stroke-width="2" :class="iconSizes[size]" class="text-rose-500" />

    <!-- Fallback -->
    <component :is="Code2" v-else :stroke-width="2" :class="iconSizes[size]" class="text-primary" />
  </span>
</template>