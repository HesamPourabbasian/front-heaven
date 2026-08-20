---
title: 'Advanced Architecture'
description: 'Master enterprise frontend architecture: Design patterns (Observer, Factory, Singleton, Strategy), SOLID principles, Dependency Injection (DI), Event-Driven Architecture, State Machines (XState), Micro-Frontends, and Design Systems.'
order: 39
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/38-security
---

# Advanced Architecture

As frontend applications scale to millions of lines of code, hundreds of distributed engineers, and multi-team ownership, code organization transcends basic framework components. Enterprise frontend engineering requires robust architectural paradigms: **Design Patterns**, **SOLID Principles**, **Dependency Injection**, **Finite State Machines**, **Event-Driven Messaging**, and modular **Micro-Frontends**.

A well-architected frontend system decouples business logic from rendering frameworks, maximizes code reusability, ensures testability, and supports independent team deployment cadences.

In this lesson, we will explore classic Gang of Four design patterns in JavaScript, apply SOLID principles to frontend codebases, implement Dependency Injection containers, manage complex UI state with Finite State Machines, and architect Micro-Frontend solutions via Module Federation.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Enterprise Layered Architecture                   │
├────────────────────────────────────────────────────────────────────────┤
│ [ UI / Presentation Layer ]   (Components, Templates, Renderers)       │
│             │                                                          │
│             ▼                                                          │
│ [ State / Application Layer ] (State Machines, Stores, ViewModels)     │
│             │                                                          │
│             ▼                                                          │
│ [ Domain / Business Layer ]   (Pure Entities, Use Cases, Validators)   │
│             │                                                          │
│             ▼                                                          │
│ [ Infrastructure / Data Layer](HTTP Clients, WebSocket, IndexedDB)     │
└────────────────────────────────────────────────────────────────────────┘
```

## SOLID Principles in Frontend Engineering

1. **Single Responsibility Principle (SRP)**: A module or component should have only one reason to change. Separate data fetching from presentation.
2. **Open/Closed Principle (OCP)**: Software entities should be open for extension, but closed for modification. Use strategy objects or composition.
3. **Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without breaking client code.
4. **Interface Segregation Principle (ISP)**: Clients should not be forced to depend on interfaces they do not use. Keep parameter contracts small and focused.
5. **Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules; both should depend on abstractions.

## Dependency Injection (DI)

Dependency Injection decouples high-level business services from concrete low-level infrastructure implementations (e.g. swapping a concrete `FetchHttpClient` with a `MockHttpClient` during testing):

```javascript
// Abstraction Interface Contract
class IStorageService {
  getItem(key) { throw new Error("Method not implemented"); }
  setItem(key, value) { throw new Error("Method not implemented"); }
}

// High-Level Domain Service adhering to DIP
class UserPreferencesManager {
  constructor(storageService) {
    this.storage = storageService; // Injected dependency
  }

  getTheme() {
    return this.storage.getItem("user_theme") || "system";
  }

  setTheme(theme) {
    this.storage.setItem("user_theme", theme);
  }
}

// Inversion of Control: Injecting concrete implementation
const manager = new UserPreferencesManager(localStorage);
```

## Classic Design Patterns in JavaScript

### 1. Observer Pattern (Pub/Sub)
Enables decoupled event-driven communication between publishers and multiple subscribers:

```javascript
class EventEmitter {
  constructor() { this.events = new Map(); }

  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(listener);
    return () => this.events.get(event).delete(listener); // Unsubscribe
  }

  emit(event, payload) {
    this.events.get(event)?.forEach(fn => fn(payload));
  }
}
```

### 2. Strategy Pattern
Defines a family of interchangeable algorithms encapsulated into separate objects:

```javascript
// Payment Processing Strategies
const paymentStrategies = {
  creditCard: { process: (amount) => `Charged $${amount} via Stripe Card API` },
  paypal: { process: (amount) => `Processed $${amount} via PayPal OAuth Portal` },
  crypto: { process: (amount) => `Transferred $${amount} via Ethereum RPC Node` }
};

function executePayment(amount, method) {
  const strategy = paymentStrategies[method];
  if (!strategy) throw new Error(`Unsupported payment method: ${method}`);
  return strategy.process(amount);
}
```

## Finite State Machines (FSMs)

Complex user interfaces (multi-step checkouts, media players, drag-and-drop canvases) often suffer from boolean state explosion (`isLoading`, `isError`, `isSuccess`, `canRetry`).

A **Finite State Machine** guarantees that an application can only exist in **exactly one deterministic state** at any given time, transitioning only through explicitly allowed event triggers:

```javascript
class MediaPlaybackFSM {
  constructor() {
    this.state = "IDLE"; // Initial state
    this.transitions = {
      IDLE: { LOAD: "LOADING" },
      LOADING: { SUCCESS: "PLAYING", FAILURE: "ERROR" },
      PLAYING: { PAUSE: "PAUSED", STOP: "IDLE" },
      PAUSED: { PLAY: "PLAYING", STOP: "IDLE" },
      ERROR: { RETRY: "LOADING" }
    };
  }

  send(event) {
    const nextState = this.transitions[this.state]?.[event];
    if (nextState) {
      console.log(`[FSM Transition] ${this.state} --(${event})--> ${nextState}`);
      this.state = nextState;
    } else {
      console.warn(`Invalid transition event '${event}' in state '${this.state}'`);
    }
  }
}

const player = new MediaPlaybackFSM();
player.send("LOAD");    // IDLE -> LOADING
player.send("SUCCESS"); // LOADING -> PLAYING
player.send("PAUSE");   // PLAYING -> PAUSED
```

## Micro-Frontends & Module Federation

In large enterprises, **Micro-Frontends** decompose monolithic frontend applications into independently developed, tested, and deployed micro-applications.

Webpack/Vite **Module Federation** enables dynamic runtime loading of independently deployed JavaScript modules across separate hosts without requiring npm package publishing or monorepo rebuilds:

```javascript
// Host Application: dynamically imports Header micro-frontend from remote host
import("remoteApp/HeaderComponent").then(({ default: Header }) => {
  document.querySelector("#header-slot").appendChild(Header());
});
```

## Summary

Advanced frontend architecture separates concerns into clean layers. SOLID principles ensure maintainable, extensible codebases. Dependency Injection decouples business services from low-level storage or network implementations. Design patterns (Observer, Strategy) solve recurring engineering problems. Finite State Machines eliminate invalid UI states, and Micro-Frontends scale independent team development.

## Best Practices

1. **Separate Business Logic from UI Components**: Keep domain algorithms and state in pure JavaScript classes/stores that can be tested independently of Vue/React.
2. **Use State Machines for Complex Workflows**: Replace conflicting boolean flags (`isLoading`, `hasError`) with explicit Finite State Machines.
3. **Inject Dependencies for Testability**: Pass HTTP clients and storage drivers into service constructors to simplify unit test mocking.
4. **Establish Architectural Boundaries with ESLint Rules**: Enforce import boundaries (e.g. preventing UI components from importing infrastructure drivers directly).
5. **Adopt a Unified Design System**: Centralize design tokens, typography, and foundational UI primitives into a shared component library.
