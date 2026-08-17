---
title: 'API & Backend Integration'
description: 'Master HTTP and REST API communication in Vue 3: Axios and native Fetch, interceptors, authentication headers, centralized service architecture, pagination, filtering, and file uploads.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/09-composition-api
  - /learn/vue/13-state-management-pinia
---

# API & Backend Integration

Modern frontend applications spend a substantial portion of their runtime communicating with backend servers, fetching JSON payloads, updating resources via RESTful endpoints, and managing network latency, authentication headers, and network failures. Building a reliable API integration layer requires more than writing one-off `fetch()` calls inside individual components—it demands a centralized, resilient architecture.

In this lesson, we will compare Axios with native Fetch, construct a centralized API client with request/response interceptors, manage authentication tokens, build robust loading and error states, implement client-side pagination, searching, and sorting, and handle multi-part file uploads.

## Fetch vs Axios: Choosing Your HTTP Client

When integrating HTTP in Vue 3, developers commonly choose between the browser's native `fetch()` API and the popular `axios` library:

- **Native Fetch**: Built into modern browsers with zero added bundle weight. However, it requires manual JSON parsing (`res.json()`), does not automatically throw on HTTP error status codes (e.g. `404` or `500` still resolve the promise), and lacks native request/response interceptors.
- **Axios**: Provides automatic JSON transformation, built-in interceptors for headers/logging/token-refresh, automatic error throwing on non-2xx status codes, request cancellation, and upload progress tracking.

For production enterprise applications, Axios or a well-architected Fetch wrapper is standard practice.

## Building a Centralized Axios API Client

Create a single instance of Axios configured with base URLs, timeouts, and default headers in `src/services/apiClient.ts`:

```typescript
// src/services/apiClient.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.front-heaven.dev/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response Interceptor: Handle Global 401 Unauthorized & Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Clearing credentials.')
      authStore.clearSession()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
```

## RESTful API Services Layer (Repository Pattern)

Rather than calling `apiClient.get(...)` inside component files, encapsulate each backend domain into dedicated service modules:

```typescript
// src/services/lessonService.ts
import { apiClient } from './apiClient'

export interface Lesson {
  id: string
  title: string
  technology: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
}

export interface LessonQueryParams {
  page?: number
  limit?: number
  technology?: string
  search?: string
  sortBy?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export const lessonService = {
  // GET: Fetch paginated list
  async getLessons(params: LessonQueryParams): Promise<PaginatedResponse<Lesson>> {
    const response = await apiClient.get<PaginatedResponse<Lesson>>('/lessons', { params })
    return response.data
  },

  // GET: Single item by ID
  async getLessonById(id: string): Promise<Lesson> {
    const response = await apiClient.get<Lesson>(`/lessons/${id}`)
    return response.data
  },

  // POST: Create resource
  async createLesson(payload: Omit<Lesson, 'id'>): Promise<Lesson> {
    const response = await apiClient.post<Lesson>('/lessons', payload)
    return response.data
  },

  // PUT / PATCH: Update resource
  async updateLesson(id: string, payload: Partial<Lesson>): Promise<Lesson> {
    const response = await apiClient.patch<Lesson>(`/lessons/${id}`, payload)
    return response.data
  },

  // DELETE: Remove resource
  async deleteLesson(id: string): Promise<void> {
    await apiClient.delete(`/lessons/${id}`)
  }
}
```

## Managing Loading, Error, and Empty States

A professional frontend must handle every phase of the network lifecycle gracefully. Here is a complete component demonstrating state orchestration:

