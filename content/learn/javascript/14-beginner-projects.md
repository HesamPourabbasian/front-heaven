---
title: 'Beginner Projects'
description: 'Build 9 complete, practical, vanilla JavaScript beginner projects: Calculator, Todo App, Counter, Quiz App, Stopwatch, Weather App, Expense Tracker, Shopping Cart, and Image Gallery.'
order: 14
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 50
prerequisites:
  - /learn/javascript/13-json-and-storage
---

# Beginner Projects

The most effective way to consolidate JavaScript fundamentals—variables, functions, arrays, objects, DOM manipulation, event handling, and local storage—is to build complete, functional, real-world applications from scratch.

Theoretical understanding of syntax only becomes practical engineering capability when you encounter and solve concrete architectural problems: managing UI state transitions, validating unpredictable user input, persisting data across page reloads, and updating the DOM efficiently.

In this comprehensive lesson, we implement 9 practical, vanilla JavaScript projects. Each project demonstrates clean software architecture, modular state management, robust event handling, and DOM rendering patterns without reliance on any external libraries or frameworks.

By building these applications sequentially, you will internalize how simple variables evolve into reactive state stores, how individual event listeners scale into event delegation systems, and how raw network responses transform into accessible user interfaces.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Beginner Projects Suite                         │
├──────────────────────────────┬─────────────────────────────────────────┤
│ 1. Interactive Calculator    │ 6. Async Weather App                    │
│ 2. Persistent Todo App       │ 7. Category Expense Tracker             │
│ 3. State-Driven Counter      │ 8. Dynamic Shopping Cart                │
│ 4. Interactive Quiz App      │ 9. Filterable Image Gallery             │
│ 5. Precision Stopwatch       │                                         │
└──────────────────────────────┴─────────────────────────────────────────┘
```

## Project 1: Interactive Arithmetic Calculator

Calculators require modeling sequential user interactions as a state machine. The application must track the current operand being typed, the previous operand stored in memory, the active mathematical operator selected, and whether the display should be reset upon entering a new calculation.

Handling edge cases is paramount in calculator logic. For example, users must not be permitted to enter multiple decimal points (`3.14.15`), division by zero must be intercepted cleanly before yielding `Infinity` or crashing, and consecutive operator selections should override the previous operator gracefully.

The following object-oriented implementation encapsulates the calculator's state, validation logic, and display rendering inside a cohesive `Calculator` class:

```javascript
class Calculator {
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.updateDisplay();
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand += number.toString();
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") this.compute();
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.updateDisplay();
  }

  compute() {
    let result;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+": result = prev + current; break;
      case "-": result = prev - current; break;
      case "*": result = prev * current; break;
      case "/": result = current === 0 ? "Error" : prev / current; break;
      default: return;
    }

    this.currentOperand = result.toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.updateDisplay();
  }

  updateDisplay() {
    this.displayElement.textContent = this.currentOperand;
  }
}
```

## Project 2: Persistent Todo App with LocalStorage

The Todo application is the classic proving ground for CRUD (Create, Read, Update, Delete) operations and data persistence. In this project, state is represented as an array of task objects stored in `localStorage`.

Instead of binding individual event listeners to every delete button and checkbox in the list, this application implements **Event Delegation** on the parent container. This ensures that newly added tasks respond to clicks immediately without requiring new event listeners.

Data serialization with `JSON.stringify()` and deserialization with `JSON.parse()` ensure that user tasks survive browser restarts and tab closures seamlessly:

```javascript
class TodoApp {
  constructor(container) {
    this.container = container;
    this.todos = JSON.parse(localStorage.getItem("todos_data") || "[]");
    this.init();
  }

  init() {
    this.render();
    this.container.addEventListener("click", (e) => {
      const id = e.target.closest("[data-id]")?.dataset.id;
      if (!id) return;

      if (e.target.matches(".btn-delete")) {
        this.deleteTodo(id);
      } else if (e.target.matches(".checkbox-toggle")) {
        this.toggleTodo(id);
      }
    });
  }

  addTodo(text) {
    if (!text.trim()) return;
    this.todos.push({ id: Date.now().toString(), text: text.trim(), completed: false });
    this.saveAndRender();
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveAndRender();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveAndRender();
  }

  saveAndRender() {
    localStorage.setItem("todos_data", JSON.stringify(this.todos));
    this.render();
  }

  render() {
    this.container.innerHTML = this.todos.map(t => `
      <li data-id="${t.id}" class="todo-item ${t.completed ? 'completed' : ''}">
        <input type="checkbox" class="checkbox-toggle" ${t.completed ? 'checked' : ''} />
        <span>${t.text}</span>
        <button class="btn-delete">×</button>
      </li>
    `).join("");
  }
}
```

## Project 3: State-Driven Counter with Dynamic Formatting

While a counter appears deceptively simple, it demonstrates reactive UI updates based on internal numerical state. The application provides step customization, reset bounds, and dynamic visual indicators.

When the numerical value crosses specific thresholds (positive, negative, zero), the component dynamically updates its styling classes and inline styles to provide visual feedback to the user:

```javascript
class Counter {
  constructor(displayEl, initial = 0, step = 1) {
    this.count = initial;
    this.step = step;
    this.displayEl = displayEl;
    this.render();
  }

