---
title: 'CSS Debugging & DevTools Mastery'
description: 'Master CSS debugging in DevTools: computed tab, box model inspection, Flexbox overlays, Grid badge inspector, and specificity debugging.'
order: 37
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/css-performance
---

## DevTools CSS Superpowers

Modern browser DevTools (Chrome, Firefox, Safari, Edge) provide dedicated debugging tools for layout engines:

---

## 1. Flexbox & Grid Overlay Badges
- Click the **`grid`** or **`flex`** badge next to an element in the DOM tree to draw interactive track guides and alignment lines over your page!

## 2. The Computed Styles Tab
- Shows the **final resolved pixel value** after all cascade layers, inheritance, and media queries have been calculated.
- Check "Show all" to see default user-agent properties.

## 3. Specificity Inspection
- Hover over any selector in the Styles pane to inspect its exact 3-part specificity score (e.g. `Specificity: (0, 1, 0)`).
- Strike-through text indicates a rule was overridden by higher specificity or later source order.

---

## Summary & Key Takeaways

- Use Grid and Flex badges in DevTools to visualize track lines and gap spacing.
- Use the Computed tab to verify actual resolved dimensions and font sizes.
- Inspect strikethrough lines to diagnose specificity override bugs.

---

## Practice Challenge

Open DevTools on a complex website, enable the Grid overlay on a grid container, and inspect track dimensions in the Layout tab.
