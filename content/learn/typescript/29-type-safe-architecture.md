---
title: 'Type-Safe Architecture'
description: 'Master enterprise-grade type-safe software architecture in TypeScript: Domain-Driven Design (DDD), DTO layers, Repository pattern, Dependency Injection, and end-to-end type safety.'
order: 29
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/28-advanced-configuration
---

# Type-Safe Architecture

In enterprise software engineering, writing individual typed functions is only the beginning. Large systems require a coherent **Type-Safe Architecture** that separates concerns cleanly across Domain Models, Data Transfer Objects (DTOs), Repository layers, Business Service layers, and Dependency Injection (DI) containers.

In this lesson, we explore how to design resilient, decoupled, and strictly typed enterprise architectures using Domain-Driven Design (DDD) principles and Inversion of Control (IoC).

```text
┌────────────────────────────────────────────────────────────┐
│               Enterprise Type-Safe Layering                │
├────────────────────────────────────────────────────────────┤
│ 1. Presentation Layer (HTTP Controllers / UI Components)  │
│    Uses: DTOs & View Models                                │
│                       ▲                                    │
│                       │ (Injected via Interface)           │
│ 2. Service Layer (Business Domain Rules)                   │
│    Uses: Domain Entities & Value Objects                   │
│                       ▲                                    │
│                       │ (Injected via Interface)           │
│ 3. Infrastructure / Repository Layer (Database / Cache)    │
│    Implements: IRepository<TEntity>                       │
└────────────────────────────────────────────────────────────┘
```

## 1. Domain Entities vs DTOs (Data Transfer Objects)

A fundamental rule of clean architecture is keeping internal **Domain Entities** strictly separated from external **DTOs**:

- **Domain Entity**: Represents core business rules, private state invariants, and domain identity (e.g., a `User` class with methods like `.changePassword()` or `.deactivate()`).
- **DTO**: A plain data structure that models network serialization payloads over HTTP/gRPC without containing any business behavior.

```typescript
// 1. Domain Value Object & Entity
export class EmailAddress {
  private readonly value: string;

  constructor(rawEmail: string) {
    if (!rawEmail.includes("@") || !rawEmail.includes(".")) {
      throw new Error(`Invalid email address format: ${rawEmail}`);
    }
    this.value = rawEmail.toLowerCase().trim();
  }

  public toString(): string {
    return this.value;
  }
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public email: EmailAddress,
    private _passwordHash: string,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date()
  ) {}

  public deactivate(): void {
    this.isActive = false;
  }
}

// 2. Data Transfer Object (DTO) for external API consumers
export interface UserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly isActive: boolean;
  readonly memberSince: string; // ISO 8601 string
}

// 3. Type-safe Mapper Function
export function toUserResponseDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    email: user.email.toString(),
    isActive: user.isActive,
    memberSince: user.createdAt.toISOString(),
  };
}
```

Notice how `_passwordHash` is never exposed in the DTO layer, making accidental data leakage impossible.

## 2. The Repository Pattern

The **Repository Pattern** abstracts database persistence behind a clean, generic interface. The business service layer depends solely on the repository interface, never on direct SQL or ORM database connections:

```typescript
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: EmailAddress): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
  delete(id: string): Promise<boolean>;
}

// Concrete Database Implementation
export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly dbConnectionPool: any) {}

  public async findById(id: string): Promise<UserEntity | null> {
    const row = await this.dbConnectionPool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (!row) return null;
    return new UserEntity(row.id, new EmailAddress(row.email), row.password_hash, row.is_active);
  }

  public async findByEmail(email: EmailAddress): Promise<UserEntity | null> {
    // Database query...
    return null;
  }

  public async save(user: UserEntity): Promise<void> {
    // Insert / update database row...
  }

  public async delete(id: string): Promise<boolean> {
    // Delete database row...
    return true;
  }
}
```

## 3. Type-Safe Dependency Injection (IoC Container)

**Dependency Injection** inverts control so that classes receive their dependencies (e.g., repositories, mailers, loggers) from an external container rather than instantiating them directly. We can construct a lightweight, fully type-safe DI container:

```typescript
export interface ServiceMap {
  userRepository: IUserRepository;
  notificationService: { sendWelcomeEmail: (email: string) => Promise<void> };
}

export class DependencyContainer {
  private services = new Map<keyof ServiceMap, unknown>();

  public register<K extends keyof ServiceMap>(key: K, instance: ServiceMap[K]): void {
    this.services.set(key, instance);
  }

  public resolve<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    const service = this.services.get(key) as ServiceMap[K];
    if (!service) {
      throw new Error(`Service '${String(key)}' is not registered in container.`);
    }
    return service;
  }
}
```

## 4. The Business Service Layer

The service layer orchestrates business transactions using the injected dependencies:

```typescript
export class UserService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly notificationService: { sendWelcomeEmail: (email: string) => Promise<void> }
  ) {}

  public async registerNewUser(rawEmail: string, passwordHash: string): Promise<UserResponseDto> {
    const email = new EmailAddress(rawEmail);

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error(`User with email '${rawEmail}' is already registered.`);
    }

    const newUser = new UserEntity(
      `usr_${Date.now()}`,
      email,
      passwordHash
    );

    await this.userRepo.save(newUser);
    await this.notificationService.sendWelcomeEmail(email.toString());

    return toUserResponseDto(newUser);
  }
}
```

## 5. End-to-End Type Safety Across the Entire Stack

By sharing pure TypeScript types between frontend and backend in a monorepo, changing a backend endpoint signature immediately causes type errors in the frontend API client during development, completely eliminating breaking API regressions:

```typescript
// Shared Contract Package (packages/api-contracts)
export interface AppApiRouter {
  "/api/users": {
    POST: {
      body: { email: string; fullName: string };
      response: UserResponseDto;
    };
  };
  "/api/users/:id": {
    GET: {
      params: { id: string };
      response: UserResponseDto;
    };
  };
}
```

## Summary

- Domain entities encapsulate core business rules and private fields; DTOs format data for network serialization.
- Value objects (`EmailAddress`, `Currency`) validate their invariants at construction time.
- The Repository pattern decouples business logic from database storage technologies.
- Type-safe Dependency Injection containers provide testable, decoupled service layers.
- Shared contract routers provide end-to-end compile-time verification across frontend and backend.

## Best Practices

1. **Never Expose Domain Entities Directly in HTTP Responses**: Always map entities through explicit DTO mapper functions to prevent accidental exposure of sensitive fields.
2. **Depend on Interfaces, Not Concrete Classes**: Service constructors should receive interfaces (`IUserRepository`) rather than concrete database classes (`PostgresUserRepository`).
3. **Encapsulate Validation Inside Value Objects**: Model complex primitive strings as validated Value Objects (`Email`, `PhoneNumber`, `PostalCode`).
4. **Use Shared Contract Types in Monorepos**: Share API request/response types between frontend and backend to catch breaking changes at compile time.
