---
title: 'Forms, Controls, Input Groups & Validation'
description: 'Master Bootstrap 5 forms: form controls, labels, input fields, textareas, selects, checkboxes, radio buttons, range sliders, input groups, and client-side form validation.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/09-common-components
---

# Forms, Controls, Input Groups & Validation

Forms are essential for collecting user input in web applications. Bootstrap 5 provides a modern, fully reset form control system that ensures consistent styling, focus states, and validation behavior across all modern browsers.

In this lesson, you will master standard form controls, labels, textareas, custom selects, checks, radio buttons, range sliders, input groups, and client-side validation states.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Bootstrap 5 Form Architecture                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  .mb-3                                                                      │
│   ├── .form-label (Semantic label linked via for="id")                      │
│   ├── .form-control / .form-select (Input element)                          │
│   ├── .form-text (Help text)                                                │
│   └── .valid-feedback / .invalid-feedback (Validation messages)             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Form Controls & Labels

Standard text inputs, emails, passwords, and textareas use `.form-control`:

```html
<form>
  <div class="mb-3">
    <label for="userEmail" class="form-label">Email address</label>
    <input type="email" class="form-control" id="userEmail" placeholder="name@example.com" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>

  <div class="mb-3">
    <label for="userMessage" class="form-label">Comments / Inquiries</label>
    <textarea class="form-control" id="userMessage" rows="3" placeholder="Enter message..."></textarea>
  </div>
</form>
```

---

## 2. Selects, Checkboxes & Radio Buttons

Bootstrap provides custom-styled dropdown selects, checkboxes, switches, and radio groups:

```html
<!-- Custom Select -->
<div class="mb-3">
  <label for="countrySelect" class="form-label">Country / Region</label>
  <select class="form-select" id="countrySelect" aria-label="Select Country">
    <option selected>Choose region...</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="eu">Europe</option>
  </select>
</div>

<!-- Checkbox -->
<div class="form-check mb-2">
  <input class="form-check-input" type="checkbox" value="" id="termsCheck">
  <label class="form-check-label" for="termsCheck">
    I agree to the terms and conditions
  </label>
</div>

<!-- Radio Buttons -->
<div class="form-check">
  <input class="form-check-input" type="radio" name="planOption" id="planFree" checked>
  <label class="form-check-label" for="planFree">Free Plan</label>
</div>
<div class="form-check mb-3">
  <input class="form-check-input" type="radio" name="planOption" id="planPro">
  <label class="form-check-label" for="planPro">Pro Plan ($19/mo)</label>
</div>
```

---

## 3. Range Sliders

Create consistent custom sliders with `.form-range`:

```html
<div class="mb-3">
  <label for="volumeRange" class="form-label">Volume Level</label>
  <input type="range" class="form-range" min="0" max="100" step="5" id="volumeRange">
</div>
```

---

## 4. Input Groups

Attach text, icons, buttons, or dropdowns to the start or end of an input:

```html
<!-- Prepended and Appended Text -->
<div class="input-group mb-3">
  <span class="input-group-text">$</span>
  <input type="number" class="form-control" placeholder="Amount" aria-label="Dollar amount">
  <span class="input-group-text">.00</span>
</div>

<!-- Input with Action Button -->
<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Search keywords..." aria-label="Search">
  <button class="btn btn-primary" type="button">Search</button>
</div>
```

---

## 5. Form Validation States

Bootstrap supports browser HTML5 constraint validation and custom validation feedback with `.needs-validation` and `.was-validated`:

```html
<form class="needs-validation" novalidate id="demoForm">
  <div class="mb-3">
    <label for="uname" class="form-label">Username</label>
    <input type="text" class="form-control" id="uname" required>
    <div class="valid-feedback">Looks good!</div>
    <div class="invalid-feedback">Please choose a username.</div>
  </div>

  <button class="btn btn-primary" type="submit">Submit Form</button>
</form>

<script>
  // Bootstrap standard client-side validation script
  document.getElementById('demoForm').addEventListener('submit', function(event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.classList.add('was-validated');
  });
</script>
```

---

## Summary & Key Takeaways

- `.form-control` styles inputs and textareas; `.form-select` styles dropdown selects.
- Checkboxes and radios use `.form-check` wrapper with `.form-check-input` and `.form-check-label`.
- `.input-group` prefixes or appends text labels, currency symbols, and action buttons.
- Adding `.was-validated` to a form displays `.valid-feedback` and `.invalid-feedback` cues.

## Best Practices & Senior Guidance

1. **Always Link Labels with `for` and `id`**: Ensures screen readers read field names and clicking the label focuses the input.
2. **Use `novalidate` on Forms with Custom Validation**: Disables default browser validation tooltips so Bootstrap's accessible feedback styles render properly.
