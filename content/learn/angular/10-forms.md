---
title: 'Angular Forms: Reactive & Template-Driven'
description: 'Master Angular Forms: Reactive Forms vs Template-Driven forms, FormControl, FormGroup, FormArray, built-in validation, custom validators, and state inspection.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 45
prerequisites: ['/learn/angular/08-services-and-dependency-injection']
---

# Angular Forms: Reactive & Template-Driven

Handling user input, validating data integrity, and submitting forms to backend APIs are essential responsibilities in web development. Angular provides two comprehensive form architectures:
1. **Reactive Forms**: Model-driven, immutable, synchronous, and highly scalable. Form controls and validation rules are declared explicitly in TypeScript classes.
2. **Template-Driven Forms**: Directives-driven, asynchronous, and declared directly in HTML templates via `[(ngModel)]`.

For enterprise applications, modern Angular heavily favors **Reactive Forms** due to their predictable data flow, strong TypeScript typing, robust unit-testing support, and superior handling of complex validation scenarios.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Reactive Forms Architecture                 │
│                                                             │
│   TypeScript Class (Form Model)       HTML Template (DOM)   │
│  ┌──────────────────────────────┐    ┌────────────────────┐ │
│  │ loginForm: FormGroup<{       │    │ <form              │ │
│  │   email: FormControl<string> │<──>│  [formGroup]=      │ │
│  │   password: FormControl<str> │    │   "loginForm">     │ │
│  │ }>                           │    │   <input           │ │
│  └──────────────────────────────┘    │    formControlName │ │
│                 │                    │     ="email" />    │ │
│                 ▼                    │ </form>            │ │
│      Synchronous Validation          └────────────────────┘ │
│      (Validators.required, email)                           │
└─────────────────────────────────────────────────────────────┘
```

## 1. Building Reactive Forms with `FormGroup` and `FormControl`

To use reactive forms, import `ReactiveFormsModule` in your standalone component. Reactive forms are assembled from three fundamental primitives:
- `FormControl`: Manages the value and validation status of an individual input field.
- `FormGroup`: Manages a group of `FormControl` instances as an object.
- `FormArray`: Manages an array of form controls or nested groups.

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="form-container">
      <h2>Account Login</h2>

      <div class="field">
        <label for="email">Email Address</label>
        <input id="email" type="email" formControlName="email" />
        @if (emailControl.invalid && (emailControl.dirty || emailControl.touched)) {
          <p class="error-msg">
            @if (emailControl.hasError('required')) { Email is required. }
            @if (emailControl.hasError('email')) { Invalid email format. }
          </p>
        }
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" formControlName="password" />
        @if (passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)) {
          <p class="error-msg">Password must be at least 8 characters.</p>
        }
      </div>

      <button type="submit" [disabled]="loginForm.invalid">Sign In</button>
    </form>
  `,
  styles: [`
    .form-container { max-width: 400px; padding: 2rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    .field { margin-bottom: 1.25rem; display: flex; flex-direction: column; }
    .error-msg { color: #dc2626; font-size: 0.85rem; margin-top: 0.25rem; }
  `]
})
export class LoginFormComponent {
  // Strongly typed FormGroup
  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
  });

  // Getters for clean template access
  get emailControl() { return this.loginForm.controls.email; }
  get passwordControl() { return this.loginForm.controls.password; }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Submitting login payload:', this.loginForm.getRawValue());
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
```

## 2. Form Control State Inspection

Angular tracks four fundamental boolean state pairs on every control and group:
- `valid` / `invalid`: Does the control pass all validation rules?
- `pristine` / `dirty`: Has the user modified the control value?
- `untouched` / `touched`: Has the control lost focus (blurred)?
- `pending` / `disabled`: Is an asynchronous validator running, or is the control disabled?

## 3. Creating Custom Synchronous Validators

A validator is a function that receives an `AbstractControl` and returns a validation errors object if invalid, or `null` if valid:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator: Forbid specific domains
export function forbidDomainValidator(forbiddenDomain: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;

    const isForbidden = value.toLowerCase().endsWith(`@${forbiddenDomain.toLowerCase()}`);
    return isForbidden ? { forbiddenDomain: { domain: forbiddenDomain } } : null;
  };
}
```

Usage in form control:

```typescript
const email = new FormControl('', [
  Validators.required,
  Validators.email,
  forbidDomainValidator('dispostable.com')
]);
```

## Summary & Key Takeaways

- Reactive Forms provide a synchronous, strongly typed, model-driven architecture for forms.
- `FormGroup`, `FormControl`, and `FormArray` build structured tree models in TypeScript.
- Use `nonNullable: true` to prevent form controls from resetting to `null`.
- Inspect `touched` and `dirty` states to display validation error messages only after user interaction.
- Custom validators return `ValidationErrors` when invalid and `null` when valid.

## Best Practices & Senior Guidance

1. **Always Use `nonNullable: true`**: When defining `FormControl` instances, configure `nonNullable: true` to guarantee type safety upon `.reset()`.
2. **Call `markAllAsTouched()` on Submit**: If a user clicks submit on an invalid form, trigger `form.markAllAsTouched()` so all validation errors become visible immediately.
3. **Keep Templates Declarative**: Avoid writing complex validation logic in HTML; encapsulate validation rules in TypeScript validator functions.
