---
title: 'Accessible Tables'
description: 'Master table accessibility: scope attributes, row vs column headers, complex multi-level headers with id and headers attributes.'
order: 15
difficulty: 'intermediate'
category: 'Level 5 - Tables'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-tables
---

## Why Table Accessibility Matters

Screen reader users cannot glance at a 2D grid visually. They navigate cell-by-cell. Without semantic markup, a screen reader will simply announce "Cell 4: $120" without indicating which product or month that cell belongs to!

---

## The `scope` Attribute

The `scope` attribute explicitly informs assistive technology whether a `<th>` header applies to a column or a row:

```html
<table>
  <caption>Employee Performance Ratings</caption>
  <thead>
    <tr>
      <th scope="col">Employee Name</th>
      <th scope="col">Department</th>
      <th scope="col">Rating</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- Row header -->
      <th scope="row">Sarah Connor</th>
      <td>Engineering</td>
      <td>Exceeds Expectations</td>
    </tr>
    <tr>
      <th scope="row">John Doe</th>
      <td>Design</td>
      <td>Meets Expectations</td>
    </tr>
  </tbody>
</table>
```

### Scope Values:
- `scope="col"`: Header for the entire column below.
- `scope="row"`: Header for the entire row to the right.
- `scope="colgroup"`: Header for a group of related columns.
- `scope="rowgroup"`: Header for a group of related rows.

---

## Complex Multi-Tier Tables (`id` and `headers`)

For complex tables with multiple nested header levels, link individual `<td>` cells to their corresponding `<th>` headers using IDs:

```html
<table>
  <caption>Q1 & Q2 Sales by Region</caption>
  <thead>
    <tr>
      <th id="reg">Region</th>
      <th id="q1">Q1 Sales</th>
      <th id="q2">Q2 Sales</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="north" headers="reg">North</th>
      <td headers="reg north q1">$50,000</td>
      <td headers="reg north q2">$65,000</td>
    </tr>
  </tbody>
</table>
```

---

## Summary & Key Takeaways

- Every `<th>` element should have a `scope="col"` or `scope="row"` attribute.
- Always include a `<caption>` so screen reader users get an immediate table summary.
- For complex multi-level grids, use `id` and `headers` associations.

---

## Practice Challenge

Build an accessible employee schedule table:
1. Column headers with `scope="col"` for days of the week.
2. Row headers with `scope="row"` for employee names.
3. A descriptive `<caption>` summarizing the work week.
