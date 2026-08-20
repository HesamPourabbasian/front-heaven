---
title: 'Testing Angular: Unit, Integration & E2E'
description: 'Master modern Angular testing: unit testing with Jasmine/Jest/Vitest, TestBed configuration, testing Signals and Standalone Components, service mocking with spies, and E2E testing with Playwright.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/angular/14-advanced-components']
---

# Testing Angular: Unit, Integration & E2E

Testing is an indispensable practice in enterprise software engineering. A rigorous testing strategy ensures that refactoring is safe, regressions are caught immediately, and critical user journeys function flawlessly across all browser environments.

Angular provides comprehensive testing tooling built around **`TestBed`**—the Angular testing module that configures isolated dependency injection containers and compiles component fixtures. Modern Angular testing strategies span three levels:
1. **Unit Testing**: Testing isolated TypeScript functions, validators, and service logic.
2. **Component Integration Testing**: Verifying template bindings, Signal reactivity, inputs/outputs, and DOM events via `ComponentFixture`.
3. **End-to-End (E2E) Testing**: Simulating real user journeys in actual browser instances using Playwright or Cypress.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The Angular Testing Pyramid                 │
│                                                             │
│                     / \                                     │
│                    / E2E \       Playwright / Cypress       │
│                   / Tests \      (Full User Journeys)       │
│                  /─────────\                                │
│                 / Component \    TestBed, Fixture, DOM      │
│                / Integration \   (Inputs, Outputs, Events)  │
│               /───────────────\                             │
│              /  Isolated Unit  \ Vitest / Jasmine Spies     │
│             /     Test Suite    \ (Services, Pure Functions)│
│            └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Unit Testing Injectable Services with Spies

Testing isolated services without rendering DOM elements is fast and reliable. Use `TestBed.configureTestingModule` and mock external dependencies:

```typescript
// src/app/features/products/product.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting() // Mock HTTP backend
      ]
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests remain
    httpTesting.verify();
  });

  it('should fetch products and update signal state', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Desk Mat', price: 25, inStock: true }
    ];

    service.fetchProducts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Desk Mat');
    });

    // Expect an outgoing GET request to /api/products
    const req = httpTesting.expectOne('/api/products');
    expect(req.request.method).toBe('GET');

    // Flush mock response payload
    req.flush(mockProducts);
  });
});
```

## 2. Component Integration Testing with `TestBed` & Signals

Testing modern standalone components involves setting inputs via `fixture.componentRef.setInput()`, triggering change detection, and querying DOM elements:

```typescript
// src/app/ui/counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { By } from '@angular/platform-browser';

describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>;
  let component: CounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent] // Standalone components are imported
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentRef.instance;
    fixture.detectChanges();
  });

  it('should render initial count of 0', () => {
    const heading = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(heading.textContent).toContain('Current Count: 0');
  });

  it('should increment count when +1 button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button.btn-increment')).nativeElement;
    button.click();
    fixture.detectChanges(); // Trigger change detection

    const heading = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(heading.textContent).toContain('Current Count: 1');
  });
});
```

## 3. End-to-End Testing with Playwright

Playwright tests the complete running application inside real Chromium, Firefox, and WebKit browsers:

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('E-Commerce Checkout Flow', () => {
  test('should allow user to add item to cart and checkout', async ({ page }) => {
    // 1. Visit products catalog
    await page.goto('/products');

    // 2. Add product to cart
    const addBtn = page.locator('button:has-text("Add to Cart")').first();
    await addBtn.click();

    // 3. Open cart drawer
    await page.locator('button[aria-label="View Cart"]').click();
    await expect(page.locator('.cart-drawer')).toBeVisible();

    // 4. Verify item is in cart
    await expect(page.locator('.cart-item-title')).toHaveText('Mechanical Keyboard');

    // 5. Proceed to checkout
    await page.locator('a:has-text("Proceed to Checkout")').click();
    await expect(page).toHaveURL(/.*checkout/);
  });
});
```

## Summary & Key Takeaways

- `TestBed` creates isolated testing modules for unit and component testing.
- `provideHttpClientTesting()` mocks HTTP requests safely using `HttpTestingController`.
- Use `fixture.componentRef.setInput()` to test Signal-based inputs.
- Playwright provides fast, resilient E2E testing across modern browser engines.

## Best Practices & Senior Guidance

1. **Test User Behavior, Not Implementation Details**: Query elements by accessible text or ARIA roles (`By.css('button:has-text("Submit")')`) rather than brittle internal CSS classes.
2. **Always Call `httpTesting.verify()`**: Place `httpTesting.verify()` in `afterEach()` to catch rogue or hanging network requests.
3. **Prefer Vitest for Speed**: Modern Angular projects benefit from Vitest for lightning-fast test execution via native ESM.
