<script setup lang="ts">
const { searchOpen } = useUiState()

onMounted(() => {
  useProgress().load()
})

useSeoMeta({
  title: 'Front-Heaven — Learn Front-End Development. The Right Way.',
  description: 'Follow a structured, beginner-friendly path from HTML and CSS fundamentals to modern front-end development. Track your progress, one lesson at a time.',
  ogTitle: 'Front-Heaven — Learn Front-End Development',
  ogDescription: 'A structured path from HTML and CSS fundamentals to modern front-end development, with progress tracking.',
  ogType: 'website',
  ogUrl: 'https://front-heaven.dev',
  ogImage: '/og-image.svg',
  ogSiteName: 'Front-Heaven',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Front-Heaven — Learn Front-End Development',
  twitterDescription: 'A structured path from HTML and CSS fundamentals to modern front-end development.',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="var(--primary)" />
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
  >
    Skip to content
  </a>
  <AppHeader />
  <main id="main">
    <Transition name="page-fade" mode="out-in">
      <NuxtPage />
    </Transition>
  </main>
  <AppFooter />
  <LazySearchModal v-if="searchOpen" />
</template>
