import type { ProviderRow, UserRow } from './types'

/** Figma wireframe sample rows used when the API is unavailable. */
export const SEED_USERS: UserRow[] = [
  {
    userId: 'seed-1',
    displayName: 'Mahmoud Abaza',
    email: 'mahmoud.abaza@advansys-is.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Today 09:12',
    isActive: true,
  },
  {
    userId: 'seed-2',
    displayName: 'Judy Ahmed',
    email: 'judy.ahmed@advansys-is.com',
    role: 'Engineer',
    status: 'Active',
    lastLogin: 'Yesterday',
    isActive: true,
  },
  {
    userId: 'seed-3',
    displayName: 'Ahmed El-Shall',
    email: 'ahmed.elshall@advansys-is.com',
    role: 'Viewer',
    status: 'Active',
    lastLogin: '3 days ago',
    isActive: true,
  },
]

export const SEED_PROVIDERS: ProviderRow[] = [
  {
    providerId: 1,
    name: 'Local · Qwen',
    modelName: 'qwen2.5-coder · on-prem',
    isActive: true,
  },
  {
    providerId: 2,
    name: 'Cohere',
    modelName: 'command-r · cloud',
    isActive: false,
  },
  {
    providerId: 3,
    name: 'Hugging Face',
    modelName: 'Inference endpoint · cloud',
    isActive: false,
  },
  {
    providerId: 4,
    name: 'DeepSeek',
    modelName: 'deepseek-chat · cloud',
    isActive: false,
  },
]

export const SEED_DASHBOARDS = [
  'Plant Overview',
  'Pump Station A',
  'Energy & kWh',
  'Compressors',
  'Water Quality',
  'Shift Report',
]
