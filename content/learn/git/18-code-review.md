---
title: 'Code Review: Senior Standards & Constructive Feedback'
description: 'Master professional code review: reviewing architecture, security, performance, maintainability, inline comment etiquette, suggestions blocks, and approval workflows.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/git/09-basic-collaboration']
---

# Code Review: Senior Standards & Constructive Feedback

**Code Review** is the premier quality assurance and knowledge-sharing practice in professional software engineering. A great code review is not a gatekeeping exercise or a spell-check for formatting—it is a collaborative conversation aimed at improving system architecture, ensuring security, verifying test coverage, and mentoring teammates.

Senior developers evaluate Pull Requests across five distinct dimensions: **Architecture**, **Performance**, **Security**, **Testability**, and **Maintainability**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The 5 Dimensions of Senior Code Review      │
├───────────────┬─────────────────────────────────────────────┤
│ Dimension     │ Critical Review Questions                   │
├───────────────┼─────────────────────────────────────────────┤
│ Architecture  │ Does this follow DDD & separation of        │
│               │ concerns? Is state managed predictably?     │
├───────────────┼─────────────────────────────────────────────┤
│ Performance   │ Are there N+1 loops, unindexed reads, or    │
│               │ unnecessary re-renders / bundle bloat?      │
├───────────────┼─────────────────────────────────────────────┤
│ Security      │ Is user input sanitized? Are auth tokens    │
│               │ protected? Are XSS/CSRF vectors prevented?  │
├───────────────┼─────────────────────────────────────────────┤
│ Testability   │ Are edge cases tested? Are mocks isolated?  │
│               │ Is test coverage meaningful?                │
├───────────────┼─────────────────────────────────────────────┤
│ Maintainability│ Is code self-documenting? Are variable names│
│               │ clear? Is technical debt introduced?        │
└───────────────┴─────────────────────────────────────────────┘
```

## 1. Using Suggestion Blocks in GitHub

Rather than typing descriptions of what code to change, reviewers can propose exact drop-in replacements using markdown suggestion blocks:

````markdown
```suggestion
export function calculateTax(subtotal: number, taxRate = 0.08): number {
  if (subtotal < 0) return 0;
  return Math.round(subtotal * taxRate * 100) / 100;
}
```
````

The author can click **Commit suggestion** directly in GitHub's web interface to apply the edit instantly.

## 2. Constructive Review Etiquette

Review the code, not the person:

| ❌ Poor Review Comment | ✅ Professional Senior Review Comment |
| :--- | :--- |
| "Why did you write this terrible loop?" | "Could we consider using `Array.prototype.reduce()` here? It would avoid mutating the array and improve readability." |
| "You forgot to test edge cases." | "What happens if the API returns an empty array or `null`? Adding a test case for empty state would ensure resilience." |
| "Change this name." | "Nit: Renaming `d` to `userData` would make this function signature more self-documenting." |

### Prefixes for Clear Intent:
- **`Blocking`**: Critical bug, security flaw, or architecture violation that must be resolved before merge.
- **`Question`**: Seeking clarification to better understand the author's intent.
- **`Nit` (Nitpick)**: Minor suggestion or style preference; optional for the author.
- **`Praise`**: Celebrating elegant solutions, clever optimizations, or great test suites!

## Summary & Key Takeaways

- Code reviews evaluate architecture, performance, security, testability, and maintainability.
- Suggestion blocks allow one-click commit applications for proposed fixes.
- Constructive feedback focuses on rationale and code behavior rather than personal criticism.
- Use explicit comment tags (`Blocking`, `Nit`, `Question`, `Praise`) to clarify expectations.

## Best Practices & Senior Guidance

1. **Automate Formatting to Eliminate Style Debates**: Enforce Prettier and ESLint in CI so human reviewers never waste time arguing over tabs vs spaces or trailing commas.
2. **Respond to Every Review Comment**: As an author, reply to all reviewer comments or react with emoji thumbs-up before requesting re-review.
