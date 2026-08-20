---
title: 'Operators'
description: 'Master JavaScript operators: arithmetic, assignment, comparison, strict vs loose equality, logical operators, nullish coalescing, optional chaining, ternary expressions, bitwise operators, delete, and precedence rules.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/03-data-types
---

# Operators

Operators are specialized symbols and keywords in JavaScript that perform computations, assignments, comparisons, and logical transformations on one or more operands (values, variables, or expressions). The combination of operators and operands forms executable expressions, which are the fundamental building blocks of application logic.

Because JavaScript is a dynamically typed language with implicit type coercion rules, mastering operators—especially comparison and logical operations—is critical for writing bug-free, predictable code. Recent ECMAScript additions, such as optional chaining (`?.`) and the nullish coalescing operator (`??`), have revolutionized how developers handle nested structures and default values safely.

In this lesson, we will dissect arithmetic and assignment operators, analyze comparison and equality rules (strict `===` vs loose `==`), master logical operators with short-circuit evaluation, explore nullish coalescing and optional chaining, leverage ternary and unary operators, understand bitwise logic, examine the `delete` and `typeof` operators, and understand operator precedence.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Core Operator Classifications                     │
├───────────────────┬────────────────────────────────────────────────────┤
│ Arithmetic        │ +  -  *  /  %  **  ++  --                          │
│ Comparison        │ ===  !==  ==  !=  >  <  >=  <=                     │
│ Logical           │ && (AND)  || (OR)  ! (NOT)                         │
│ Modern Safe Access│ ?? (Nullish Coalescing)  ?. (Optional Chaining)    │
│ Ternary & Unary   │ condition ? a : b  |  typeof, delete, +, -, ~      │
│ Bitwise           │ &  |  ^  ~  <<  >>  >>>                            │
└───────────────────┴────────────────────────────────────────────────────┘
```

## Arithmetic and Assignment Operators

Arithmetic operators perform mathematical calculations on numeric operands (or operands coerced to numbers):
- **Addition (`+`)**: Adds numbers or concatenates strings if either operand is a string.
- **Subtraction (`-`)**, **Multiplication (`*`)**, **Division (`/`)**: Standard mathematical operations.
- **Remainder / Modulo (`%`)**: Returns the integer remainder after division (`7 % 3 === 1`).
- **Exponentiation (`**`)**: Raises the base to the exponent power (`2 ** 3 === 8`).
- **Increment (`++`) / Decrement (`--`)**: Modifies a variable by 1 (prefix `++x` evaluates after increment; postfix `x++` evaluates before increment).

Compound assignment operators combine an arithmetic operation with assignment, modifying the target variable in place (`+=`, `-=`, `*=`, `/=`, `%=`, `**=`). Modern ECMAScript also provides logical assignment operators: `&&=`, `||=`, and `??=`.

```javascript
let balance = 1000;
balance += 250; // balance = balance + 250 (1250)
balance *= 1.05; // Compound interest (1312.5)

// Logical assignment operators
let userProfile = { theme: null };
userProfile.theme ??= "dark"; // Sets "dark" only if userProfile.theme is null/undefined
console.log(userProfile.theme); // "dark"
```

## Strict Equality (`===`) vs Loose Equality (`==`)

One of the most critical rules in JavaScript is understanding the difference between strict equality (`===` / `!==`) and loose equality (`==` / `!=`).

- **Strict Equality (`===`)**: Compares both the **type** and the **value** of operands without performing any type conversion. If the operands have different types, `===` immediately returns `false`.
- **Loose Equality (`==`)**: Implements complex Abstract Equality Comparison algorithms. If operands have different types, JavaScript attempts implicit type coercion, converting strings to numbers, booleans to numbers, and objects to primitives before comparing. This produces non-intuitive results and subtle security vulnerabilities.

```javascript
// Loose Equality Coercion Pitfalls (Avoid ==)
console.log(0 == false);        // true (false coerced to 0)
console.log("" == 0);           // true ("" coerced to 0)
console.log(null == undefined); // true (special specification rule)
console.log([] == 0);           // true (array coerced to "" then 0)
console.log([1] == 1);          // true

// Strict Equality (Predictable & Safe)
console.log(0 === false);        // false (number !== boolean)
console.log("" === 0);           // false (string !== number)
console.log(null === undefined); // false (null !== undefined)
console.log([] === 0);           // false
```

## Logical Operators & Short-Circuit Evaluation

JavaScript logical operators (`&&`, `||`, `!`) operate on truthy and falsy values. The values `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN` are **falsy**; all other values are **truthy** (including empty arrays `[]` and empty objects `{}`).

Logical operators use **short-circuit evaluation**:
- **Logical AND (`&&`)**: Evaluates operands from left to right. It returns the first falsy operand encountered; if all operands are truthy, it returns the final operand.
- **Logical OR (`||`)**: Evaluates operands from left to right. It returns the first truthy operand encountered; if all operands are falsy, it returns the final operand.
- **Logical NOT (`!`)**: Inverts truthiness into a boolean. Double NOT (`!!value`) explicitly converts any value to its boolean equivalent.

```javascript
// Short-circuiting for conditional execution
const user = { isAuthenticated: true, username: "Alice" };
user.isAuthenticated && console.log(`Welcome, ${user.username}`);

