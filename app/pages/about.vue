<script setup lang="ts">
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  Layers,
  Map,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  Zap,
} from 'lucide-vue-next'

useSeoMeta({
  title: 'About Me — Front-Heaven',
  description: 'Learn about Front-Heaven, our mission to make front-end development accessible to everyone, our step-by-step learning methodology, and meet the creator Hesam Pourabbasian.',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://front-heaven.dev/about' }],
})

const learningSteps = [
  {
    step: '01',
    title: 'Core Web Foundations',
    subtitle: 'HTML5 & Modern CSS3',
    icon: Code2,
    color: '#f97316',
    description:
      'Every web journey begins with structure and style. Master semantic markup, web accessibility (WCAG/a11y), responsive layouts with Flexbox and CSS Grid, fluid typography, and custom CSS design properties.',
    skills: ['Semantic HTML5', 'CSS Grid & Flexbox', 'Responsive Design', 'Accessibility (a11y)', 'CSS Variables'],
    milestone: 'Build an accessible, mobile-first responsive portfolio website from scratch.',
  },
  {
    step: '02',
    title: 'The Programming Engine',
    subtitle: 'JavaScript & TypeScript',
    icon: Zap,
    color: '#eab308',
    description:
      'Transform static pages into interactive web applications. Deeply understand modern ECMAScript (ES2022+), scope, closures, the event loop, async/await, and DOM manipulation, followed by static typing, interfaces, and generics with TypeScript.',
    skills: ['Modern ESNext', 'Async & Promises', 'DOM Manipulation', 'TypeScript Generics', 'Strict Type Safety'],
    milestone: 'Build a fully typed interactive task and data-tracking application.',
  },
  {
    step: '03',
    title: 'Tooling & Network Protocols',
    subtitle: 'Git, GitHub & REST APIs',
    icon: Terminal,
    color: '#8b5cf6',
    description:
      'Work like a professional software engineer. Master Git branching and GitHub collaboration workflows, learn how browsers communicate with servers over HTTP/HTTPS, and fetch data from RESTful APIs with Fetch and Axios.',
    skills: ['Git Version Control', 'GitHub Workflows', 'RESTful APIs', 'JSON & Async Fetching', 'Vite Build Tool'],
    milestone: 'Connect frontend clients to live third-party REST APIs with error handling.',
  },
  {
    step: '04',
    title: 'Component Frameworks',
    subtitle: 'React, Vue, Svelte or Angular',
    icon: Layers,
    color: '#10b981',
    description:
      'Scale your applications with declarative component-driven architectures. Master reactive state management (Pinia, Redux), component props and custom events, client-side routing, and reusable UI design patterns.',
    skills: ['Component Architecture', 'Declarative Reactivity', 'State Management', 'Client-Side Routing', 'Virtual DOM & Signals'],
    milestone: 'Build a multi-page Single-Page Application (SPA) with centralized state.',
  },
  {
    step: '05',
    title: 'Full-Stack Meta-Frameworks',
    subtitle: 'Next.js & Nuxt',
    icon: Cpu,
    color: '#06b6d4',
    description:
      'Level up to production-grade web engineering. Harness Server-Side Rendering (SSR), Static Site Generation (SSG), file-based routing, server-side API endpoints, SEO optimization, and Edge rendering.',
    skills: ['Universal SSR / SSG', 'Server Routes & Nitro', 'React Server Components', 'SEO & OpenGraph', 'Edge Deployment'],
    milestone: 'Deploy a lightning-fast, SEO-optimized full-stack web platform.',
  },
  {
    step: '06',
    title: 'Styling, Testing & DevOps',
    subtitle: 'Tailwind CSS, Vitest & CI/CD',
    icon: Rocket,
    color: '#f43f5e',
    description:
      'Polish your applications to enterprise standards. Compose modern UIs with Tailwind CSS v4, write reliable unit and integration tests with Vitest, optimize Core Web Vitals, and automate deployments with CI/CD pipelines.',
    skills: ['Tailwind CSS v4', 'Vitest Unit Testing', 'Web Vitals & Performance', 'CI/CD Pipelines', 'Production Security'],
    milestone: 'Publish tested, benchmarked, production-ready web applications to global CDNs.',
  },
]

