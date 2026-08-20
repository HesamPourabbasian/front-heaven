---
title: 'Strings'
description: 'Master JavaScript string manipulation: indexing, slicing, template literals, length property, searching (includes, startsWith, endsWith), trimming, casing, substring extraction, and regex replacement.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/06-functions
---

# Strings

Strings in JavaScript represent textual data encoded as sequences of 16-bit UTF-16 code units. In JavaScript, strings are primitive values and are completely **immutable**: once a string value is allocated in memory, individual characters cannot be altered in place. Any string method that appears to transform a string (such as `toUpperCase()` or `replace()`) actually allocates and returns a brand-new string.

Efficient text processing, formatting, sanitization, and parsing are central to modern frontend development. With the introduction of ES6 Template Literals and modern inspection methods, string manipulation in JavaScript is both expressive and performant.

In this lesson, we will explore string indexing and slicing, template literals with embedded expressions, string properties (`.length`), search methods (`includes()`, `startsWith()`, `endsWith()`), extraction methods (`slice()`, `substring()`), mutation simulation (`replace()`, `replaceAll()`), splitting and joining, trimming, and casing transformations.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Common String Operations                        │
├───────────────────┬────────────────────────────────────────────────────┤
│ Inspection        │ .length, .includes(), .startsWith(), .endsWith()   │
│ Extraction        │ .slice(start, end), .substring(start, end), .at()  │
│ Transformation    │ .replace(), .replaceAll(), .toLowerCase(), .trim() │
│ Splitting         │ .split(delimiter) -> Array of substrings           │
│ Templating        │ `Hello ${name}, total: ${price * qty}`             │
└───────────────────┴────────────────────────────────────────────────────┘
```

## String Indexing, `.at()`, and `.length`

Strings can be indexed like arrays using zero-based bracket notation (`str[0]`) or the modern `.at()` method introduced in ES2022. While bracket notation returns `undefined` for negative indices, `.at(-1)` provides convenient access to characters counting backward from the end of the string.

The `.length` property returns the number of UTF-16 code units in the string:

```javascript
const sentence = "Frontend Development";

console.log(sentence.length); // 20
console.log(sentence[0]);     // "F"
console.log(sentence.at(-1));  // "t" (last character)
console.log(sentence.at(-4));  // "m"

// Strings are immutable
sentence[0] = "X"; // Silently fails in non-strict mode, throws in strict mode
console.log(sentence); // "Frontend Development" (unchanged)
```

## Template Literals and Expression Interpolation

Template literals (delimited by backticks `` ` ``) revolutionize string formatting by supporting multi-line strings without escape sequences and inline expression interpolation using `${expression}` syntax.

Within `${...}`, you can execute arbitrary JavaScript expressions, ternary operators, and function calls:

```javascript
const user = { firstName: "Sarah", role: "Lead Engineer", projectCount: 8 };

// Multi-line interpolated string
const summary = `
User Profile:
- Name: ${user.firstName}
- Role: ${user.role}
- Status: ${user.projectCount > 5 ? "Senior Veteran" : "Contributor"}
- Generated: ${new Date().toLocaleDateString()}
`;

console.log(summary.trim());
```

## Searching Strings: `includes()`, `startsWith()`, and `endsWith()`

Modern JavaScript provides intuitive boolean search methods that replace legacy `indexOf() !== -1` checks:
- **`includes(searchString, position)`**: Checks if `searchString` exists anywhere within the target string.
- **`startsWith(searchString, position)`**: Checks if the string begins with `searchString`.
- **`endsWith(searchString, length)`**: Checks if the string ends with `searchString`.

```javascript
const filename = "invoice_2026_q3.pdf";

console.log(filename.includes("2026"));      // true
console.log(filename.startsWith("invoice")); // true
console.log(filename.endsWith(".pdf"));      // true
console.log(filename.endsWith(".png"));      // false
```

## Slicing and Extracting: `slice()` vs `substring()`

JavaScript provides two primary methods for extracting substrings:
- **`slice(startIndex, endIndex)`**: Extracts characters from `startIndex` up to (but not including) `endIndex`. Supports negative indices to offset from the string end.
- **`substring(startIndex, endIndex)`**: Similar to `slice`, but treats negative arguments as `0` and automatically swaps `startIndex` and `endIndex` if `startIndex > endIndex`.

In modern development, **`slice()` is universally preferred** due to its predictable negative index support.

```javascript
const source = "ECMAScript_2026";

// slice with positive and negative indices
console.log(source.slice(0, 10)); // "ECMAScript"
console.log(source.slice(-4));    // "2026"

// substring comparison
console.log(source.substring(10, 0)); // "ECMAScript" (swaps arguments)
```

## Replacing Text: `replace()` and `replaceAll()`

- **`replace(searchValue, replaceValue)`**: Replaces the **first** occurrence of a substring or regular expression match.
- **`replaceAll(searchValue, replaceValue)`**: Replaces **all** occurrences of a substring or global regular expression match across the entire string.

```javascript
const rawText = "The red cat sat on the red mat.";

const singleReplaced = rawText.replace("red", "blue");
console.log(singleReplaced); // "The blue cat sat on the red mat."

const allReplaced = rawText.replaceAll("red", "blue");
console.log(allReplaced); // "The blue cat sat on the blue mat."
```

## Trimming, Splitting, and Casing

- **`trim()`**, **`trimStart()`**, **`trimEnd()`**: Strips whitespace (spaces, tabs, newlines) from the edges of a string.
- **`toUpperCase()`**, **`toLowerCase()`**: Returns a copy of the string converted to uppercase or lowercase.
- **`split(separator, limit)`**: Divides a string into an array of substrings using a specified separator delimiter.

```javascript
// Sanitizing user form input
const rawEmail = "   User.Contact@DOMAIN.COM   
";
const cleanEmail = rawEmail.trim().toLowerCase();
console.log(cleanEmail); // "user.contact@domain.com"

// Splitting CSV string
const tags = "javascript, typescript, frontend, react";
const tagList = tags.split(",").map(tag => tag.trim());
console.log(tagList); // ["javascript", "typescript", "frontend", "react"]
```

## Summary

JavaScript strings are immutable primitives representing UTF-16 text. Character access is available via zero-based indexing or `.at()` for negative offsets. Template literals allow multi-line strings and inline expression interpolation. Search methods (`includes`, `startsWith`, `endsWith`) return clean booleans. Use `slice()` for substring extraction, `replaceAll()` for comprehensive substitutions, `trim()` for input sanitation, and `split()` to convert delimited text into arrays.

## Best Practices

1. **Always Use Template Literals for Concatenation**: Avoid manual string addition (`"Hello " + name + "!"`); use `` `Hello ${name}!` ``.
2. **Use `slice()` Over `substring()`**: Standardize on `slice()` for substring extraction to take advantage of intuitive negative index offsets.
3. **Sanitize User Inputs Early**: Chain `.trim().toLowerCase()` on user-submitted emails, usernames, and codes before storage or comparison.
4. **Use `replaceAll()` for Complete Substitutions**: Avoid legacy regex workarounds (`/target/g`) when replacing simple literal substrings.
5. **Remember Immutability**: Remember that string methods never mutate the original variable in place; always capture the returned string value.
