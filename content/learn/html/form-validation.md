---
title: 'HTML Form Validation'
description: 'Master client-side validation: required, min, max, minlength, maxlength, pattern regex, step, and custom error validation messages.'
order: 19
difficulty: 'intermediate'
category: 'Level 6 - Forms & User Input'
estimatedMinutes: 20
prerequisites:
  - /learn/html/form-controls
---

## Built-In Browser Validation

HTML5 includes powerful native validation attributes that run automatically in the browser before the form is submitted to the server:

```html
<form action="/register" method="POST">
  <!-- Required field -->
  <label for="reg-name">Full Name (required):</label>
  <input type="text" id="reg-name" name="name" required minlength="3" maxlength="50" />

  <!-- Numeric boundaries -->
  <label for="reg-age">Age (18-120):</label>
  <input type="number" id="reg-age" name="age" min="18" max="120" required />

  <!-- Regular Expression Pattern -->
  <label for="reg-zip">US Zip Code (5 digits):</label>
  <input type="text" id="reg-zip" name="zip" pattern="[0-9]{5}" title="Five digit ZIP code (e.g. 90210)" required />

  <button type="submit">Submit Registration</button>
</form>
```

---

## Validation Attributes Reference

| Attribute | Applies To | Description |
| :--- | :--- | :--- |
| `required` | Text, email, checkbox, radio, file | Prevents form submission if empty |
| `minlength` / `maxlength` | Text, password, search, textarea | Enforces character count constraints |
| `min` / `max` | Number, range, date, time | Enforces numeric/date boundary values |
| `step` | Number, range | Enforces numeric step increments (e.g., `step="0.01"` for currency) |
| `pattern` | Text, search, url, tel, email, password | Regular expression (regex) match rule |

---

## Disabling Validation During Testing (`novalidate`)

To test server-side validation error handling, you can bypass browser validation using the `novalidate` boolean attribute on the `<form>`:

```html
<form action="/test" method="POST" novalidate>
  <!-- Browser will not block submission if invalid -->
</form>
```

> **Crucial Rule**: Native HTML validation is a user experience enhancement, **not** a substitute for backend security. Never trust client-side data alone!

---

## Summary & Key Takeaways

- Use `required`, `minlength`, and `maxlength` for instant input validation.
- Use `pattern` with regular expressions for strict formats like zip codes or postal codes.
- Always pair `pattern` with a helpful `title` attribute so the browser displays meaningful error tooltips.

---

## Practice Challenge

Build a checkout payment form with:
1. Credit card number requiring exactly 16 digits using `pattern="[0-9]{16}"`.
2. CVV code requiring 3 or 4 digits.
3. Expiration month/year using native `date` or `pattern`.
