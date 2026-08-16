---
title: "Production React & DevOps"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 30
order: 40
description: "Production builds, environment variables, CI/CD pipelines, Docker containerization, and Sentry error monitoring."
---

# Production React & DevOps

Shipping a React application to production involves far more than running `npm run build`. Professional engineering requires robust environment variable segregation, automated Continuous Integration and Continuous Deployment (CI/CD) pipelines, Docker containers, and real-time observability with error tracking.

In this lesson, you will explore the end-to-end production workflow: environment configurations, GitHub Actions CI pipelines, Docker builds, and Sentry error monitoring.

## 1. Environment Variable Management

Never hardcode API endpoints or public keys. In Vite, prefix client-safe environment variables with `VITE_`:

```text
# .env.production
VITE_API_BASE_URL=https://api.front-heaven.dev/v1
VITE_SENTRY_DSN=https://example@sentry.io/12345
```

Access variables in your code:
```typescript
const apiEndpoint = import.meta.env.VITE_API_BASE_URL;
```
*(Warning: Never prefix private database credentials or API secrets with `VITE_` as they are bundled into public client JavaScript).*

## 2. GitHub Actions CI/CD Pipeline

Automate linting, type-checking, testing, and deployment on every Pull Request:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build
```

## 3. Production Error Monitoring with Sentry

Catch uncaught exceptions and performance bottlenecks in production:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1, // Sample 10% of production transactions
});
```

## Best Practices

- **Never Commit `.env.local` Files**: Add all local environment files to `.gitignore`.
- **Enforce Branch Protection Rules**: Require CI checks to pass before merging into `main`.
- **Enable Source Maps in Sentry**: Upload source maps securely to Sentry during build to decode minified stack traces.

## Summary

Production readiness requires automating quality gates through CI/CD, managing environment variables cleanly, and monitoring runtime health with Sentry.
