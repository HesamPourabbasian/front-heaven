---
title: 'API & Backend Integration'
description: 'Master backend and full-stack TypeScript: typed REST APIs, request/response DTOs, Fetch & Axios clients, Express, Node.js HTTP, and Fastify type providers.'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/20-typescript-with-frontend
---

# API & Backend Integration

In modern full-stack development, the boundary between client and server is the most common source of runtime bugs. Discrepancies between what the backend sends and what the frontend expects—such as renamed JSON keys, missing fields, or mismatched data types—cause silent UI failures and production outages.

TypeScript provides end-to-end type safety across the network boundary. By sharing **Data Transfer Objects (DTOs)**, parameterizing HTTP clients like `fetch` and `axios`, and strictly typing backend frameworks like **Express** and **Fastify**, you can construct robust, reliable distributed systems.

```text
┌────────────────────────────────────────────────────────────┐
│                  End-to-End API Type Flow                  │
│                                                            │
│       Shared DTO Interfaces (types/api.ts)                 │
│         - CreateUserDto                                    │
│         - UserResponseDto                                  │
│         - ApiErrorPayload                                  │
│                 ▲                         ▲                │
│                 │                         │                │
│        ┌────────┴────────┐       ┌────────┴────────┐       │
│        │  Backend API    │       │ Frontend Client │       │
│        │ (Express/Fastify│ ────> │ (Typed Fetch /  │       │
│        │  Request/Res)   │       │  Axios Client)  │       │
│        └─────────────────┘       └─────────────────┘       │
└────────────────────────────────────────────────────────────┘
```

## Shared DTOs and API Contract Modeling

A **Data Transfer Object (DTO)** is an interface that defines the exact shape of data sent over the network. Defining DTOs in a shared module ensures that client and server always agree on payload structures:

```typescript
// types/userApi.ts

// Request DTO: What the client sends to create a user
export interface CreateUserDto {
  email: string;
  fullName: string;
  role: "admin" | "member" | "viewer";
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
  };
}

// Response DTO: What the server returns upon success
export interface UserResponseDto {
  readonly id: string;
  email: string;
  fullName: string;
  role: "admin" | "member" | "viewer";
  createdAt: string; // ISO 8601 string
}

// Standardized API Error Response
export interface ApiErrorDto {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: Record<string, string[]>;
}
```

## Typing the Native `fetch()` API

Native browser and Node 18+ `fetch()` returns a `Promise<Response>`. The `.json()` method on `Response` returns `Promise<any>` by default. To make `fetch` type-safe, author a generic wrapper function:

```typescript
export async function apiFetch<TResponse>(
  url: string,
  options?: RequestInit
): Promise<TResponse> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData: ApiErrorDto = await response.json().catch(() => ({
      statusCode: response.status,
      errorCode: "UNKNOWN_HTTP_ERROR",
      message: response.statusText,
    }));
    throw new Error(`[API ${errorData.statusCode}]: ${errorData.message}`);
  }

  return (await response.json()) as TResponse;
}

// Clean, strongly typed invocation:
const user = await apiFetch<UserResponseDto>("/api/users/101");
console.log(user.fullName.toUpperCase()); // Fully typed!
```

## Typing Axios HTTP Clients

Axios provides native generic parameter support for `axios.get<T>()`, `axios.post<T>()`, and Axios interceptors:

```typescript
import axios, { type AxiosResponse } from "axios";
import type { CreateUserDto, UserResponseDto } from "./types/userApi";

const apiClient = axios.create({
  baseURL: "https://api.myapp.dev/v1",
  timeout: 10000,
});

export const UserService = {
  async getUser(id: string): Promise<UserResponseDto> {
    const response: AxiosResponse<UserResponseDto> = await apiClient.get<UserResponseDto>(`/users/${id}`);
    return response.data;
  },

  async createUser(payload: CreateUserDto): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto, AxiosResponse<UserResponseDto>, CreateUserDto>(
      "/users",
      payload
    );
    return response.data;
  },
};
```

## Express.js with TypeScript

When building backend microservices with Express, use `@types/express` to type Request params, Request query, Request body, and Response payloads:

```typescript
import express, { type Request, type Response, type NextFunction } from "express";
import type { CreateUserDto, UserResponseDto, ApiErrorDto } from "./types/userApi";

const app = express();
app.use(express.json());

// Typing route parameters: Request<Params, ResBody, ReqBody, ReqQuery>
interface UserParams {
  userId: string;
}

app.get(
  "/api/users/:userId",
  (req: Request<UserParams>, res: Response<UserResponseDto | ApiErrorDto>) => {
    const { userId } = req.params;

    if (userId === "404") {
      return res.status(404).json({
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
        message: `User '${userId}' does not exist`,
      });
    }

    return res.status(200).json({
      id: userId,
      email: "engineer@domain.com",
      fullName: "Linus Torvalds",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
  }
);

app.post(
  "/api/users",
  (req: Request<{}, UserResponseDto, CreateUserDto>, res: Response<UserResponseDto>) => {
    const { email, fullName, role } = req.body; // 'req.body' is strictly CreateUserDto

    const createdUser: UserResponseDto = {
      id: `usr_${Date.now()}`,
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json(createdUser);
  }
);
```

## Fastify with TypeBox / TypeScript Providers

Fastify provides superior performance and type inference using JSON Schema type providers (such as `@fastify/type-provider-typebox` or Zod):

```typescript
import Fastify from "fastify";
import { Type, type Static } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>();

const UserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  isActive: Type.Boolean(),
});

type UserType = Static<typeof UserSchema>;

server.get(
  "/user/:id",
  {
    schema: {
      params: Type.Object({ id: Type.String() }),
      response: {
        200: UserSchema,
      },
    },
  },
  async (request, reply) => {
    // request.params.id is strictly typed as string
    return {
      id: request.params.id,
      username: "GraceHopper",
      isActive: true,
    };
  }
);
```

## Summary

- Shared DTO interfaces create an unambiguous contract between frontend clients and backend APIs.
- Generic wrapper functions around `fetch` eliminate loose `any` values and standardize error handling.
- Axios provides built-in generic parameterization across requests, responses, and interceptors.
- Express types route parameters (`Params`), request bodies (`ReqBody`), query strings (`ReqQuery`), and responses (`ResBody`).
- Fastify integrates JSON Schema type providers for compile-time and runtime validation.

## Best Practices

1. **Maintain a Single Shared Types Directory**: Keep API DTOs in a shared monorepo package or shared `/types` directory imported by both frontend and backend.
2. **Never Return Raw Database Entities**: Map internal database rows to sanitized `ResponseDto` shapes before returning data to clients (omitting password hashes, tokens, internal flags).
3. **Parameterize HTTP Wrappers Generically**: Avoid calling `response.json() as any`; always pass explicit generic response arguments (`apiFetch<UserDto>`).
4. **Standardize Error Responses**: Guarantee that all API endpoints return a uniform error structure (`ApiErrorDto`) on 4xx and 5xx responses.
