---
title: 'Tables, Tabular Data & Grid Alignment'
description: 'Master HTML data tables: Table structure (<table>, <tr>, <th>, <td>), semantic segmentation (<thead>, <tbody>, <tfoot>), column spanning (colspan, rowspan), captions, and accessible headers.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/html/05-lists
---

# Tables, Tabular Data & Grid Alignment

HTML tables are designed exclusively for structuring and presenting **tabular data**—information organized across two-dimensional rows and columns (e.g., financial spreadsheets, product price comparisons, timetables, and metric benchmarks).

In this lesson, we explore the complete HTML table architecture: `<table>`, `<tr>`, `<th>`, `<td>`, the structural sections `<thead>`, `<tbody>`, and `<tfoot>`, column and row spanning (`colspan`, `rowspan`), accessible `scope` attributes, and `<caption>`.

```text
┌────────────────────────────────────────────────────────────┐
│                  HTML Table Architecture Anatomy           │
├────────────────────────────────────────────────────────────┤
│ <table>                                                    │
│   <caption>Quarterly Server Latency Benchmarks</caption>   │
│   <thead>                                                  │
│     <tr><th scope="col">Region</th><th>P95 Latency</th></tr>│
│   </thead>                                                 │
│   <tbody>                                                  │
│     <tr><th scope="row">US-East</th><td>24ms</td></tr>     │
│   </tbody>                                                 │
│   <tfoot>                                                  │
│     <tr><th>Average</th><td>28ms</td></tr>                 │
│   </tfoot>                                                 │
│ </table>                                                   │
└────────────────────────────────────────────────────────────┘
```

## 1. Table Fundamentals: Rows, Headers & Cells

- **`<table>`**: The container element for all tabular content.
- **`<tr>` (Table Row)**: Represents a single horizontal row of cells.
- **`<th>` (Table Header)**: Represents a header cell for a column or row. Browsers render header cells bold and centered by default, and screen readers use them to announce context when reading data cells.
- **`<td>` (Table Data)**: Represents a standard data cell holding values.

```html
<table>
  <tr>
    <th>Framework</th>
    <th>Initial Release</th>
    <th>Reactivity Model</th>
  </tr>
  <tr>
    <td>Vue.js</td>
    <td>2014</td>
    <td>Proxy-based Fine-grained</td>
  </tr>
  <tr>
    <td>React</td>
    <td>2013</td>
    <td>Virtual DOM Reconciliation</td>
  </tr>
</table>
```

## 2. Structural Segmentation: `<thead>`, `<tbody>` & `<tfoot>`

Splitting tables into semantic sections provides structural clarity and allows browsers to maintain visible header and footer rows when printing multi-page documents:

```html
<table>
  <caption>2026 Developer Training Plan & Pricing</caption>
  <thead>
    <tr>
      <th scope="col">Tier</th>
      <th scope="col">Monthly Price</th>
      <th scope="col">Included Features</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Starter</th>
      <td>$0</td>
      <td>Full Core Fundamentals curriculum</td>
    </tr>
    <tr>
      <th scope="row">Pro Engineer</th>
      <td>$29</td>
      <td>Full roadmap, AI coding, and senior projects</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Team Enterprise</th>
      <td colspan="2">Contact sales for custom team licensing</td>
    </tr>
  </tfoot>
</table>
```

## 3. Merging Cells with `colspan` and `rowspan`

When a single cell must span across multiple adjacent columns or vertical rows, use `colspan` and `rowspan`:

- **`colspan="2"`**: Stretches the cell across two horizontal columns.
- **`rowspan="3"`**: Stretches the cell down across three vertical rows.

```html
<table border="1">
  <thead>
    <tr>
      <th rowspan="2">Student</th>
      <th colspan="2">Exam Scores</th>
    </tr>
    <tr>
      <th>Midterm</th>
      <th>Final</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alex Dev</td>
      <td>94</td>
      <td>98</td>
    </tr>
  </tbody>
</table>
```

## 4. Table Accessibility with `scope` & `<caption>`

Screen readers navigate data tables by tracking row and column headers. Without proper markup, visually impaired users hear random values without knowing which column or row they belong to:
- **`<caption>`**: Placed immediately after the opening `<table>` tag, providing an accessible title describing the table's purpose.
- **`scope="col"`**: Explicitly identifies the header cell as the header for the entire column below.
- **`scope="row"`**: Explicitly identifies the header cell as the header for the horizontal row to its right.

## Summary

- HTML tables represent two-dimensional tabular datasets across rows and columns.
- Tables are divided into `<thead>` (column headers), `<tbody>` (data rows), and `<tfoot>` (summary totals).
- `<th>` defines headers; `<td>` contains data values.
- `colspan` and `rowspan` merge adjacent cells horizontally and vertically.
- `<caption>` and `scope="col"` / `scope="row"` ensure screen reader accessibility.

## Best Practices

1. **Never Use Tables for Page Layout**: Use CSS Flexbox and Grid for page layout; reserve tables exclusively for tabular data.
2. **Always Provide a `<caption>`**: Give screen reader users immediate context on the table's dataset.
3. **Always Add `scope="col"` and `scope="row"` to `<th>`**: Enable screen readers to announce row and column context for every cell.
4. **Avoid Deeply Nested Merged Cells**: Keep `colspan` and `rowspan` simple to maintain readable responsive tables.
