---
title: "Creating a React Project"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 20
order: 3
description: "Setting up modern React applications using Vite with JavaScript and TypeScript, understanding project structure and scripts."
---

# Creating a React Project

Setting up a modern React project has evolved significantly over the years. While tools like Create React App (CRA) were historically common, modern development relies on lightning-fast build tools like **Vite**. Vite leverages native ES Modules in the browser during development and uses Rollup for optimized production builds.

In this lesson, you will learn how to initialize a new React project from scratch using Vite, understand every file in the standard directory layout, and master the core npm scripts used in professional development.

## Initializing a React App with Vite

To create a new React application, open your terminal and run the interactive Vite initializer:
```bash
npm create vite@latest my-react-app -- --template react-ts
```
*(Replace `react-ts` with `react` if you are scaffolding a pure JavaScript project).*

Once created, navigate into the directory and install dependencies:
```bash
cd my-react-app
npm install
npm run dev
```
Vite will start a local development server with Hot Module Replacement (HMR), typically accessible at `http://localhost:5173`.

## Understanding Project Directory Structure

A standard Vite React project contains several essential files and directories:

```text
my-react-app/
├── node_modules/        # Installed third-party packages
├── public/              # Static assets copied directly to dist (favicons, fonts)
├── src/                 # Application source code
│   ├── assets/          # Component images, SVG icons, and static stylesheets
│   ├── App.css          # App-level styles
│   ├── App.tsx          # Root React application component
│   ├── index.css        # Global CSS styles and Tailwind imports
│   ├── main.tsx         # Entry point mounting React into the real DOM
│   └── vite-env.d.ts    # TypeScript definitions for Vite client types
├── index.html           # The single HTML host shell
├── package.json         # Project metadata, dependencies, and scripts
├── tsconfig.json        # TypeScript compiler configuration
└── vite.config.ts       # Vite plugins and build settings
```

## Deep Dive into Core Files

### 1. `index.html`
Unlike older Webpack configurations where HTML was hidden in build templates, Vite treats `index.html` as the root entry point. It contains a root container div:
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

### 2. `src/main.tsx`
This file bridges the gap between the real browser DOM and the React component tree. It imports `createRoot` from `react-dom/client` and mounts your `<App />` component:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 3. `src/App.tsx`
The main top-level component that serves as the root container for your application features, layouts, and routes.

## Essential npm Commands

You will use four primary scripts defined in `package.json`:
- `npm run dev`: Starts the local development server with instant HMR.
- `npm run build`: Type-checks (in TypeScript projects) and compiles an optimized, minified production bundle in the `dist/` folder.
- `npm run preview`: Spins up a local web server to preview the built `dist/` bundle locally before production deployment.
- `npm run lint`: Executes ESLint to check for code quality and syntax issues.

## React + JavaScript vs React + TypeScript

When creating a React project, you can choose JavaScript (`.jsx`) or TypeScript (`.tsx`). In modern industry development, TypeScript is overwhelmingly favored because it provides static type checking for props, state, API responses, and custom hooks.

TypeScript catches spelling mistakes in prop names and mismatched data types at compile time, eliminating an entire category of common runtime bugs before your code reaches users.

## Best Practices

- **Use Vite over Create React App**: CRA is deprecated and slow. Always use Vite, Next.js, or Remix for modern React development.
- **Keep `src/` Organized Early**: As your project grows, establish dedicated folders for `components/`, `hooks/`, `services/`, and `types/`.
- **Leave `<React.StrictMode>` Enabled**: StrictMode helps identify side effects, deprecated APIs, and unexpected state mutations by intentionally double-invoking component renders in development.

## Summary

Creating a React application with Vite gives you an ultra-fast developer environment with instant HMR and optimized production bundling. By understanding the roles of `index.html`, `main.tsx`, and `package.json`, you have a solid foundation for structuring scalable React projects.
