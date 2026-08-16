---
title: 'CSS Preprocessors & Tooling (Sass & PostCSS)'
description: 'Explore Sass/SCSS (variables, mixins, functions, @use), PostCSS (Autoprefixer, CSS nano), and modern build pipelines.'
order: 39
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/css-architecture-at-scale
---

## Why Preprocessors Exist

Before native CSS variables and nesting, preprocessors like **Sass/SCSS** provided modular features:

```scss
// SCSS Module
@use 'sass:color';

$primary-color: #0ea5e9;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  @include flex-center;
  background-color: color.adjust($primary-color, $lightness: 20%);
}
```

---

## PostCSS & Autoprefixer

**PostCSS** transforms modern CSS with JavaScript plugins:
- **Autoprefixer**: Automatically injects vendor prefixes (`-webkit-`, `-moz-`) based on Browserslist targets.
- **cssnano**: Minifies and compresses production CSS bundles.

---

## Summary & Key Takeaways

- Modern CSS has adopted most preprocessor features natively (variables, nesting).
- PostCSS remains essential in modern build pipelines for vendor prefixing and minification.

---

## Practice Challenge

Write an SCSS stylesheet utilizing variables, mixins, and color functions, and compile it to standard CSS.
