---
title: "Authentication & Protected Routes"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 22
description: "Handling user authentication, JWTs, HTTP cookies, session state, protected routes, and role-based access control (RBAC)."
---

# Authentication & Protected Routes

Authentication and authorization are mission-critical requirements for almost every production web application. In a React Single Page Application (SPA), managing authentication requires coordinating client-side state, secure storage mechanisms (such as `HttpOnly` cookies or tokens), navigation guards, and role-based access control (RBAC).

In this lesson, you will learn how to design a complete authentication system in React, create an `AuthProvider` context, guard private routes, and manage token lifecycles securely.

## Authentication Architecture Overview

A secure React authentication flow consists of the following lifecycle:

```text
User Fills Credentials (Login Form)
                 │
                 ▼
API Authenticates & Issues Token / HttpOnly Cookie
                 │
                 ▼
React AuthContext Stores User Session State
                 │
                 ▼
Protected Route Guard Verifies Active Session
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[ Authenticated ]     [ Unauthenticated ]
 Render Protected      Redirect to /login
 Route Component       with return URL
```

## 1. Creating the `AuthContext`

Centralize authentication state and operations inside a dedicated context and custom hook:

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app startup:
    async function restoreSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to restore session', err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const userData = await res.json();
    setUser(userData);
    return userData;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
```

## 2. Guarding Private Routes

Using React Router, wrap private routes in an authentication check:

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export function RequireAuth({ allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="spinner">Verifying authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-Based Access Control (RBAC):
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
```

## 3. Token Storage Security Considerations

- **HttpOnly, Secure Cookies (Recommended)**: Stores authentication tokens in browser cookies flagged with `HttpOnly`, `Secure`, and `SameSite=Lax`. JavaScript running in the browser cannot read these cookies, providing robust protection against Cross-Site Scripting (XSS) token theft.
- **In-Memory + Refresh Tokens**: Keep short-lived access tokens strictly in React state memory, using silent background refresh token rotations against the auth server.
- **Avoid LocalStorage for Sensitive Tokens**: Storing sensitive JWTs in `localStorage` exposes them to malicious third-party scripts or XSS vulnerabilities.

## Best Practices

- **Show Loading State During Initial Session Check**: Never flash the login screen momentarily while restoring an existing session on page load.
- **Save Return URL on Redirect**: Pass `state: { from: location }` so users return to their intended destination after logging in.
- **Implement Centralized 401 Interceptors**: Use Axios/fetch interceptors to automatically catch HTTP 401 Unauthorized responses and trigger logout across the app.

## Summary

Authentication in React combines centralized session state via context, navigation guards via protected routes, and secure token lifecycle management. Implementing HttpOnly cookies and role-based route protection creates a resilient, enterprise-grade authentication system.
