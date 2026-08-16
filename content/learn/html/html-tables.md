---
title: 'HTML Tables'
description: 'Learn table, tr, th, td, caption, thead, tbody, tfoot, colspan, and rowspan to display structured tabular data.'
order: 14
difficulty: 'beginner'
category: 'Level 5 - Tables'
estimatedMinutes: 20
prerequisites:
  - /learn/html/embedded-content
---

## Anatomy of an HTML Table

Tables present two-dimensional tabular data arranged in rows and columns:

```html
<table>
  <caption>Monthly Web Traffic Breakdown (2026)</caption>
  <thead>
    <tr>
      <th>Month</th>
      <th>Unique Visitors</th>
      <th>Pageviews</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>January</td>
      <td>120,400</td>
      <td>345,100</td>
    </tr>
    <tr>
      <td>February</td>
      <td>145,800</td>
      <td>410,200</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Total</td>
      <td>266,200</td>
      <td>755,300</td>
    </tr>
  </tfoot>
</table>
```

---

## Core Table Elements

| Tag | Purpose |
| :--- | :--- |
| `<table>` | The wrapper container for all table content |
| `<caption>` | Semantic title describing the table contents |
| `<thead>` | Groups the table header rows |
| `<tbody>` | Groups the primary data rows |
| `<tfoot>` | Groups summary/total rows at the bottom |
| `<tr>` | Table Row container |
| `<th>` | Header Cell (bold and centered by default) |
| `<td>` | Standard Data Cell |

---

## Spanning Columns & Rows

You can merge adjacent cells horizontally or vertically:

- `colspan="N"`: Expands a cell across $N$ columns.
- `rowspan="N"`: Expands a cell across $N$ rows.

```html
<table>
  <tr>
    <th colspan="2">Student Information</th>
  </tr>
  <tr>
    <td rowspan="2">Alex Smith</td>
    <td>Grade: A</td>
  </tr>
  <tr>
    <td>Attendance: 98%</td>
  </tr>
</table>
```

---

## Important Rule: Tables are NOT for Page Layouts

In early web development, tables were misused to arrange page layouts (headers, sidebars, footers). In modern web development, **always use CSS Flexbox and Grid for page layouts**, and reserve HTML tables solely for tabular data (spreadsheets, pricing comparisons, schedules).

---

## Summary & Key Takeaways

- Group table rows into `<thead>`, `<tbody>`, and `<tfoot>`.
- Always provide a `<caption>` describing the data.
- Use `<th>` for headers and `<td>` for data cells.
- Use `colspan` and `rowspan` to span multiple columns or rows.

---

## Practice Challenge

Build a 4-column pricing comparison table with:
1. A `<caption>` title.
2. A `<thead>` with Plan names (Free, Pro, Enterprise).
3. A `<tbody>` with feature rows.
4. A `<tfoot>` with monthly costs.
