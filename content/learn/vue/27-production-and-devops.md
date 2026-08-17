---
title: 'Production, DevOps & CI/CD for Vue'
description: 'Complete guide to production deployment for Vue and Nuxt: GitHub Actions CI/CD pipelines, multi-stage Docker builds, Nginx static hosting, Sentry error monitoring, and caching.'
order: 27
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/vue/17-testing-vue-applications
  - /learn/vue/22-nuxt-framework
---

# Production, DevOps & CI/CD for Vue

Building a feature-complete Vue 3 application is only half the journey; deploying, monitoring, automating, and operating that application reliably at scale in production is the hallmark of a senior software engineer. A modern frontend DevOps pipeline ensures that every code change is automatically linted, type-checked, tested, built into optimized artifacts, containerized with Docker, deployed to global edge CDNs, and monitored for real-time runtime errors.

In this lesson, we will build an automated CI/CD pipeline using GitHub Actions, construct multi-stage Docker containers, configure high-performance Nginx static hosting, implement HTTP cache-control headers, and integrate Sentry error tracking.

## Git Workflow Standards & Conventional Commits

Professional engineering teams maintain high repository quality using **Conventional Commits**:
- `feat(scope)`: A new user-facing feature.
- `fix(scope)`: A bug fix.
- `refactor(scope)`: Code restructure without changing behavior.
- `perf(scope)`: Performance improvements.
- `test(scope)`: Adding or correcting tests.
- `chore(scope)`: Build tooling, dependencies, or config updates.

Automate commit validation using `husky` and `commitlint` to ensure all commit messages adhere to team standards before they can be pushed to remote branches.

## Continuous Integration & Deployment (CI/CD) with GitHub Actions

A robust CI/CD pipeline automatically verifies pull requests before merging, preventing broken builds or failing tests from entering the `main` branch.

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm run lint

      - name: Run TypeScript Typecheck
        run: pnpm run typecheck

      - name: Run Vitest Unit Tests
        run: pnpm run test:run

      - name: Build Production Bundle
        run: pnpm run build
```

## Docker Containerization for Vue 3 SPA and Nuxt

Containerizing web applications ensures consistent behavior across development, staging, and production environments.

### 1. Multi-Stage Dockerfile for Vue 3 SPA (with Nginx)
For client-side SPAs, use a multi-stage build that compiles the application with Node.js and serves the static `/dist` directory with a lightweight, ultra-fast Nginx Alpine server:

```dockerfile
# Stage 1: Build the Vue application
FROM node:20-alpine AS build-stage
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 2: Production Nginx Server (Under 25MB total image size!)
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Accompanying `nginx.conf` for SPA Routing:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Immutable Caching for hashed assets in /assets/
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA Fallback: Direct all non-file requests to index.html for Vue Router
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

### 2. Multi-Stage Dockerfile for Nuxt SSR
For Nuxt SSR applications, use a Node.js runtime container running the Nitro server:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

## HTTP Cache-Control & Asset Invalidation

Modern Vite builds generate unique content-hash filenames for every JavaScript, CSS, and asset file (e.g. `index-B192jf.js`).

To maximize user load speeds while ensuring instant updates upon deployment:
- **Hashed Assets (`/assets/*`)**: Set `Cache-Control: public, max-age=31536000, immutable`. Browsers and edge CDNs will cache these files permanently for 1 year, never re-requesting them.
- **Entry HTML (`index.html`)**: Set `Cache-Control: no-cache`. The browser will always check with the server before using a cached `index.html`, ensuring users immediately download new hashed asset URLs whenever a new deployment occurs.

## Real-Time Error Tracking with Sentry

Even with 100% test coverage, unexpected runtime exceptions (unhandled promise rejections, network timeouts, third-party browser extensions) occur in production. **Sentry** captures live runtime exceptions with breadcrumbs, stack traces, and user context.

Install `@sentry/vue`:
```bash
npm install @sentry/vue
```

Initialize in `src/main.ts`:
```typescript
import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // Sample 10% of transactions for performance monitoring
    replaysOnErrorSampleRate: 1.0, // Record 100% of sessions with errors
  })
}

app.use(router)
app.mount('#app')
```

## Edge Hosting & Deployment Platforms

Modern Vue and Nuxt applications are deployed to specialized edge platforms:
- **Vercel / Netlify**: Automated Git-push deployments, instant preview branches for every Pull Request, built-in edge serverless functions, and zero-config Nuxt SSR support.
- **Cloudflare Pages & Workers**: Global distributed edge compute running with sub-10ms TTFB worldwide.
- **AWS S3 + CloudFront**: Scalable, cost-effective static hosting with global CDN distribution.

## Best Practices

- **Automate Quality Gates in CI**: Block merges if `pnpm run typecheck` or `pnpm run test` fails.
- **Enforce Immutable Hashed Caching**: Always set `max-age=31536000, immutable` on static assets and `no-cache` on `index.html`.
- **Use Multi-Stage Docker Builds**: Keep production container image sizes under 50MB by separating build tools from runtime containers.
- **Configure Sentry Source Maps in CI**: Upload `.map` source files during CI builds so Sentry displays clean TypeScript stack traces without exposing source maps publicly to users.

## Summary

Frontend DevOps bridges code creation and dependable production operation. By automating GitHub Actions CI/CD pipelines, containerizing applications with multi-stage Docker builds, configuring optimized Nginx and edge caching headers, and tracking live errors with Sentry, you ensure your Vue 3 applications run with enterprise-grade reliability, security, and performance.
