---
title: 'HTML & Browser DevTools'
description: 'Master inspecting HTML: Elements panel, Live DOM tree vs View Source, editing HTML live in browser, and debugging accessibility trees.'
order: 41
difficulty: 'beginner'
category: 'Level 12 - HTML in Real Projects'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-and-backend
---

## Mastering the Elements Panel

Browser Developer Tools (F12 or Right Click → Inspect) are the most important daily tool for front-end engineers.

---

## Key DevTools Capabilities

### 1. View Source vs. Live DOM
- **View Source (Ctrl+U / Cmd+U)**: Shows the raw text sent over HTTP from the server before JavaScript execution.
- **DevTools Elements Panel**: Shows the **live, current DOM tree** after browser parsing, HTML error recovery, and JavaScript mutations.

### 2. Live HTML Editing
- Double-click any text or attribute in the Elements panel to edit it live on the page.
- Right-click an element → **Edit as HTML** to paste new blocks of markup.
- Drag and drop DOM nodes up and down to reorder layout instantly.

### 3. Inspecting the Accessibility Tree
Modern DevTools (Chrome & Firefox) include an **Accessibility** tab showing:
- Computed Accessible Name.
- ARIA roles and properties.
- Contrast ratios on text elements.

---

## Summary & Key Takeaways

- Use the Elements panel to inspect the live DOM tree.
- Live DOM reflects JavaScript modifications; View Source shows only raw initial server text.
- Use the Accessibility tab to audit screen reader name computation and ARIA roles.

---

## Practice Challenge

Open DevTools on any website:
1. Inspect the main heading and edit its text live.
2. Find an image and inspect its `alt` text and rendered dimensions.
3. Open the Accessibility tab to inspect the computed accessible name of a button.
