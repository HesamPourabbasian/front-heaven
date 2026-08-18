---
title: 'Cloud Infrastructure, Edge Computing & Containers'
description: 'Master enterprise front-end infrastructure: Anycast CDNs, Multi-Stage Docker builds, Nginx reverse proxy routing, Edge Functions (V8 Isolates), and Cloudflare/AWS/Vercel architecture.'
order: 23
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/22-developer-experience
---

# Cloud Infrastructure, Edge Computing & Containers

A senior front-end engineer must understand how applications are hosted, routed, containerized, and deployed at global scale. Front-end code does not live in a vacuum; it is distributed across **Anycast CDNs**, executed inside lightweight **V8 Edge Isolates**, containerized in **Docker**, and routed through **Nginx Reverse Proxies**.

In this lesson, we explore DNS and Anycast CDNs, multi-stage production Docker containers, Nginx SPA/SSR reverse proxy configurations, and low-latency **Edge Functions**.

```text
┌────────────────────────────────────────────────────────────┐
│               Global Edge Infrastructure Routing           │
├────────────────────────────────────────────────────────────┤
│ Global User Request (e.g. Tokyo, London, São Paulo)        │
│       │                                                    │
│       ▼ (Anycast DNS Routing to Nearest Edge POP)          │
│ Cloudflare / CloudFront Edge CDN Server:                   │
│ ├── 1. Edge Function (A/B Testing, Auth, Geo-Routing)      │
│ ├── 2. Edge Cache (Static Assets & Cached SSR HTML Pages)  │
│ └── 3. Cache MISS? ──► Reverse Proxy / Origin Server Pool  │
├────────────────────────────────────────────────────────────┤
│ Dockerized Origin: Node.js (Nuxt / Next.js) on AWS / K8s   │
└────────────────────────────────────────────────────────────┘
```

## 1. Multi-Stage Production Docker Builds

Containerizing front-end applications requires lean, secure **Multi-Stage Dockerfiles** that build artifacts in a heavy build image but ship only the minimal compiled static files or runtime binary in the final image:

```dockerfile
# Stage 1: Build & Compile
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Production Static Nginx Server
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

The resulting production container image is less than **25 MB**, contains zero build tools or source code, and boots in under 1 second.

## 2. Production Nginx Configuration for Single Page Applications

For client-side SPAs, all unknown paths must fallback to `index.html` while serving static assets with immutable cache headers:

```nginx
# /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip & Brotli Compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # 1. Immutable Long-Term Caching for Fingerprinted Assets
    location ~* \.(?:css|js|woff2?|avif|webp|png|jpg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # 2. SPA Route Fallback (Serves index.html for Vue / React client routing)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # 3. Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

## 3. Serverless vs Edge Functions (V8 Isolates)

- **Traditional Serverless (AWS Lambda / Node.js Containers)**: Spawns a full Node.js virtual environment. Cold starts can take 200ms - 1500ms.
- **Edge Functions (Cloudflare Workers / Vercel Edge / Deno Deploy)**: Executes inside lightweight **V8 Isolates** distributed across hundreds of global CDN Points of Presence (POPs). Cold start times are under **5 milliseconds**:

```typescript
// Edge Middleware (Runs in < 5ms close to the user in Cloudflare / Vercel)
export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const country = request.headers.get("cf-ipcountry") || "US";

  // Geo-targeted A/B testing at the network edge with 0 client JS!
  if (url.pathname === "/") {
    if (country === "DE" || country === "FR") {
      url.pathname = "/eu";
      return Response.redirect(url.toString(), 302);
    }
  }

  // Authentication check at the Edge before hitting origin
  const token = request.headers.get("cookie")?.includes("session_token");
  if (url.pathname.startsWith("/admin") && !token) {
    return new Response("Unauthorized", { status: 401 });
  }

  return fetch(request);
}
```

## 4. Secrets Management & Environment Variables

Never embed private API keys or database connection strings in client-side code:
- **Client-Exposed Variables (`VITE_*`, `NEXT_PUBLIC_*`)**: Embedded directly in compiled JavaScript strings during build time (publicly visible to anyone opening DevTools).
- **Server / Edge Secrets**: Kept in runtime environment stores (AWS Secrets Manager, Cloudflare Secrets, Vercel Environment Variables) and accessed strictly inside server routes or Edge functions.

## Summary

- Multi-stage Docker builds separate build dependencies from minimal production runtime containers.
- Nginx provides high-performance SPA fallback routing (`try_files $uri /index.html`), gzip compression, and security headers.
- Edge Functions execute in lightweight V8 Isolates with sub-5ms cold starts across global CDN POPs.
- Anycast DNS routes user traffic to the geographically closest edge server, minimizing network latency.
- Client environment variables are public; private secrets must remain isolated on server and edge runtimes.

## Best Practices

1. **Use Multi-Stage Dockerfiles**: Reduce container image sizes by 90% and eliminate build tooling from production.
2. **Configure Immutable Caching on Fingerprinted Assets**: Instruct Nginx and CDNs to cache static chunks for 1 year.
3. **Execute Geo-Routing & Auth Checks at the Edge**: Block unauthorized requests before they consume expensive origin server compute.
4. **Never Prefix Secret Keys with `VITE_` or `NEXT_PUBLIC_`**: Keep private API keys strictly on the server tier.