```vue
<!-- LessonDirectory.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { lessonService, type Lesson } from '@/services/lessonService'

const lessons = ref<Lesson[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const currentPage = ref(1)
const searchQuery = ref('')
const selectedTech = ref('all')
const totalPages = ref(1)

async function fetchLessons() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const res = await lessonService.getLessons({
      page: currentPage.value,
      limit: 10,
      search: searchQuery.value.trim() || undefined,
      technology: selectedTech.value !== 'all' ? selectedTech.value : undefined,
    })
    lessons.value = res.data
    totalPages.value = res.totalPages
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Failed to load lessons. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Refetch whenever filters or page change
watch([currentPage, selectedTech], fetchLessons)

onMounted(fetchLessons)
</script>

<template>
  <div class="lessons-container p-6 max-w-4xl mx-auto">
    <!-- Search & Filter Controls -->
    <div class="flex gap-4 mb-6">
      <input
        v-model.lazy="searchQuery"
        @keyup.enter="fetchLessons"
        placeholder="Search lessons..."
        class="flex-1 rounded-xl border border-border px-4 py-2 text-sm bg-surface-2"
      />
      <select v-model="selectedTech" class="rounded-xl border border-border px-3 py-2 text-sm bg-surface-2">
        <option value="all">All Technologies</option>
        <option value="vue">Vue.js</option>
        <option value="react">React</option>
        <option value="typescript">TypeScript</option>
      </select>
    </div>

    <!-- 1. Loading State -->
    <div v-if="isLoading" class="py-16 text-center text-muted text-sm">
      <span class="spinner inline-block size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
      Loading curriculum...
    </div>

    <!-- 2. Error State -->
    <div v-else-if="errorMessage" class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm flex justify-between items-center">
      <span>{{ errorMessage }}</span>
      <button @click="fetchLessons" class="font-bold underline text-xs">Retry</button>
    </div>

    <!-- 3. Empty State -->
    <div v-else-if="lessons.length === 0" class="py-16 text-center text-muted text-sm">
      No lessons match your search criteria. Try adjusting your filters.
    </div>

    <!-- 4. Data Content List -->
    <ul v-else class="divide-y divide-border border border-border rounded-2xl bg-surface">
      <li v-for="l in lessons" :key="l.id" class="p-4 flex justify-between items-center">
        <div>
          <h4 class="font-bold text-ink">{{ l.title }}</h4>
          <span class="text-xs text-muted">{{ l.technology }} · {{ l.estimatedMinutes }} mins</span>
        </div>
        <span class="badge uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-surface-3">
          {{ l.difficulty }}
        </span>
      </li>
    </ul>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1 && !isLoading" class="flex justify-between items-center mt-6 text-xs">
      <button
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
        class="px-4 py-2 border rounded-xl disabled:opacity-40"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage += 1"
        class="px-4 py-2 border rounded-xl disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
</template>
```

## Multipart File Uploads with Progress Tracking

Uploading images, avatars, and documents requires constructing a `FormData` payload and setting the `Content-Type` header to `multipart/form-data`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '@/services/apiClient'

const fileInput = ref<HTMLInputElement | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)
const uploadedUrl = ref<string | null>(null)

async function handleFileUpload() {
  const file = fileInput.value?.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', 'avatars')

  isUploading.value = true
  uploadProgress.value = 0

  try {
    const res = await apiClient.post<{ url: string }>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      },
    })
    uploadedUrl.value = res.data.url
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="upload-box p-4 border rounded-2xl bg-surface">
    <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload" />
    
    <div v-if="isUploading" class="mt-3">
      <div class="h-2 w-full bg-surface-3 rounded-full overflow-hidden">
        <div class="h-full bg-primary transition-all duration-300" :style="{ width: `${uploadProgress}%` }" />
      </div>
      <span class="text-xs text-muted mt-1 block">Uploading: {{ uploadProgress }}%</span>
    </div>

    <img v-if="uploadedUrl" :src="uploadedUrl" class="size-20 rounded-full mt-4 object-cover" />
  </div>
</template>
```

## Canceling In-Flight Requests with `AbortController`

When users rapidly type into search autocomplete fields or switch routes before previous requests resolve, canceling obsolete network requests prevents race conditions:

```typescript
let controller: AbortController | null = null

async function searchApi(query: string) {
  // Cancel previous pending request
  if (controller) {
    controller.abort()
  }

  controller = new AbortController()

  return apiClient.get(`/search?q=${query}`, {
    signal: controller.signal
  })
}
```

## Best Practices

- **Never Put Hardcoded URLs in Components**: Always configure base endpoints via environment variables (`import.meta.env.VITE_API_BASE_URL`) and route through a service layer.
- **Always Handle Three UI States**: Implement visual designs for Loading, Error, and Empty states across all data-fetching views.
- **Cancel Stale In-Flight Requests**: Use `AbortController` on search autocompletes to prevent race conditions from overwriting fresh data with outdated slow responses.
- **Centralize 401 Unauthorized Handling**: Use Axios response interceptors to automatically clear local authentication tokens and redirect to `/login`.

## Summary

A robust API integration architecture transforms raw network calls into a dependable, type-safe data pipeline. By utilizing centralized Axios clients with interceptors, the Repository pattern for API services, proper state indicators, and multipart upload handlers, your Vue 3 applications maintain high reliability and performance under all network conditions.
