import createClient from 'openapi-fetch'
import type { paths } from './schema'

/**
 * ASP.NET Core Swagger paths are root-relative (e.g. `/Assets`), not `/api/...`.
 * Set `VITE_API_BASE_URL` to the API origin only (e.g. `http://localhost:5299`).
 */
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export const apiClient = createClient<paths>({ baseUrl })

export { baseUrl as apiBaseUrl }
