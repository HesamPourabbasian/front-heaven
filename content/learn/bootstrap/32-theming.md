---
title: 'Theming, Dark Mode & Runtime Theme Switching'
description: 'Master Bootstrap 5.3+ color mode engine: data-bs-theme="dark", runtime 0ms theme switching, custom color modes (sepia, navy), CSS variable cascades, system preference detection, and FOUT prevention.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/31-design-systems
---

# Theming, Dark Mode & Runtime Theme Switching

Bootstrap 5.3 introduced a first-class **Color Mode Engine** enabling light mode, dark mode, and custom multi-brand color themes. Built on CSS Custom Properties, theme switching executes in 0 milliseconds at runtime without full page reloads or downloading alternative stylesheets.

In this lesson, you will master the `data-bs-theme` attribute, author custom color modes, build an instant theme switcher with `localStorage` persistence, and prevent Flash of Unstyled Theme (FOUT).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bootstrap 5.3+ Color Mode Engine                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  <html data-bs-theme="dark">                                                │
│                                                                             │
│  Cascades automatically down to all children:                               │
│  • --bs-body-bg: #212529                                                    │
│  • --bs-body-color: #dee2e6                                                 │
│  • --bs-card-bg: #2b3035                                                    │
│  • --bs-border-color: #495057                                               │
│                                                                             │
│  Localized Component Override:                                              │
│  <div class="card" data-bs-theme="light"> (Forces light mode locally)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The `data-bs-theme` Attribute

Applying `data-bs-theme="dark"` to `<html>` or `<body>` converts the entire page to dark mode:

```html
<!doctype html>
<html lang="en" data-bs-theme="dark">
  <head>
    <meta charset="utf-8">
    <title>Dark Mode Application</title>
    <link href="/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="p-4">
    <div class="card shadow-sm p-4">
      <h3 class="card-title">Dark Mode Card</h3>
      <p class="text-body-secondary">Cards, dropdowns, forms, and tables adapt instantly.</p>
      <button class="btn btn-primary">Primary Action</button>
    </div>
  </body>
</html>
```

### Localized Theme Overrides:
You can invert color modes for specific sections (e.g. a dark navbar inside a light website):

```html
<nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Dark Navbar in Light App</a>
  </div>
</nav>
```

---

## 2. Creating Custom Color Modes (e.g. Sepia & Cyberpunk)

Define custom themes in CSS using data-attributes:

```scss
// Custom Theme Modes
[data-bs-theme="sepia"] {
  --bs-body-bg: #fbf0d9;
  --bs-body-color: #5f4b32;
  --bs-card-bg: #f4e3c1;
  --bs-border-color: #dfcaa2;
  --bs-primary: #8f5b28;
  --bs-secondary-color: #7d6344;
}

[data-bs-theme="cyberpunk"] {
  --bs-body-bg: #0d0221;
  --bs-body-color: #00f0ff;
  --bs-card-bg: #19053b;
  --bs-border-color: #ff007f;
  --bs-primary: #ff007f;
  --bs-secondary-color: #7122fa;
}
```

---

## 3. Production Runtime Theme Switcher Script

Build an accessible theme toggle with OS detection and `localStorage` persistence:

```javascript
// theme-manager.js
const THEME_KEY = 'app-theme-preference';

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Initialize immediately to prevent flash of white screen
setTheme(getPreferredTheme());

// Listen for OS system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (!storedTheme || storedTheme === 'auto') {
    setTheme(getPreferredTheme());
  }
});
```

---

## 4. Preventing Flash of Unstyled Theme (FOUT)

Insert a synchronous inline blocking script in the `<head>` tag *before* stylesheets load:

```html
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('app-theme-preference') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-bs-theme', theme);
    })();
  </script>
  <link rel="stylesheet" href="/css/bootstrap.min.css">
</head>
```

---

## Summary & Key Takeaways

- Bootstrap 5.3+ color modes operate via `data-bs-theme="light|dark|custom"`.
- Applying `data-bs-theme` at the root or component level instantly updates CSS variables.
- Custom modes like `sepia` or `high-contrast` are defined via attribute selectors.
- Synchronous inline `<head>` scripts prevent Flash of Unstyled Theme (FOUT).

## Best Practices & Senior Guidance

1. **Use Theme-Aware Utilities**: Use `.text-body-secondary` and `.bg-body-tertiary` rather than hardcoded `.text-muted` or `.bg-light` so surfaces automatically adjust in dark mode.
2. **Listen to `matchMedia` Changes**: Ensure your application responds live if a user's operating system transitions from daylight to dark mode.
