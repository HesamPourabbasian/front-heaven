const THEME_KEY = 'front-heaven:theme'

export function useTheme() {
  const theme = useState<'light' | 'dark'>('fh-theme', () => 'light')

  function apply(next: 'light' | 'dark') {
    theme.value = next
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        /* storage unavailable */
      }
    }
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })

  return { theme, apply, toggle }
}

export function useUiState() {
  const searchOpen = useState('fh-search-open', () => false)
  const sidebarOpen = useState('fh-sidebar-open', () => false)
  return { searchOpen, sidebarOpen }
}
