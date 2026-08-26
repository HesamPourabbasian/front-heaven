---
title: 'Interactive JavaScript Components'
description: 'Master Bootstrap 5 JavaScript components: dropdowns, modals, collapse, accordions, dynamic tabs, tooltips, popovers, image carousels, toasts, and offcanvas drawers.'
order: 11
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites:
  - /learn/bootstrap/09-common-components
  - /learn/bootstrap/10-forms
---

# Interactive JavaScript Components

Bootstrap 5 provides a powerful suite of interactive UI components powered by native vanilla JavaScript (ES6 modules, zero jQuery). These components use HTML `data-bs-*` attributes for declarative functionality and offer programmatic JavaScript APIs for dynamic control.

In this lesson, you will master Dropdowns, Modals, Collapse, Accordions, Tabs, Tooltips, Popovers, Carousels, Toasts, and Offcanvas drawers.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bootstrap JavaScript Data Attributes                     │
├──────────────────────┬────────────────────────┬─────────────────────────────┤
│ Component            │ Toggle Attribute       │ Target Attribute            │
├──────────────────────┼────────────────────────┼─────────────────────────────┤
│ Modal                │ data-bs-toggle="modal" │ data-bs-target="#myModal"   │
│ Offcanvas            │ data-bs-toggle="offcanvas"│ data-bs-target="#sidebar"│
│ Collapse / Accordion │ data-bs-toggle="collapse" │ data-bs-target="#faq1"   │
│ Dropdown             │ data-bs-toggle="dropdown" │ (Implicit sibling menu)  │
│ Tab                  │ data-bs-toggle="tab"   │ data-bs-target="#profile"   │
└──────────────────────┴────────────────────────┴─────────────────────────────┘
```

---

## 1. Modals

Modals provide dialog overlays for alerts, confirmation prompts, and focused user workflows:

```html
<!-- Trigger button -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch Modal
</button>

<!-- Modal Structure -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalLabel">Confirmation Prompt</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Are you sure you want to proceed with this operation?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">Save Changes</button>
      </div>
    </div>
  </div>
</div>
```

---

## 2. Dropdowns & Offcanvas

Create flyout menus and slide-in sidebars:

```html
<!-- Dropdown Menu -->
<div class="dropdown mb-3">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Account Menu
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Profile</a></li>
    <li><a class="dropdown-item" href="#">Settings</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item text-danger" href="#">Logout</a></li>
  </ul>
</div>

<!-- Offcanvas Sidebar -->
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
  Open Drawer
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasLabel">Navigation Drawer</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <p>Slide-in content, navigation links, or shopping cart summary.</p>
  </div>
</div>
```

---

## 3. Accordions & Collapse

Expand and collapse content sections smoothly:

```html
<div class="accordion" id="faqAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        How does Bootstrap 5 handle JavaScript?
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Bootstrap 5 is built with modern ES6 vanilla JavaScript and Popper.js, completely free of jQuery.
      </div>
    </div>
  </div>
</div>
```

---

## 4. Dynamic Tabs

Switch between content panes dynamically:

```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-pane" type="button" role="tab">Home</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-pane" type="button" role="tab">Profile</button>
  </li>
</ul>
<div class="tab-content p-3 border border-top-0" id="myTabContent">
  <div class="tab-pane fade show active" id="home-pane" role="tabpanel" tabindex="0">Home panel content.</div>
  <div class="tab-pane fade" id="profile-pane" role="tabpanel" tabindex="0">Profile panel content.</div>
</div>
```

---

## 5. Tooltips, Popovers, Toasts & Carousel

Interactive micro-feedback and image sliders:

```html
<!-- Tooltip (Requires JS initialization) -->
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip info">
  Hover for Tooltip
</button>

<!-- Toast Notification -->
<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <strong class="me-auto">Notification</strong>
    <small>Just now</small>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    New message received.
  </div>
</div>
```

### Initializing Tooltips and Popovers via JavaScript:
Tooltips and popovers are opt-in for performance reasons and must be initialized:

```javascript
// Initialize all tooltips on page
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
```

---

## Summary & Key Takeaways

- Bootstrap 5 components operate declaratively via `data-bs-*` attributes.
- Modals, Offcanvas, and Accordions manage focus, backdrop overlays, and accessibility automatically.
- Tooltips and Popovers require manual JS initialization via `bootstrap.Tooltip`.
- All components fire custom DOM lifecycle events (e.g. `shown.bs.modal`, `hidden.bs.offcanvas`).

## Best Practices & Senior Guidance

1. **Always Include `aria-labelledby` and `aria-hidden` on Modals**: Crucial for screen reader compatibility when dialogs open and close.
2. **Use Popper.js Bundle**: Ensure `bootstrap.bundle.min.js` is loaded so Dropdowns and Tooltips position accurately without console errors.
