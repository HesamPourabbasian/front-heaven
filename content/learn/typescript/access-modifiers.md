---
title: 'Access Modifiers'
description: 'Master public, private, protected, and readonly access modifiers in TypeScript classes alongside JavaScript private fields.'
order: 20
difficulty: 'intermediate'
category: 'Level 6 - Classes & OOP'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/classes
---

## Access Modifiers Overview

TypeScript provides three visibility modifiers to control where class members can be accessed:

| Modifier | Accessible inside class | Accessible in subclasses | Accessible on instances from outside |
| :--- | :--- | :--- | :--- |
| **`public`** (default) | ✅ Yes | ✅ Yes | ✅ Yes |
| **`protected`** | ✅ Yes | ✅ Yes | ❌ No |
| **`private`** | ✅ Yes | ❌ No | ❌ No |

---

## 1. `public` (Default)

All members are `public` by default unless specified otherwise. Explicit `public` annotations are usually used in constructor parameter properties:

```ts
class Greeter {
  public message: string

  constructor(message: string) {
    this.message = message
  }

  public greet(): string {
    return this.message
  }
}
```

---

## 2. `private` vs JavaScript `#` Private Fields

### TypeScript `private` Keyword
The `private` modifier is checked at compile-time by TypeScript, but stripped during compilation:

```ts
class BankAccount {
  private balance: number = 0

  deposit(amount: number) {
    if (amount > 0) this.balance += amount
  }

  getBalance(): number {
    return this.balance
  }
}

const account = new BankAccount()
// Error: Property 'balance' is private and only accessible within class 'BankAccount'.
// account.balance
```

### JavaScript `#` Hard Private Fields
JavaScript native `#field` syntax enforces true runtime privacy in modern runtimes:

```ts
class SecureVault {
  #secretKey: string = 'SUPER_SECRET_TOKEN'

  revealKey(): string {
    return this.#secretKey
  }
}
```

*Difference:* TypeScript `private` allows access using `(account as any).balance` or in compiled ES5 JS. Native `#secretKey` is strictly private at the JavaScript runtime engine level.

---

## 3. `protected`

`protected` members are accessible within the declaring class and all derived subclasses, but **not** from external callers or instances:

```ts
class BaseDatabaseConnection {
  protected connectionString: string

  constructor(connStr: string) {
    this.connectionString = connStr
  }

  protected executeRawQuery(sql: string) {
    console.log(`Executing: ${sql} on ${this.connectionString}`)
  }
}

class PostgresConnection extends BaseDatabaseConnection {
  public findUser(id: number) {
    // Valid: Subclasses can access protected members of the base class
    this.executeRawQuery(`SELECT * FROM users WHERE id = ${id}`)
  }
}

const db = new PostgresConnection('postgres://localhost:5432')
db.findUser(42) // OK

// Error: Property 'executeRawQuery' is protected:
// db.executeRawQuery('DROP TABLE users')
```

---

## 4. `readonly` Properties

The `readonly` modifier prevents reassignment to a property after initialization (either at declaration or in the constructor):

```ts
class ServerConfig {
  readonly host: string
  readonly port: number

  constructor(host: string, port: number) {
    this.host = host
    this.port = port
  }

  updatePort(newPort: number) {
    // Error: Cannot assign to 'port' because it is a read-only property.
    // this.port = newPort
  }
}
```

---

## Summary

- `public`: Accessible everywhere (default).
- `protected`: Accessible only inside the class and its subclasses.
- `private`: Accessible only inside the declaring class.
- `#field`: Native ECMAScript private field with runtime boundary enforcement.
- `readonly`: Ensures property cannot be reassigned after construction.

## Practice

1. Create a class `Employee` with `public name: string`, `protected salary: number`, and `private ssn: string`.
2. Create a subclass `Manager` that can access `salary` via a method `getBonusEstimate()`.
3. Try accessing `ssn` and `salary` from an instance outside the class to verify the compiler flags the errors.
