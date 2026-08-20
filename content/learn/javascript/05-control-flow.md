---
title: 'Control Flow'
description: 'Master JavaScript control flow structures: conditional branching (if, else, else if, switch), iteration loops (for, while, do...while), jump statements (break, continue), and nested logic.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/javascript/04-operators
---

# Control Flow

Control flow defines the sequential order in which individual statements, instructions, and function calls are evaluated and executed within a JavaScript program. By default, the JavaScript engine executes code linearly from top to bottom. Control flow structures introduce branching conditions and iterative loops, enabling programs to dynamically adapt their behavior based on runtime state, user inputs, and asynchronous events.

Writing maintainable control flow requires balancing expressive conditional structures with clean architectural paradigms. Overly nested conditionals and unconstrained loops degrade readability and create complex code paths that are difficult to test and maintain.

In this lesson, we will explore conditional branching with `if`, `else if`, and `else`, examine multi-branch evaluation with `switch`, analyze loop constructs (`for`, `while`, `do...while`), and master loop control jump statements (`break` and `continue`).

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Control Flow Architecture                       │
├───────────────────────────────────┬────────────────────────────────────┤
│ Conditional Branching             │ Iterative Loops                    │
├───────────────────────────────────┼────────────────────────────────────┤
│ • if (condition) { ... }          │ • for (let i = 0; i < n; i++)      │
│ • else if (condition) { ... }     │ • while (condition) { ... }        │
│ • else { ... }                    │ • do { ... } while (condition)     │
│ • switch (val) { case x: break; } │ • break / continue (Jumps)         │
└───────────────────────────────────┴────────────────────────────────────┘
```

## Conditional Statements: `if`, `else if`, and `else`

The `if` statement evaluates a test condition inside parentheses. If the condition evaluates to a truthy value, the associated block statement executes. If the condition is falsy, execution bypasses the block and proceeds to subsequent `else if` evaluations or the fallback `else` block.

When chaining multiple conditions, JavaScript evaluates them sequentially and exits the conditional ladder as soon as the first truthy condition is encountered. Always place more specific conditions before general ones.

```javascript
function evaluateCreditScore(score) {
  if (score >= 800) {
    return "Exceptional";
  } else if (score >= 740) {
    return "Very Good";
  } else if (score >= 670) {
    return "Good";
  } else if (score >= 580) {
    return "Fair";
  } else {
    return "Poor";
  }
}
```

## Nested Conditions & Early Return Guards

Deeply nested `if` statements (often referred to as the "Pyramid of Doom" or arrow anti-pattern) significantly increase cyclomatic complexity and cognitive load. A widely adopted software engineering best practice is to replace nested conditions with **guard clauses** and **early returns**.

Guard clauses validate edge cases, missing inputs, and permission failures at the very beginning of a function, returning immediately before the primary business logic executes. This keeps the happy path flat, readable, and linear.

```javascript
// Anti-pattern: Deeply nested conditions
function processOrderBad(order, user) {
  if (user) {
    if (user.isActive) {
      if (order && order.items.length > 0) {
        if (user.balance >= order.total) {
          // Primary business logic buried 4 levels deep
          user.balance -= order.total;
          return { success: true };
        } else {
          return { error: "Insufficient funds" };
        }
      } else {
        return { error: "Empty order" };
      }
    } else {
      return { error: "Inactive user" };
    }
  } else {
    return { error: "Unauthenticated" };
  }
}

