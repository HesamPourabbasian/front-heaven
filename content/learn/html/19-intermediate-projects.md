---
title: 'Intermediate Projects: Advanced Accessible Systems'
description: 'Build intermediate-level production web applications: Accessible Analytics Dashboard, E-Commerce Product Page with Art Direction, and a Multi-Step Wizard Registration Portal.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/html/18-html-css-javascript
---

# Intermediate Projects: Advanced Accessible Systems

Advancing to the intermediate level of front-end engineering requires building complex, multi-component systems that seamlessly integrate accessible dialogs, responsive media art direction, constraint-validated forms, and live status regions.

In this capstone lesson for **Level 2 (Intermediate)**, we construct full production-grade blueprints for two comprehensive projects: an **Accessible Analytics Dashboard** and an **E-Commerce Product Experience with Art Direction & Native Modals**.

```text
┌────────────────────────────────────────────────────────────┐
│                 Level 2 Intermediate Project Matrix        │
├────────────────────────────────────────────────────────────┤
│ 1. Accessible Analytics Dashboard                          │
│ (Landmarks, Tabular Benchmarks, Meter Gauges, Live Regions)│
├────────────────────────────────────────────────────────────┤
│ 2. E-Commerce Product Experience                           │
│ (Picture Art Direction, Native Dialog Modal, Form Controls)│
└────────────────────────────────────────────────────────────┘
```

## Project Blueprint 1: Accessible Analytics Dashboard (`dashboard.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enterprise Analytics Dashboard — Front-Heaven</title>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to main dashboard</a>

    <header>
      <nav aria-label="Dashboard Top Navigation">
        <h2>Enterprise Ops</h2>
        <ul>
          <li><a href="/overview" aria-current="page">Overview</a></li>
          <li><a href="/metrics">Metrics</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>
    </header>

    <main id="main-content" tabindex="-1">
      <h1>Infrastructure Health & Performance</h1>

      <!-- Live Status Announcement Region -->
      <div aria-live="polite" class="status-banner" role="status">
        All edge services operational. Zero degraded endpoints.
      </div>

      <!-- Metric Gauges -->
      <section aria-labelledby="gauges-heading">
        <h2 id="gauges-heading">Resource Utilization</h2>
        <div class="metrics-grid">
          <div>
            <label for="cpu-meter">CPU Usage (Cluster A):</label>
            <meter id="cpu-meter" min="0" max="100" low="40" high="80" optimum="30" value="62">
              62%
            </meter>
          </div>
          <div>
            <label for="mem-meter">Memory Allocation:</label>
            <meter id="mem-meter" min="0" max="100" low="50" high="85" optimum="40" value="45">
              45%
            </meter>
          </div>
        </div>
      </section>

      <!-- Tabular Performance Data -->
      <section aria-labelledby="latency-heading">
        <h2 id="latency-heading">Regional Latency Breakdown</h2>
        <table>
          <caption>P95 Response Latency by Edge Point of Presence (POP)</caption>
          <thead>
            <tr>
              <th scope="col">Edge Location</th>
              <th scope="col">Throughput</th>
              <th scope="col">P95 Latency</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Tokyo (NRT)</th>
              <td>45k req/s</td>
              <td>18ms</td>
              <td>Optimal</td>
            </tr>
            <tr>
              <th scope="row">Frankfurt (FRA)</th>
              <td>62k req/s</td>
              <td>22ms</td>
              <td>Optimal</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>
```

## Project Blueprint 2: E-Commerce Product Page with Native Dialog

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ergonomic Developer Chair — Front-Heaven Store</title>
  </head>
  <body>
    <main>
      <article class="product-layout">
        <!-- Responsive Media with Art Direction -->
        <figure>
          <picture>
            <source media="(max-width: 640px)" srcset="/img/chair-square.avif" type="image/avif" />
            <source srcset="/img/chair-wide.avif" type="image/avif" />
            <img
              src="/img/chair-wide.jpg"
              alt="Ergonomic mesh office chair in matte black finish"
              width="800"
              height="600"
              fetchpriority="high"
            />
          </picture>
          <figcaption>Custom lumbar support with breathable 3D mesh.</figcaption>
        </figure>

        <!-- Product Purchase Form -->
        <section aria-labelledby="product-title">
          <h1 id="product-title">Ergonomic Pro Chair v2</h1>
          <p class="price">$499.00 <del>$599.00</del></p>

          <form action="/api/cart/add" method="POST">
            <fieldset>
              <legend>Select Color Finish</legend>
              <label><input type="radio" name="color" value="matte-black" checked /> Matte Black</label>
              <label><input type="radio" name="color" value="slate-gray" /> Slate Gray</label>
            </fieldset>

            <label for="qty-input">Quantity</label>
            <input type="number" id="qty-input" name="quantity" min="1" max="5" value="1" required />

            <button type="submit">Add to Shopping Bag</button>
            <button type="button" id="open-size-guide-btn">View Dimensions Guide</button>
          </form>
        </section>
      </article>

      <!-- Native Size Guide Modal Dialog -->
      <dialog id="size-guide-modal" aria-labelledby="modal-title">
        <form method="dialog">
          <h2 id="modal-title">Chair Dimensions & Adjustment Specs</h2>
          <p>Height: 110cm–125cm | Width: 68cm | Seat Depth: 52cm</p>
          <button value="close">Close Guide</button>
        </form>
      </dialog>
    </main>

    <script>
      const modal = document.getElementById('size-guide-modal');
      document.getElementById('open-size-guide-btn').addEventListener('click', () => {
        modal.showModal();
      });
    </script>
  </body>
</html>
```

## Summary

- The Analytics Dashboard demonstrates accessible tabular layouts, real-time live regions, and `<meter>` gauges.
- The E-Commerce blueprint pairs responsive `<picture>` art direction with native `<dialog>` modal popups.
- Skip links provide direct keyboard accessibility to primary dashboards.
- Proper use of `<meter>` and `<caption>` ensures clarity across desktop screens and screen readers.

## Best Practices

1. **Verify Keyboard Navigation Across Modals**: Ensure `Escape` closes the `<dialog>` and restores focus.
2. **Combine `aria-live` with Status Banners**: Keep screen reader users informed of real-time background updates.
3. **Use `<picture>` for High-Value Product Imagery**: Deliver square crops on mobile and widescreen banners on desktop.
4. **Use `<meter>` for Capacity Utilization**: Display disk, memory, and bandwidth gauges semantically.
