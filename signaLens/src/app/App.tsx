import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/app/providers'
import { AppRoutes } from '@/app/routes'
import { applyTheme } from '@/shared/lib/preferences'

/** App composition root for the modular monolith. */
export default function App() {
  useEffect(() => {
    applyTheme()
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  )
}
