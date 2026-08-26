---
title: 'Framework Integration: React, Vue & Angular'
description: 'Master integrating Bootstrap 5 into modern JavaScript frameworks: React (react-bootstrap, controlled modals), Vue 3 (bootstrap-vue-next, reactive directives), and Angular 18/19 (ng-bootstrap, component architecture).'
order: 26
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/bootstrap/24-javascript-api
---

# Framework Integration: React, Vue & Angular

In modern frontend architecture, Bootstrap 5 frequently powers the presentation and design token layer of component-driven SPA frameworks like **React**, **Vue**, and **Angular**. Rather than manipulating the real DOM directly with vanilla Bootstrap scripts, dedicated framework wrapper libraries bridge Bootstrap's styles with virtual DOM lifecycles and reactive state management.

In this lesson, you will master integrating Bootstrap across React, Vue 3, and Angular.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Framework Integration Architecture                       │
├───────────────────┬───────────────────────────┬─────────────────────────────┤
│ React             │ Vue 3                     │ Angular                     │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ react-bootstrap   │ bootstrap-vue-next        │ @ng-bootstrap/ng-bootstrap  │
│ Pure React state  │ Reactive ref / v-model    │ RxJS Signals & Services     │
│ Zero jQuery       │ Zero DOM collisions       │ TypeScript strict typing    │
└───────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 1. Bootstrap with React (`react-bootstrap`)

`react-bootstrap` replaces Bootstrap's imperative JavaScript with declarative React components:

```bash
npm install react-bootstrap bootstrap
```

### Controlled Modal & State Management in React:
```jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

export function ProjectModal() {
  const [show, setShow] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating project:', projectName);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Project
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="projNameInput">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Apollo Mission"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Project
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
```

---

## 2. Bootstrap with Vue 3 (`bootstrap-vue-next`)

In Vue 3, `bootstrap-vue-next` provides idiomatic Composition API components:

```bash
npm install bootstrap-vue-next bootstrap
```

### Reactive Component in Vue 3:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BModal, BButton, BAlert, BFormInput } from 'bootstrap-vue-next'

const isModalOpen = ref(false)
const emailInput = ref('')
const showAlert = ref(false)

function handleConfirm() {
  showAlert.value = true
  isModalOpen.value = false
}
</script>

<template>
  <div class="container py-4">
    <BAlert v-model="showAlert" variant="success" dismissible>
      Registration submitted for {{ emailInput }}!
    </BAlert>

    <BButton variant="primary" @click="isModalOpen = true">
      Open Subscriber Modal
    </BButton>

    <BModal v-model="isModalOpen" title="Subscribe to Updates" @ok="handleConfirm">
      <div class="mb-3">
        <label class="form-label">Email address</label>
        <BFormInput v-model="emailInput" type="email" placeholder="name@example.com" />
      </div>
    </BModal>
  </div>
</template>
```

---

## 3. Bootstrap with Angular (`@ng-bootstrap/ng-bootstrap`)

In Angular, `@ng-bootstrap/ng-bootstrap` provides modular Angular directives and services:

```bash
ng add @ng-bootstrap/ng-bootstrap
```

### Modal Service in Angular Component:
```typescript
import { Component, inject, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-modal',
  template: `
    <button class="btn btn-outline-primary" (click)="openModal(content)">Launch Dialog</button>

    <ng-template #content let-modal>
      <div class="modal-header">
        <h4 class="modal-title">Angular Bootstrap Dialog</h4>
        <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss()"></button>
      </div>
      <div class="modal-body">
        <p>Managed natively via Angular Dependency Injection.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="modal.close('Save click')">Close</button>
      </div>
    </ng-template>
  `
})
export class AdminModalComponent {
  private modalService = inject(NgbModal);

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
}
```

---

## Summary & Key Takeaways

- In React, use `react-bootstrap` for declarative components synchronized with React state.
- In Vue 3, use `bootstrap-vue-next` for Composition API `v-model` bindings.
- In Angular, use `@ng-bootstrap/ng-bootstrap` for dependency-injected modal services.
- Never mix raw `bootstrap.bundle.min.js` DOM manipulation with virtual DOM framework state.

## Best Practices & Senior Guidance

1. **Avoid Double Importing CSS**: When using framework wrapper libraries, import Bootstrap CSS or SCSS only once at the application root (`main.js` / `styles.scss`).
2. **Maintain Single Source of Truth for State**: Allow the framework's reactive state (React `useState`, Vue `ref`) to dictate open/closed visibility rather than querying the DOM.