  increment() { this.count += this.step; this.render(); }
  decrement() { this.count -= this.step; this.render(); }
  reset() { this.count = 0; this.render(); }

  render() {
    this.displayEl.textContent = this.count;
    this.displayEl.style.color = this.count > 0 ? "green" : this.count < 0 ? "red" : "black";
  }
}
```

## Project 4: Interactive Multiple-Choice Quiz Engine

The Quiz application manages a sequential progression of questions, validating user answers against an answer key and aggregating a cumulative score.

The quiz engine cleanly decouples question data from rendering logic, allowing developers to supply arbitrary question datasets via JSON:

```javascript
class QuizEngine {
  constructor(questions, onFinish) {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
    this.onFinish = onFinish;
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  submitAnswer(selectedIndex) {
    if (selectedIndex === this.getCurrentQuestion().correctIndex) {
      this.score++;
    }
    this.currentIndex++;
    if (this.currentIndex >= this.questions.length) {
      this.onFinish(this.score, this.questions.length);
    }
  }
}
```

## Project 5: Millisecond Precision Stopwatch

Building a stopwatch requires managing browser timers with `setInterval()` while mitigating timer drift. Because JavaScript timers are not strictly guaranteed to run at exact millisecond intervals due to event loop queuing, calculating elapsed time using `Date.now() - startTime` delivers high precision:

```javascript
class Stopwatch {
  constructor(onTick) {
    this.onTick = onTick;
    this.elapsedTime = 0;
    this.timerId = null;
    this.startTime = 0;
  }

  start() {
    if (this.timerId) return;
    this.startTime = Date.now() - this.elapsedTime;
    this.timerId = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.onTick(this.formatTime(this.elapsedTime));
    }, 10);
  }

  stop() {
    clearInterval(this.timerId);
    this.timerId = null;
  }

  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.onTick("00:00:00.00");
  }

  formatTime(ms) {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const hundredths = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${hundredths}`;
  }
}
```

## Project 6: Asynchronous Weather Client

This project integrates the Fetch API to retrieve live atmospheric conditions from a remote REST API, parsing JSON responses and updating DOM cards asynchronously:

```javascript
async function fetchWeatherData(city, apiKey) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error(`City not found (${response.status})`);
    const data = await response.json();
    return {
      cityName: data.name,
      temp: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity
    };
  } catch (error) {
    return { error: error.message };
  }
}
```

## Project 7: Categorized Expense Tracker

Managing personal finances requires categorizing expenditures, validating numeric inputs, and calculating cumulative totals using higher-order array methods like `reduce()`:

```javascript
class ExpenseTracker {
  constructor() {
    this.expenses = [];
  }

  addExpense(description, amount, category) {
    this.expenses.push({ id: Date.now(), description, amount: parseFloat(amount), category });
  }

  getTotalSpending() {
    return this.expenses.reduce((sum, item) => sum + item.amount, 0);
  }

  getBreakdownByCategory() {
    return this.expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
  }
}
```

## Project 8: Dynamic Shopping Cart with Map Data Structure

Using JavaScript's built-in `Map` data structure simplifies tracking unique product IDs and updating item quantities efficiently without nested array filtering:

```javascript
class ShoppingCart {
  constructor() {
    this.items = new Map(); // key: productId, value: { product, quantity }
  }

  addItem(product) {
    if (this.items.has(product.id)) {
      this.items.get(product.id).quantity++;
    } else {
      this.items.set(product.id, { product, quantity: 1 });
    }
  }

  removeItem(productId) {
    this.items.delete(productId);
  }

  getTotalPrice() {
    let total = 0;
    for (const { product, quantity } of this.items.values()) {
      total += product.price * quantity;
    }
    return total;
  }
}
```

## Project 9: Filterable and Searchable Image Gallery

Filtering media galleries requires dynamic array filtering based on category tags combined with lazy-loading attributes on `<img>` elements to conserve network bandwidth:

```javascript
class ImageGallery {
  constructor(images, containerEl) {
    this.images = images;
    this.containerEl = containerEl;
    this.render(this.images);
  }

  filterByCategory(category) {
    const filtered = category === "all" 
      ? this.images 
      : this.images.filter(img => img.category === category);
    this.render(filtered);
  }

  render(items) {
    this.containerEl.innerHTML = items.map(img => `
      <div class="gallery-card">
        <img src="${img.src}" alt="${img.title}" loading="lazy" />
        <p>${img.title} (${img.category})</p>
      </div>
    `).join("");
  }
}
```

## Summary

Building practical applications bridges theoretical knowledge and software engineering mastery. The nine projects in this lesson implement robust design patterns: state encapsulation within classes, event delegation for scalable UI bindings, immutability and persistence with local storage, asynchronous API retrieval with error boundaries, and dynamic DOM rendering.

## Best Practices

1. **Decouple State from UI**: Always manage application data in a dedicated state object or class model before rendering updates to the DOM.
2. **Use Event Delegation**: Attach listeners to parent containers instead of looping over every interactive card or row.
3. **Handle Edge Cases Early**: Validate inputs (empty strings, `NaN`, network error responses) with guard clauses.
4. **Keep Functions Modular**: Divide projects into small single-purpose methods (`render`, `save`, `compute`).
5. **Persist State Safely**: Handle `try...catch` around `localStorage` operations and provide initial fallback values.
