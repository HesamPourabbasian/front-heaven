---
title: 'Intermediate Projects & Full-Featured Applications'
description: 'Build 7 advanced intermediate Bootstrap 5 projects: responsive e-commerce storefront with offcanvas cart, SaaS analytics dashboard, CRM data portal, admin control panel, modern blog platform, multi-page business website, and custom component library.'
order: 27
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites:
  - /learn/bootstrap/13-advanced-grid
  - /learn/bootstrap/18-advanced-components
  - /learn/bootstrap/19-forms-advanced
  - /learn/bootstrap/20-tables
  - /learn/bootstrap/22-sass
---

# Intermediate Projects & Full-Featured Applications

At the intermediate level, building production applications means orchestrating complex layout hierarchies, responsive drawers, data-dense tables, dynamic modal workflows, and customized Sass themes. In this project lab, you will construct 7 production-grade web applications.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Level 2 Intermediate Projects Lab                      │
├───────┬───────────────────────────────┬─────────────────────────────────────┤
│ Lab   │ Project Title                 │ Key Concepts Exercised              │
├───────┼───────────────────────────────┼─────────────────────────────────────┤
│ Lab 1 │ Responsive E-Commerce App     │ Filter Offcanvas, Cart Drawer, Badges│
│ Lab 2 │ SaaS Analytics Dashboard      │ Dark Sidebar, Metric Charts, Tables │
│ Lab 3 │ Enterprise CRM Portal         │ Search Filter, Data Modals, Avatars │
│ Lab 4 │ Multi-Step Admin Panel        │ Step Tabs, Form Validation, Alerts  │
│ Lab 5 │ Editorial Blog Platform       │ Hero Feature, Category Badges, Cards│
│ Lab 6 │ Multi-Page Corporate Website  │ Sticky Navbar, Testimonials, FAQ    │
│ Lab 7 │ Custom Component Library      │ Sass Theme Overrides, Story Tokens  │
└───────┴───────────────────────────────┴─────────────────────────────────────┘
```

---

## Lab 1: SaaS Analytics Dashboard with Dark Sidebar

An enterprise dashboard with a fixed dark sidebar, KPI metrics cards, and a real-time data table:

```html
<div class="d-flex min-vh-100 bg-light">
  <!-- Sidebar -->
  <aside class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 260px;">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <span class="fs-4 fw-bold">NexusAdmin</span>
    </a>
    <hr class="border-secondary">
    <ul class="nav nav-pills flex-column mb-auto gap-1">
      <li class="nav-item">
        <a href="#" class="nav-link active" aria-current="page">
          <i class="bi bi-grid-fill me-2"></i> Overview
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white-50">
          <i class="bi bi-people-fill me-2"></i> Customers
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white-50">
          <i class="bi bi-bar-chart-fill me-2"></i> Financials
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white-50">
          <i class="bi bi-sliders me-2"></i> Settings
        </a>
      </li>
    </ul>
    <hr class="border-secondary">
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
        <span class="rounded-circle bg-primary text-white p-2 me-2 fw-bold small">OP</span>
        <strong>Operator</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#">Sign out</a></li>
      </ul>
    </div>
  </aside>

  <!-- Main Content View -->
  <main class="flex-grow-1 p-4 p-md-5 overflow-auto">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">Executive Performance Overview</h2>
        <p class="text-muted mb-0">Aggregate metrics across 12 distributed cloud regions.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-download me-1"></i> Export PDF</button>
        <button class="btn btn-primary btn-sm"><i class="bi bi-plus-lg me-1"></i> Add Metric</button>
      </div>
    </div>

    <!-- KPI Metric Cards Row -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm p-3">
          <span class="text-muted small text-uppercase fw-semibold">Gross ARR</span>
          <h3 class="fw-bold my-2">$3,420,500</h3>
          <span class="text-success small fw-semibold"><i class="bi bi-arrow-up-right"></i> +14.2% YoY</span>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm p-3">
          <span class="text-muted small text-uppercase fw-semibold">Active Organizations</span>
          <h3 class="fw-bold my-2">894</h3>
          <span class="text-success small fw-semibold"><i class="bi bi-arrow-up-right"></i> +8.1% MoM</span>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm p-3">
          <span class="text-muted small text-uppercase fw-semibold">System Error Rate</span>
          <h3 class="fw-bold my-2">0.002%</h3>
          <span class="text-success small fw-semibold"><i class="bi bi-check2-circle"></i> SLA Compliant</span>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-xl-3">
        <div class="card border-0 shadow-sm p-3">
          <span class="text-muted small text-uppercase fw-semibold">Support SLA Resolution</span>
          <h3 class="fw-bold my-2">42m</h3>
          <span class="text-info small fw-semibold"><i class="bi bi-clock-history"></i> Median</span>
        </div>
      </div>
    </div>

    <!-- Active Deployments Table -->
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3 border-0">
        <h5 class="fw-bold mb-0">Production Microservice Deployments</h5>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Service</th>
              <th>Version</th>
              <th>Region</th>
              <th>Status</th>
              <th>Health</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="fw-semibold">auth-gateway-v2</td>
              <td><code>v2.14.0</code></td>
              <td>us-east-1</td>
              <td><span class="badge bg-success-subtle text-success">Healthy</span></td>
              <td>
                <div class="progress" style="height: 6px; width: 100px;">
                  <div class="progress-bar bg-success" style="width: 100%;"></div>
                </div>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary">Inspect</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
```

---

## Lab 2: Multi-Page Corporate Website Architecture

A clean corporate website layout featuring a sticky glassmorphism header, responsive hero banner, icon feature matrix, accordion FAQ, and newsletter registration footer:

```html
<!-- Sticky Header -->
<header class="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
  <div class="container">
    <a class="navbar-brand fw-bold text-primary" href="#">ApexGlobal</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#corporateNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="corporateNav">
      <ul class="navbar-nav mx-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Solutions</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Enterprise</a></li>
        <li class="nav-item"><a class="nav-link" href="#">About Us</a></li>
      </ul>
      <a href="#contact" class="btn btn-primary btn-sm px-3">Contact Sales</a>
    </div>
  </div>
</header>
```

---

## Summary & Key Takeaways

- Intermediate projects combine flexible sidebars (`aside` + `main`), complex responsive navigation, and data-dense tables.
- Building custom SCSS themes with unified design tokens ensures brand consistency across multi-page enterprise applications.
- Structuring components with `h-100`, `shadow-sm`, and `table-responsive` guarantees visual stability across any screen size.