// || fallback pitfall: falsy numbers like 0 are skipped!
const userCount = 0;
const displayCount = userCount || 10;
console.log(displayCount); // 10 (Bug! userCount was validly 0)
```

## Nullish Coalescing (`??`) and Optional Chaining (`?.`)

To resolve the pitfall where `||` treats valid values like `0`, `""`, or `false` as falsy fallbacks, ECMAScript 2020 introduced the **Nullish Coalescing Operator (`??`)**. The `??` operator falls back to the right-hand operand **only if** the left-hand operand is strictly `null` or `undefined`.

The **Optional Chaining Operator (`?.`)** allows developers to read properties or invoke methods deep within nested object graphs without throwing a `TypeError: Cannot read properties of undefined/null`. If the reference before `?.` is nullish, evaluation short-circuits and returns `undefined`.

```javascript
const serverConfig = {
  port: 0, // Valid port number
  timeout: null,
  database: {
    connectionString: "postgres://localhost:5432"
  }
};

// Nullish Coalescing maintains 0 and empty strings
const activePort = serverConfig.port ?? 8080;
console.log(activePort); // 0 (Correctly preserved!)

const activeTimeout = serverConfig.timeout ?? 5000;
console.log(activeTimeout); // 5000 (null triggered fallback)

// Safe nested navigation with optional chaining
const replicaHost = serverConfig.database?.replicas?.[0]?.host;
console.log(replicaHost); // undefined (No crash!)
```

## Ternary, Unary, Bitwise, and `delete` Operators

- **Ternary Operator (`condition ? exprIfTrue : exprIfFalse`)**: The only JavaScript operator taking three operands. It is an inline expression that returns one of two values based on a boolean condition.
- **Unary Operators**: Operators taking a single operand, including unary plus `+` (converts strings to numbers: `+"42" === 42`), unary negation `-`, logical NOT `!`, and bitwise NOT `~`.
- **Bitwise Operators**: Operations on 32-bit binary representations of numbers (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`). Used in performance-critical graphics, hashing algorithms, and permission bitmasks.
- **`delete` Operator**: Deletes a property from an object (`delete user.temporaryToken`). It does not deallocate memory directly (that is handled by garbage collection) and should never be used on array elements, as it leaves an empty `sparse` hole (`undefined`) rather than re-indexing the array.

```javascript
// Ternary Operator
const accessLevel = user.isAdmin ? "FULL_ACCESS" : "READ_ONLY";

// Unary plus type coercion
const numericId = +"10842"; // 10842 (number)

// Object property deletion
const session = { id: "sess_99", tempCache: "data" };
delete session.tempCache;
console.log(session); // { id: "sess_99" }
```

## Operator Precedence

Operator precedence dictates the order in which operators are evaluated in complex compound expressions. Operators with higher precedence are evaluated before those with lower precedence.

When in doubt, use grouping parentheses `( ... )` to make evaluation order unambiguous. Parentheses have the highest precedence (level 18), overriding default evaluation orders.

| Precedence | Operator Category | Operators | Associativity |
| :--- | :--- | :--- | :--- |
| **18 (Highest)** | Grouping, Member Access | `(...)`, `a.b`, `a[b]`, `a?.b` | Left-to-right |
| **17** | Function Call, `new` (with args) | `fn(...)`, `new Class(...)` | Left-to-right |
| **15** | Postfix Increment/Decrement | `a++`, `a--` | None |
| **14** | Unary, Logical NOT, `typeof` | `!`, `+`, `-`, `typeof`, `delete`| Right-to-left |
| **13** | Exponentiation | `**` | Right-to-left |
| **12** | Multiplicative | `*`, `/`, `%` | Left-to-right |
| **11** | Additive | `+`, `-` | Left-to-right |
| **9** | Relational / `instanceof` | `<`, `<=`, `>`, `>=`, `instanceof`| Left-to-right |
| **8** | Equality | `===`, `!==`, `==`, `!=` | Left-to-right |
| **5** | Logical AND | `&&` | Left-to-right |
| **4** | Logical OR / Nullish | `||`, `??` | Left-to-right |
| **3** | Ternary Conditional | `? :` | Right-to-left |
| **2 (Lowest)** | Assignment | `=`, `+=`, `-=`, `&&=`, `??=` | Right-to-left |

## Summary

JavaScript operators provide the arithmetic, relational, and logical machinery for manipulating program state. Always use strict equality (`===`) to avoid the unpredictable hazards of type coercion with loose equality (`==`). Use the nullish coalescing operator (`??`) when supplying default values to preserve valid falsy values like `0` and `""`. Chain deep object traversals with optional chaining (`?.`) to prevent runtime crashes, and use explicit grouping parentheses to ensure transparent operator precedence in complex mathematical or boolean expressions.

## Best Practices

1. **Enforce Strict Equality Exclusively**: Configure ESLint with the `eqeqeq` rule to disallow `==` and `!=` across your entire codebase.
2. **Use `??` Instead of `||` for Defaults**: Prefer `const port = config.port ?? 3000` to prevent accidentally overwriting valid `0`, `false`, or `""` values.
3. **Combine `?.` and `??`**: Use optional chaining alongside nullish coalescing for safe nested extraction: `const title = response.data?.user?.title ?? 'Member'`.
4. **Use Explicit Parentheses in Mixed Logic**: When combining `&&` and `||`, always wrap sub-conditions in parentheses for clarity and maintainability.
5. **Never Use `delete` on Arrays**: Use `array.splice()` or `array.filter()` to remove array elements without introducing sparse empty holes.
