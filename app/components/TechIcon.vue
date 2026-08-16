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
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  icon: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  color: '#6366f1',
  size: 'md',
})

const sizes = {
  sm: 'size-9 rounded-xl text-[14px]',
  md: 'size-11 rounded-xl text-lg',
  lg: 'size-14 rounded-2xl text-2xl',
}

const tileStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.color} 0%, color-mix(in srgb, ${props.color} 55%, var(--surface)) 100%)`,
  boxShadow: `0 8px 20px -8px color-mix(in srgb, ${props.color} 55%, transparent)`,
}))

const normalizedIcon = computed(() => (props.icon || '').toLowerCase().trim())
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center text-white select-none transition-transform duration-200"
    :class="sizes[size]"
    :style="tileStyle"
    aria-hidden="true"
  >
    <!-- React Minimal SVG -->
    <svg v-if="normalizedIcon === 'react' || normalizedIcon === 'atom'" viewBox="-11.5 -10.23174 23 20.46348" class="size-6 shrink-0" fill="currentColor">
      <circle cx="0" cy="0" r="2.05" fill="currentColor" />
      <g stroke="currentColor" stroke-width="1.1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>

    <!-- Vue.js Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'vue' || normalizedIcon === 'component'" viewBox="0 0 256 221" class="size-5 shrink-0" fill="currentColor">
      <path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="currentColor" opacity="0.8" />
      <path d="M0 0l128 220.8L256 0h-51.2L128 132.48 49.92 0H0z" fill="currentColor" />
    </svg>

    <!-- Angular Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'angular' || normalizedIcon === 'triangle'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M12 2.5L2.8 5.75l1.4 12.18L12 22.5l7.8-4.57 1.4-12.18L12 2.5zm0 2.45l5.88 13.05h-1.93l-1.18-2.95H9.23l-1.18 2.95H6.12L12 4.95zm-1.88 8.4h3.76L12 8.65l-1.88 4.7z" />
    </svg>

    <!-- Svelte Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'svelte' || normalizedIcon === 'flame'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M21.21 4.54a7.92 7.92 0 0 0-11.45-.98L5.94 6.94a7.91 7.91 0 0 0-.75 11.23 7.92 7.92 0 0 0 11.45.98l3.82-3.38a7.91 7.91 0 0 0 .75-11.23zm-3.34 8.78l-3.82 3.38a4.91 4.91 0 0 1-7.1-.6 4.9 4.9 0 0 1 .46-6.95l1.24-1.1 1.77 2a2.46 2.46 0 0 0-.23 3.48 2.46 2.46 0 0 0 3.55.3l3.82-3.38a2.46 2.46 0 0 0 .23-3.48 2.46 2.46 0 0 0-3.55-.3l-1.24 1.1-1.77-2 1.24-1.1a4.91 4.91 0 0 1 7.1.6 4.9 4.9 0 0 1-.46 6.95z" />
    </svg>

    <!-- SolidJS Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'solidjs' || normalizedIcon === 'zap'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M22.5 15.5l-4.5 4.5-9-1.5-6.5-6.5 4.5-4.5 9 1.5 6.5 6.5zm-9-11l-4.5 4.5 9 1.5 6.5 6.5 4.5-4.5-9-1.5-6.5-6.5zm-6.5 6.5l-4.5 4.5 9 1.5 6.5 6.5 4.5-4.5-9-1.5-6.5-6.5z" />
    </svg>

    <!-- Preact Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'preact' || normalizedIcon === 'sparkles'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4h2v4zm0-6h-2V7h2v3z" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.2" fill="none" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.2" fill="none" transform="rotate(-30 12 12)" />
    </svg>

    <!-- Astro Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'astro'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M8.53 14.65a5.52 5.52 0 0 0 6.94 0l1.45 1.45a7.58 7.58 0 0 1-9.84 0l1.45-1.45z" />
      <path d="M12 2C8.5 4.5 7 8 7 12c0 3.5 1.5 6 5 8 3.5-2 5-4.5 5-8 0-4-1.5-7.5-5-10z" />
    </svg>

    <!-- HTMX Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'htmx' || normalizedIcon === 'send'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M3 7l5 5-5 5 1.5 1.5 6.5-6.5L4.5 5.5 3 7zm18 10l-5-5 5-5-1.5-1.5-6.5 6.5 6.5 6.5 1.5-1.5zm-8 1h-2v2h2v-2z" />
    </svg>

    <!-- Next.js Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'nextjs' || normalizedIcon === 'server'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.7 14.65l-6.87-8.9V16.5H8.3V7.5h1.77l6.63 8.65V7.5h1.53v9.65h-1.53z" />
    </svg>

    <!-- Nuxt Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'nuxtjs' || normalizedIcon === 'cpu'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M17.5 18H23l-5.5-9.5-2.5 4.5 1.5 2.5h-2.5l-3-5.2-4.5 7.7H21l-3.5-6.1 1.5-2.6 4.5 7.7zM9.5 15l3-5.2 3 5.2h-6zM3.5 18l5-8.7L12 15H1.5l2 3z" />
    </svg>

    <!-- Tailwind CSS Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'tailwindcss' || normalizedIcon === 'paintbrush'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M12 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6C13.7 11.8 15 13.2 18 13.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C16.3 7.4 15 6 12 6zm-6 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.6C7.7 17.8 9 19.2 12 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.6C10.3 13.4 9 12 6 12z" />
    </svg>

    <!-- Bootstrap Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'bootstrap' || normalizedIcon === 'box'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm5.5 3v10h4.2c2.2 0 3.8-1.3 3.8-3.3 0-1.3-.8-2.3-2-2.8 1-.5 1.6-1.4 1.6-2.5 0-1.8-1.5-2.9-3.5-2.9H9.5zm2.1 1.8h2c.9 0 1.5.5 1.5 1.3 0 .8-.6 1.3-1.5 1.3h-2V8.8zm0 4.2h2.2c1 0 1.7.6 1.7 1.5s-.7 1.5-1.7 1.5h-2.2V13z" />
    </svg>

    <!-- HTML5 Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'html' || normalizedIcon === 'code'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4zm13.3 4.5l-.2 2.3H8.3l.2 2.3h8.3l-.6 6.5-4.2 1.2-4.2-1.2-.3-3.3h2.3l.1 1.7 2.1.6 2.1-.6.2-2.3H7.8L7 6.5h10.3z" />
    </svg>

    <!-- CSS3 Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'css' || normalizedIcon === 'palette'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4zm13.5 4.5l-.2 2.3H9.8l.2 2.3h7.2l-.6 6.5-4.6 1.3-4.6-1.3-.3-3.3h2.3l.1 1.7 2.5.7 2.5-.7.3-2.7H7.7L7 6.5h10.5z" />
    </svg>

    <!-- JavaScript Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'javascript' || normalizedIcon === 'braces'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M3 3h18v18H3V3zm10.5 14.5c1.4 0 2.2-.7 2.5-1.5l-1.4-.8c-.2.5-.5.8-1.1.8-.7 0-1.2-.5-1.2-1.4V10h-1.8v4.6c0 1.9 1.1 2.9 3 2.9zm4.8 0c1.8 0 2.9-1 2.9-2.5 0-1.4-.9-2.1-2.2-2.6l-.5-.2c-.7-.3-1-.6-1-1.1 0-.5.4-.9 1.1-.9.6 0 1.1.3 1.4.8l1.4-.9c-.6-.9-1.4-1.4-2.8-1.4-1.7 0-2.8 1-2.8 2.4 0 1.3.8 2 2.1 2.5l.5.2c.8.3 1.2.7 1.2 1.2 0 .6-.5 1-1.3 1-.8 0-1.4-.4-1.7-1.1l-1.4.9c.5 1.1 1.6 1.7 3.1 1.7z" />
    </svg>

    <!-- TypeScript Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'typescript' || normalizedIcon === 'shield'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M3 3h18v18H3V3zm3.5 5.5h7V10h-2.5v7h-2v-7H6.5V8.5zm9.5 9c1.8 0 2.9-1 2.9-2.5 0-1.4-.9-2.1-2.2-2.6l-.5-.2c-.7-.3-1-.6-1-1.1 0-.5.4-.9 1.1-.9.6 0 1.1.3 1.4.8l1.4-.9c-.6-.9-1.4-1.4-2.8-1.4-1.7 0-2.8 1-2.8 2.4 0 1.3.8 2 2.1 2.5l.5.2c.8.3 1.2.7 1.2 1.2 0 .6-.5 1-1.3 1-.8 0-1.4-.4-1.7-1.1l-1.4.9c.5 1.1 1.6 1.7 3.1 1.7z" />
    </svg>

    <!-- Git Minimal SVG -->
    <svg v-else-if="normalizedIcon === 'git'" viewBox="0 0 24 24" class="size-5 shrink-0" fill="currentColor">
      <path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.8 4.6l2.7 2.7c.6-.2 1.4-.1 1.9.5.6.6.7 1.4.4 2.1l2.6 2.6c.7-.3 1.5-.2 2.1.4.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.6-.6-.7-1.4-.4-2.1l-2.4-2.4v5.3c.3.2.5.5.6.8.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1.2-.2.4-.4.7-.5V9.7c-.3-.1-.5-.3-.7-.5-.6-.6-.7-1.4-.4-2.1L6.1 4.4 2.4 8.1c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.6.6-1.5.1-2.1z" />
    </svg>

    <!-- Responsive Viewport SVG -->
    <component :is="MonitorSmartphone" v-else-if="normalizedIcon === 'responsive'" :stroke-width="2.2" class="size-5" />

    <!-- Accessibility SVG -->
    <component :is="Accessibility" v-else-if="normalizedIcon === 'accessibility'" :stroke-width="2.2" class="size-5" />

    <!-- Network / HTTP SVG -->
    <component :is="Network" v-else-if="normalizedIcon === 'network' || normalizedIcon === 'http-and-apis'" :stroke-width="2.2" class="size-5" />

    <!-- Fallback -->
    <component :is="Code2" v-else :stroke-width="2.2" class="size-5" />
  </span>
</template>