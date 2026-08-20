---
title: 'HTTP Client & Data Fetching'
description: 'Master Angular HttpClient: provideHttpClient, typed GET/POST/PUT/DELETE operations, request headers, query parameters, response handling, and error catching.'
order: 11
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/angular/08-services-and-dependency-injection']
---

# HTTP Client & Data Fetching

Most web applications interact with backend servers over HTTP to fetch resources, submit forms, and synchronize data. Angular provides the `@angular/common/http` module featuring the **`HttpClient`** service—a robust, typed, and observable-based HTTP client designed for enterprise communication.

In modern Angular, `HttpClient` is registered in `app.config.ts` using `provideHttpClient()` and injected into services via the modern `inject(HttpClient)` function.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular HttpClient Architecture             │
│                                                             │
│  Angular Service                  Backend REST API          │
│  ┌───────────────────────────┐    ┌───────────────────────┐ │
│  │ http.get<User[]>('/users')│───>│ GET /api/v1/users     │ │
│  └───────────────────────────┘    └───────────────────────┘ │
│                │                             │              │
│                ▼                             ▼              │
│  ┌───────────────────────────┐    ┌───────────────────────┐ │
│  │ RxJS Observable / Signal  │<───│ JSON Response:        │ │
│  │ Typed User[] payload      │    │ [{ id: 1, name: '...'}]│
│  └───────────────────────────┘    └───────────────────────┘ │
│                │                                            │
│                ▼                                            │
│  Error Interception & catchError()                          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Configuring `provideHttpClient`

In `src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configure HttpClient with modern Fetch API backend
    provideHttpClient(withFetch())
  ]
};
```

Using `withFetch()` configures Angular to use the native browser `fetch()` API under the hood, unlocking streaming responses and better performance in Server-Side Rendering (SSR).

## 2. Performing Typed CRUD Operations

`HttpClient` methods are generic, allowing you to specify the expected return type (`<T>`):

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  body: string;
  authorId: number;
}

export type CreateArticleDto = Omit<Article, 'id'>;

@Injectable({ providedIn: 'root' })
export class ArticleApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  // GET: Fetch articles with query parameters
  getArticles(page = 1, limit = 10): Observable<Article[]> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Article[]>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // GET by ID
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST: Create resource with custom headers
  createArticle(dto: CreateArticleDto): Observable<Article> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Client-Version': '2026.1'
    });

    return this.http.post<Article>(this.baseUrl, dto, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT: Complete update
  updateArticle(id: number, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}`, article).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown) {
    console.error('API Error occurred:', error);
    return throwError(() => new Error('Failed to complete network request.'));
  }
}
```

## 3. Integrating HTTP Requests with Signals (`toSignal`)

In modern Angular components, you can transform HTTP Observables directly into reactive Signals using the `toSignal()` utility from `@angular/core/rxjs-interop`:

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleApiService } from './article-api.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  template: `
    <h2>Latest Articles</h2>
    @if (articles(); as list) {
      <ul>
        @for (article of list; track article.id) {
          <li>
            <h4>{{ article.title }}</h4>
            <p>{{ article.body }}</p>
          </li>
        }
      </ul>
    } @else {
      <p>Loading articles from server...</p>
    }
  `
})
export class ArticleListComponent {
  private api = inject(ArticleApiService);

  // Convert Observable to Signal with initial value undefined
  readonly articles = toSignal(this.api.getArticles());
}
```

## Summary & Key Takeaways

- `provideHttpClient(withFetch())` configures Angular's HTTP client with modern native fetch execution.
- `HttpClient` methods (`get`, `post`, `put`, `delete`) accept generic TypeScript interfaces for strict response typing.
- `HttpParams` and `HttpHeaders` construct immutable query strings and request headers.
- Use `catchError()` from RxJS to intercept network failures defensively.
- Use `toSignal()` to bridge HTTP Observables into modern component signals.

## Best Practices & Senior Guidance

1. **Always Type HTTP Calls**: Never write `http.get('/api')` without specifying the generic interface: `http.get<User[]>('/api')`.
2. **Never Call `HttpClient` Directly in Components**: Always isolate HTTP calls inside dedicated API or repository services.
3. **Use `withFetch()`**: Always configure `provideHttpClient(withFetch())` for improved performance and SSR streaming compatibility.
