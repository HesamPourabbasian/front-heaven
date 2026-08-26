---
title: 'Core UI Components: Buttons, Cards, Alerts & Badges'
description: 'Master Bootstrap 5 core CSS components: buttons, button groups, cards, alerts, badges, breadcrumbs, pagination, progress bars, list groups, tables, images, and figures.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/06-colors
  - /learn/bootstrap/08-flexbox-utilities
---

# Core UI Components: Buttons, Cards, Alerts & Badges

Bootstrap provides a comprehensive library of pre-styled, accessible, and responsive CSS components. These components eliminate boilerplate CSS and follow consistent styling guidelines for visual feedback, navigation, data display, and typography.

In this lesson, you will master the most frequently used Bootstrap UI components: buttons, button groups, cards, alerts, badges, breadcrumbs, pagination, progress bars, list groups, tables, images, and figures.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Common Bootstrap Components                           │
├───────────────────┬───────────────────────────┬─────────────────────────────┤
│ Actions & Cues    │ Content & Containers      │ Navigation & Lists          │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ .btn / .btn-*     │ .card / .card-body        │ .breadcrumb                 │
│ .btn-group        │ .alert / .alert-*         │ .pagination                 │
│ .badge / .pill    │ .progress / .progress-bar │ .list-group                 │
│ .figure           │ .table / .table-striped   │ .img-fluid / .img-thumbnail │
└───────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 1. Buttons & Button Groups

Buttons support solid colors, outline variants, and size modifiers:

```html
<!-- Solid Buttons -->
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>

<!-- Outline Buttons -->
<button type="button" class="btn btn-outline-primary">Outline Primary</button>

<!-- Sizing -->
<button type="button" class="btn btn-primary btn-lg">Large Button</button>
<button type="button" class="btn btn-secondary btn-sm">Small Button</button>

<!-- Button Group -->
<div class="btn-group" role="group" aria-label="Action group">
  <button type="button" class="btn btn-outline-primary">Left</button>
  <button type="button" class="btn btn-outline-primary">Middle</button>
  <button type="button" class="btn btn-outline-primary">Right</button>
</div>
```

---

## 2. Cards

Cards are versatile content containers supporting images, headers, footers, and contextual styling:

```html
<div class="card shadow-sm" style="max-width: 320px;">
  <img src="https://placehold.co/600x400" class="card-img-top" alt="Card placeholder">
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">Quick example text demonstrating card body layout.</p>
    <a href="#" class="btn btn-primary btn-sm">Read More</a>
  </div>
  <div class="card-footer text-muted small">
    Last updated 5 mins ago
  </div>
</div>
```

---

## 3. Alerts & Badges

Communicate contextual feedback and numeric counters:

```html
<!-- Dismissible Alert -->
<div class="alert alert-success alert-dismissible fade show" role="alert">
  <strong>Success!</strong> Your transaction has been recorded.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<!-- Badges -->
<span class="badge bg-primary">New</span>
<span class="badge rounded-pill bg-danger">99+</span>
<button type="button" class="btn btn-secondary position-relative">
  Inbox
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    5
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
```

---

## 4. Breadcrumbs & Pagination

Provide structural and multi-page navigation:

```html
<!-- Breadcrumbs -->
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Library</a></li>
    <li class="breadcrumb-item active" aria-current="page">Data</li>
  </ol>
</nav>

<!-- Pagination -->
<nav aria-label="Page navigation">
  <ul class="pagination">
    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
    <li class="page-item active"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
```

---

## 5. Progress Bars & List Groups

Display loading state and vertical item lists:

```html
<!-- Animated Striped Progress Bar -->
<div class="progress" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 75%">75%</div>
</div>

<!-- List Group with Badges -->
<ul class="list-group mt-3">
  <li class="list-group-item d-flex justify-content-between align-items-center active">
    Active Inbox
    <span class="badge bg-light text-dark rounded-pill">14</span>
  </li>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    Sent Messages
    <span class="badge bg-primary rounded-pill">2</span>
  </li>
</ul>
```

---

## 6. Tables, Images & Figures

Style responsive data tables, fluid responsive images, and captioned figures:

```html
<!-- Striped Hoverable Table -->
<div class="table-responsive">
  <table class="table table-striped table-hover align-middle">
    <thead class="table-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Alice Smith</td>
        <td>Lead Engineer</td>
        <td><span class="badge bg-success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Fluid Image and Figure -->
<figure class="figure mt-3">
  <img src="https://placehold.co/600x300" class="figure-img img-fluid rounded" alt="Project diagram">
  <figcaption class="figure-caption text-center">Figure 1.1: System Architecture Overview</figcaption>
</figure>
```

---

## Summary & Key Takeaways

- Buttons use `.btn` paired with variant classes like `.btn-primary` or `.btn-outline-danger`.
- Cards (`.card`) provide modular containers with optional header, body, footer, and image caps.
- Alerts communicate feedback and support native dismiss buttons (`data-bs-dismiss="alert"`).
- Tables support `.table-striped`, `.table-hover`, and `.table-responsive` out of the box.
- Images scale responsively using `.img-fluid` (`max-width: 100%; height: auto;`).

## Best Practices & Senior Guidance

1. **Always Wrap Wide Tables in `.table-responsive`**: This prevents table data from breaking mobile viewports with horizontal scrollbars.
2. **Add `aria-label` to Pagination and Breadcrumbs**: Screen readers require accessible navigation labels to distinguish multiple `<nav>` elements on a single page.
