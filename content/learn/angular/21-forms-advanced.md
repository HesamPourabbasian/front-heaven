---
title: 'Advanced Forms & ControlValueAccessor'
description: 'Master advanced Angular Reactive Forms: strongly typed FormGroups, dynamic FormArrays, nested form architectures, async validators, cross-field validation, and custom inputs with ControlValueAccessor.'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/angular/10-forms']
---

# Advanced Forms & ControlValueAccessor

In enterprise applications, forms frequently evolve beyond simple username/password inputs. You must manage multi-tiered nested form structures, dynamically growing lists of form fields (`FormArray`), asynchronous uniqueness validation against backend databases, cross-field validation rules (e.g. password confirmation matches), and custom reusable input widgets (rich text editors, star rating pickers, custom date range selectors).

Angular's **`ControlValueAccessor` (CVA)** interface provides the bridge between native Angular forms and custom UI components, enabling custom components to participate seamlessly in `formControlName`, `formControl`, and `ngModel` bindings.

```text
┌─────────────────────────────────────────────────────────────┐
│                 ControlValueAccessor Bridge Interface       │
│                                                             │
│  Angular Reactive Form (FormGroup / FormControl)            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ratingControl = new FormControl<number>(4);           │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│              writeValue(val)│ registerOnChange(fn)          │
│                             ▼                               │
│  Custom Component (<app-star-rating [formControl]="rating">)│
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Implements ControlValueAccessor:                      │  │
│  │ - writeValue(value: number): void                     │  │
│  │ - registerOnChange(fn: any): void                     │  │
│  │ - registerOnTouched(fn: any): void                    │  │
│  │ - setDisabledState(isDisabled: boolean): void         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Building Custom Components with `ControlValueAccessor`

To make a custom component compatible with Angular form directives, implement the 4 methods of `ControlValueAccessor` and register the component in the `NG_VALUE_ACCESSOR` multi-provider token:

```typescript
// src/app/ui/star-rating.component.ts
import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingComponent),
      multi: true
    }
  ],
  template: `
    <div class="star-rating" [class.disabled]="disabled()">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <button
          type="button"
          class="star-btn"
          [class.filled]="star <= value()"
          [disabled]="disabled()"
          (click)="selectRating(star)">
          ★
        </button>
      }
    </div>
  `,
  styles: [`
    .star-btn { font-size: 1.5rem; background: none; border: none; cursor: pointer; color: #cbd5e1; }
    .star-btn.filled { color: #f59e0b; }
    .disabled { opacity: 0.5; pointer-events: none; }
  `]
})
export class StarRatingComponent implements ControlValueAccessor {
  readonly value = signal<number>(0);
  readonly disabled = signal<boolean>(false);

  private onChange: (val: number) => void = () => {};
  private onTouched: () => void = () => {};

  // 1. Angular writes a new value to the component
  writeValue(val: number): void {
    this.value.set(val ?? 0);
  }

  // 2. Register callback to notify Angular when the value changes
  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  // 3. Register callback to notify Angular when the control is touched (blurred)
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // 4. Angular enables or disables the control
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectRating(rating: number): void {
    if (!this.disabled()) {
      this.value.set(rating);
      this.onChange(rating);
      this.onTouched();
    }
  }
}
```

## 2. Dynamic Form Fields with `FormArray`

When users can dynamically add or remove form items (e.g. multiple phone numbers or invoice line items), use `FormArray`:

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="invoiceForm">
      <h3>Invoice Line Items</h3>

      <div formArrayName="items">
        @for (item of itemsArray.controls; track $index; let idx = $index) {
          <div [formGroupName]="idx" class="item-row">
            <input formControlName="description" placeholder="Description" />
            <input formControlName="amount" type="number" placeholder="Amount" />
            <button type="button" (click)="removeItem(idx)">Remove</button>
          </div>
        }
      </div>

      <button type="button" (click)="addItem()">+ Add Item</button>
    </form>
  `
})
export class InvoiceFormComponent {
  readonly invoiceForm = new FormGroup({
    clientName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    items: new FormArray<FormGroup<{
      description: FormControl<string>;
      amount: FormControl<number>;
    }>>([])
  });

  get itemsArray() {
    return this.invoiceForm.controls.items;
  }

  addItem(): void {
    const itemGroup = new FormGroup({
      description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl(0, { nonNullable: true, validators: [Validators.min(1)] })
    });
    this.itemsArray.push(itemGroup);
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }
}
```

## 3. Cross-Field Validation (Password Confirmation)

Cross-field validators validate multiple fields together and are attached to the `FormGroup`:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
};
```

## Summary & Key Takeaways

- `ControlValueAccessor` enables any custom component to behave as a first-class Angular form control.
- `FormArray` manages dynamically growing collections of form controls or nested groups.
- Cross-field validators attach to parent `FormGroup` instances to compare sibling field values.
- Typed Reactive Forms enforce strict types on `.value` and `.getRawValue()`.

## Best Practices & Senior Guidance

1. **Always Implement All 4 CVA Methods**: Even if `setDisabledState` seems optional, implementing it guarantees accessibility and proper `[disabled]` support.
2. **Use `getRawValue()` on Form Submission**: Calling `form.value` excludes disabled controls, whereas `form.getRawValue()` includes all controls in the typed model.
3. **Clean Up FormArray Subscriptions**: When listening to `FormArray.valueChanges`, use `takeUntilDestroyed()` to prevent runaway memory leaks.
