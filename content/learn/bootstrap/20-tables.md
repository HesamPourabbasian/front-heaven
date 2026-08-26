---
title: 'Advanced Tables & Data Presentation'
description: 'Master Bootstrap 5 tables: responsive tables (table-responsive-*), zebra striping (table-striped), column striping, hover effects, bordered/borderless tables, vertical alignment, and nested cell utilities.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/bootstrap/09-common-components
---

# Advanced Tables & Data Presentation

Data tables are critical for enterprise software, analytics portals, and financial systems. Bootstrap 5 provides a powerful table styling architecture supporting responsive breakpoint wrappers, zebra row and column striping, hover highlights, contextual coloring, vertical cell alignment, and caption positioning.

In this lesson, you will master advanced table modifiers, responsive table scrolling, vertical alignment rules, and dark theme tables.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Bootstrap Table Modifiers                           │
├───────────────────┬───────────────────────────┬─────────────────────────────┤
│ Striping & Hover  │ Borders & Themes          │ Layout & Alignment          │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ .table-striped    │ .table-bordered           │ .table-responsive           │
│ .table-striped-col│ .table-borderless         │ .table-responsive-md        │
│ .table-hover      │ .table-dark               │ .align-middle / .align-top  │
│ .table-sm         │ .table-primary / success  │ .caption-top                │
└───────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 1. Striped Rows & Columns

Apply zebra-striping to table rows or table columns:

```html
<!-- Zebra-Striped Rows & Hover Highlights -->
<table class="table table-striped table-hover">
  <thead>
    <tr>
      <th scope="col"># ID</th>
      <th scope="col">User</th>
      <th scope="col">Plan</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">101</th>
      <td>Alexander Hayes</td>
      <td>Enterprise</td>
      <td><span class="badge bg-success">Active</span></td>
    </tr>
    <tr>
      <th scope="row">102</th>
      <td>Elena Rostova</td>
      <td>Startup</td>
      <td><span class="badge bg-warning text-dark">Pending</span></td>
    </tr>
  </tbody>
</table>
```

---

## 2. Responsive Tables (`.table-responsive-*`)

Prevent horizontal layout overflow by wrapping the table in responsive overflow containers:

```html
<!-- Table scrolls horizontally ONLY on screens smaller than 992px (large) -->
<div class="table-responsive-lg">
  <table class="table table-bordered align-middle">
    <thead class="table-light">
      <tr>
        <th>Server Cluster</th>
        <th>Region</th>
        <th>CPU Load</th>
        <th>Memory</th>
        <th>Bandwidth</th>
        <th>Uptime</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="fw-bold">us-east-cluster-01</td>
        <td>Virginia (us-east-1)</td>
        <td>42%</td>
        <td>18.4 / 32 GB</td>
        <td>1.2 TB/mo</td>
        <td>99.99%</td>
        <td><button class="btn btn-sm btn-outline-primary">Inspect</button></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 3. Vertical Cell Alignment (`align-middle`)

Align cell content vertically to prevent misaligned badges, buttons, and avatar images:

```html
<table class="table align-middle">
  <thead>
    <tr>
      <th>Avatar & Name</th>
      <th>Role</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-circle bg-primary text-white p-2 fw-bold">JD</div>
          <div>
            <div class="fw-semibold">Jane Doe</div>
            <small class="text-muted">jane@company.com</small>
          </div>
        </div>
      </td>
      <td>Security Lead</td>
      <td><button class="btn btn-sm btn-outline-secondary">Edit</button></td>
    </tr>
  </tbody>
</table>
```

---

## 4. Dark & Contextual Tables

Style tables with dark themes or row-level contextual highlights:

```html
<table class="table table-dark table-striped table-hover mb-0">
  <thead>
    <tr>
      <th>Log Level</th>
      <th>Message</th>
      <th>Timestamp</th>
    </tr>
  </thead>
  <tbody>
    <tr class="table-danger">
      <td class="text-danger fw-bold">CRITICAL</td>
      <td class="text-dark">Database connection pool exhausted</td>
      <td class="text-dark">14:02:18 UTC</td>
    </tr>
    <tr class="table-warning">
      <td class="text-warning fw-bold">WARNING</td>
      <td class="text-dark">High memory consumption detected (88%)</td>
      <td class="text-dark">14:01:55 UTC</td>
    </tr>
  </tbody>
</table>
```

---

## Summary & Key Takeaways

- `.table-striped` adds alternating row backgrounds; `.table-hover` highlights hovered rows.
- `.table-responsive-{breakpoint}` ensures wide tables scroll horizontally without breaking mobile layouts.
- `.align-middle` vertically centers avatars, text, badges, and action buttons within table rows.
- Contextual classes (`table-success`, `table-danger`) highlight specific audit rows.

## Best Practices & Senior Guidance

1. **Always Use `scope="col"` on Headers and `scope="row"` on Leading Cells**: Ensures screen readers properly navigate complex tabular data grids.
2. **Combine `.table-sm` with Dashboard Cards**: The `.table-sm` class cuts cell padding in half, maximizing information density in data dashboards.
