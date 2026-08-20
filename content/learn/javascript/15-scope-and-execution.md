---
title: 'Scope & Execution'
description: 'Deep dive into JavaScript execution: execution contexts, call stack, lexical environments, scope chain, variable hoisting, closures, and garbage collection mechanisms.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/javascript/14-beginner-projects
---

# Scope & Execution

To write performant, bug-free JavaScript applications and diagnose complex asynchronous anomalies, developers must understand the runtime execution model that powers JavaScript engines like V8, SpiderMonkey, and JavaScriptCore. JavaScript code does not execute in a vacuum; every statement is parsed, compiled into bytecode, and evaluated inside an **Execution Context** governed by strict lexical scoping and memory management rules.

At the center of this architecture are the **Call Stack**, **Lexical Environments**, and the **Scope Chain**. Together, these mechanisms govern variable visibility, lifetime, closure persistence, and garbage collection.

In this lesson, we will explore execution contexts (Creation vs Execution phases), dissect the Lexical Environment structure (Environment Records and Outer Reference chains), trace the Scope Chain, examine hoisting and closures, and understand Mark-and-Sweep garbage collection.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Execution Context & Scope Chain                   │
├────────────────────────────────────────────────────────────────────────┤
│ Global Execution Context                                               │
│  ├── Variable Environment / Lexical Environment (outer: null)          │
│  └── Call Stack: [ Global Frame ]                                      │
│                                                                        │
│ Function Execution Context: outerFunction()                            │
│  ├── Environment Record: { localA: 10 }                                │
│  └── Outer Lexical Environment Reference ──> [ Global Environment ]   │
│                                                                        │
│ Function Execution Context: innerFunction()                            │
│  ├── Environment Record: { localB: 20 }                                │
│  └── Outer Lexical Environment Reference ──> [ outerFunction Env ]     │
└────────────────────────────────────────────────────────────────────────┘
```

## The Execution Context: Global and Function Contexts

An **Execution Context (EC)** is an internal abstract data structure created by the JavaScript engine to manage the transformation and evaluation of code. There are three types of execution contexts:
1. **Global Execution Context (GEC)**: The default base context created when your script starts. It instantiates the global object (`window` or `global`) and binds the global `this`.
2. **Function Execution Context (FEC)**: Created whenever a function is invoked. Every function call generates its own distinct execution context pushed onto the Call Stack.
3. **Eval Execution Context**: Generated when executing code inside `eval()` (discouraged in modern development).

Every execution context undergoes two distinct phases:
- **Creation Phase**: The engine parses the function, creates the Lexical Environment, allocates memory for variables and functions, registers declarations (hoisting), and binds the `this` value.
- **Execution Phase**: The engine runs the code line-by-line, assigning values to variables and evaluating expressions.

## Lexical Environments and Environment Records

A **Lexical Environment** is a specification type used to define the association of Identifiers to specific variables and functions based on the lexical nesting structure of ECMAScript code. It consists of two components:
1. **Environment Record**: The actual storage dictionary mapping identifier names to values within this scope. (Includes the Declarative Environment Record for variables/functions and Object Environment Record for global/with bindings).
2. **Outer Reference (`[[OuterEnv]]`)**: A reference pointer to the parent lexical environment that physically surrounds this code block in the source code.

```javascript
const globalApiKey = "KEY_9988";

function parentScope() {
  const parentSecret = "SECRET_123";

  function childScope() {
    // childScope can resolve childLocal, parentSecret, and globalApiKey
    const childLocal = "LOCAL_DATA";
    console.log(childLocal, parentSecret, globalApiKey);
  }

  childScope();
}

parentScope();
```

## The Scope Chain and Identifier Resolution

When the engine encounters an identifier in code, it initiates **Identifier Resolution**. The engine first inspects the local Environment Record of the currently executing execution context. If the identifier is found, it uses that value.

If the identifier is not found locally, the engine follows the `[[OuterEnv]]` pointer to the outer lexical environment and repeats the search. This traversal continues up the **Scope Chain** until the identifier is found or the Global Lexical Environment (whose outer reference is `null`) is reached. If the identifier is still not found in the global environment, the engine throws a `ReferenceError`.

```javascript
const user = "Global User";

