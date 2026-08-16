---
title: 'Server Routes & Nitro Engine in Nuxt'
description: 'Build backend API endpoints in Nuxt using server/api/ and H3 event handlers.'
order: 2
difficulty: 'advanced'
category: 'Nuxt Full-Stack'
estimatedMinutes: 25
prerequisites:
  - /learn/nuxtjs/introduction-to-nuxtjs
---

## Nitro Server Routes

```ts
// server/api/stats.ts
export default defineEventHandler((event) => {
  return {
    status: 'online',
    timestamp: new Date().toISOString(),
  }
})
```

---

## Summary & Key Takeaways

- Nitro compiles to run seamlessly on Node.js, Vercel, Cloudflare Workers, and Netlify.
