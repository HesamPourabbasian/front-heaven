---
title: 'Beginner Projects: Building Real Semantic Web Pages'
description: 'Apply beginner HTML skills to real-world projects: Authoring complete semantic markup for a Developer Portfolio, Restaurant Menu, Blog Article, and User Registration portal.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/html/09-basic-metadata
---

# Beginner Projects: Building Real Semantic Web Pages

The fastest and most durable way to cement your understanding of foundational HTML is by assembling all individual concepts—semantic landmarks, heading hierarchies, typography, hyperlinks, media figures, tabular pricing, and accessible forms—into complete, production-grade web documents.

In this capstone lesson for **Level 1 (Beginner)**, we provide complete, fully realized semantic HTML blueprints for four iconic project templates: a **Developer Portfolio**, a **Tech Blog Article**, a **Restaurant Menu with Reservation Form**, and a **User Registration Portal**.

```text
┌────────────────────────────────────────────────────────────┐
│                 Level 1 Beginner Capstone Portfolio        │
├────────────────────────────────────────────────────────────┤
│ 1. Developer Portfolio       (Header, Nav, Bio, Projects)  │
│ 2. Editorial Blog Post       (Article, Figures, Time, Aside│
│ 3. Restaurant Menu           (Tabular Menu, Reservation)   │
│ 4. User Registration Portal  (Fieldset, Validation Inputs) │
└────────────────────────────────────────────────────────────┘
```

## Project Blueprint 1: Developer Portfolio (`portfolio.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alex Morgan — Front-End Software Engineer</title>
    <meta name="description" content="Portfolio of Alex Morgan, specializing in accessible Vue.js and TypeScript web applications." />
  </head>
  <body>
    <header>
      <nav aria-label="Main Navigation">
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <h1>Alex Morgan</h1>
      <p>Front-End Engineer building performant, accessible web systems.</p>
    </header>

    <main>
      <section id="about">
        <h2>About Me</h2>
        <p>I am a developer based in San Francisco with a passion for web performance, design systems, and semantic HTML architecture.</p>
      </section>

      <section id="projects">
        <h2>Featured Projects</h2>
        <article>
          <h3>Front-Heaven Learning Platform</h3>
          <p>An open-source curriculum platform for mastering modern web development.</p>
          <ul>
            <li>Built with Nuxt 4, Vue 3, and Tailwind CSS.</li>
            <li>100% Lighthouse accessibility score.</li>
          </ul>
          <a href="https://github.com/example/front-heaven" target="_blank" rel="noopener noreferrer">View Source Code</a>
        </article>
      </section>

      <section id="contact">
        <h2>Get In Touch</h2>
        <address>
          Email: <a href="mailto:alex@example.com">alex@example.com</a><br />
          GitHub: <a href="https://github.com/example" target="_blank" rel="noopener noreferrer">github.com/example</a>
        </address>
      </section>
    </main>

    <footer>
      <p>&copy; 2026 Alex Morgan. Built with semantic HTML5.</p>
    </footer>
  </body>
</html>
```

## Project Blueprint 2: Restaurant Menu & Reservation Page

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Artisan Bistro — Menu & Table Reservations</title>
  </head>
  <body>
    <header>
      <h1>Artisan Bistro & Café</h1>
      <p>Organic farm-to-table dining open daily from 8:00 AM to 10:00 PM.</p>
    </header>

    <main>
      <section id="menu">
        <h2>Seasonal Menu</h2>
        <table>
          <caption>Lunch & Dinner Entrées</caption>
          <thead>
            <tr>
              <th scope="col">Dish Name</th>
              <th scope="col">Dietary</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Wild Mushroom Risotto</th>
              <td>Vegetarian / Gluten-Free</td>
              <td>$24.00</td>
            </tr>
            <tr>
              <th scope="row">Pan-Seared Pacific Salmon</th>
              <td>Gluten-Free</td>
              <td>$28.50</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="reservation">
        <h2>Book a Table</h2>
        <form action="/api/reservations" method="POST">
          <fieldset>
            <legend>Party Details</legend>
            <label for="guest-name">Full Name</label>
            <input type="text" id="guest-name" name="name" required />

            <label for="guest-email">Email Address</label>
            <input type="email" id="guest-email" name="email" required />

            <label for="party-size">Party Size</label>
            <input type="number" id="party-size" name="size" min="1" max="12" value="2" required />

            <label for="res-date">Reservation Date</label>
            <input type="date" id="res-date" name="date" required />

            <button type="submit">Confirm Reservation</button>
          </fieldset>
        </form>
      </section>
    </main>
  </body>
</html>
```

## Summary

- Project templates integrate headings, navigation, content articles, data tables, and input forms.
- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) structure real-world user flows.
- Accessible forms require explicit labels, fieldset groupings, and appropriate input constraints.
- Clean document outlines make projects immediately accessible to all users.

## Best Practices

1. **Test Projects Without CSS First**: Ensure your raw HTML is readable, logical, and fully interactive before applying styles.
2. **Verify All Form Labels Work on Click**: Click labels in the browser to ensure the matching input is focused.
3. **Use Accurate Semantic Elements for Sectioning**: Group content with `<article>` and `<section>` with explicit headings.
4. **Always Include Valid Contact Links**: Use `mailto:` and `tel:` protocols in `<address>` blocks.
