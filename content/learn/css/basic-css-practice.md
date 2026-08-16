---
title: 'Beginner CSS Practice Projects'
description: 'Consolidate Level 1 CSS skills by building a profile card, navigation bar, landing page hero, login form, and pricing card.'
order: 12
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 30
prerequisites:
  - /learn/css/basic-responsive-design
---

## Putting Level 1 into Practice

Congratulations on completing **Level 1 — Beginner CSS**! The fastest way to lock in this knowledge is by building real interface components.

---

## Project 1: User Profile Card

Build a modern user profile badge with:
- Circular avatar image.
- Name, job title, and social links.
- Subtle drop shadow and border radius.

```html
<div class="profile-card">
  <img src="avatar.jpg" alt="Jane Doe" class="profile-avatar" />
  <h3 class="profile-name">Jane Doe</h3>
  <p class="profile-role">Frontend Engineer</p>
  <button type="button" class="profile-btn">Follow</button>
</div>
```

```css
.profile-card {
  max-width: 320px;
  padding: 2rem;
  border-radius: 1rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.profile-role {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.profile-btn {
  margin-top: 1.25rem;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background-color: #0ea5e9;
  color: #ffffff;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.profile-btn:hover {
  background-color: #0284c7;
}
```

---

## Project 2: Pricing Tier Card

Build a featured subscription card with:
- Plan tier name & price.
- Bulleted list of features.
- Primary call to action button.

---

## Summary & Key Takeaways

- Break designs into modular reusable classes.
- Combine the box model, typography, colors, and shadows to create polished interfaces.
- Test responsiveness across mobile and desktop.

---

## Practice Challenge

Build all five starter components (Profile Card, Navbar, Hero, Login Form, Pricing Card) in a single HTML showcase page.
