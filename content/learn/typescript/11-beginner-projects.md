---
title: 'Beginner Projects'
description: 'Build 6 complete, production-ready TypeScript beginner applications: Todo App, Calculator, Expense Tracker, Quiz App, Weather App, and Product Management.'
order: 11
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/10-typescript-configuration
---

# Beginner Projects

The most effective way to internalize TypeScript fundamentals—basic types, interfaces, discriminated unions, narrowing, and classes—is to apply them to real-world projects. In this lesson, we build six complete, practical applications with end-to-end type safety.

Each project demonstrates how TypeScript prevents runtime bugs, enforces data integrity, and simplifies state management.

```text
┌────────────────────────────────────────────────────────────┐
│                  Beginner Projects Suite                   │
├──────────────────────────────┬─────────────────────────────┤
│ 1. Todo App                  │ 4. Quiz Application         │
│ (State, CRUD, Filter Unions) │ (Score Engine, State Types) │
├──────────────────────────────┼─────────────────────────────┤
│ 2. Type-Safe Calculator      │ 5. Weather App              │
│ (Discriminated Operations)   │ (API Schemas & Narrowing)   │
├──────────────────────────────┼─────────────────────────────┤
│ 3. Expense Tracker           │ 6. Product Management       │
│ (Categories, Aggregations)   │ (Repository OOP Class)      │
└──────────────────────────────┴─────────────────────────────┘
```

## Project 1: Type-Safe Todo App

A complete Todo management engine that enforces strictly typed statuses (`all`, `active`, `completed`), immutable IDs, and type-safe filter operations:

```typescript
export interface TodoItem {
  readonly id: string;
  title: string;
  isCompleted: boolean;
  readonly createdAt: Date;
}

export type TodoFilter = "all" | "active" | "completed";

export class TodoManager {
  private todos: TodoItem[] = [];

  public addTodo(title: string): TodoItem {
    const newTodo: TodoItem = {
      id: `todo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      isCompleted: false,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  public toggleTodo(id: string): boolean {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return false;
    todo.isCompleted = !todo.isCompleted;
    return true;
  }

  public removeTodo(id: string): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    return this.todos.length < initialLength;
  }

  public getTodos(filter: TodoFilter = "all"): readonly TodoItem[] {
    switch (filter) {
      case "active":
        return this.todos.filter(t => !t.isCompleted);
      case "completed":
        return this.todos.filter(t => t.isCompleted);
      case "all":
      default:
        return this.todos;
    }
  }
}
```

## Project 2: Arithmetic Calculator with Discriminated Unions

Using discriminated unions to represent calculation operations guarantees that each operator is paired with the exact necessary operands:

```typescript
export type CalculatorOperation =
  | { type: "add"; a: number; b: number }
  | { type: "subtract"; a: number; b: number }
  | { type: "multiply"; a: number; b: number }
  | { type: "divide"; a: number; b: number }
  | { type: "power"; base: number; exponent: number }
  | { type: "squareRoot"; value: number };

export interface CalculationResult {
  readonly operation: CalculatorOperation["type"];
  readonly result: number;
  readonly timestamp: Date;
}

export function executeCalculation(op: CalculatorOperation): CalculationResult {
  let computedValue: number;

  switch (op.type) {
    case "add":
      computedValue = op.a + op.b;
      break;
    case "subtract":
      computedValue = op.a - op.b;
      break;
    case "multiply":
      computedValue = op.a * op.b;
      break;
    case "divide":
      if (op.b === 0) {
        throw new Error("Division by zero is mathematically undefined.");
      }
      computedValue = op.a / op.b;
      break;
    case "power":
      computedValue = Math.pow(op.base, op.exponent);
      break;
    case "squareRoot":
      if (op.value < 0) {
        throw new Error("Cannot calculate square root of a negative number.");
      }
      computedValue = Math.sqrt(op.value);
      break;
    default: {
      const exhaustiveCheck: never = op;
      throw new Error(`Unhandled operation: ${exhaustiveCheck}`);
    }
  }

  return {
    operation: op.type,
    result: computedValue,
    timestamp: new Date(),
  };
}
```

## Project 3: Personal Expense Tracker

A budget tracker featuring typed categories, expense entries, and statistical aggregations:

```typescript
export type ExpenseCategory = "food" | "transport" | "utilities" | "entertainment" | "healthcare";

export interface Expense {
  readonly id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
}

export interface ExpenseSummary {
  totalAmount: number;
  byCategory: Record<ExpenseCategory, number>;
  transactionCount: number;
}

export class ExpenseTracker {
  private expenses: Expense[] = [];

  public addExpense(description: string, amount: number, category: ExpenseCategory): Expense {
    if (amount <= 0) {
      throw new Error("Expense amount must be greater than zero.");
    }

    const expense: Expense = {
      id: `exp_${Date.now()}`,
      description,
      amount,
      category,
      date: new Date(),
    };

    this.expenses.push(expense);
    return expense;
  }

