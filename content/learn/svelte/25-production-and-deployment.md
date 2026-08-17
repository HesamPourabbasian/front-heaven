---
title: 'Production, DevOps & Deployment for SvelteKit'
description: 'Complete guide to production deployment for SvelteKit: GitHub Actions CI/CD pipelines, official adapters (Node, Vercel, Cloudflare), Docker multi-stage builds, and Sentry monitoring.'
order: 25
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/svelte/16-testing
  - /learn/svelte/20-advanced-sveltekit
---

# Production, DevOps & Deployment for SvelteKit

Shipping a feature-complete SvelteKit application is only the first step; maintaining, automating, containerizing, and monitoring that application reliably at global scale in production is the hallmark of a senior software engineer. A modern DevOps pipeline ensures that every code commit is automatically linted, type-checked, tested, compiled into optimized artifacts, containerized with Docker, deployed to global edge infrastructure, and monitored for real-time runtime exceptions.

In this lesson, we will explore SvelteKit's official adapter ecosystem, configure an automated CI/CD pipeline using GitHub Actions, construct multi-stage Docker containers, configure immutable cache headers, and integrate real-time error tracking with Sentry.

## The SvelteKit Adapter Ecosystem

SvelteKit decouples application logic from deployment targets using **Adapters**. By switching the adapter in `svelte.config.js`, you can deploy the exact same application to any hosting platform:

### 1. `@sveltejs/adapter-node` (Standalone Node.js Server)
Builds a standalone Node.js server (`build/index.js`) ideal for Docker containers, Kubernetes, AWS ECS, or traditional virtual private servers (VPS):
```bash
npm install -D @sveltejs/adapter-node
```

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node'

export default {
  kit: {
    adapter: adapter({ out: 'build' })
  }
}
```

### 2. `@sveltejs/adapter-vercel` (Serverless & Edge)
Deploys server routes and SSR pages as Vercel Serverless and Edge Functions with automated CDN routing.

### 3. `@sveltejs/adapter-cloudflare` (Cloudflare Pages/Workers)
Runs your entire full-stack application on Cloudflare's global edge network with ultra-low latency and zero cold starts.

### 4. `@sveltejs/adapter-static` (Static Site Generation)
Exports your entire site as static HTML, CSS, and JS files for hosting on GitHub Pages, AWS S3, or Netlify.

## Continuous Integration & Deployment (CI/CD) with GitHub Actions

A resilient CI/CD pipeline automatically validates pull requests before they can be merged into `main`.

Create `.github/workflows/ci.yml`:

```yaml
name: SvelteKit CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Run svelte-check Typecheck
        run: pnpm run check

      - name: Run Vitest Unit Tests
        run: pnpm run test:unit

      - name: Build Production Artifacts
        run: pnpm run build
```

## Multi-Stage Dockerfile for SvelteKit Node Production

To build a production-ready, ultra-compact Docker container for `@sveltejs/adapter-node`:

```dockerfile
# Stage 1: Build Phase
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Production Runner (Under 75MB total image size!)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "build/index.js"]
```

## HTTP Cache-Control & Asset Invalidation

SvelteKit generates content-hashed filenames for all client bundles (e.g. `/_app/immutable/nodes/0.f8e91a.js`).

To maximize edge CDN speed while ensuring users immediately receive updates on new deployments:
- **Immutable Assets (`/_app/immutable/*`)**: Set `Cache-Control: public, max-age=31536000, immutable`. Browsers and CDNs cache these permanently for 1 year.
- **HTML Pages & Data Endpoints**: Set `Cache-Control: no-cache` or configure SWR (`s-maxage=3600, stale-while-revalidate`).

## Real-Time Error Tracking with Sentry

Catch uncaught exceptions in production using `@sentry/sveltekit`:

```bash
npm install @sentry/sveltekit
```

Initialize in `src/hooks.server.ts`:
```typescript
import * as Sentry from '@sentry/sveltekit'
import { sequence } from '@sveltejs/kit/hooks'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})

export const handle = sequence(Sentry.sentryHandle())
export const handleError = Sentry.handleErrorWithSentry()
```

Initialize in `src/hooks.client.ts`:
```typescript
import * as Sentry from '@sentry/sveltekit'

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
})

export const handleError = Sentry.handleErrorWithSentry()
```

## Best Practices

- **Block Merges on Typecheck and Test Failures**: Enforce `svelte-check` and Vitest test suites in GitHub Actions.
- **Use Multi-Stage Docker Builds**: Exclude devDependencies and source files from production container images.
- **Choose the Optimal SvelteKit Adapter**: Match your hosting platform with the appropriate official adapter (`adapter-node`, `adapter-vercel`, `adapter-cloudflare`).
- **Configure Sentry Source Maps in CI**: Upload `.map` files during build so Sentry displays clean TypeScript stack traces without exposing source maps publicly.

## Summary

Production DevOps bridges feature development and dependable production operations. By configuring official SvelteKit adapters, automating GitHub Actions CI/CD pipelines, containerizing applications with multi-stage Docker builds, configuring immutable cache headers, and tracking live errors with Sentry, you ensure your Svelte applications run with enterprise-grade reliability, security, and performance.
