const STORAGE_KEY = 'front-heaven:progress:v1'

const LEGACY_JAVASCRIPT_PATHS: Record<string, string[]> = {
  '/learn/javascript/what-is-javascript': ['/learn/javascript/introduction-to-javascript'],
  '/learn/javascript/variables-and-data-types': ['/learn/javascript/variables', '/learn/javascript/data-types'],
  '/learn/javascript/operators-and-conditionals': ['/learn/javascript/operators', '/learn/javascript/control-flow'],
  '/learn/javascript/loops': ['/learn/javascript/loops-and-iterations'],
  '/learn/javascript/functions': ['/learn/javascript/functions-and-parameters'],
  '/learn/javascript/arrays-and-objects': ['/learn/javascript/data-structures', '/learn/javascript/objects-and-prototypes'],
  '/learn/javascript/dom-and-events': ['/learn/javascript/dom', '/learn/javascript/browser-javascript'],
  '/learn/javascript/error-handling-and-json': ['/learn/javascript/error-handling', '/learn/javascript/structured-data'],
  '/learn/javascript/promises-async-await-and-fetch': ['/learn/javascript/promises', '/learn/javascript/async-await', '/learn/javascript/fetch'],
  '/learn/javascript/closures-scope-and-the-event-loop': ['/learn/javascript/scope-and-function-execution', '/learn/javascript/event-loop'],
  '/learn/javascript/modules-and-web-storage': ['/learn/javascript/modules'],
}

let loaded = false

export function useProgress() {
  const completed = useState<Record<string, string>>('fh-progress', () => ({}))

  function load() {
    if (!import.meta.client || loaded) return
    loaded = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const migrated = { ...parsed } as Record<string, string>
          let changed = false

          for (const [oldPath, newPaths] of Object.entries(LEGACY_JAVASCRIPT_PATHS)) {
            const completedAt = migrated[oldPath]
            if (!completedAt) continue

            for (const newPath of newPaths) {
              migrated[newPath] ??= completedAt
            }
            delete migrated[oldPath]
            changed = true
          }

          completed.value = migrated
          if (changed) persist()
        }
      }
    } catch {
      /* storage unavailable or corrupted — start fresh */
    }
  }

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed.value))
    } catch {
      /* storage unavailable */
    }
  }

  function isCompleted(path: string): boolean {
    return Boolean(completed.value[path])
  }

  function markCompleted(path: string) {
    if (!completed.value[path]) {
      completed.value[path] = new Date().toISOString()
      persist()
    }
  }

  function unmark(path: string) {
    if (completed.value[path]) {
      const next = { ...completed.value }
      delete next[path]
      completed.value = next
      persist()
    }
  }

  function toggle(path: string) {
    if (isCompleted(path)) {
      unmark(path)
    } else {
      markCompleted(path)
    }
  }

  return { completed, load, isCompleted, markCompleted, unmark, toggle }
}