function levelOne() {
  // Shadowing: local user overrides global user in this scope
  const user = "Level 1 User";

  function levelTwo() {
    console.log(user); // Resolves to "Level 1 User" via outer reference
  }

  levelTwo();
}

levelOne();
```

## Lexical Scope vs Dynamic Scope

JavaScript uses **Lexical Scope** (static scope), meaning scope boundaries are determined strictly at **author time** by the location of function declarations in the source code—not at runtime by where or how the function is called.

No matter where or how a function is later invoked, its scope chain is locked to the lexical environment where it was defined.

```javascript
const trackingCategory = "System";

function logCategory() {
  console.log(trackingCategory);
}

function customRunner() {
  const trackingCategory = "CustomOverride";
  // logCategory still prints "System" because it was lexically declared in Global scope
  logCategory();
}

customRunner(); // Logs: "System"
```

## Closures: Lexical Memory Retention

A **Closure** is the combination of a function bundled together with references to its surrounding lexical environment. In JavaScript, closures are created automatically every time a function is created.

A closure gives an inner function access to an outer function's scope even **after** the outer function has finished executing and its execution context has been popped off the call stack. The engine retains the outer lexical environment in heap memory as long as the inner function retains a reference to it.

```javascript
function createRateLimiter(maxCallsPerMinute) {
  let callCount = 0;
  let windowStart = Date.now();

  // The returned function forms a closure over callCount and windowStart
  return function execute(taskName) {
    const now = Date.now();
    if (now - windowStart > 60000) {
      callCount = 0;
      windowStart = now;
    }

    if (callCount >= maxCallsPerMinute) {
      throw new Error(`Rate limit exceeded for task: ${taskName}`);
    }

    callCount++;
    console.log(`Executing ${taskName} (Call ${callCount}/${maxCallsPerMinute})`);
  };
}

const apiLimiter = createRateLimiter(2);
apiLimiter("fetchUsers"); // Call 1/2
apiLimiter("fetchPosts"); // Call 2/2
// apiLimiter("fetchComments"); // Throws Rate limit exceeded!
```

## Garbage Collection: Mark-and-Sweep

JavaScript features automated memory management via a **Garbage Collector (GC)**. The primary algorithm used by modern engines is **Mark-and-Sweep**:

1. **Roots**: The GC assumes a set of root objects (the Global object, active local variables and parameters on the Call Stack).
2. **Mark Phase**: The GC traverses the object reference graph starting from the roots, marking every reachable object as "active".
3. **Sweep Phase**: The GC sweeps through the memory heap, reclaiming all un-marked memory locations and returning them to the OS.

Closures keep their referenced outer variables alive in heap memory. If long-lived objects or global event listeners unintentionally hold references to closures, this can create memory leaks.

```javascript
// Potential Memory Leak: Unbounded closure reference
function setupLeak() {
  const massiveData = new Array(1000000).fill("payload");

  window.leakyHandler = function() {
    // Retains massiveData in memory permanently because leakyHandler is attached to window
    console.log("Data length:", massiveData.length);
  };
}
```

## Summary

JavaScript execution is managed via Execution Contexts pushed onto the Call Stack. Each context contains a Lexical Environment composed of an Environment Record and an outer lexical reference. The Scope Chain resolves identifiers statically based on source code authoring location. Closures preserve their surrounding lexical scope in heap memory even after outer functions terminate. The Mark-and-Sweep garbage collector automatically cleans up unreferenced memory.

## Best Practices

1. **Leverage Closures for Data Encapsulation**: Use closures to create private variables and module factories without exposing internal state.
2. **Avoid Unintentional Memory Leaks**: Clear global listeners, timers, and references when closures retain large data structures.
3. **Avoid Variable Shadowing**: Avoid declaring inner variables with the exact same name as outer variables to preserve code clarity.
4. **Minimize Global Scope Footprint**: Keep variables scoped tightly to local blocks or modules to reduce scope chain traversal and prevent collisions.
5. **Never Use `eval()` or `with`**: Both constructs destroy lexical optimization optimizations inside modern JIT compilers.
