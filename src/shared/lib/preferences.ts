export type ThemePreference = 'light' | 'dark' | 'system'

const THEME_KEY = 'signalens.theme'
const SIDEBAR_KEY = 'signalens.sidebarCollapsed'
const DASHBOARD_KEY = 'signalens.defaultDashboard'

export function readTheme(): ThemePreference {
  const value = localStorage.getItem(THEME_KEY)
  if (value === 'light' || value === 'dark' || value === 'system') return value
  return 'light'
}

export function writeTheme(theme: ThemePreference) {
  localStorage.setItem(THEME_KEY, theme)
  applyTheme(theme)
  window.dispatchEvent(new CustomEvent('signalens:theme', { detail: theme }))
}

export function applyTheme(theme: ThemePreference = readTheme()) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', dark)
}

export function readSidebarCollapsed(): boolean {
  return localStorage.getItem(SIDEBAR_KEY) === 'true'
}

export function writeSidebarCollapsed(collapsed: boolean) {
  localStorage.setItem(SIDEBAR_KEY, String(collapsed))
  window.dispatchEvent(
    new CustomEvent('signalens:sidebar', { detail: collapsed }),
  )
}

export function readDefaultDashboard(): string {
  return localStorage.getItem(DASHBOARD_KEY) ?? 'Plant Overview'
}

export function writeDefaultDashboard(name: string) {
  localStorage.setItem(DASHBOARD_KEY, name)
}
