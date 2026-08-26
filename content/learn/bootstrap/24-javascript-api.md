---
title: 'Bootstrap JavaScript API & Programmatic Control'
description: 'Master Bootstrap 5 JavaScript architecture: programmatic APIs, class constructors, getOrCreateInstance(), component lifecycle events (shown, hidden), async methods, and dynamic instance management.'
order: 24
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/11-basic-javascript-components
---

# Bootstrap JavaScript API & Programmatic Control

While HTML `data-bs-*` attributes allow declarative component toggling, enterprise single-page applications and rich web apps require programmatic JavaScript control. Bootstrap 5 exposes a modern, ES6-based object-oriented JavaScript API. Every component can be instantiated, controlled, inspected, and destroyed programmatically.

In this lesson, you will master programmatic class constructors, `getInstance()` and `getOrCreateInstance()`, component event listeners, asynchronous transition handling, and lifecycle cleanup.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bootstrap JavaScript API Architecture                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Programmatic Pattern:                                                      │
│  const modalEl = document.getElementById('myModal');                        │
│  const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {               │
│    backdrop: 'static',                                                      │
│    keyboard: false                                                          │
│  });                                                                        │
│                                                                             │
│  modal.show();                                                              │
│  modal.hide();                                                              │
│  modal.dispose();                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Class Constructors & `getOrCreateInstance`

Bootstrap 5 components can be retrieved or created via static methods:

```javascript
import * as bootstrap from 'bootstrap'

const myModalEl = document.getElementById('authModal')

// 1. Get existing instance or initialize with configuration options
const authModal = bootstrap.Modal.getOrCreateInstance(myModalEl, {
  backdrop: 'static',
  keyboard: false,
  focus: true
})

// 2. Control visibility programmatically
authModal.show()

// Hide after 3 seconds
setTimeout(() => {
  authModal.hide()
}, 3000)
```

---

## 2. Component Event Lifecycle

Bootstrap components dispatch custom DOM events throughout their transition lifecycle:

- `show.bs.{component}`: Fires immediately when the `show` method is called.
- `shown.bs.{component}`: Fires after the CSS transition completes and the element is fully visible.
- `hide.bs.{component}`: Fires immediately when `hide` is called.
- `hidden.bs.{component}`: Fires after the CSS transition finishes and element is fully hidden.

```javascript
const modalElement = document.getElementById('authModal')

modalElement.addEventListener('show.bs.modal', (event) => {
  console.log('Modal is about to open...')
})

modalElement.addEventListener('shown.bs.modal', (event) => {
  // Focus the first input automatically
  document.getElementById('firstInput').focus()
})

modalElement.addEventListener('hidden.bs.modal', (event) => {
  // Clean up sensitive form inputs
  document.getElementById('authForm').reset()
})
```

---

## 3. Offcanvas & Collapse Programmatic Control

```javascript
// Offcanvas API
const drawerEl = document.getElementById('cartDrawer')
const cartOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerEl)

function openCart() {
  cartOffcanvas.show()
}

// Collapse API
const faqEl = document.getElementById('faqSection')
const faqCollapse = new bootstrap.Collapse(faqEl, { toggle: false })
faqCollapse.toggle()
```

---

## 4. Initializing Popovers & Tooltips Dynamically

Tooltips and popovers require manual initialization. You can initialize them across the document with a concise helper:

```javascript
function initializeBootstrapComponents(root = document) {
  // Tooltips
  const tooltips = root.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltips.forEach(el => new bootstrap.Tooltip(el))

  // Popovers
  const popovers = root.querySelectorAll('[data-bs-toggle="popover"]')
  popovers.forEach(el => new bootstrap.Popover(el, { trigger: 'focus' }))
}

document.addEventListener('DOMContentLoaded', () => {
  initializeBootstrapComponents()
})
```

---

## 5. Preventing Memory Leaks with `dispose()`

In single-page applications (React, Vue, Nuxt, Angular), DOM elements are frequently added and removed. Always clean up instances to prevent memory leaks:

```javascript
// Cleanup lifecycle hook (e.g. Vue onUnmounted or React useEffect cleanup)
function cleanupComponent(element) {
  const instance = bootstrap.Modal.getInstance(element)
  if (instance) {
    instance.dispose()
  }
}
```

---

## Summary & Key Takeaways

- Static methods like `bootstrap.Modal.getOrCreateInstance(el)` retrieve or construct instances safely.
- Four core lifecycle events (`show`, `shown`, `hide`, `hidden`) enable synchronization with app state.
- Tooltips and Popovers require explicit initialization in JS.
- Calling `.dispose()` tears down listeners and clears memory in modern SPA routers.

## Best Practices & Senior Guidance

1. **Use `getOrCreateInstance` Over `new bootstrap.Modal()`**: Prevents creating duplicate overlapping event listeners on the same DOM element.
2. **Handle `shown.bs.modal` for Focus Management**: Never attempt to focus inputs on `show.bs.modal` before CSS fade transitions complete, or focus will fail in some browsers.
