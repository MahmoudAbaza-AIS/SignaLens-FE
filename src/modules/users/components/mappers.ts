import type { ApiLlmProvider, ApiUser, ProviderRow, UserRow, UserStatus } from './types'

export function mapApiUser(user: ApiUser): UserRow {
  const isActive = Boolean(user.isActive)
  return {
    userId: user.userId ?? crypto.randomUUID(),
    displayName: user.displayName?.trim() || '—',
    email: user.email?.trim() || '—',
    role: user.role?.trim() || 'Viewer',
    status: isActive ? 'Active' : 'Inactive',
    lastLogin: formatRelative(user.createdAtUtc),
    isActive,
    createdAtUtc: user.createdAtUtc,
  }
}

export function mapApiProvider(provider: ApiLlmProvider): ProviderRow {
  return {
    providerId: provider.providerId ?? 0,
    name: provider.name?.trim() || 'Unnamed provider',
    modelName: provider.modelName?.trim() || '—',
    isActive: Boolean(provider.isActive),
  }
}

export function statusBadgeClass(status: UserStatus): string {
  if (status === 'Active') return 'border-[#1c854d] text-[#1c854d]'
  if (status === 'Locked') return 'border-[#bf730d] text-[#bf730d]'
  return 'border-sl-muted text-sl-muted'
}

function formatRelative(iso?: string): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startThat = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayDiff = Math.round(
    (startToday.getTime() - startThat.getTime()) / 86_400_000,
  )

  if (dayDiff === 0) {
    return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`
  }
  if (dayDiff === 1) return 'Yesterday'
  if (dayDiff < 14) return `${dayDiff} days ago`
  if (dayDiff < 60) return `${Math.floor(dayDiff / 7)} weeks ago`
  return date.toLocaleDateString()
}
