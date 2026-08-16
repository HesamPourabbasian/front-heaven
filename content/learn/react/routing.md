---
title: "Client-Side Routing with React Router"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 20
description: "Setting up React Router v6/v7: Routes, dynamic parameters, nested layouts, programmatic navigation, and protected routes."
---

# Client-Side Routing with React Router

In a Single Page Application (SPA), navigating between different views must update the browser URL and history without triggering a full page reload from the server. **React Router** is the standard routing library for React web applications.

In this lesson, you will learn how to configure declarative routes, handle dynamic route parameters, create shared nested layouts with `<Outlet />`, navigate programmatically, and build protected authenticated routes.

## Configuring Routes with `createBrowserRouter`

Modern React Router v6 and v7 recommend using the data API with `createBrowserRouter` and `RouterProvider`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function RootLayout() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </nav>
      <main className="content">
        {/* Child routes render here: */}
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

## Reading Dynamic Route Parameters with `useParams`

When defining routes with dynamic segments (like `/products/:id`), extract the parameter in the target component using the `useParams` hook:

```jsx
import { useParams, Link } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>Product Details for ID: {id}</h2>
      <Link to="/products">← Back to All Products</Link>
    </div>
  );
}
```

## Programmatic Navigation with `useNavigate`

When you need to navigate the user programmatically after an asynchronous action (such as submitting a form or logging out), use `useNavigate`:

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    await authenticateUser();
    // Redirect to user dashboard:
    navigate('/dashboard', { replace: true });
  }

  return <form onSubmit={handleLogin}>...</form>;
}
```

## Building Protected Routes (Authentication Guard)

To safeguard private pages from unauthorized access, create a reusable wrapper component that checks authentication status:

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, saving current location for post-login redirect:
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// In your router definitions:
{
  element: <ProtectedRoute isAuthenticated={isUserLoggedIn} />,
  children: [
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/settings', element: <SettingsPage /> },
  ],
}
```

## Best Practices

- **Use `<Link>` and `<NavLink>` instead of `<a>`**: Native anchor tags trigger full page reloads and reset application memory state.
- **Use Nested Layouts**: Group shared navigation bars and sidebars in layout routes using `<Outlet />`.
- **Provide a 404 Fallback**: Always configure an `errorElement` or catch-all wildcard path (`path: '*'`) to gracefully handle invalid URLs.

## Summary

React Router provides seamless client-side routing, nested layouts, dynamic parameter handling, and protected route architecture. By utilizing modern data APIs and declarative navigation components, you create fast, multi-view SPAs.
