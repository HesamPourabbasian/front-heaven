<script setup lang="ts">
import { ArrowLeft, Compass } from 'lucide-vue-next'

const props = defineProps<{ error: any }>()

useSeoMeta({
  title: props.error?.statusCode === 404 ? 'Page not found — Front-Heaven' : 'Something went wrong — Front-Heaven',
  robots: 'noindex',
})
</script>

<template>
  <main class="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
    <span class="mb-8 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/25" aria-hidden="true">
      <Compass class="size-7" />
    </span>
    <p class="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
      {{ error?.statusCode ?? 500 }}
    </p>
    <h1 class="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
      {{ error?.statusCode === 404 ? 'This page drifted off the roadmap.' : 'Something went wrong.' }}
    </h1>
    <p class="mt-4 max-w-md text-base leading-relaxed text-muted">
      {{ error?.statusCode === 404
        ? 'The page you are looking for does not exist — but your learning journey is still waiting for you.'
        : 'An unexpected error occurred. Please try again.' }}
    </p>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <NuxtLink to="/" class="btn-primary text-sm">
        <ArrowLeft class="size-4" aria-hidden="true" />
        Back to home
      </NuxtLink>
      <NuxtLink to="/roadmap" class="btn-secondary text-sm">
        Explore the roadmap
      </NuxtLink>
    </div>
  </main>
</template>
