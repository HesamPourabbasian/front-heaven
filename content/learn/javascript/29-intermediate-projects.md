---
title: 'Intermediate Projects'
description: 'Build 8 complete, production-grade intermediate JavaScript projects: REST API Client, E-Commerce Frontend, Auth Application, Admin Dashboard, Real-Time Chat, Kanban Board, Movie Application, and Advanced Expense Tracker.'
order: 29
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 55
prerequisites:
  - /learn/javascript/28-tooling
---

# Intermediate Projects

Advancing from beginner to intermediate mastery requires designing applications that handle asynchronous network concurrency, modular state architectures, real-time event streaming, client-side authentication tokens, and complex UI interactions.

In this lesson, we build 8 comprehensive, real-world intermediate projects in vanilla JavaScript. Each project illustrates architectural patterns: state stores, token interceptors, DOM reconciliation, custom events, and robust error handling.

Building intermediate applications requires managing complex asynchronous lifecycles. Rather than simple single-file scripts, these projects emphasize clean modularization, defensive error boundaries, and separation of concerns.

By mastering these 8 real-world application architectures, you bridge the gap between building toy prototypes and engineering scalable production applications.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                       Intermediate Projects Suite                      │
├──────────────────────────────┬─────────────────────────────────────────┤
│ 1. Resilient REST API Client │ 5. Real-Time Chat Client (WebSocket)    │
│ 2. Dynamic E-Commerce Store  │ 6. Drag-and-Drop Kanban Board           │
│ 3. Secure Auth Application   │ 7. Movie Discovery & Search Client      │
│ 4. Analytics Admin Dashboard │ 8. Multi-Category Advanced Tracker      │
└──────────────────────────────┴─────────────────────────────────────────┘
```

## Project 1: Resilient REST API Client with Interceptors

A centralized HTTP client class featuring base URLs, default headers, request timeout handling, and response interceptors.

The client encapsulates request configuration, token injection, error parsing, and timeout abort signals into a single reusable class:

```javascript
class HttpClient {
  constructor({ baseURL = "", timeout = 8000 } = {}) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.interceptors = { request: [], response: [] };
  }

  useRequestInterceptor(fn) { this.interceptors.request.push(fn); }
  useResponseInterceptor(fn) { this.interceptors.response.push(fn); }

  async request(endpoint, options = {}) {
    let config = {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers }
    };

    // Run request interceptors (e.g. attaching auth tokens)
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    const signal = AbortSignal.timeout(this.timeout);
    const url = `${this.baseURL}${endpoint}`;

    try {
      let response = await fetch(url, { ...config, signal });

      // Run response interceptors
      for (const interceptor of this.interceptors.response) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request to ${url} failed:`, error.message);
      throw error;
    }
  }

  get(endpoint, options) { return this.request(endpoint, { ...options, method: "GET" }); }
  post(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });
  }
}
```

## Project 2: Reactive E-Commerce Frontend Architecture

E-commerce stores require synchronizing catalog inventory with shopping cart state. This project implements a central reactive state store with subscriber notifications:

```javascript
class StoreState {
  constructor() {
    this.products = [];
    this.cart = new Map();
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() { this.listeners.forEach(fn => fn(this)); }

  setProducts(products) {
    this.products = products;
    this.notify();
  }

  addToCart(productId) {
    const qty = this.cart.get(productId) || 0;
    this.cart.set(productId, qty + 1);
    this.notify();
  }

  removeFromCart(productId) {
    this.cart.delete(productId);
    this.notify();
  }

  getCartTotal() {
    let total = 0;
    for (const [id, qty] of this.cart.entries()) {
      const product = this.products.find(p => p.id === id);
      if (product) total += product.price * qty;
    }
    return total;
  }
}
```

## Project 3: Client-Side Authentication Session Manager

Managing user authentication requires tracking login tokens, persisting sessions across tabs, and providing authorization guards for protected application routes:

```javascript
class AuthManager {
  #tokenKey = "auth_jwt_token";

  constructor(apiClient) {
    this.api = apiClient;
    this.currentUser = null;
  }

  async login(email, password) {
    const data = await this.api.post("/auth/login", { email, password });
    sessionStorage.setItem(this.#tokenKey, data.token);
    this.currentUser = data.user;
    return this.currentUser;
  }

  logout() {
    sessionStorage.removeItem(this.#tokenKey);
    this.currentUser = null;
    window.location.href = "/login";
  }

  getToken() {
    return sessionStorage.getItem(this.#tokenKey);
  }

  isAuthenticated() {
    return Boolean(this.getToken());
  }
}
```

## Project 4: Interactive Admin Dashboard Analytics Widget

Admin dashboards render statistical aggregations, calculating conversion metrics and revenue figures dynamically:

```javascript
class DashboardMetrics {
  constructor(metricsContainer) {
    this.container = metricsContainer;
  }

  render(data) {
    const { revenue, activeUsers, conversionRate } = data;
    this.container.innerHTML = `
      <div class="metric-card">
        <h3>Total Revenue</h3>
        <p class="metric-value">$${revenue.toLocaleString()}</p>
      </div>
      <div class="metric-card">
        <h3>Active Users</h3>
        <p class="metric-value">${activeUsers.toLocaleString()}</p>
      </div>
      <div class="metric-card">
        <h3>Conversion Rate</h3>
        <p class="metric-value">${(conversionRate * 100).toFixed(1)}%</p>
      </div>
    `;
  }
}
```

## Project 5: Real-Time Chat Client using WebSockets

WebSocket communication enables low-latency bidirectional messaging. The chat client includes automatic reconnection logic on network dropouts:

```javascript
class RealtimeChatClient {
  constructor(wsUrl, onMessageReceived) {
    this.wsUrl = wsUrl;
    this.onMessageReceived = onMessageReceived;
    this.socket = null;
  }

  connect() {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.addEventListener("open", () => {
      console.log("WebSocket connected to chat server");
    });

    this.socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      this.onMessageReceived(payload);
    });

    this.socket.addEventListener("close", () => {
      console.warn("Socket disconnected. Reconnecting in 3s...");
      setTimeout(() => this.connect(), 3000);
    });
  }

  sendMessage(sender, text) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ sender, text, timestamp: Date.now() }));
    }
  }
}
```

## Project 6: Drag-and-Drop Kanban Board

Interactive task management boards rely on the native HTML5 Drag and Drop API, moving task cards between workflow columns dynamically:

```javascript
class KanbanBoard {
  constructor(boardElement) {
    this.board = boardElement;
    this.initDragAndDrop();
  }

  initDragAndDrop() {
    this.board.addEventListener("dragstart", (e) => {
      const card = e.target.closest(".kanban-card");
      if (card) {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", card.id);
      }
    });

    this.board.addEventListener("dragend", (e) => {
      const card = e.target.closest(".kanban-card");
      card?.classList.remove("dragging");
    });

    this.board.querySelectorAll(".kanban-column").forEach(column => {
      column.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow drop
      });

      column.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text/plain");
        const card = document.getElementById(cardId);
        if (card) column.querySelector(".cards-container").appendChild(card);
      });
    });
  }
}
```

## Project 7: Movie Discovery & Search Application

Search interfaces require debouncing queries and canceling inflight network calls using `AbortController` to eliminate race conditions:

```javascript
class MovieApp {
  constructor(apiKey, gridContainer) {
    this.apiKey = apiKey;
    this.grid = gridContainer;
    this.controller = null;
  }

  async searchMovies(query) {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
      const res = await fetch(url, { signal: this.controller.signal });
      const data = await res.json();
      this.renderMovies(data.results || []);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Movie search error:", err);
    }
  }

  renderMovies(movies) {
    this.grid.innerHTML = movies.map(m => `
      <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/w200${m.poster_path}" alt="${m.title}" loading="lazy" />
        <h4>${m.title}</h4>
        <span>Rating: ⭐ ${m.vote_average}</span>
      </div>
    `).join("");
  }
}
```

## Project 8: Multi-Category Advanced Expense Tracker

This application tracks complex financial expenditures, aggregating monthly breakdowns and persisting state to local storage:

```javascript
class AdvancedExpenseTracker {
  constructor() {
    this.records = JSON.parse(localStorage.getItem("expense_records_v2") || "[]");
  }

  addRecord({ title, amount, category, date = new Date() }) {
    this.records.push({
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString()
    });
    this.persist();
  }

  getMonthlySpending(year, month) {
    return this.records
      .filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, r) => sum + r.amount, 0);
  }

  persist() {
    localStorage.setItem("expense_records_v2", JSON.stringify(this.records));
  }
}
```

## Summary

These eight intermediate projects implement key architectural design patterns required in professional frontend engineering: state subscription patterns, network interceptors with timeout controls, drag-and-drop event orchestration, resilient WebSocket auto-reconnection, and client-side token auth storage.

## Best Practices

1. **Centralize HTTP Network Calls**: Use an `HttpClient` wrapper with interceptors rather than raw `fetch()` calls scattered across components.
2. **Implement Reconnection Strategies**: WebSockets and real-time streams should always feature exponential backoff or retry timers on unexpected disconnects.
3. **Cancel Stale Inflight Requests**: Protect search interfaces against race conditions using `AbortController`.
4. **Use Subscriptions for State Updates**: Implement observer patterns (`subscribe`/`notify`) to cleanly decouple state logic from DOM rendering.
5. **Use Unique Identifiers for Records**: Use `crypto.randomUUID()` for unique entity IDs.
