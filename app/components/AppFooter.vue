<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 border-t border-border" aria-label="Site information">
    <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
      <div class="max-w-sm">
        <Brand />
        <p class="mt-4 text-sm leading-relaxed text-muted">
          A structured, beginner-friendly path to becoming a front-end developer — from HTML and CSS fundamentals to modern front-end engineering.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-10 sm:grid-cols-3">
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted">Learn</h3>
          <ul class="mt-4 space-y-2.5">
            <li><NuxtLink to="/learn/html" class="text-sm text-ink-soft transition-colors hover:text-primary">HTML</NuxtLink></li>
            <li><NuxtLink to="/learn/css" class="text-sm text-ink-soft transition-colors hover:text-primary">CSS</NuxtLink></li>
            <li><NuxtLink to="/learn/javascript" class="text-sm text-ink-soft transition-colors hover:text-primary">JavaScript</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted">Journey</h3>
          <ul class="mt-4 space-y-2.5">
            <li><NuxtLink to="/roadmap" class="text-sm text-ink-soft transition-colors hover:text-primary">Roadmap</NuxtLink></li>
            <li><NuxtLink to="/diagram" class="text-sm text-ink-soft transition-colors hover:text-primary">Diagram</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-sm text-ink-soft transition-colors hover:text-primary">About Us</NuxtLink></li>
            <li><NuxtLink to="/" class="text-sm text-ink-soft transition-colors hover:text-primary">Home</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted">Stack</h3>
          <ul class="mt-4 space-y-2.5">
            <li><a href="https://nuxt.com" target="_blank" rel="noopener" class="text-sm text-ink-soft transition-colors hover:text-primary">Nuxt</a></li>
            <li><a href="https://tailwindcss.com" target="_blank" rel="noopener" class="text-sm text-ink-soft transition-colors hover:text-primary">Tailwind CSS</a></li>
            <li><a href="https://content.nuxt.com" target="_blank" rel="noopener" class="text-sm text-ink-soft transition-colors hover:text-primary">Nuxt Content</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-border">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
        <p>© {{ year }} Front-Heaven. Built for curious beginners.</p>
        <p>Made with <span class="text-primary">Nuxt</span>, <span class="text-primary">Vue</span> &amp; a love of teaching.</p>
      </div>
    </div>
  </footer>
</template>