const STORAGE_KEY = 'front-heaven:progress:v1'

const LEGACY_JAVASCRIPT_PATHS: Record<string, string[]> = {
  '/learn/javascript/what-is-javascript': ['/learn/javascript/01-javascript-fundamentals'],
  '/learn/javascript/introduction-to-javascript': ['/learn/javascript/01-javascript-fundamentals'],
  '/learn/javascript/variables-and-data-types': ['/learn/javascript/02-variables', '/learn/javascript/03-data-types'],
  '/learn/javascript/variables': ['/learn/javascript/02-variables'],
  '/learn/javascript/data-types': ['/learn/javascript/03-data-types'],
  '/learn/javascript/operators-and-conditionals': ['/learn/javascript/04-operators', '/learn/javascript/05-control-flow'],
  '/learn/javascript/operators': ['/learn/javascript/04-operators'],
  '/learn/javascript/control-flow': ['/learn/javascript/05-control-flow'],
  '/learn/javascript/loops': ['/learn/javascript/05-control-flow'],
  '/learn/javascript/loops-and-iterations': ['/learn/javascript/05-control-flow'],
  '/learn/javascript/functions': ['/learn/javascript/06-functions'],
  '/learn/javascript/functions-and-parameters': ['/learn/javascript/06-functions'],
  '/learn/javascript/arrays-and-objects': ['/learn/javascript/08-arrays', '/learn/javascript/10-objects'],
  '/learn/javascript/data-structures': ['/learn/javascript/08-arrays', '/learn/javascript/33-advanced-data-structures'],
  '/learn/javascript/objects-and-prototypes': ['/learn/javascript/10-objects', '/learn/javascript/17-prototypes-and-objects'],
  '/learn/javascript/dom-and-events': ['/learn/javascript/11-dom', '/learn/javascript/12-events'],
  '/learn/javascript/dom': ['/learn/javascript/11-dom'],
  '/learn/javascript/browser-javascript': ['/learn/javascript/11-dom', '/learn/javascript/26-browser-apis'],
  '/learn/javascript/error-handling-and-json': ['/learn/javascript/24-error-handling', '/learn/javascript/13-json-and-storage'],
  '/learn/javascript/error-handling': ['/learn/javascript/24-error-handling'],
  '/learn/javascript/structured-data': ['/learn/javascript/13-json-and-storage'],
  '/learn/javascript/promises-async-await-and-fetch': ['/learn/javascript/21-asynchronous-javascript', '/learn/javascript/23-fetch-and-apis'],
  '/learn/javascript/promises': ['/learn/javascript/21-asynchronous-javascript'],
  '/learn/javascript/async-await': ['/learn/javascript/21-asynchronous-javascript'],
  '/learn/javascript/fetch': ['/learn/javascript/23-fetch-and-apis'],
  '/learn/javascript/closures-scope-and-the-event-loop': ['/learn/javascript/15-scope-and-execution', '/learn/javascript/22-event-loop'],
  '/learn/javascript/scope-and-function-execution': ['/learn/javascript/15-scope-and-execution'],
  '/learn/javascript/event-loop': ['/learn/javascript/22-event-loop'],
  '/learn/javascript/modules-and-web-storage': ['/learn/javascript/20-modules', '/learn/javascript/13-json-and-storage'],
  '/learn/javascript/modules': ['/learn/javascript/20-modules'],
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
