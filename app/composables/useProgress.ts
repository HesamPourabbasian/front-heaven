const STORAGE_KEY = 'front-heaven:progress:v1'

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
          completed.value = parsed
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