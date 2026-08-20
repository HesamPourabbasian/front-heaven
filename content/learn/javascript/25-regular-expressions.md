---
title: 'Regular Expressions'
description: 'Master JavaScript Regular Expressions (RegExp): syntax, character classes, quantifiers, capturing and named groups, lookahead and lookbehind assertions, regex flags, and string methods (test, match, matchAll, replace).'
order: 25
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/javascript/24-error-handling
---

# Regular Expressions

Regular Expressions (RegExp) are patterns used to match character combinations in strings. In JavaScript, regular expressions are first-class `RegExp` objects with dedicated methods, integrated seamlessly with the `String` prototype methods (`match`, `matchAll`, `replace`, `replaceAll`, `search`, `split`).

From sanitizing user inputs and validating email/phone numbers to parsing structured data streams, regular expressions provide unmatched pattern-matching power. Modern ECMAScript (ES2018+) has substantially enriched JavaScript RegExp capabilities with **Named Capturing Groups**, **Lookbehind Assertions**, the `dotAll` (`s`) flag, and the `matchAll()` iterator.

In this lesson, we will explore RegExp syntax and construction, character classes and metacharacters, quantifiers, numbered and named capturing groups, positive/negative lookaheads and lookbehinds, flags (`g`, `i`, `m`, `s`, `u`, `y`), and execution methods (`test`, `exec`, `match`, `matchAll`).

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        RegExp Pattern Breakdown                        │
├────────────────────────────────────────────────────────────────────────┤
│ Pattern: /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g              │
│                                                                        │
│ • / ... /      : RegExp Literal Delimiters                             │
│ • (?<year>...) : Named Capturing Group 'year'                          │
│ • \d{4}        : Exactly 4 Digit Characters (Quantifier)               │
│ • -            : Literal Dash Match                                    │
│ • g            : Global Flag (Matches all occurrences in input)        │
└────────────────────────────────────────────────────────────────────────┘
```

## Creating Regular Expressions and Flags

JavaScript supports two ways to create a `RegExp` object:
1. **RegExp Literal**: `/pattern/flags` (compiled at script load time; preferred for static patterns).
2. **RegExp Constructor**: `new RegExp("pattern", "flags")` (compiled at runtime; required when building dynamic patterns from variables).

### Common Flags:
- **`g` (Global)**: Finds all matches rather than stopping after the first match.
- **`i` (Ignore Case)**: Case-insensitive matching.
- **`m` (Multiline)**: `^` and `$` match the start/end of each line rather than the entire string.
- **`s` (dotAll)**: Allows `.` to match newline characters (`
`).
- **`u` (Unicode)**: Enables full Unicode support and code-point matching.
- **`y` (Sticky)**: Matches only from the exact index indicated by `lastIndex`.

```javascript
// Static literal
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

// Dynamic constructor
const searchTerm = "react";
const dynamicRegex = new RegExp(`\b${searchTerm}\b`, "gi");
```

## Character Classes and Quantifiers

- **Character Classes**:
  - `\d`: Any digit (`[0-9]`), `\D`: Any non-digit.
  - `\w`: Any word character (alphanumeric plus underscore `[a-zA-Z0-9_]`), `\W`: Non-word character.
  - `\s`: Any whitespace character (spaces, tabs, newlines), `\S`: Non-whitespace.
  - `.`: Any single character except newlines (unless `s` flag is active).
  - `[a-z]`: Custom character set range; `[^0-9]`: Negated set (not a digit).
  - ``: Word boundary.
- **Quantifiers**:
  - `*`: 0 or more times (greedy).
  - `+`: 1 or more times.
  - `?`: 0 or 1 time (optional), or makes a quantifier lazy (`*?`, `+?`).
  - `{n}`: Exactly `n` times; `{n,m}`: Between `n` and `m` times; `{n,}`: At least `n` times.

```javascript
// Validating US Phone Number: (123) 456-7890 or 123-456-7890
const phonePattern = /^(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
console.log(phonePattern.test("(555) 234-5678")); // true
console.log(phonePattern.test("555-234-5678"));   // true
```

## Capturing Groups and Named Groups

Enclosing a portion of a pattern in parentheses `(...)` creates a **Capturing Group**, allowing you to extract matching sub-strings or refer to them later.

ES2018 introduced **Named Capturing Groups** using `(?<name>...)`, providing self-documenting extraction:

```javascript
const logEntry = "2026-08-20 [ERROR] Connection timed out on port 5432";
const logPattern = /(?<date>\d{4}-\d{2}-\d{2})\s+\[(?<level>\w+)\]\s+(?<message>.+)/;

const match = logEntry.match(logPattern);
if (match) {
  const { date, level, message } = match.groups;
  console.log(`Level: ${level}, Date: ${date}, Msg: "${message}"`);
}
```

## Lookahead and Lookbehind Assertions

Assertions match a position without consuming characters (zero-width matches):
- **Positive Lookahead `(?=...)`**: Asserts that what follows matches the pattern.
- **Negative Lookahead `(?!...)`**: Asserts that what follows does **not** match.
- **Positive Lookbehind `(?<=...)`**: Asserts that what precedes matches.
- **Negative Lookbehind `(?<!...)`**: Asserts that what precedes does not match.

```javascript
// Strong Password Validation using Lookaheads:
// Must have: at least 1 uppercase, 1 lowercase, 1 digit, min 8 chars
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
console.log(strongPassword.test("Abc12345!")); // true
console.log(strongPassword.test("weakpass"));  // false

// Extract currency amount preceded by '$' using Positive Lookbehind
const priceText = "The server costs $149 per month.";
const priceMatch = priceText.match(/(?<=\$)\d+/);
console.log(priceMatch?.[0]); // "149"
```

## RegExp and String Execution Methods

- **`regex.test(str)`**: Returns `true` or `false` based on whether the string matches.
- **`str.match(regex)`**: Returns match array or `null`.
- **`str.matchAll(regex)`**: Returns an iterator yielding all matches including capturing groups (requires `g` flag).
- **`str.replace(regex, replacement)`**: Replaces matched substrings with new text or dynamic replacement callbacks.

```javascript
const htmlSnippet = '<a href="/home">Home</a><a href="/about">About</a>';
const linkRegex = /href="(?<url>[^"]+)"/g;

// matchAll iteration
for (const match of htmlSnippet.matchAll(linkRegex)) {
  console.log("Found route URL:", match.groups.url);
}
```

## Summary

JavaScript regular expressions provide robust pattern matching. Standard character classes (`\d`, `\w`, `\s`) and quantifiers (`+`, `*`, `{n}`) define structures. Named capturing groups (`(?<name>...)`) make parsed results intuitive, while lookahead and lookbehind assertions validate contextual rules without consuming characters.

## Best Practices

1. **Use `test()` for Simple Boolean Validation**: Prefer `regex.test(str)` over `str.match(regex)` when checking if a string matches a format.
2. **Use Named Groups for Extraction**: Avoid fragile numbered indices like `match[1]`; use `(?<name>...)` and destructure `match.groups`.
3. **Beware of Regex Denial of Service (ReDoS)**: Avoid catastrophic backtracking caused by nested, ambiguous quantifiers (e.g., `(a+)+$`).
4. **Always Reset `lastIndex` on Global RegExps**: Global (`g`) regex objects are stateful; test calls update `regex.lastIndex`, which can cause alternating `true`/`false` results on repeated tests.
5. **Escape User Input in Dynamic RegExps**: Always sanitize dynamic strings before passing them to `new RegExp()`.
