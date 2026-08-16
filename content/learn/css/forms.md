---
title: 'Styling HTML Forms'
description: 'Style modern form controls: custom inputs, accessible focus rings, custom checkboxes, radio switches, validation styling, and floating labels.'
order: 21
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/animations
---

## Modern Form Styling

Browser default form controls look outdated and inconsistent across operating systems. CSS allows you to reset and style them cleanly.

---

## Text Inputs & Accessible Focus Rings

```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #0f172a;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.input-field:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

/* Validation states */
.input-field:user-invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
```

---

## Custom Checkboxes and Toggle Switches

Using `appearance: none` to build custom controls:

```css
.toggle-switch {
  appearance: none;
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background-color: #cbd5e1;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ffffff;
  transition: transform 0.2s;
}

.toggle-switch:checked {
  background-color: #0ea5e9;
}

.toggle-switch:checked::after {
  transform: translateX(20px);
}
```

---

## Summary & Key Takeaways

- Use `:user-invalid` to highlight errors only after the user has interacted with the field.
- Never remove `outline` without providing an equivalent `:focus-visible` indicator.
- Use `appearance: none` to craft custom toggle switches.

---

## Practice Challenge

Build a styled settings form with custom toggle switches, search inputs with clear icons, and validation indicators.
