---
title: "Form Handling in React"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 25
order: 11
description: "Controlled vs uncontrolled inputs, handling text, checkboxes, radios, selects, form validation, and resetting."
---

# Form Handling in React

Forms are the primary medium for gathering user input in web applications—from search bars and feedback forms to checkout flows and registration portals. In React, form inputs can be managed either through component state (**Controlled Components**) or directly via the DOM (**Uncontrolled Components**).

In this lesson, you will learn how to build controlled form inputs, manage multiple input fields with a single handler, validate inputs, display error messages, and handle form submissions cleanly.

## Controlled vs Uncontrolled Components

### Controlled Components (Recommended)
In a controlled component, the input's current value is driven directly by React state. React serves as the "single source of truth":
```jsx
function SimpleInput() {
  const [text, setText] = useState('');

  return (
    <input
      type="text"
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```
Every keystroke triggers `onChange`, updating React state, which then re-renders the input with the new value. This gives you instant validation, conditional formatting, and real-time UI feedback.

### Uncontrolled Components
In an uncontrolled component, the DOM retains internal state. You access the value only when needed using a `ref` (`useRef`). While useful for legacy integration or file inputs, controlled inputs are the industry standard for general forms.

## Handling Common Form Controls

### 1. Text Inputs and Textareas
```jsx
<input
  type="text"
  value={username}
  onChange={e => setUsername(e.target.value)}
/>

<textarea
  value={bio}
  onChange={e => setBio(e.target.value)}
/>
```

### 2. Checkboxes (`checked` attribute)
Checkboxes use the `checked` boolean attribute rather than `value`:
```jsx
<label>
  <input
    type="checkbox"
    checked={isSubscribed}
    onChange={e => setIsSubscribed(e.target.checked)}
  />
  Subscribe to newsletter
</label>
```

### 3. Select Dropdowns
```jsx
<select value={role} onChange={e => setRole(e.target.value)}>
  <option value="developer">Developer</option>
  <option value="designer">Designer</option>
  <option value="manager">Product Manager</option>
</select>
```

## Managing Multi-Field Forms with a Single State Object

When dealing with forms that contain 5, 10, or more inputs, creating individual `useState` hooks for every field leads to boilerplate. Instead, manage the form using a single state object and a shared `onChange` handler:

```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    role: 'developer',
    termsAccepted: false,
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Submitting registration payload:', formData);
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
      />
      <button type="submit">Create Account</button>
    </form>
  );
}
```

## Client-Side Validation and Error Display

Validating user input before sending it to a backend server improves user experience and prevents bad data submissions:

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email format.';
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    console.log('Logging in with:', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={errors.email ? 'input-error' : ''}
      />
      {errors.email && <span className="error-text">{errors.email}</span>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## Resetting Forms

To reset a controlled form back to its initial empty state, simply call your state updater with the original initial values:
```jsx
function handleReset() {
  setFormData(initialFormState);
}
```

## Best Practices

- **Always Connect `<label>` with `htmlFor`**: Ensure screen readers and mobile touch devices can focus inputs by tapping labels.
- **Use Controlled Components by Default**: Controlled components ensure your UI state and validation remain completely synchronized with React.
- **Leverage Form Libraries for Large Forms**: For enterprise forms with complex multi-step validation, use libraries like **React Hook Form** paired with **Zod**.

## Summary

Handling forms in React with controlled components creates a single source of truth for user input. By managing text, checkboxes, and dropdowns with unified state handlers and implementing client-side validation, you build robust, accessible input workflows.
