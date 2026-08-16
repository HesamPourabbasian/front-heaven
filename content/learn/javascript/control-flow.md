---
title: Control Flow
description: Direct program execution with conditions, if...else and switch statements.
order: 8
difficulty: beginner
category: Level 3 - Control Flow and Functions
estimatedMinutes: 25
prerequisites:
  - learn/javascript/expressions
---

## Decisions

Control flow lets a program choose. `if...else` handles boolean conditions; `switch` compares one value against several cases. Use strict case matching and always consider the default branch.

```js
if (score >= 90) {
  grade = 'A'
} else if (score >= 80) {
  grade = 'B'
} else {
  grade = 'Keep practicing'
}
```

Guard clauses reduce nesting: return or continue when invalid input is found, then keep the main path at the left edge.

## Summary

Clear control flow makes business rules testable. Prefer small conditions, explicit comparisons and a visible fallback.

## Practice

Implement the same grading rule with `if...else` and `switch`, then add tests for boundaries and invalid input.
