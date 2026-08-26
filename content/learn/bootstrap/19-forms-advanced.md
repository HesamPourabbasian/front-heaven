---
title: 'Advanced Forms, Floating Labels & Custom Validation'
description: 'Master advanced Bootstrap 5 forms: floating labels (form-floating), compound input groups, horizontal grid forms, custom validation scripts, accessible form error handling, and disabled states.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/10-forms
---

# Advanced Forms, Floating Labels & Custom Validation

Forms in modern web applications require rich interactive feedback, floating label animations, accessible error associations, and clean multi-column layouts. Bootstrap 5 provides advanced form utilities including floating labels, horizontal grid forms, complex compound input groups, and integration with HTML5 validation APIs.

In this lesson, you will master `.form-floating`, multi-row form layouts, programmatic custom validation, disabled/readonly control behaviors, and accessibility attributes.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Advanced Form Architecture                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Floating Label:                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Email address (Floats upward smoothly on focus / content entry)       │  │
│  │ name@company.com                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Horizontal Form Layout:                                                    │
│  [ Email Label (col-sm-3) ] [ Input Field & Validation (col-sm-9)         ] │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Floating Labels (`form-floating`)

Floating labels create modern Material-style animated input fields where the placeholder transforms into a persistent floating label upon focus or input:

```html
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div>

<div class="form-floating mb-3">
  <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
  <label for="floatingPassword">Password</label>
</div>

<!-- Floating Label with Select -->
<div class="form-floating">
  <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
    <option selected>Open this select menu</option>
    <option value="1">Enterprise Tier</option>
    <option value="2">Team Tier</option>
  </select>
  <label for="floatingSelect">Subscription Tier</label>
</div>
```

> **Requirement**: `<input>` must come *before* `<label>` and must have a `placeholder="..."` defined (even if empty `placeholder=" "`).

---

## 2. Horizontal Form Layouts

Use the Bootstrap grid (`.row` and `.col-*`) with `.col-form-label` to align labels beside input controls on desktop screens:

```html
<form>
  <div class="row mb-3">
    <label for="inputEmail3" class="col-sm-3 col-form-label fw-semibold">Company Email</label>
    <div class="col-sm-9">
      <input type="email" class="form-control" id="inputEmail3">
    </div>
  </div>
  <div class="row mb-3">
    <label for="inputOrg" class="col-sm-3 col-form-label fw-semibold">Organization Name</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="inputOrg">
    </div>
  </div>
</form>
```

---

## 3. Complex Compound Input Groups

Combine multiple addons, buttons, and selects inside a single `.input-group`:

```html
<div class="input-group mb-3">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Protocol</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">https://</a></li>
    <li><a class="dropdown-item" href="#">http://</a></li>
  </ul>
  <input type="text" class="form-control" placeholder="subdomain.domain.com" aria-label="Domain input">
  <button class="btn btn-primary" type="button">Verify Domain</button>
</div>
```

---

## 4. Advanced Validation & Accessibility Wiring

Connect input validation directly to ARIA live regions and `aria-describedby`:

```html
<form id="enterpriseForm" class="needs-validation" novalidate>
  <div class="mb-3">
    <label for="taxId" class="form-label">Federal Tax ID / EIN</label>
    <input 
      type="text" 
      class="form-control" 
      id="taxId" 
      pattern="^\d{2}-\d{7}$"
      placeholder="XX-XXXXXXX" 
      aria-describedby="taxIdHelp taxIdFeedback"
      required
    >
    <div id="taxIdHelp" class="form-text">Must match standard 9-digit format (XX-XXXXXXX).</div>
    <div id="taxIdFeedback" class="invalid-feedback">Please enter a valid format EIN.</div>
  </div>

  <button class="btn btn-primary" type="submit">Submit Registration</button>
</form>

<script>
  const form = document.getElementById('enterpriseForm');
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);
</script>
```

---

## Summary & Key Takeaways

- `.form-floating` creates animated label transitions when an `<input placeholder="...">` is followed by `<label>`.
- Horizontal forms use `.row` with `.col-form-label` to align labels vertically with inputs.
- Compound input groups embed dropdowns, select tags, and submit buttons into unified controls.
- `aria-describedby` links inputs to both help text and `.invalid-feedback` messages for assistive technologies.

## Best Practices & Senior Guidance

1. **Always Use `col-form-label` on Grid Labels**: This ensures standard vertical padding matches `.form-control` text alignment.
2. **Never Omit Placeholder on Floating Inputs**: The CSS `:placeholder-shown` pseudo-class powers the floating label animation.
