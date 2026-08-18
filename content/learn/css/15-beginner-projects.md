---
title: 'Beginner Projects: Modern Responsive Component Blueprints'
description: 'Build complete beginner-level CSS components: Profile Card with avatar badge, Tiered SaaS Pricing Section, Sticky Glassmorphism Navbar, and Responsive Grid Image Gallery.'
order: 15
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/css/14-transitions
---

# Beginner Projects: Modern Responsive Component Blueprints

The true test of foundational CSS mastery is synthesizing the box model, typography hierarchies, flexbox alignment, grid coordinates, multi-layered shadows, and smooth transitions into real, production-ready user interface components.

In this capstone lesson for **Level 1 (Beginner)**, we build four essential production UI blueprints: a **Developer Profile Card**, a **3-Tier SaaS Pricing Table**, a **Sticky Glassmorphism Navbar**, and a **Responsive Image Gallery**.

```text
┌────────────────────────────────────────────────────────────┐
│                 Level 1 Beginner Component Showcase        │
├────────────────────────────────────────────────────────────┤
│ 1. Developer Profile Card  (Avatar, Pill Badges, Elevation)│
│ 2. SaaS Pricing Table      (3-Tier Grid, Highlight Badge)  │
│ 3. Glassmorphism Navbar    (Flexbox, Sticky, Backdrop Blur)│
│ 4. Responsive Photo Grid   (auto-fit, object-fit, Hover)   │
└────────────────────────────────────────────────────────────┘
```

## Project Blueprint 1: Developer Profile Card (`profile-card.css`)

```html
<article class="profile-card">
  <div class="avatar-wrapper">
    <img src="/img/avatar.jpg" alt="Hesam Pourabbasian" class="avatar-img" />
    <span class="status-indicator" aria-label="Available for work"></span>
  </div>
  <h2 class="profile-name">Hesam Pourabbasian</h2>
  <p class="profile-role">Senior Front-End Engineer</p>
  <div class="skills-list">
    <span class="skill-pill">Vue 3</span>
    <span class="skill-pill">TypeScript</span>
    <span class="skill-pill">CSS Architecture</span>
  </div>
  <button type="button" class="btn-connect">Connect</button>
</article>
```

```css
.profile-card {
  max-width: 320px;
  padding: 1.75rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 2px 4px -2px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.12);
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3b82f6;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background-color: #22c55e;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.profile-role {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.25rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skill-pill {
  padding: 0.25rem 0.75rem;
  background-color: #f1f5f9;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

.btn-connect {
  width: 100%;
  padding: 0.625rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-connect:hover {
  background-color: #1d4ed8;
}
```

## Project Blueprint 2: Sticky Glassmorphism Navbar (`navbar.css`)

```css
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}

.nav-link:hover, .nav-link.active {
  color: #38bdf8;
}
```

## Summary

- The Profile Card combines rounded avatars, status overlays (`position: absolute`), and hover elevation (`transform: translateY`).
- The Sticky Navbar pairs `position: sticky` with `backdrop-filter: blur()` for modern glassmorphism.
- Fluid typography and flexbox pill badges create clean, self-adapting user interface elements.
- Consistent modular design systems use clean variables for padding, borders, and transitions.

## Best Practices

1. **Keep Component Styles Encapsulated**: Use specific class names (`.profile-card__avatar`) to prevent leaking.
2. **Combine `transform: translateY(-4px)` with `box-shadow` on Hover**: Deliver natural depth feedback.
3. **Always Add `object-fit: cover` on Avatars**: Prevent distorted user profile images.
4. **Use Translucent RGBA with `backdrop-filter`**: Maintain legibility when scrolling over varied page content.
