---
title: 'HTML Input Elements'
description: 'Master all HTML5 input types: text, password, email, number, date, time, url, search, file, checkbox, radio, hidden, and submit.'
order: 17
difficulty: 'beginner'
category: 'Level 6 - Forms & User Input'
estimatedMinutes: 25
prerequisites:
  - /learn/html/forms
---

## The Universal Input Element (`<input>`)

The `<input>` element is a void tag whose appearance and behavior changes entirely based on its `type` attribute.

---

## Essential Text-Based Input Types

```html
<!-- Single-line text -->
<input type="text" name="username" placeholder="johndoe" />

<!-- Obscured password -->
<input type="password" name="password" minlength="8" />

<!-- Validates email structure & activates mobile @ keyboard -->
<input type="email" name="email" placeholder="user@example.com" />

<!-- Validates URL structure -->
<input type="url" name="website" placeholder="https://example.com" />

<!-- Search input with built-in clear button -->
<input type="search" name="q" placeholder="Search lessons..." />

<!-- Telephone input that triggers numeric keyboard on mobile -->
<input type="tel" name="phone" placeholder="555-0199" />
```

---

## Numeric & Date Input Types

```html
<!-- Numeric stepper with constraints -->
<input type="number" name="quantity" min="1" max="100" step="1" value="1" />

<!-- Slider control -->
<input type="range" name="volume" min="0" max="100" value="75" />

<!-- Native date picker -->
<input type="date" name="birthdate" />

<!-- Native time picker -->
<input type="time" name="appointment" />

<!-- Color swatch picker -->
<input type="color" name="theme-color" value="#0ea5e9" />
```

---

## Selection Input Types

### 1. Checkboxes (Multiple Selections)
```html
<input type="checkbox" id="newsletter" name="subscribe" value="yes" checked />
<label for="newsletter">Subscribe to weekly front-end tips</label>
```

### 2. Radio Buttons (Single Exclusive Choice)
Radio buttons must share the **same `name` attribute** to form a mutually exclusive group:

```html
<fieldset>
  <legend>Select Subscription Tier</legend>
  <input type="radio" id="tier-free" name="tier" value="free" checked />
  <label for="tier-free">Free Tier</label>

  <input type="radio" id="tier-pro" name="tier" value="pro" />
  <label for="tier-pro">Pro Plan ($19/mo)</label>
</fieldset>
```

### 3. Hidden Inputs
Used to pass internal data (like CSRF tokens or user IDs) without displaying them visually:

```html
<input type="hidden" name="csrf_token" value="abc123xyz" />
```

---

## Summary & Key Takeaways

- Choosing the right `type` enables mobile-optimized virtual keyboards (email, tel, number).
- Radio buttons must share the exact same `name` to enforce single selection.
- Always provide explicit `id` attributes so inputs can be paired with `<label>` elements.

---

## Practice Challenge

Build a profile settings form featuring:
1. An `email` and `tel` input.
2. A `date` picker for birth date.
3. A radio button group for notification frequency (Daily, Weekly, Never).
4. A `checkbox` agreeing to terms.
