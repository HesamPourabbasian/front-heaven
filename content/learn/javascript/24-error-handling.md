---
title: 'Error Handling'
description: 'Master robust JavaScript error handling: try/catch/finally blocks, throw statements, built-in error types (TypeError, ReferenceError, SyntaxError), custom error subclasses, asynchronous error handling, and global error boundaries.'
order: 24
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/23-fetch-and-apis
---

# Error Handling

In production software engineering, runtime errors and exceptional conditions (network disconnections, malformed server payloads, invalid user inputs, permission denials) are inevitable. Robust error handling transforms unexpected failures from catastrophic application crashes into graceful, user-friendly feedback and traceable observability logs.

JavaScript provides a comprehensive error-handling ecosystem centered on the `Error` object, `try...catch...finally` exception handling blocks, custom error class hierarchies, and global error interceptors.

In this lesson, we will explore synchronous exception handling with `try`, `catch`, and `finally`, the `throw` statement, built-in JavaScript error constructors, creating domain-specific custom Error subclasses, handling asynchronous Promise rejections, and setting up global error listeners.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     Error Handling & Propagation Flow                  │
├────────────────────────────────────────────────────────────────────────┤
│ try {                                                                  │
│   // 1. Risky Operation (e.g. JSON.parse, API call)                    │
│   throw new ValidationError("Invalid email format");                   │
│ } catch (error) {                                                      │
│   // 2. Error Caught & Handled                                         │
│   if (error instanceof ValidationError) { showFeedback(error); }       │
│   else { throw error; } // Re-throw unhandled errors                    │
│ } finally {                                                            │
│   // 3. Guaranteed Cleanup (Runs regardless of success or failure)     │
│   closeModalSpinner();                                                 │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

## The `try...catch...finally` Construct

- **`try`**: Wraps a block of code that may potentially throw an exception.
- **`catch (error)`**: Executes if an exception is thrown inside the `try` block. In modern JavaScript, the error variable is optional (`catch { ... }` for optional catch binding).
- **`finally`**: A block that is **guaranteed to execute** after the `try` and `catch` blocks finish, regardless of whether an exception occurred or was handled. It runs even if the `try` or `catch` block executes an explicit `return` statement.

```javascript
function processFile(filePath) {
  let fileHandle = null;
  try {
    fileHandle = openFile(filePath);
    return parseData(fileHandle);
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error.message);
    return null;
  } finally {
    // Guaranteed resource cleanup
    if (fileHandle) {
      fileHandle.close();
      console.log("File handle closed safely");
    }
  }
}
```

## Built-in JavaScript Error Types

JavaScript features standard subclasses of the base `Error` object:
1. **`TypeError`**: Thrown when an operation cannot be performed (e.g., calling a non-function, mutating a frozen object, accessing properties of `null`/`undefined`).
2. **`ReferenceError`**: Thrown when referencing a non-existent identifier or accessing a variable in the TDZ.
3. **`SyntaxError`**: Thrown when attempting to parse syntactically invalid code (e.g., in `JSON.parse` or `eval`).
4. **`RangeError`**: Thrown when a numerical value is outside its allowable range (e.g. `new Array(-1)` or stack overflow).
5. **`URIError`**: Thrown when URI encoding/decoding functions (`decodeURIComponent`) encounter malformed sequences.

```javascript
try {
  null.someMethod();
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.name);                // "TypeError"
  console.log(e.message);             // "Cannot read properties of null..."
}
```

## Creating Custom Domain Error Classes

Subclassing the built-in `Error` class allows you to create domain-specific error types that capture business context (such as HTTP status codes, validation errors, or payment failures):

```javascript
class DomainError extends Error {
  constructor(message, code = "INTERNAL_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
  }
}

class ValidationError extends DomainError {
  constructor(field, message) {
    super(`Validation failed for '${field}': ${message}`, "VALIDATION_FAILED");
    this.field = field;
  }
}

class ApiError extends DomainError {
  constructor(statusCode, message) {
    super(`API returned ${statusCode}: ${message}`, "API_ERROR");
    this.statusCode = statusCode;
  }
}

// Consuming custom errors with polymorphic catch handling
function registerUser(data) {
  if (!data.email?.includes("@")) {
    throw new ValidationError("email", "Must contain a valid @ domain");
  }
  // Registration logic...
}
```

## Asynchronous Error Handling

Synchronous `try...catch` blocks cannot catch exceptions thrown inside asynchronous callbacks:

```javascript
// WRONG - try/catch cannot catch callback error!
try {
  setTimeout(() => {
    // throw new Error("Boom!"); // Uncaught Exception! Crashes runtime!
  }, 100);
} catch (e) {
  console.log("Will never be reached");
}

// CORRECT - using async/await with try/catch
async function runSafeAsync() {
  try {
    const result = await riskyNetworkCall();
    return result;
  } catch (err) {
    console.error("Caught async error:", err.message);
  }
}
```

## Global Error Listeners

To prevent unhandled exceptions and unhandled promise rejections from silently failing or crashing applications:

- **Browser**:
  - `window.addEventListener("error", (event) => { ... })`: Catches unhandled runtime exceptions.
  - `window.addEventListener("unhandledrejection", (event) => { ... })`: Catches unhandled Promise rejections.
- **Node.js**:
  - `process.on("uncaughtException", (err) => { ... })`
  - `process.on("unhandledRejection", (reason) => { ... })`

```javascript
// Browser global unhandled rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise Rejection Detected:", event.reason);
  // Send telemetry report to monitoring service (Sentry / Datadog)
  reportToMonitoring(event.reason);
  event.preventDefault(); // Prevents default console warning
});
```

## Summary

JavaScript error handling combines `try`, `catch`, and `finally` blocks with the `throw` statement. Standard errors like `TypeError` and `ReferenceError` identify runtime violations. Create custom subclasses extending `Error` to attach domain metadata. In asynchronous code, always wrap `await` calls in `try...catch`, and register global `unhandledrejection` listeners to catch unhandled Promise failures.

## Best Practices

1. **Always Throw `Error` Instances**: Never throw primitive strings (`throw "error"`); always throw true `Error` objects (`throw new Error("message")`) to preserve stack traces.
2. **Use Custom Error Classes for Clean Branching**: Differentiate errors using `instanceof CustomError` rather than inspecting raw error message strings.
3. **Never Swallow Errors Silently**: Avoid empty `catch {}` blocks; always log, report, or handle errors gracefully.
4. **Use `finally` for Resource Cleanup**: Place spinner deactivation, file handle closing, and connection resets inside `finally` blocks.
5. **Install Global Unhandled Rejection Listeners**: Log all unhandled async errors to observability tools.