const platformHighlights = [
  {
    title: 'Zero Fluff, 100% Practical',
    description: 'Every lesson is designed to be concise, practical, and immediately applicable with real-world code snippets.',
    icon: Sparkles,
  },
  {
    title: 'Visual Learning Roadmaps',
    description: 'Interactive roadmap stages and full architectural diagrams give you clear mental models of how technologies connect.',
    icon: Map,
  },
  {
    title: 'Offline & Privacy-First',
    description: 'No account required. Your learning progress, completed lessons, and notes are saved directly in your browser.',
    icon: ShieldCheck,
  },
  {
    title: 'Free & Open Source',
    description: 'Built with open-source technologies for the global developer community. Learn at your own pace without paywalls.',
    icon: Heart,
  },
]
</script>

<template>
  <div class="relative overflow-clip">
    <!-- Hero Section -->
    <section class="relative mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 lg:px-8">
      <div class="text-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-semibold text-muted">
          <Globe class="size-3.5 text-primary" aria-hidden="true" />
          About Front-Heaven
        </p>

        <h1 class="mt-6 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          Empowering Developers to Master <br class="hidden sm:inline" />
          <span class="gradient-text">Modern Front-End</span>
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Front-Heaven is a free, structured, and modern learning platform built to guide developers from their very first HTML tag all the way to enterprise-grade full-stack front-end engineering.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/roadmap"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
          >
            Explore the Roadmap
            <ArrowRight class="size-4" />
          </NuxtLink>
          <NuxtLink
            to="/learn/html"
            class="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-border-strong hover:bg-surface-2"
          >
            <BookOpen class="size-4 text-primary" />
            Start Learning HTML
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Platform Purpose & Philosophy -->
    <section class="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="rounded-3xl border border-border bg-surface p-8 sm:p-12 shadow-xs">
        <div class="max-w-3xl">
          <h2 class="text-xs font-semibold uppercase tracking-widest text-primary">Our Mission</h2>
          <h3 class="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            Why Front-Heaven was Created
          </h3>
          <p class="mt-4 text-base leading-relaxed text-muted">
            The modern front-end ecosystem is vast and often overwhelming. Beginners are frequently inundated with fragmented tutorials, outdated legacy courses, conflicting advice, and decision fatigue over which frameworks or tools to learn.
          </p>
          <p class="mt-4 text-base leading-relaxed text-muted">
            <strong class="text-ink font-semibold">Front-Heaven eliminates the guesswork.</strong> We provide a carefully curated, sequential learning path where every concept builds naturally on the previous one. We focus on teaching foundational web standards first, ensuring you understand <em>why</em> modern frameworks exist before diving into complex abstractions.
          </p>
        </div>

        <div class="mt-10 grid gap-6 sm:grid-cols-2">
          <div
            v-for="item in platformHighlights"
            :key="item.title"
            class="flex items-start gap-4 rounded-2xl border border-border/70 bg-surface-2/50 p-5 transition-all duration-200 hover:border-border-strong hover:bg-surface-2"
          >
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <component :is="item.icon" class="size-5" />
            </div>
            <div>
              <h4 class="font-semibold text-ink text-sm sm:text-base">{{ item.title }}</h4>
              <p class="mt-1 text-xs sm:text-sm text-muted leading-relaxed">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Step-by-Step Learning Guide -->
    <section class="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-semibold text-muted">
          <Map class="size-3.5 text-primary" aria-hidden="true" />
          The Step-by-Step Methodology
        </p>
        <h2 class="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          How You Should Learn Front-End Development
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Follow these six progressive stages in sequence. Avoid skipping fundamentals—each stage provides the essential mental model required for the next.
        </p>
      </div>

      <div class="mt-12 space-y-6">
        <div
          v-for="(stage, idx) in learningSteps"
          :key="stage.step"
          class="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-border-strong hover:shadow-lg"
        >
          <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <!-- Left Info -->
            <div class="flex items-start gap-4 sm:gap-5">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-2xl font-mono text-base font-bold shadow-xs transition-transform duration-200 group-hover:scale-105"
                :style="{ backgroundColor: `${stage.color}15`, color: stage.color, borderColor: `${stage.color}40` }"
              >
                <component :is="stage.icon" class="size-6" />
              </div>

              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-mono text-xs font-bold tracking-wider uppercase text-muted">
                    Stage {{ stage.step }}
                  </span>
                  <span class="text-muted/40">•</span>
                  <span class="text-xs font-medium" :style="{ color: stage.color }">
                    {{ stage.subtitle }}
                  </span>
                </div>
                <h3 class="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">
                  {{ stage.title }}
                </h3>
                <p class="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {{ stage.description }}
                </p>

                <!-- Key Skills Badges -->
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="skill in stage.skills"
                    :key="skill"
                    class="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink-soft"
                  >
                    <CheckCircle2 class="size-3 text-primary" />
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Milestone Card -->
            <div class="shrink-0 lg:max-w-xs w-full rounded-2xl border border-border/80 bg-surface-2/60 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Flame class="size-3.5 text-amber-500" />
                Milestone Project
              </p>
              <p class="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                {{ stage.milestone }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Meet the Creator Section -->
    <section class="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-surface-2 p-8 sm:p-12 shadow-md">
        <div class="text-center sm:text-left">
          <p class="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-1.5 text-xs font-semibold text-muted">
            <User class="size-3.5 text-primary" aria-hidden="true" />
            Meet the Creator
          </p>
          <h2 class="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
            Built with Passion by <span class="gradient-text">Hesam Pourabbasian</span>
          </h2>
        </div>

        <div class="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="size-28 sm:size-36 overflow-hidden rounded-3xl border-2 border-primary/40 shadow-xl">
              <img
                src="https://avatars.githubusercontent.com/u/137700266?v=4"
                alt="Hesam Pourabbasian"
                class="size-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-xl bg-surface border border-border shadow-md text-base" title="In love with coding">
              🖥️
            </div>
          </div>

          <!-- Bio & Details -->
          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 class="text-xl font-bold text-ink">Hesam Pourabbasian</h3>
              <span class="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Front-End Developer
              </span>
            </div>

            <p class="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted">
              <MapPin class="size-3.5 text-muted" />
              Tabriz, Iran
            </p>

            <p class="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              Hi! I'm <strong class="text-ink">Hesam Pourabbasian</strong>, a front-end developer with a deep love for clean code, intuitive user interfaces, and modern web architecture.
            </p>
            <p class="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              I built <strong class="text-ink">Front-Heaven</strong> to give aspiring developers the structured, high-quality, and completely free roadmap that I wished I had when starting out. My goal is to break down complex architectural patterns into crystal-clear, hands-on lessons with zero fluff.
            </p>

            <!-- Shields.io Badges -->
            <div class="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href="https://github.com/HesamPourabbasian"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex transition-transform hover:scale-105 active:scale-95"
                aria-label="GitHub Profile Badge"
              >
                <img
                  src="https://img.shields.io/badge/GitHub-HesamPourabbasian-181717?style=for-the-badge&logo=github&logoColor=white"
                  alt="GitHub - HesamPourabbasian"
                  class="h-7.5 rounded-lg object-contain shadow-xs"
                />
              </a>

              <a
                href="https://github.com/HesamPourabbasian?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex transition-transform hover:scale-105 active:scale-95"
                aria-label="GitHub Repositories Badge"
              >
                <img
                  src="https://img.shields.io/badge/Repositories-6_Open_Source-blue?style=for-the-badge&logo=git&logoColor=white"
                  alt="Repositories Badge"
                  class="h-7.5 rounded-lg object-contain shadow-xs"
                />
              </a>

              <a
                href="https://github.com/HesamPourabbasian"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-primary hover:text-primary"
              >
                Follow on GitHub
                <ExternalLink class="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="relative mx-auto max-w-5xl px-4 pt-4 pb-20 sm:px-6 lg:px-8 text-center">
      <div class="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12">
        <h2 class="font-display text-2xl font-bold text-ink sm:text-3xl">
          Start Your Front-End Journey Today
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Join thousands of learners mastering HTML, CSS, JavaScript, TypeScript, and modern frameworks with Front-Heaven.
        </p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
          <NuxtLink
            to="/roadmap"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-hover"
          >
            View Complete Roadmap
            <ArrowRight class="size-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
