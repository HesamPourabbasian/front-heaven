<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (!el.value) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  )
  observer.observe(el.value)
})
</script>

<template>
  <div ref="el" class="reveal" :class="{ 'is-visible': visible }">
    <slot />
  </div>
</template>
