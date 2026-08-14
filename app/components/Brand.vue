<template>
  <NuxtLink
    to="/"
    class="group inline-flex shrink-0 items-center gap-2.5"
    aria-label="Front-Heaven — back to home"
  >
    <span
      class="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105"
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6l-6 6 6 6" />
        <path d="M16 6l6 6-6 6" />
      </svg>
      <span class="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" aria-hidden="true" />
    </span>
    <span class="font-display text-lg font-bold tracking-tight text-ink">
      Front<span class="gradient-text">Heaven</span>
    </span>
  </NuxtLink>
</template>