  public getSummary(): ExpenseSummary {
    const initialCategories: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      healthcare: 0,
    };

    const total = this.expenses.reduce((sum, item) => sum + item.amount, 0);

    const breakdown = this.expenses.reduce((acc, item) => {
      acc[item.category] += item.amount;
      return acc;
    }, { ...initialCategories });

    return {
      totalAmount: Math.round(total * 100) / 100,
      byCategory: breakdown,
      transactionCount: this.expenses.length,
    };
  }
}
```

## Project 4: Interactive Quiz Engine

An interactive quiz runner with question types, option validation, and score calculation:

```typescript
export interface QuizQuestion {
  readonly id: number;
  question: string;
  options: readonly [string, string, string, string]; // Exactly 4 options
  correctAnswerIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface QuizSubmission {
  questionId: number;
  selectedIndex: 0 | 1 | 2 | 3;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
}

export class QuizEngine {
  constructor(private readonly questions: readonly QuizQuestion[]) {}

  public evaluateQuiz(submissions: QuizSubmission[]): QuizResult {
    let correctCount = 0;

    for (const question of this.questions) {
      const submission = submissions.find(s => s.questionId === question.id);
      if (submission && submission.selectedIndex === question.correctAnswerIndex) {
        correctCount++;
      }
    }

    const percentage = Math.round((correctCount / this.questions.length) * 100);

    return {
      totalQuestions: this.questions.length,
      correctAnswers: correctCount,
      percentage,
      passed: percentage >= 70,
    };
  }
}
```

## Project 5: Weather Dashboard API Client

Modeling weather API responses, error handling, and unit conversions:

```typescript
export interface WeatherCondition {
  main: "Clear" | "Clouds" | "Rain" | "Snow" | "Thunderstorm";
  description: string;
}

export interface WeatherData {
  city: string;
  temperatureCelsius: number;
  humidityPercentage: number;
  condition: WeatherCondition;
  windSpeedKph: number;
}

export type WeatherResult =
  | { success: true; data: WeatherData }
  | { success: false; errorCode: "CITY_NOT_FOUND" | "NETWORK_ERROR"; message: string };

export function formatWeatherDisplay(result: WeatherResult): string {
  if (!result.success) {
    return `[Weather Error]: ${result.message} (${result.errorCode})`;
  }

  const { city, temperatureCelsius, condition, humidityPercentage } = result.data;
  return `${city}: ${temperatureCelsius}°C, ${condition.main} (${condition.description}) - Humidity: ${humidityPercentage}%`;
}
```

## Project 6: Product Catalog & Inventory Manager

An enterprise-ready inventory class with generic search capabilities, stock validation, and price filtering:

```typescript
export interface Product {
  readonly id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: "electronics" | "books" | "apparel";
  isDiscontinued: boolean;
}

export class ProductCatalog {
  private products: Map<string, Product> = new Map();

  public registerProduct(product: Product): void {
    if (this.products.has(product.id)) {
      throw new Error(`Product with ID ${product.id} is already registered.`);
    }
    this.products.set(product.id, product);
  }

  public updateStock(id: string, delta: number): Product {
    const product = this.products.get(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    const newStock = product.stockQuantity + delta;
    if (newStock < 0) {
      throw new Error(`Insufficient stock for product ${product.name}.`);
    }

    product.stockQuantity = newStock;
    return product;
  }

  public findByCategory(category: Product["category"]): Product[] {
    return Array.from(this.products.values()).filter(
      p => p.category === category && !p.isDiscontinued
    );
  }
}
```

## Summary

- The Todo App demonstrates state modeling, immutable IDs, and union filtering.
- The Calculator demonstrates the power of Discriminated Unions and exhaustive checking with `never`.
- The Expense Tracker highlights structured aggregation and typed dictionaries (`Record<K, V>`).
- The Quiz App demonstrates fixed-length tuples (`readonly [string, string, string, string]`) and index literal bounds (`0 | 1 | 2 | 3`).
- The Weather Client shows type-safe API success and error modeling.
- The Product Catalog demonstrates Object-Oriented repository patterns and Map-based state management.

## Best Practices

1. **Model State with Discriminated Unions**: Eliminate impossible UI and API states by tagging models with a common discriminant (`type`, `status`, `success`).
2. **Use `readonly` on IDs and Dates**: Safeguard generated timestamps and database IDs from accidental mutations.
3. **Encapsulate Data Inside Classes**: Maintain clean separation between internal state arrays and public getter methods.
4. **Enforce Exhaustive Handlers**: Always add `default: const _exhaustive: never = op` inside state evaluation switches to guarantee all cases are handled.
