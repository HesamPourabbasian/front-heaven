---
title: 'Intermediate Projects: Production SaaS Dashboards & Theming'
description: 'Build complete intermediate-level CSS applications: Responsive Analytics SaaS Dashboard with Subgrid, Floating Multi-Theme System, and Interactive Pricing Switcher.'
order: 30
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/css/29-frameworks-and-tools
---

# Intermediate Projects: Production SaaS Dashboards & Theming

At the intermediate level of front-end engineering, you must be capable of architecting entire multi-panel web applications that seamlessly combine **CSS Grid Template Areas**, **CSS Subgrid**, **Container Queries**, dynamic **CSS Variables**, and smooth GPU transitions.

In this capstone lesson for **Level 2 (Intermediate)**, we construct a complete, fully functional production blueprint: a **Responsive SaaS Analytics Dashboard Shell with Subgrid and Dynamic Dark Mode Theming**.

```text
┌────────────────────────────────────────────────────────────┐
│                 Level 2 Intermediate Project Blueprint     │
├────────────────────────────────────────────────────────────┤
│ ┌── App Header (Sticky, Glassmorphism, Theme Switcher) ──┐ │
│ ├── Sidebar (Fixed width, Independent Scroll) ───────────┤ │
│ └── Main Content Area                                    │ │
│     ├── Stat Cards (Subgrid alignment across cards)      │ │
│     ├── Metric Charts (CSS Conic Gradients & Tooltips)   │ │
│     └── Responsive Data Feed (Container Queries)         │ │
└────────────────────────────────────────────────────────────┘
```

## Complete Project Blueprint: Enterprise SaaS Dashboard (`dashboard.css`)

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Analytics Pro Dashboard</title>
  <link rel="stylesheet" href="dashboard.css" />
</head>
<body>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div class="brand">Front-Heaven Ops</div>
      <div class="header-actions">
        <button id="theme-toggle" class="btn-icon" aria-label="Toggle theme">🌓</button>
      </div>
    </header>

    <!-- Sidebar Navigation -->
    <aside class="app-sidebar">
      <nav class="sidebar-nav">
        <a href="#overview" class="nav-item nav-item--active">Overview</a>
        <a href="#servers" class="nav-item">Edge Servers</a>
        <a href="#billing" class="nav-item">Billing</a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="app-main">
      <h1>Infrastructure Performance</h1>

      <!-- Stats Grid using CSS Subgrid -->
      <section class="stats-grid">
        <article class="stat-card">
          <span class="stat-card__eyebrow">API Requests</span>
          <strong class="stat-card__value">4.2M</strong>
          <span class="stat-card__change stat-card__change--positive">+14% vs last week</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__eyebrow">P95 Latency</span>
          <strong class="stat-card__value">18ms</strong>
          <span class="stat-card__change stat-card__change--positive">-4ms vs last week</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__eyebrow">Error Rate</span>
          <strong class="stat-card__value">0.002%</strong>
          <span class="stat-card__change stat-card__change--neutral">Unchanged</span>
        </article>
      </section>
    </main>
  </div>
</body>
</html>
```

```css
/* dashboard.css - Enterprise Design Tokens & Theming */
:root {
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --accent-primary: #2563eb;
  --accent-positive: #16a34a;
  --radius-lg: 0.75rem;
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --bg-app: #090d16;
  --bg-surface: #0f172a;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --border-color: #1e293b;
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}

/* Universal Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: var(--bg-app);
  color: var(--text-primary);
  line-height: 1.5;
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* 2D Grid Application Shell */
.app-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  min-height: 100dvh;
}

.app-header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 2rem;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.app-sidebar {
  grid-area: sidebar;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  padding: 1.5rem 1rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.625rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.nav-item:hover, .nav-item--active {
  background-color: var(--bg-app);
  color: var(--accent-primary);
}

.app-main {
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
}

/* Stats Grid using CSS Subgrid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* Aligns eyebrow, value, and change indicator across cards */
  padding: 1.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-card__eyebrow {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-card__change {
  font-size: 0.875rem;
}

.stat-card__change--positive {
  color: var(--accent-positive);
}

/* Responsive Mobile Breakpoint */
@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main";
  }
  .app-sidebar {
    display: none;
  }
}
```

## Summary

- The SaaS Dashboard blueprint combines Grid Template Areas, Subgrid card rows, and BEM modular naming.
- Semantic CSS Custom Properties drive instantaneous zero-reload dark mode switching.
- `100dvh` ensures the full-height desktop shell fits mobile device viewports without overflow.
- Subgrid keeps metric values and percentage changes aligned on identical horizontal baselines.

## Best Practices

1. **Keep Layout Shell Defined by Grid Areas**: Reorganize mobile layouts with a single `@media` grid-template-areas shift.
2. **Use Subgrid for Multi-Row Card Alignments**: Prevent mismatched button baselines across dynamic content.
3. **Use Semantic Variables Across All Components**: Never hardcode hex values inside component blocks.
4. **Transition Background-Color on Theme Switch**: Deliver smooth visual transitions during dark/light mode toggles.
