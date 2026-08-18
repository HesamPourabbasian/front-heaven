---
title: 'Form Styling, Custom Controls & Accessible UI States'
description: 'Master enterprise form styling in CSS: Custom accessible checkboxes and radio buttons with appearance: none, file upload buttons (::file-selector-button), :user-invalid validation states, and floating label animations.'
order: 26
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/css/25-layout
---

# Form Styling, Custom Controls & Accessible UI States

Styling HTML form controls historically required fragile `<div>` hacks that broke keyboard navigation and screen reader support. Modern CSS provides native properties—such as **`appearance: none`**, **`accent-color`**, the **`::file-selector-button`** pseudo-element, and the **`:user-invalid`** state—enabling completely custom branded inputs that remain 100% accessible.

In this lesson, we explore styling custom checkboxes and radio buttons with `appearance: none`, floating label animations, custom file inputs, styling dropdown arrows, and accessible state indicators.

```text
┌────────────────────────────────────────────────────────────┐
│                    Modern Custom Checkbox Anatomy          │
├────────────────────────────────────────────────────────────┤
│ input[type="checkbox"] {                                   │
│   appearance: none; /* Strips OS native styling */         │
│   width: 20px; height: 20px;                               │
│   border: 2px solid var(--border-color);                   │
│   border-radius: 4px;                                      │
│   display: grid; place-content: center;                    │
│ }                                                          │
│ input[type="checkbox"]:checked {                           │
│   background-color: var(--brand-primary);                  │
│ }                                                          │
│ input[type="checkbox"]:checked::before {                   │
│   content: "✓"; color: white;                             │
│ }                                                          │
└────────────────────────────────────────────────────────────┘
```

## 1. Custom Checkboxes & Radio Buttons with `appearance: none`

`appearance: none` removes the operating system's default native control graphics while preserving all underlying accessibility roles, keyboard tab focus, and change events:

```css
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #94a3b8;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  display: grid;
  place-content: center;
  transition: all 0.15s ease;
}

.custom-checkbox:hover {
  border-color: #3b82f6;
}

.custom-checkbox:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.custom-checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}

.custom-checkbox:checked::before {
  content: "";
  width: 10px;
  height: 6px;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(-45deg) translate(1px, -1px);
}
```

## 2. Floating Label Form Input Pattern

Create interactive floating labels that animate upward when inputs are focused or contain text:

```html
<div class="floating-group">
  <input type="text" id="user-email" class="floating-input" placeholder=" " required />
  <label for="user-email" class="floating-label">Email Address</label>
</div>
```

```css
.floating-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.floating-input {
  width: 100%;
  padding: 1rem 0.75rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: transparent;
  outline: none;
}

.floating-label {
  position: absolute;
  top: 0.85rem;
  left: 0.75rem;
  color: #64748b;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: left top;
}

/* When input is focused OR has value (placeholder is NOT shown): float label! */
.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label {
  transform: translateY(-0.5rem) scale(0.75);
  color: #2563eb;
}

.floating-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
```

## 3. Styling Native File Inputs with `::file-selector-button`

Customize the native "Choose File" button directly in CSS:

```css
input[type="file"]::file-selector-button {
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  margin-inline-end: 1rem;
  transition: background-color 0.15s ease;
}

input[type="file"]::file-selector-button:hover {
  background-color: #e2e8f0;
}
```

## 4. Modern Validation Pseudoclasses: `:user-invalid`

Using standard `:invalid` turns inputs red the moment the page loads before the user even starts typing. Modern **`:user-invalid`** applies styles **only after the user has interacted** with the field and committed an invalid value:

```css
input:user-invalid {
  border-color: #ef4444;
  background-color: #fef2f2;
}

input:user-valid {
  border-color: #10b981;
}
```

## Summary

- `appearance: none` strips native OS graphics while maintaining complete accessibility.
- Floating labels leverage `:focus` and `:not(:placeholder-shown)` to animate smoothly.
- `::file-selector-button` styles native file upload buttons directly.
- `:user-invalid` prevents premature error styling on initial page load.
- Always provide high-contrast focus rings (`:focus-visible`) on custom controls.

## Best Practices

1. **Use `appearance: none` on Real Native Inputs**: Never build fake `<div>` checkboxes.
2. **Use `:user-invalid` Over `:invalid`**: Prevent confusing red borders on unsubmitted empty forms.
3. **Always Connect `<label for="id">`**: Ensure clicking the label toggles the custom checkbox.
4. **Style `:disabled` State Clearly**: Reduce opacity (`0.5`) and set `cursor: not-allowed`.
