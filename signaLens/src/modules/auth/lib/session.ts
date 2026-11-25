const AUTH_KEY = 'signalens.auth'

export type AuthSession = {
  email: string
  displayName: string
  remember: boolean
}

export function readSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function writeSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  window.dispatchEvent(new CustomEvent('signalens:auth', { detail: session }))
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY)
  window.dispatchEvent(new CustomEvent('signalens:auth', { detail: null }))
}

export function isAuthenticated(): boolean {
  return readSession() != null
}
