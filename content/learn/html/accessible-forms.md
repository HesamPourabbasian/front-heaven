---
title: 'Accessible Forms'
description: 'Design accessible forms: explicit label associations, aria-describedby for error messages, fieldset legends, and required hints.'
order: 25
difficulty: 'intermediate'
category: 'Level 8 - Accessibility'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-accessibility
---

## Why Accessible Forms Matter

Forms are the most critical interactive components on the web. If a user cannot fill out a checkout form or registration field due to missing accessibility labels, they cannot complete their goal.

---

## Form Accessibility Best Practices

### 1. Explicit Labels
Always connect `<label>` elements to inputs via `for` matching the `id`:

```html
<label for="billing-email">Billing Email Address (Required):</label>
<input type="email" id="billing-email" name="email" required aria-required="true" />
```

### 2. Associating Helper Text & Error Messages (`aria-describedby`)
Connect helper notes and validation error messages directly to the input:

```html
<label for="user-password">Password</label>
<input
  type="password"
  id="user-password"
  name="password"
  aria-describedby="pass-rules pass-error"
  aria-invalid="true"
/>
<span id="pass-rules" class="help-text">Must be at least 8 characters with one number.</span>
<span id="pass-error" class="error-text">Password is too short.</span>
```

### 3. Grouping Controls with `<fieldset>` and `<legend>`
For radio buttons or checkboxes, the `<legend>` provides the essential question prompt for screen readers:

```html
<fieldset>
  <legend>Preferred Contact Method</legend>
  <input type="radio" id="c-email" name="contact" value="email" checked />
  <label for="c-email">Email</label>

  <input type="radio" id="c-sms" name="contact" value="sms" />
  <label for="c-sms">SMS Text</label>
</fieldset>
```

---

## Summary & Key Takeaways

- Never use `placeholder` as a replacement for a visible `<label>`.
- Use `aria-describedby` to link input fields to their validation error text.
- Group radio buttons with `<fieldset>` and `<legend>`.

---

## Practice Challenge

Build an accessible payment form featuring:
1. Credit card input linked to helper text via `aria-describedby`.
2. Explicitly labeled CVV code with security tooltip.
3. `<fieldset>` grouping billing vs shipping options.