// Best Practice: Early Return Guard Clauses
function processOrderClean(order, user) {
  if (!user) return { error: "Unauthenticated" };
  if (!user.isActive) return { error: "Inactive user" };
  if (!order || order.items.length === 0) return { error: "Empty order" };
  if (user.balance < order.total) return { error: "Insufficient funds" };

  // Flat, clear happy path
  user.balance -= order.total;
  return { success: true };
}
```

## Multi-way Branching with `switch`

The `switch` statement evaluates an expression and matches its value against multiple `case` clauses using strict equality (`===`). When a matching case is found, execution begins at that case and continues until a `break` statement is encountered or the switch block terminates.

Omitting the `break` statement results in **fall-through**, where subsequent cases execute regardless of whether their case expression matches. While intentional fall-through can be used to group cases that share identical logic, unintentional fall-through is a frequent source of bugs. Always include a `default` clause to handle unmatched values.

```javascript
function getHttpActionDescription(statusCode) {
  switch (statusCode) {
    case 200:
    case 201:
      return "Request Succeeded";
    case 400:
      return "Bad Request - Check payload";
    case 401:
      return "Unauthorized - Authentication required";
    case 403:
      return "Forbidden - Insufficient permissions";
    case 404:
      return "Resource Not Found";
    case 500:
      return "Internal Server Error";
    default:
      return `Unhandled status code: ${statusCode}`;
  }
}
```

## Iteration Loops: `for`, `while`, and `do...while`

Loops repeat a block of code until a specified condition evaluates to falsy.

1. **Standard `for` Loop**: Consists of three optional expressions: initialization, condition check, and final increment expression (`for (let i = 0; i < limit; i++)`). It is ideal for iterating when the exact number of cycles is known in advance.
2. **`while` Loop**: Evaluates its test condition **before** each iteration. If the condition begins as false, the loop body never executes. Ideal for loops driven by dynamic state changes or queues.
3. **`do...while` Loop**: Evaluates its test condition **after** each iteration. Consequently, the loop body is guaranteed to execute at least once, regardless of whether the initial condition is truthy or falsy.

```javascript
// Standard for loop
const metrics = [88, 92, 79, 95];
let sum = 0;
for (let i = 0; i < metrics.length; i++) {
  sum += metrics[i];
}

// while loop: queue processing
const taskQueue = ["email_welcome", "sync_crm", "generate_invoice"];
while (taskQueue.length > 0) {
  const currentTask = taskQueue.shift();
  console.log(`Processing: ${currentTask}`);
}

// do...while loop: guaranteed single execution
let retryCount = 0;
do {
  console.log(`Attempt ${retryCount + 1}`);
  retryCount++;
} while (retryCount < 0); // Condition is false, but runs once
```

## Loop Control: `break` and `continue`

- **`break`**: Immediately terminates the innermost loop or switch statement, transferring execution to the statement immediately following the terminated block.
- **`continue`**: Immediately halts the current iteration of the loop and jumps to the evaluation of the loop's next increment/condition check.

```javascript
// Using break and continue
const transactions = [100, -20, 500, -15, 9999, 45];

for (let i = 0; i < transactions.length; i++) {
  const current = transactions[i];

  // Skip negative numbers
  if (current < 0) {
    continue;
  }

  // Halt processing on suspicious flag
  if (current > 5000) {
    console.warn(`Suspicious transaction detected: ${current}. Halting.`);
    break;
  }

  console.log(`Verified credit: $${current}`);
}
```

## Summary

JavaScript control flow provides branching logic (`if`, `else if`, `else`, `switch`) and iteration mechanisms (`for`, `while`, `do...while`). Guard clauses and early returns prevent nested nesting patterns and simplify code maintenance. `switch` statements evaluate cases via strict equality (`===`) and require explicit `break` statements to prevent fall-through. Loops iterate over datasets or queues, controlled dynamically with `break` to exit early and `continue` to skip specific cycles.

## Best Practices

1. **Prefer Early Return Guards**: Eliminate nested `if` statements by validating failure cases and returning early.
2. **Always Include a `default` in `switch`**: Provide a fallback `default` clause to catch unexpected inputs and prevent silent failures.
3. **Avoid Infinite Loops**: Ensure loop conditions have a guaranteed termination path, especially inside `while` loops.
4. **Use Proper Scoping in `for` Loops**: Always declare loop counters with `let` (`for (let i = 0; ...)`), never with `var`, to prevent loop-variable leakage into outer scopes.
5. **Prefer Declarative Iterators for Collections**: Use array methods (`map`, `filter`, `forEach`) for array transformations, reserving manual `for` loops for performance-critical inner loops or when explicit `break`/`continue` control is necessary.
