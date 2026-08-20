---
title: 'Common UI Components: Buttons, Cards, Modals & Navbars'
description: 'Master building production UI components with Tailwind: responsive navigation bars, interactive buttons, content cards, hero banners, modal dialogs, dropdowns, and accessible forms.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/06-states']
---

# Common UI Components: Buttons, Cards, Modals & Navbars

The true power of Tailwind CSS comes from composing atomic utility classes into cohesive, production-ready **UI Components**. Rather than relying on rigid component frameworks with hardcoded CSS overrides, Tailwind gives you total architectural freedom to craft pixel-perfect, accessible components tailored to your brand.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Component Composition Architecture          │
│                                                             │
│   Atomic Utilities         Composition        Component     │
│  ┌─────────────────┐       ┌───────────┐     ┌───────────┐  │
│  │ px-4 py-2       │ ────> │ Composed  │ ──> │ <Button>  │  │
│  │ bg-indigo-600   │       │ Template  │     │ <Card>    │  │
│  │ rounded-lg      │       │ Pattern   │     │ <Modal>   │  │
│  │ font-semibold   │       │           │     │ <Navbar>  │  │
│  └─────────────────┘       └───────────┘     └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Responsive Application Navbar

```html
<nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Brand Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
          FH
        </div>
        <span class="text-xl font-bold text-slate-900">Front-Heaven</span>
      </div>

      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-8">
        <a href="#" class="text-slate-600 hover:text-indigo-600 font-medium transition">Tracks</a>
        <a href="#" class="text-slate-600 hover:text-indigo-600 font-medium transition">Roadmaps</a>
        <a href="#" class="text-slate-600 hover:text-indigo-600 font-medium transition">Certifications</a>
      </div>

      <!-- Action Button -->
      <div class="hidden md:flex items-center gap-4">
        <button class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900">Sign In</button>
        <button class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
          Get Started
        </button>
      </div>
    </div>
  </div>
</nav>
```

## 2. Interactive Feature Card

```html
<div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
  <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  </div>
  <h3 class="text-lg font-bold text-slate-900">High-Velocity Build</h3>
  <p class="text-slate-600 text-sm mt-2 leading-relaxed">
    Compile production styles in under 50ms using modern Rust-based JIT compilers.
  </p>
</div>
```

## Summary & Key Takeaways

- Composing utility classes creates modular, maintainable UI components.
- Combine Flexbox, spacing scales, and state modifiers for interactive components.
- Fixed sticky headers (`sticky top-0 z-50`) provide seamless navigation.

## Best Practices & Senior Guidance

1. **Extract Reusable Components in Your Framework**: In React/Vue/Angular, encapsulate component markup into `<Button>`, `<Card>`, and `<Badge>` components rather than copying raw class strings across templates.
