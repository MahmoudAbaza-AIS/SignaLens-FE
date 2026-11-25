import type { components } from '@/shared/lib/api/schema'

export type ApiUser = components['schemas']['User']
export type ApiLlmProvider = components['schemas']['LlmProvider']
export type ApiDashboard = components['schemas']['Dashboard']

export type UserStatus = 'Active' | 'Locked' | 'Inactive'

export type SettingsTab = 'users' | 'llm' | 'preferences'

export type UserRow = {
  userId: string
  displayName: string
  email: string
  role: string
  status: UserStatus
  lastLogin: string
  isActive: boolean
  createdAtUtc?: string
}

export type ProviderRow = {
  providerId: number
  name: string
  modelName: string
  isActive: boolean
}
