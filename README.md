# Front-Heaven

A structured, beginner-friendly platform for learning front-end development — from HTML and CSS fundamentals to modern front-end engineering.

## Features

- **Structured roadmap** — 10 stages covering HTML, CSS, JavaScript, Git, responsive design, accessibility, HTTP/APIs, TypeScript, frameworks, and advanced topics
- **44+ lessons** — beginner-friendly, practical, self-contained lessons with real code examples
- **Progress tracking** — mark lessons complete, track your percentage across technologies, resume where you left off
- **Dark mode** — full light/dark theme with system preference detection and manual toggle
- **Search** — instant search across all lessons and technologies (Cmd/Ctrl+K)
- **Responsive** — mobile-first design that works on all screen sizes
- **Accessible** — skip-to-content, screen reader support, keyboard navigation, ARIA attributes, reduced motion respect
- **Offline-ready** — progress stored in localStorage, no sign-up required

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 4](https://nuxt.com) |
| UI Library | [Vue 3](https://vuejs.org) (Composition API + `<script setup>`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Content | [Nuxt Content v3](https://content.nuxt.com) (Markdown-driven) |
| Icons | [Lucide Vue Next](https://lucide.dev) |
| Fonts | Google Fonts (Inter, Space Grotesk, JetBrains Mono) |
| Language | TypeScript (strict mode) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, yarn, or bun

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type checking

```bash
npm run typecheck
```

## Project Structure

```
front-heaven/
├── app/
│   ├── app.vue                 # Root layout (header, page, footer, search)
│   ├── error.vue               # Custom 404/500 error page
│   ├── assets/css/main.css     # Global styles and design tokens
│   ├── components/             # 22 Vue components
│   ├── composables/            # useProgress, useSiteContent, useTheme
│   ├── pages/                  # File-based routing
│   │   ├── index.vue           # Homepage
│   │   ├── roadmap.vue         # Full roadmap
│   │   └── learn/
│   │       └── [technology]/   # Technology + lesson pages
│   ├── types/content.ts        # TypeScript interfaces
│   └── utils/content.ts        # Utility functions
├── content/
│   ├── technologies/           # Technology intro pages (Markdown)
│   └── learn/                  # Lesson content (Markdown)
│       ├── html/               # 7 HTML lessons
│       ├── css/                # 8 CSS lessons
│       ├── javascript/         # 11 JavaScript lessons
│       ├── git/                # 8 Git lessons
│       └── responsive-design/  # 10 Responsive Design lessons
├── public/                     # Static assets (favicon, og-image)
├── nuxt.config.ts
├── tsconfig.json
└── package.json
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, technologies, methodology, featured lessons |
| `/roadmap` | Visual learning roadmap with progress tracking |
| `/learn/:technology` | Technology overview with lesson list |
| `/learn/:technology/:lesson` | Individual lesson with content, TOC, prev/next |

## Content

Lessons are written in Markdown with YAML frontmatter:

```yaml
---
title: 'What is HTML?'
description: 'A brief introduction to HTML and what it does.'
order: 1
difficulty: beginner
category: 'HTML Basics'
estimatedMinutes: 10
prerequisites: []
---
```

## License

Built for curious beginners.
