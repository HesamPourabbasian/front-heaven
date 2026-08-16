---
title: Objects
description: Work with object records, prototypes, prototypal inheritance and classes.
order: 11
difficulty: intermediate
category: Level 4 - Objects, Prototypes and this
estimatedMinutes: 35
prerequisites:
  - learn/javascript/functions-and-parameters
---

## Objects and prototypes

Objects store properties and methods. Access properties with dot or bracket notation; use bracket notation for dynamic keys. Every ordinary object has a prototype, an object JavaScript consults when a property is missing.

```js
const user = { name: 'Ada', greet() { return `Hi, ${this.name}` } }
console.log(user.greet())
```

Prototypal inheritance links objects through `Object.create()` or constructor prototypes. Classes are syntax over this prototype model:

```js
class User { constructor(name) { this.name = name } }
```

Prefer composition and small objects over deep inheritance trees.

## Summary

Objects are records plus behavior, and classes do not replace prototypes; they provide a clearer syntax for constructing prototype-linked objects.

## Practice

Create a prototype with `Object.create`, then implement the same behavior with a class. Inspect both with `Object.getPrototypeOf`.
