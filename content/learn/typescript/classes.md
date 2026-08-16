---
title: 'Classes'
description: 'Learn object-oriented programming in TypeScript, class field annotations, constructors, parameter properties shorthand, and class contracts with implements.'
order: 19
difficulty: 'intermediate'
category: 'Level 6 - Classes & OOP'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/generics
---

## Classes in TypeScript

TypeScript fully supports ECMAScript classes while adding static type annotations, access control, parameter properties, and interface conformance contracts.

```ts
class User {
  id: number
  name: string
  email: string

  constructor(id: number, name: string, email: string) {
    this.id = id
    this.name = name
    this.email = email
  }

  getDisplayName(): string {
    return `${this.name} (${this.email})`
  }
}

const user = new User(1, 'Ada Lovelace', 'ada@example.com')
console.log(user.getDisplayName())
```

---

## Parameter Properties Shorthand

In standard JavaScript/TypeScript, initializing constructor fields requires declaring the field and assigning `this.field = field`.

TypeScript provides a **Parameter Properties** shorthand: prefixing a constructor parameter with an access modifier (`public`, `private`, `protected`, or `readonly`) automatically declares and initializes the property on the class:

```ts
// Parameter properties shorthand:
class Product {
  constructor(
    public readonly id: string,
    public title: string,
    public price: number,
    private inventoryCount: number = 0,
  ) {
    // No explicit 'this.id = id' assignments needed!
  }

  getInStock(): boolean {
    return this.inventoryCount > 0
  }
}

const item = new Product('prod_99', 'Mechanical Keyboard', 120, 15)
console.log(item.title) // 'Mechanical Keyboard'
```

---

## Implementing Interfaces (`implements`)

Classes can implement one or more interfaces to enforce that an instance complies with a given contract:

```ts
interface Authenticatable {
  token: string
  login(username: string, password: string): Promise<boolean>
  logout(): void
}

interface Loggable {
  logActivity(action: string): void
}

class AuthService implements Authenticatable, Loggable {
  token: string = ''

  async login(username: string, password: string): Promise<boolean> {
    // authentication logic
    this.token = 'auth_token_xyz'
    this.logActivity(`User ${username} logged in`)
    return true
  }

  logout(): void {
    this.token = ''
    this.logActivity('User logged out')
  }

  logActivity(action: string): void {
    console.log(`[AUTH LOG]: ${action}`)
  }
}
```

---

## Getters and Setters

TypeScript supports accessors with type safety. If a getter has a type, the setter's parameter is automatically inferred:

```ts
class Temperature {
  private _celsius: number = 0

  get celsius(): number {
    return this._celsius
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new RangeError('Temperature below absolute zero is impossible.')
    }
    this._celsius = value
  }

  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32
  }

  set fahrenheit(value: number) {
    this.celsius = ((value - 32) * 5) / 9
  }
}
```

---

## Summary

- TypeScript classes support static type annotations on fields, methods, and accessors.
- Parameter properties shorthand (`constructor(public name: string)`) eliminates boilerplate initialization.
- Use `implements` to guarantee that a class conforms to one or more interface contracts.
- Getters and setters provide controlled property access with strict type checking.

## Practice

1. Define an interface `Playable` with `play(): void` and `pause(): void`.
2. Create an `AudioTrack` class using parameter properties shorthand for `public title: string` and `public durationSeconds: number`.
3. Have `AudioTrack` implement `Playable` and test instantiating it.
