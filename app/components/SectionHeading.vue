<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  id?: string
}>(), {
  eyebrow: '',
  description: '',
  align: 'left',
  id: '',
})
</script>

<template>
  <div class="max-w-2xl" :class="align === 'center' ? 'mx-auto text-center' : ''">
    <p
      v-if="eyebrow"
      class="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
    >
      {{ eyebrow }}
    </p>
    <h2 :id="id || undefined" class="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-4 text-base leading-relaxed text-muted">
      {{ description }}
    </p>
  </div>
</template>