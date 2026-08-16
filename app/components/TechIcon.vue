<script setup lang="ts">
import {
  Accessibility,
  Atom,
  Box,
  Braces,
  Component as ComponentIcon,
  Cpu,
  FileCode,
  Flame,
  GitBranch,
  Layers,
  MonitorSmartphone,
  Network,
  Paintbrush,
  Palette,
  Rocket,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Triangle,
  Zap,
} from 'lucide-vue-next'
import type { Component } from 'vue'

const ICONS: Record<string, Component> = {
  code: FileCode,
  palette: Palette,
  braces: Braces,
  git: GitBranch,
  responsive: MonitorSmartphone,
  accessibility: Accessibility,
  network: Network,
  shield: ShieldCheck,
  layers: Layers,
  rocket: Rocket,
  atom: Atom,
  react: Atom,
  component: ComponentIcon,
  vue: ComponentIcon,
  triangle: Triangle,
  angular: Triangle,
  flame: Flame,
  svelte: Flame,
  zap: Zap,
  solidjs: Zap,
  sparkles: Sparkles,
  preact: Sparkles,
  astro: Rocket,
  send: Send,
  htmx: Send,
  server: Server,
  nextjs: Server,
  cpu: Cpu,
  nuxtjs: Cpu,
  paintbrush: Paintbrush,
  tailwindcss: Paintbrush,
  box: Box,
  bootstrap: Box,
}

const props = withDefaults(defineProps<{
  icon: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  color: '#6366f1',
  size: 'md',
})

const iconComponent = computed(() => ICONS[props.icon] ?? FileCode)

const sizes = {
  sm: 'size-9 rounded-xl text-[15px]',
  md: 'size-11 rounded-xl text-lg',
  lg: 'size-14 rounded-2xl text-2xl',
}

const tileStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.color} 0%, color-mix(in srgb, ${props.color} 55%, var(--surface)) 100%)`,
  boxShadow: `0 8px 20px -8px color-mix(in srgb, ${props.color} 55%, transparent)`,
}))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center text-white"
    :class="sizes[size]"
    :style="tileStyle"
    aria-hidden="true"
  >
    <component :is="iconComponent" :stroke-width="2.2" />
  </span>
</template>